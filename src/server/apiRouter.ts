import { IncomingMessage, ServerResponse } from 'http';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  generateHighThinkingExplanation,
  searchGroundedQuery,
  generateFastHint,
  generateAdaptiveStudyPlan,
  generateDiagnosticAnalysis,
  generateEducationalImage,
  startVeoVideoGeneration,
  analyzeVideoContent,
  generateEmbedding,
  generateRagTutorResponse,
  generateRemedialExamFromMistakes,
} from './gemini.ts';

function findGppBinary(): string | null {
  const candidates = [
    'g++',
    'C:\\MinGW\\bin\\g++.exe',
    'C:\\msys64\\ucrt64\\bin\\g++.exe',
    'C:\\msys64\\mingw64\\bin\\g++.exe',
    'C:\\Program Files\\CodeBlocks\\MinGW\\bin\\g++.exe',
    'C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\\g++.exe',
  ];
  for (const cmd of candidates) {
    try {
      const res = spawnSync(cmd, ['--version'], { timeout: 2000, encoding: 'utf-8' });
      if (res.status === 0) return cmd;
    } catch {
      // ignore
    }
  }
  return null;
}

function findPythonBinary(): string | null {
  const candidates = ['python', 'python3', 'py'];
  for (const cmd of candidates) {
    try {
      const res = spawnSync(cmd, ['--version'], { timeout: 2000, encoding: 'utf-8' });
      if (res.status === 0) return cmd;
    } catch {
      // ignore
    }
  }
  return null;
}

function executeNativeBatch(language: 'python' | 'cpp', code: string, inputs: string[], timeLimitMs = 2000) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tinpath-judge-'));
  try {
    if (language === 'python') {
      const pyBin = findPythonBinary();
      if (!pyBin) return { supported: false };
      const srcPath = path.join(tmpDir, 'solution.py');
      fs.writeFileSync(srcPath, code, 'utf-8');

      const compileCheck = spawnSync(pyBin, ['-m', 'py_compile', srcPath], {
        timeout: 3000,
        encoding: 'utf-8',
      });
      if (compileCheck.status !== 0) {
        return {
          supported: true,
          compileError: (compileCheck.stderr || compileCheck.stdout || 'SyntaxError').trim(),
          results: [],
        };
      }

      const results = inputs.map(stdin => {
        const t0 = Date.now();
        const run = spawnSync(pyBin, ['-I', srcPath], {
          input: stdin,
          timeout: timeLimitMs,
          encoding: 'utf-8',
          maxBuffer: 2 * 1024 * 1024,
        });
        const elapsed = Date.now() - t0;
        const timedOut = run.error && (run.error as any).code === 'ETIMEDOUT';
        return {
          stdout: run.stdout || '',
          stderr: run.stderr || '',
          exitCode: timedOut ? 124 : (run.status ?? 1),
          timedOut: Boolean(timedOut),
          timeMs: Math.max(1, elapsed),
        };
      });
      return { supported: true, results };
    }

    if (language === 'cpp') {
      const gppBin = findGppBinary();
      if (!gppBin) return { supported: false };
      const srcPath = path.join(tmpDir, 'solution.cpp');
      const exePath = path.join(tmpDir, process.platform === 'win32' ? 'solution.exe' : 'solution.out');
      fs.writeFileSync(srcPath, code, 'utf-8');

      const compile = spawnSync(gppBin, ['-O2', '-std=c++17', srcPath, '-o', exePath], {
        timeout: 8000,
        encoding: 'utf-8',
      });
      if (compile.status !== 0) {
        return {
          supported: true,
          compileError: (compile.stderr || compile.stdout || 'Compilation Error').trim(),
          results: [],
        };
      }

      const results = inputs.map(stdin => {
        const t0 = Date.now();
        const run = spawnSync(exePath, [], {
          input: stdin,
          timeout: timeLimitMs,
          encoding: 'utf-8',
          maxBuffer: 2 * 1024 * 1024,
        });
        const elapsed = Date.now() - t0;
        const timedOut = run.error && (run.error as any).code === 'ETIMEDOUT';
        return {
          stdout: run.stdout || '',
          stderr: run.stderr || '',
          exitCode: timedOut ? 124 : (run.status ?? 1),
          timedOut: Boolean(timedOut),
          timeMs: Math.max(1, elapsed),
        };
      });
      return { supported: true, results };
    }

    return { supported: false };
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup error
    }
  }
}

// Helper to parse JSON body from incoming stream
async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

export async function handleApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return true;
  }

  if (!url.startsWith('/api/')) {
    return false;
  }

  try {
    // 1. Health check
    if (url === '/api/health') {
      sendJson(res, 200, {
        status: 'ok',
        appName: 'TinPath',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
      return true;
    }

    // 1b. Native Code Execution Sandbox (ported from NTV-Judge sandbox_runner.py)
    if (url === '/api/code/run' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const language = body.language === 'cpp' ? 'cpp' : 'python';
      const code = String(body.code || '');
      const inputs: string[] = Array.isArray(body.inputs)
        ? body.inputs.map((x: any) => String(x ?? ''))
        : [String(body.stdin ?? '')];
      const timeLimitMs = Math.min(Math.max(Number(body.timeLimitMs) || 2000, 200), 5000);

      const batchResult = executeNativeBatch(language, code, inputs, timeLimitMs);
      sendJson(res, 200, {
        success: true,
        ...batchResult,
      });
      return true;
    }

    // 2. High Thinking AI Tutor (Gemini 4 Argon)
    if (url === '/api/gemini/thinking' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateHighThinkingExplanation({
        topicTitle: body.topicTitle || 'Tổng quan Tin học THPT',
        userQuestion: body.userQuestion || '',
        studentContext: body.studentContext,
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 3. Search Grounding (Gemini 3.8 Flash with googleSearch)
    if (url === '/api/gemini/search' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await searchGroundedQuery(body.query || 'Cấu trúc đề thi tốt nghiệp THPT môn Tin học 2025');
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 4. Fast Question Hint (Gemini 3.1 Flash-Lite)
    if (url === '/api/gemini/hint' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateFastHint(body.questionContent || '', body.options || '');
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 5. Adaptive Study Plan
    if (url === '/api/gemini/study-plan' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateAdaptiveStudyPlan({
        studentName: body.studentName || 'Học sinh TinPath',
        grade: body.grade || '12',
        track: body.track || 'CS',
        targetScore: body.targetScore || 8.5,
        dailyStudyMinutes: body.dailyStudyMinutes || 45,
        diagnosticScore: body.diagnosticScore,
        weakTopics: body.weakTopics || [],
        daysRemaining: body.daysRemaining || 75,
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 5b. Diagnostic Competency Analysis (Gemini 3.8 Flash)
    if (url === '/api/gemini/diagnostic-analysis' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateDiagnosticAnalysis({
        studentName: body.studentName || 'Học sinh TinPath',
        grade: body.grade || '12',
        track: body.track || 'CS',
        score: body.score ?? 7.0,
        totalQuestions: body.totalQuestions ?? 10,
        correctCount: body.correctCount ?? 7,
        topicBreakdown: body.topicBreakdown || [],
        wrongQuestions: body.wrongQuestions || [],
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 5c. AI Remedial Exam Generator from Mistakes (Gemini Flash)
    if (url === '/api/gemini/generate-remedial-exam' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateRemedialExamFromMistakes({
        wrongQuestions: body.wrongQuestions || [],
        mode: body.mode || 'variation',
        questionCount: body.questionCount || 10,
        studentTrack: body.studentTrack || 'CS',
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 6. Educational Image Generation (1K, 2K, 4K)
    if (url === '/api/gemini/generate-image' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateEducationalImage({
        topicTitle: body.topicTitle || 'Kiến trúc máy tính và mạng',
        description: body.description || 'Infographic minh họa các tầng mạng',
        resolution: body.resolution || '1K',
        aspectRatio: body.aspectRatio || '16:9',
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 7. Veo Video Generation
    if (url === '/api/gemini/generate-video' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await startVeoVideoGeneration({
        prompt: body.prompt || 'Mô phỏng 3D dòng dữ liệu truyền qua bộ chuyển mạch Switch và Router',
        aspectRatio: body.aspectRatio || '16:9',
        resolution: body.resolution || '720p',
        imageBase64: body.imageBase64,
        imageMimeType: body.imageMimeType,
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 8. Video Understanding & Analysis
    if (url === '/api/gemini/analyze-video' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.videoBase64) {
        sendJson(res, 400, { success: false, error: 'Thiếu dữ liệu video base64' });
        return true;
      }
      const result = await analyzeVideoContent({
        videoBase64: body.videoBase64,
        mimeType: body.mimeType || 'video/mp4',
        userPrompt: body.userPrompt || 'Tóm tắt các khái niệm tin học được đề cập trong video',
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 9. Server-side XP Verification Engine (Rule 9: Module tính điểm tập trung, chống gian lận)
    if (url === '/api/xp/verify' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { type, score, correctCount, totalQuestions, currentStreak } = body;

      let awardedXP = 0;
      let reason = '';

      if (type === 'daily_challenge') {
        const validCorrect = Math.min(Math.max(correctCount || 0, 0), 10);
        awardedXP = 30 + validCorrect * 5;
        reason = `Hoàn thành thử thách 10 câu hằng ngày (${validCorrect}/10 câu đúng)`;
      } else if (type === 'exam') {
        const validScore = Math.min(Math.max(score || 0, 0), 10);
        awardedXP = Math.round(validScore * 10);
        if (validScore >= 9.0) {
          awardedXP += 25;
          reason = `Đạt điểm xuất sắc (${validScore}đ) bài thi thử tốt nghiệp`;
        } else {
          reason = `Hoàn thành bài thi thử (${validScore}đ)`;
        }
      } else if (type === 'streak_milestone') {
        if (currentStreak === 7) awardedXP = 50;
        else if (currentStreak === 14) awardedXP = 100;
        else if (currentStreak === 30) awardedXP = 200;
        reason = `Thưởng mốc chuỗi học ${currentStreak} ngày liên tiếp`;
      }

      sendJson(res, 200, {
        success: true,
        awardedXP,
        reason,
        verifiedAt: new Date().toISOString(),
      });
      return true;
    }

    // 10. Text Embedding (text-embedding-004) — Dùng cho RAG vector search
    if (url === '/api/gemini/embed' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.text || typeof body.text !== 'string') {
        sendJson(res, 400, { success: false, error: 'Thiếu trường "text" để tạo embedding' });
        return true;
      }
      const embedding = await generateEmbedding(body.text);
      sendJson(res, 200, { success: true, embedding });
      return true;
    }

    // 11. RAG AI Tutor — Trả lời có tài liệu SGK từ pgvector
    if (url === '/api/gemini/rag-tutor' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateRagTutorResponse({
        topicTitle: body.topicTitle || 'Tổng quan Tin học THPT',
        userQuestion: body.userQuestion || '',
        studentContext: body.studentContext,
        sgkContext: body.sgkContext || '',
      });
      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    sendJson(res, 404, { error: 'Không tìm thấy API endpoint' });
    return true;
  } catch (error: any) {
    console.error('API Error:', error);
    sendJson(res, 500, {
      success: false,
      error: error.message || 'Lỗi xử lý server nội bộ',
    });
    return true;
  }
}
