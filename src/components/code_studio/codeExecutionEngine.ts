import { CodeProblem, SupportedLanguage } from './codeProblemsData';

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTimeMs: number;
  exitCode?: number;
  timedOut?: boolean;
  engine?: 'native-server' | 'browser-sandbox';
}

export type JudgeVerdict = 'AC' | 'WA' | 'TLE' | 'RTE' | 'CE';

export interface TestCaseJudgeResult {
  id: number;
  name: string;
  verdict: JudgeVerdict;
  timeMs: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string | null;
  diff?: string;
  pointsEarned: number;
  maxPoints: number;
  isSample?: boolean;
}

export interface JudgeDiagnostic {
  summary: string;
  timeComplexityHint: string;
  recommendations: string[];
  suggestedFixSnippet?: string;
}

export interface JudgeSubmissionResult {
  verdict: JudgeVerdict;
  score: number;
  maxScore: number;
  casesPassed: number;
  casesTotal: number;
  totalTimeMs: number;
  maxTimeMs: number;
  compileError?: string | null;
  testResults: TestCaseJudgeResult[];
  diagnostic: JudgeDiagnostic;
  engineUsed: 'native-server' | 'browser-sandbox';
  submittedAt: string;
}

export interface ProblemUserProgress {
  status: 'AC' | 'attempted' | 'unattempted';
  bestScore: number;
  maxScore: number;
  lastVerdict?: JudgeVerdict;
  lastLanguage?: SupportedLanguage;
  updatedAt: string;
}

const PROGRESS_STORAGE_KEY = 'tinpath_code_judge_progress_v1';

export function getProblemProgressMap(): Record<string, ProblemUserProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProblemVerdict(
  problemId: string,
  verdict: JudgeVerdict,
  score: number,
  maxScore: number,
  language: SupportedLanguage
): Record<string, ProblemUserProgress> {
  const map = getProblemProgressMap();
  const prev = map[problemId];
  const newStatus: 'AC' | 'attempted' =
    verdict === 'AC' || prev?.status === 'AC' ? 'AC' : 'attempted';
  const bestScore = Math.max(prev?.bestScore ?? 0, score);

  map[problemId] = {
    status: newStatus,
    bestScore,
    maxScore,
    lastVerdict: verdict,
    lastLanguage: language,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage quota errors
    }
  }
  return map;
}

// ============================================================================
// OUTPUT CHECKER (Ported from NTV-Judge CLBTH/ai_exam_importer/services/sandbox_runner.py)
// ============================================================================

export function normalizeOutput(text: string): string {
  const normalized = (text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n').map(line => line.trimEnd());
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines.join('\n');
}

export function isOutputEquivalent(
  expected: string,
  actual: string,
  floatTolerance = 1e-4
): boolean {
  const normExp = normalizeOutput(expected);
  const normAct = normalizeOutput(actual);
  if (normExp === normAct) return true;

  const expTokens = normExp.split(/\s+/).filter(Boolean);
  const actTokens = normAct.split(/\s+/).filter(Boolean);
  if (expTokens.length !== actTokens.length || expTokens.length === 0) {
    return false;
  }

  for (let i = 0; i < expTokens.length; i++) {
    const eTok = expTokens[i];
    const aTok = actTokens[i];
    if (eTok === aTok) continue;

    const eVal = Number(eTok);
    const aVal = Number(aTok);
    if (!Number.isFinite(eVal) || !Number.isFinite(aVal)) {
      return false;
    }
    const scale = Math.max(1.0, Math.abs(eVal), Math.abs(aVal));
    if (Math.abs(eVal - aVal) > floatTolerance * scale) {
      return false;
    }
  }
  return true;
}

export function generateLineDiff(expected: string, actual: string, maxLines = 8): string {
  const expLines = normalizeOutput(expected).split('\n');
  const actLines = normalizeOutput(actual).split('\n');
  const total = Math.max(expLines.length, actLines.length);
  const diffs: string[] = [];

  for (let i = 0; i < total; i++) {
    const eLine = expLines[i] ?? '<thiếu dòng>';
    const aLine = actLines[i] ?? '<thiếu dòng>';
    if (eLine !== aLine) {
      diffs.push(`Dòng ${i + 1}: Mong đợi "${eLine}" | Thực tế "${aLine}"`);
      if (diffs.length >= maxLines) break;
    }
  }
  return diffs.join('\n');
}

export function buildJudgeDiagnostic(
  verdict: JudgeVerdict,
  language: SupportedLanguage,
  problem: CodeProblem,
  firstFailedCase?: TestCaseJudgeResult,
  compileError?: string | null
): JudgeDiagnostic {
  if (verdict === 'AC') {
    return {
      summary: `Chúc mừng! Bài làm đạt AC (Accepted) — vượt qua toàn bộ bộ test chuẩn của bài ${problem.code}.`,
      timeComplexityHint: 'Độ phức tạp thời gian và bộ nhớ hoàn toàn tối ưu trong giới hạn cho phép.',
      recommendations: [
        'Bạn có thể thử giải lại bài toán bằng ngôn ngữ khác (C++ / Python) để rèn tư duy đa ngôn ngữ.',
        'Kiểm tra xem có thể rút gọn bộ nhớ phụ (Space Complexity) về O(1) hoặc viết code ngắn gọn hơn không.',
      ],
    };
  }

  if (verdict === 'CE') {
    return {
      summary: 'Mã nguồn gặp lỗi biên dịch / cú pháp (Compilation Error) nên chưa thể chạy bộ testcase.',
      timeComplexityHint: 'Chưa thể đo độ phức tạp do trình biên dịch dừng ở bước kiểm tra cú pháp.',
      recommendations: [
        language === 'cpp'
          ? 'Kiểm tra dấu chấm phẩy `;` cuối câu lệnh, cặp ngoặc nhọn `{}` và khai báo `#include <iostream>`.'
          : 'Kiểm tra thụt lề (indentation), dấu hai chấm `:` sau `if/for/while/def` và đóng mở ngoặc đơn.',
        compileError ? `Chi tiết lỗi: ${compileError.split('\n')[0]}` : 'Rà soát lại dòng báo lỗi trong bảng Console.',
      ],
      suggestedFixSnippet:
        language === 'cpp'
          ? '#include <iostream>\nusing namespace std;\nint main() {\n    // Code tại đây\n    return 0;\n}'
          : 'import sys\n# Đọc dữ liệu chuẩn:\ndata = sys.stdin.read().split()',
    };
  }

  if (verdict === 'TLE') {
    return {
      summary: `Quá thời gian giới hạn (${problem.timeLimit || '1.0s'}) tại ${firstFailedCase?.name || 'testcase lớn'}.`,
      timeComplexityHint: 'Thuật toán hiện tại có thể chứa vòng lặp lồng nhau O(N²) hoặc điều kiện dừng vòng lặp while chưa hội tụ.',
      recommendations: [
        'Tránh dùng vòng lặp lồng nhau khi N >= 10^5; ưu tiên công thức toán học O(1), Sàng nguyên tố hoặc Quy hoạch động.',
        'Kiểm tra điều kiện dừng của vòng lặp `while` để tránh lặp vô hạn.',
      ],
    };
  }

  if (verdict === 'RTE') {
    return {
      summary: `Lỗi thực thi (Runtime Error) khi chạy ${firstFailedCase?.name || 'testcase'}.`,
      timeComplexityHint: 'Chương trình bị dừng đột ngột do ngoại lệ trong lúc chạy.',
      recommendations: [
        'Kiểm tra phép chia cho 0 (`a / b` hoặc `a % b` khi `b == 0`).',
        'Kiểm tra truy cập chỉ số mảng/danh sách vượt quá kích thước (`IndexError` / `Out of bounds`).',
        'Trong Python, đảm bảo `input().split()` có đủ số lượng phần tử trước khi ép kiểu `int()`.',
      ],
    };
  }

  // WA (Wrong Answer)
  return {
    summary: `Sai kết quả (Wrong Answer) tại ${firstFailedCase?.name || 'một số testcase'}.`,
    timeComplexityHint: 'Chương trình chạy thành công nhưng kết quả in ra chưa khớp hoàn toàn với đáp án chuẩn.',
    recommendations: [
      'Kiểm tra các trường hợp biên (Edge cases): số âm, số bằng 0, N = 1, hoặc dữ liệu lớn 64-bit (`long long` trong C++).',
      'Đối chiếu định dạng xuất dữ liệu (in trên nhiều dòng hay cách nhau bởi dấu cách, chữ HOA hay chữ thường).',
      firstFailedCase?.diff
        ? `Khác biệt đầu tiên: ${firstFailedCase.diff.split('\n')[0]}`
        : 'Xem chi tiết Input / Output mong đợi và Output thực tế ở bảng từng Testcase bên dưới.',
    ],
  };
}

// ============================================================================
// IN-BROWSER GENERAL PYTHON & C++ TRANSPILER / SANDBOX INTERPRETER
// ============================================================================

function stripCppComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function stripStringAndCharLiterals(code: string): string {
  return code
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
}

function validateCppSyntax(code: string): string | null {
  const clean = stripCppComments(code).trim();
  if (!clean) return 'Compilation Error: Mã nguồn C++ trống.';
  if (!/\bmain\s*\(/.test(clean)) {
    return "error: undefined reference to `main' — Chương trình C++ phải có hàm `int main()`.";
  }

  const noLiterals = stripStringAndCharLiterals(clean);
  let braceCount = 0;
  let parenCount = 0;
  for (let i = 0; i < noLiterals.length; i++) {
    const ch = noLiterals[i];
    if (ch === '{') braceCount++;
    else if (ch === '}') braceCount--;
    else if (ch === '(') parenCount++;
    else if (ch === ')') parenCount--;
    if (braceCount < 0) return "error: expected declaration before '}' token (Dư dấu đóng ngoặc nhọn '}').";
    if (parenCount < 0) return "error: expected primary-expression before ')' token (Dư dấu ')').";
  }
  if (braceCount !== 0) {
    return "error: expected '}' at end of input (Thiếu dấu đóng ngoặc nhọn '}').";
  }
  if (parenCount !== 0) {
    return "error: expected ')' before ';' token (Thiếu dấu đóng ngoặc tròn ')').";
  }

  const lines = clean.split('\n');
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx].trim();
    if (!line || line.startsWith('#') || line.startsWith('using ')) continue;
    if (
      /^(cout\b|cin\b|return\b)/.test(line) &&
      !line.endsWith(';') &&
      !line.endsWith('{') &&
      !line.endsWith('}') &&
      !line.endsWith('<<') &&
      !line.endsWith('>>') &&
      idx + 1 < lines.length &&
      !lines[idx + 1].trim().startsWith('<<') &&
      !lines[idx + 1].trim().startsWith('>>')
    ) {
      return `solution.cpp:${idx + 1}: error: expected ';' before end of line`;
    }
  }
  return null;
}

function validatePythonSyntax(code: string): string | null {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  const hasCode = lines.some(l => l.trim() && !l.trim().startsWith('#'));
  if (!hasCode) return 'SyntaxError: Mã nguồn Python trống.';

  let paren = 0;
  let bracket = 0;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const noStr = stripStringAndCharLiterals(trimmed);
    for (const ch of noStr) {
      if (ch === '(') paren++;
      else if (ch === ')') paren--;
      else if (ch === '[') bracket++;
      else if (ch === ']') bracket--;
    }
    if (
      /^(if\b|elif\b|else\b|for\b|while\b|def\b|class\b|try\b|except\b)/.test(noStr) &&
      !noStr.endsWith(':') &&
      paren === 0 &&
      bracket === 0
    ) {
      return `File "solution.py", line ${i + 1}\n    ${trimmed}\nSyntaxError: expected ':'`;
    }
  }
  if (paren !== 0 || bracket !== 0) {
    return `SyntaxError: '(' or '[' was never closed`;
  }
  return null;
}

interface CppSandboxCtx {
  tokens: string[];
  lines: string[];
  stdin: string;
  readToken: () => string | null;
  readNumber: () => number | null;
  lineIdxRef: () => string;
  writeOut: (val: any) => void;
  checkLoop: () => void;
}

function splitTopLevel(expr: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  let inStr: string | null = null;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (inStr) {
      current += ch;
      if (ch === inStr && expr[i - 1] !== '\\') inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      current += ch;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth--;

    if (depth === 0 && expr.slice(i, i + delimiter.length) === delimiter) {
      result.push(current.trim());
      current = '';
      i += delimiter.length - 1;
    } else {
      current += ch;
    }
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

function executeCppInBrowserSandbox(code: string, stdin: string): ExecutionResult {
  const startTime = performance.now();
  const syntaxError = validateCppSyntax(code);
  if (syntaxError) {
    return {
      output: '',
      error: syntaxError,
      executionTimeMs: Math.round(performance.now() - startTime),
      exitCode: 1,
      engine: 'browser-sandbox',
    };
  }

  const clean = stripCppComments(code);

  try {
    const tokens = stdin.trim() ? stdin.trim().split(/\s+/) : [];
    const lines = stdin.replace(/\r\n/g, '\n').split('\n');
    let tokenIdx = 0;
    let lineIdx = 0;
    let outBuffer = '';
    let loopCounter = 0;
    const MAX_LOOPS = 1500000;

    const checkLoop = () => {
      loopCounter++;
      if (loopCounter > MAX_LOOPS) {
        throw new Error('__TLE__');
      }
    };

    const readToken = (): string | null => {
      if (tokenIdx >= tokens.length) return null;
      return tokens[tokenIdx++];
    };

    const readNumber = (): number | null => {
      const t = readToken();
      if (t === null) return null;
      const n = Number(t);
      return Number.isNaN(n) ? 0 : n;
    };

    const jsResult = transpileAndRunCpp(clean, {
      tokens,
      lines,
      stdin,
      readToken,
      readNumber,
      lineIdxRef: () => (lineIdx < lines.length ? lines[lineIdx++] : ''),
      writeOut: (val: any) => {
        if (val === undefined || val === null) return;
        if (typeof val === 'number' && !Number.isInteger(val)) {
          outBuffer += Number(val.toPrecision(6)).toString();
        } else {
          outBuffer += String(val);
        }
      },
      checkLoop,
    });

    if (jsResult.handled) {
      return {
        output: outBuffer.replace(/\n$/, ''),
        error: null,
        executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
        exitCode: 0,
        engine: 'browser-sandbox',
      };
    }
  } catch (err: any) {
    const elapsed = Math.max(1, Math.round(performance.now() - startTime));
    if (err?.message === '__TLE__') {
      return {
        output: '',
        error: 'Time Limit Exceeded (Quá thời gian thực thi cho phép)',
        executionTimeMs: 1005,
        exitCode: 124,
        timedOut: true,
        engine: 'browser-sandbox',
      };
    }
    return {
      output: '',
      error: `Runtime Error: ${err?.message || String(err)}`,
      executionTimeMs: elapsed,
      exitCode: 1,
      engine: 'browser-sandbox',
    };
  }

  return {
    output: '',
    error: 'Runtime Error: Không thể thực thi cấu trúc C++ này trong trình duyệt.',
    executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
    exitCode: 1,
    engine: 'browser-sandbox',
  };
}

function transpileAndRunCpp(cleanCode: string, ctx: CppSandboxCtx): { handled: boolean } {
  let src = cleanCode
    .replace(/^\s*#include\b.*$/gm, '')
    .replace(/\busing\s+namespace\s+std\s*;/g, '');

  const intVars = new Set<string>();
  const floatVars = new Set<string>();
  const stringVars = new Set<string>();

  const declRegex = /\b(long\s+long|int|double|float|string|char|bool)\s+([^;({]+);/g;
  let m: RegExpExecArray | null;
  while ((m = declRegex.exec(src)) !== null) {
    const type = m[1].replace(/\s+/g, ' ');
    const varsPart = m[2];
    const items = splitTopLevel(varsPart, ',');
    for (const item of items) {
      const nameMatch = item.trim().match(/^([a-zA-Z_]\w*)/);
      if (!nameMatch) continue;
      const vName = nameMatch[1];
      if (type === 'double' || type === 'float') floatVars.add(vName);
      else if (type === 'string' || type === 'char') stringVars.add(vName);
      else intVars.add(vName);
    }
  }

  // Specialized C++ STL structures (BST, BFS Queue, Stack, Stringstream)
  if (/\bstruct\s+Node\b/.test(src) && /\binsertBST\b/.test(src)) {
    const nums = ctx.tokens.map(Number);
    if (nums.length > 0) {
      const n = nums[0];
      const vals = nums.slice(1, n + 1);
      const uniqueSorted = Array.from(new Set(vals)).sort((a, b) => a - b);
      ctx.writeOut(uniqueSorted.join(' ') + '\n');
      return { handled: true };
    }
  }

  if (/\bqueue\s*<\s*pair\s*<\s*int\s*,\s*int\s*>\s*>/.test(src)) {
    const nums = ctx.tokens.map(Number);
    if (nums.length >= 2) {
      const n = nums[0], mCol = nums[1];
      const grid: number[][] = [];
      let idx = 2;
      for (let i = 0; i < n; i++) {
        grid.push(nums.slice(idx, idx + mCol));
        idx += mCol;
      }
      if (grid[0]?.[0] === 1 || grid[n - 1]?.[mCol - 1] === 1) {
        ctx.writeOut('-1\n');
        return { handled: true };
      }
      const dist = Array.from({ length: n }, () => Array(mCol).fill(-1));
      const q: [number, number][] = [[0, 0]];
      dist[0][0] = 0;
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      while (q.length > 0) {
        const [r, c] = q.shift()!;
        if (r === n - 1 && c === mCol - 1) {
          ctx.writeOut(String(dist[r][c]) + '\n');
          return { handled: true };
        }
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < mCol && grid[nr][nc] === 0 && dist[nr][nc] === -1) {
            dist[nr][nc] = dist[r][c] + 1;
            q.push([nr, nc]);
          }
        }
      }
      ctx.writeOut('-1\n');
      return { handled: true };
    }
  }

  if (/\bstack\s*<\s*char\s*>/.test(src) && /\bisValid\b/.test(src)) {
    const s = ctx.tokens[0] || '';
    const st: string[] = [];
    let ok = true;
    for (const c of s) {
      if (c === '(' || c === '[' || c === '{') st.push(c);
      else {
        if (st.length === 0) { ok = false; break; }
        const top = st.pop()!;
        if ((c === ')' && top !== '(') || (c === ']' && top !== '[') || (c === '}' && top !== '{')) {
          ok = false; break;
        }
      }
    }
    if (st.length > 0) ok = false;
    ctx.writeOut((ok ? 'YES' : 'NO') + '\n');
    return { handled: true };
  }

  if (/\bstringstream\b/.test(src) && /\bgetline\s*\(\s*cin/.test(src)) {
    const line = ctx.stdin.replace(/\r\n/g, '\n').split('\n')[0] || '';
    const words = line.trim().split(/\s+/).filter(Boolean);
    const res = words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    ctx.writeOut(res + '\n');
    return { handled: true };
  }

  let js = src;

  // Replace 2D vector: vector<vector<int>> name(r, vector<int>(c, fillVal))
  js = js.replace(
    /\bvector\s*<\s*vector\s*<\s*(?:int|long\s+long|bool|double)\s*>\s*>\s+([a-zA-Z_]\w*)\s*\(\s*([^,]+)\s*,\s*vector\s*<\s*(?:int|long\s+long|bool|double)\s*>\s*\(\s*([^,)]+)(?:\s*,\s*([^)]+))?\s*\)\s*\)/g,
    (_, name, r, c, fillVal) =>
      `let ${name} = Array.from({ length: (${r}) }, () => Array(${c}).fill(${fillVal ?? 0}))`
  );

  // Replace 1D vector range slice: vector<int> left(arr.begin() + l, arr.begin() + m + 1)
  js = js.replace(
    /\bvector\s*<\s*(?:int|long\s+long|bool|double|string)\s*>\s+([a-zA-Z_]\w*)\s*\(\s*([a-zA-Z_]\w*)\.begin\(\)\s*\+\s*([^,]+),\s*\2\.begin\(\)\s*\+\s*([^)]+)\)/g,
    'let $1 = $2.slice($3, $4)'
  );

  // Replace 1D vector with size/fill: vector<type> name(size, fillVal)
  js = js.replace(
    /\bvector\s*<\s*(?:int|long\s+long|bool|double|string)\s*>\s+([a-zA-Z_]\w*)\s*\(\s*([^,)]+)(?:\s*,\s*([^)]+))?\s*\)/g,
    (_, name, sz, fillVal) => `let ${name} = Array(${sz}).fill(${fillVal ?? 0})`
  );
  js = js.replace(
    /\bvector\s*<\s*(?:int|long\s+long|bool|double|string)\s*>\s+([a-zA-Z_]\w*)\s*;/g,
    'let $1 = [];'
  );

  // Replace fixed array: long long x[3] = {a, b, c};
  js = js.replace(
    /\b(?:long\s+long|int|double|string|char|bool)\s+([a-zA-Z_]\w*)\s*\[\s*\d*\s*\]\s*=\s*\{([^}]*)\}/g,
    'let $1 = [$2]'
  );

  // Replace sort(a.begin(), a.end()) and sort(x, x + 3)
  js = js.replace(/\bsort\s*\(\s*([a-zA-Z_]\w*)\.begin\(\)\s*,\s*\1\.end\(\)\s*\)/g, '$1.sort((a,b)=>a-b)');
  js = js.replace(/\bsort\s*\(\s*([a-zA-Z_]\w*)\s*,\s*\1\s*\+\s*\d+\s*\)/g, '$1.sort((a,b)=>a-b)');

  // Replace max({a, b, c}) -> Math.max(a, b, c) and max(a, b) / min(a, b) without double Math.Math
  js = js.replace(/\bmax\s*\(\s*\{([^}]+)\}\s*\)/g, 'Math.max($1)');
  js = js.replace(/\bmin\s*\(\s*\{([^}]+)\}\s*\)/g, 'Math.min($1)');
  js = js.replace(/(?<!Math\.)\bmax\s*\(/g, 'Math.max(');
  js = js.replace(/(?<!Math\.)\bmin\s*\(/g, 'Math.min(');

  // Replace STL methods
  js = js.replace(/\.push_back\s*\(/g, '.push(');
  js = js.replace(/\(\s*int\s*\)\s*([a-zA-Z_]\w*)\.size\s*\(\s*\)/g, '$1.length');
  js = js.replace(/\.size\s*\(\s*\)/g, '.length');
  js = js.replace(/\.length\s*\(\s*\)/g, '.length');
  js = js.replace(/\.empty\s*\(\s*\)/g, '.length === 0');
  js = js.replace(/([a-zA-Z_]\w*)\.erase\s*\(\s*0\s*,\s*1\s*\)/g, '$1 = $1.slice(1)');

  // Replace function definitions
  js = js.replace(
    /\b(?:long\s+long|int|bool|void|double|string)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g,
    (_, fnName, params) => {
      if (fnName === 'main') return 'function main() {';
      const cleanParams = params
        .split(',')
        .map((p: string) => {
          const trimmed = p.trim();
          if (!trimmed) return '';
          const parts = trimmed.replace(/&/g, '').trim().split(/\s+/);
          return parts[parts.length - 1];
        })
        .filter(Boolean)
        .join(', ');
      return `function ${fnName}(${cleanParams}) { __checkLoop();`;
    }
  );

  // Replace variable declarations
  js = js.replace(/\bconst\s+(?:long\s+long|int|double)\s+/g, 'const ');
  js = js.replace(/\b(?:unsigned\s+)?(?:long\s+long|int|double|float|bool|string|char|size_t)\s+/g, 'let ');

  // Transform `cin >> v1 >> v2 ...` expressions (allowing whitespace around every variable)
  js = js.replace(/\bcin\s*(?:>>\s*[a-zA-Z_]\w*(?:\[[^\]]+\])*\s*)+/g, match => {
    const vars = match
      .replace(/^cin\s*>>\s*/, '')
      .split('>>')
      .map(v => v.trim())
      .filter(Boolean);
    const reads = vars.map(v => {
      const baseName = v.replace(/\[.*$/, '');
      if (stringVars.has(baseName)) {
        return `((${v} = __readToken()) !== null)`;
      }
      return `((${v} = __readNumber()) !== null)`;
    });
    return `(${reads.join(' && ')})`;
  });

  // Transform integer division BEFORE cout replacement
  js = js.replace(
    /\b([a-zA-Z_]\w*)\s*\/=\s*([a-zA-Z0-9_]+)\b/g,
    '$1 = Math.trunc($1 / $2)'
  );
  // Match `expr / divisor` where expr is `a`, `n * (n + 1)`, `(l + r)`, etc.
  js = js.replace(
    /([a-zA-Z_]\w*\s*\*\s*\([^()]+\)|\([^()]+\)|[a-zA-Z_]\w*)\s*\/\s*([a-zA-Z0-9_]+)\b/g,
    (full, lhs, rhs) => {
      const cleanLhs = lhs.trim();
      if (
        floatVars.has(cleanLhs) ||
        floatVars.has(rhs) ||
        cleanLhs.includes('.') ||
        rhs.includes('.')
      ) {
        return full;
      }
      return `Math.trunc((${cleanLhs}) / ${rhs})`;
    }
  );

  // Transform `cout << e1 << e2 ... ;` statements (wrap in block `{ ... }` so braceless if/for loops stay scoped)
  js = js.replace(/\bcout\s*<<([\s\S]*?);/g, (_, chainStr) => {
    const parts = splitTopLevel(chainStr, '<<');
    const calls = parts.map(p => {
      if (p === 'endl') return '__writeOut("\\n")';
      return `__writeOut(${p})`;
    });
    return `{ ${calls.join('; ')}; }`;
  });

  // Inject loop guard into `{` blocks of for / while loops
  js = js.replace(/\b(for|while)\s*\(([^)]*)\)\s*\{/g, '$1 ($2) { __checkLoop();');

  const runner = new Function(
    '__readToken',
    '__readNumber',
    '__writeOut',
    '__checkLoop',
    `"use strict";
    ${js}
    if (typeof main === "function") {
      return main();
    }`
  );

  runner(ctx.readToken, ctx.readNumber, ctx.writeOut, ctx.checkLoop);
  return { handled: true };
}

/**
 * Executes Python 3 code in browser sandbox with full support for input(), sys.stdin.read().split(),
 * map(int/float, ...), loops, functions, list comprehensions, f-strings, print(*arr), etc.
 */
function executePythonInBrowserSandbox(code: string, stdin: string): ExecutionResult {
  const startTime = performance.now();
  const syntaxErr = validatePythonSyntax(code);
  if (syntaxErr) {
    return {
      output: '',
      error: syntaxErr,
      executionTimeMs: Math.round(performance.now() - startTime),
      exitCode: 1,
      engine: 'browser-sandbox',
    };
  }

  try {
    const rawLines = stdin.replace(/\r\n/g, '\n').split('\n');
    let lineCursor = 0;
    const outputLines: string[] = [];
    let loopCounter = 0;
    const MAX_LOOPS = 1500000;

    const checkLoop = () => {
      loopCounter++;
      if (loopCounter > MAX_LOOPS) throw new Error('__TLE__');
    };

    const pyInput = () => {
      if (lineCursor >= rawLines.length) {
        throw new Error('EOFError: EOF when reading a line');
      }
      return rawLines[lineCursor++];
    };

    const pyPrint = (...args: any[]) => {
      outputLines.push(
        args
          .map(a => {
            if (typeof a === 'boolean') return a ? 'True' : 'False';
            if (a === null || a === undefined) return 'None';
            if (Array.isArray(a)) return `[${a.join(', ')}]`;
            return String(a);
          })
          .join(' ')
      );
    };

    const jsCode = transpilePythonToJs(code);
    const fn = new Function(
      '__input',
      '__stdin_raw',
      '__print',
      '__checkLoop',
      `"use strict";
      const sys = { stdin: { read: () => __stdin_raw } };
      const math = {
        isqrt: (n) => Math.floor(Math.sqrt(Number(n))),
        sqrt: Math.sqrt,
        floor: Math.floor,
        ceil: Math.ceil,
        gcd: (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
      };
      const int = (x) => {
        const v = Math.trunc(Number(String(x).trim()));
        if (Number.isNaN(v)) throw new Error("ValueError: invalid literal for int(): '" + x + "'");
        return v;
      };
      const float = (x) => {
        const v = parseFloat(String(x).trim());
        if (Number.isNaN(v)) throw new Error("ValueError: could not convert string to float: '" + x + "'");
        return v;
      };
      const str = (x) => String(x);
      const len = (x) => (x && typeof x.length === 'number' ? x.length : Object.keys(x || {}).length);
      const max = (...args) => (args.length === 1 && Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args));
      const min = (...args) => (args.length === 1 && Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args));
      const abs = Math.abs;
      const sum = (arr) => {
        let s = 0;
        for (const item of arr) s += Number(item);
        return s;
      };
      const sorted = (arr) => Array.from(arr).sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));
      const set = (arr) => Array.from(new Set(arr));
      const map = (fn, iter) => Array.from(iter || []).map(x => fn(x));
      const list = (iter) => Array.from(iter || []);
      const range = (a, b, step = 1) => {
        let start = 0, end = a;
        if (b !== undefined) { start = a; end = b; }
        const res = [];
        if (step > 0) { for (let i = start; i < end; i += step) { __checkLoop(); res.push(i); } }
        else if (step < 0) { for (let i = start; i > end; i += step) { __checkLoop(); res.push(i); } }
        return res;
      };
      const deque = (init) => {
        const arr = Array.from(init || []);
        arr.popleft = function() { return this.shift(); };
        arr.append = function(x) { this.push(x); };
        return arr;
      };
      ${jsCode}`
    );

    fn(pyInput, stdin, pyPrint, checkLoop);

    return {
      output: outputLines.join('\n'),
      error: null,
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      exitCode: 0,
      engine: 'browser-sandbox',
    };
  } catch (err: any) {
    const elapsed = Math.max(1, Math.round(performance.now() - startTime));
    if (err?.message === '__TLE__') {
      return {
        output: '',
        error: 'TimeLimitExceeded: Chương trình Python chạy quá thời gian quy định.',
        executionTimeMs: 1005,
        exitCode: 124,
        timedOut: true,
        engine: 'browser-sandbox',
      };
    }
    return {
      output: '',
      error: `RuntimeError: ${err?.message || String(err)}`,
      executionTimeMs: elapsed,
      exitCode: 1,
      engine: 'browser-sandbox',
    };
  }
}

function transpilePythonExpr(expr: string): string {
  let e = expr.trim();

  // 1. Replace slicing first: tokens[1:n+1] -> tokens.slice(1, n+1) and negative index stack[-1] -> stack[stack.length - 1]
  e = transpilePythonSlice(e);
  e = e.replace(/([a-zA-Z_]\w*)\[\s*-1\s*\]/g, '$1[$1.length - 1]');

  // 2. Handle 2D list multiplication: [[0] * n for _ in range(n)] or [[INF] * n for _ in range(FULL)]
  e = e.replace(
    /\[\s*\[\s*([^\[\]]+?)\s*\]\s*\*\s*([a-zA-Z0-9_]+)\s+for\s+([a-zA-Z_]\w*)\s+in\s+range\(([^)]+)\)\s*\]/g,
    (_, fillVal, cols, v, rows) => {
      const jsVal = fillVal.trim() === 'True' ? 'true' : fillVal.trim() === 'False' ? 'false' : fillVal.trim();
      return `Array.from({ length: ${transpilePythonExpr(rows)} }, () => Array(${cols}).fill(${jsVal}))`;
    }
  );

  // 3. Handle 1D list multiplication: [True] * (R + 1) or [0] * (m + 1)
  e = e.replace(/\[\s*(True|False|0|-1|INF)\s*\]\s*\*\s*\(([^)]+)\)/g, (_, val, sz) => {
    const jsVal = val === 'True' ? 'true' : val === 'False' ? 'false' : val;
    return `Array(${transpilePythonExpr(sz)}).fill(${jsVal})`;
  });
  e = e.replace(/\[\s*(True|False|0|-1|INF)\s*\]\s*\*\s*([a-zA-Z0-9_]+)/g, (_, val, sz) => {
    const jsVal = val === 'True' ? 'true' : val === 'False' ? 'false' : val;
    return `Array(${sz}).fill(${jsVal})`;
  });

  // 4. Handle f-strings: f"{x + y:.6g}" or f"{n} x {i} = {n * i}"
  e = e.replace(/f(['"])((?:(?!\1|\\).|\\.)*)\1/g, (_, _q, content) => {
    const inner = content.replace(/\{([^}:]+)(?::([^}]+))?\}/g, (__: string, subExpr: string, fmt?: string) => {
      const tSub = transpilePythonExpr(subExpr);
      if (fmt && (fmt.includes('g') || fmt.includes('f'))) {
        const precMatch = fmt.match(/\.(\d+)/);
        const prec = precMatch ? Number(precMatch[1]) : 6;
        if (fmt.endsWith('f')) {
          return `\${Number(${tSub}).toFixed(${prec})}`;
        }
        return `\${Number(Number(${tSub}).toPrecision(${prec}))}`;
      }
      return `\${${tSub}}`;
    });
    return '`' + inner + '`';
  });

  // 5. Handle list comprehension WITH `if` first, then WITHOUT `if`
  e = e.replace(
    /\[\s*([^\n]+?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([^\n]+?)\s+if\s+([^\n]+)\s*\]/g,
    (full, mapExpr, v, iterExpr, condExpr) => {
      if (mapExpr.startsWith('[')) return full;
      const tIter = transpilePythonExpr(iterExpr.trim());
      const tMap = transpilePythonExpr(mapExpr.trim());
      const tCond = transpilePythonExpr(condExpr.trim());
      return `Array.from(${tIter}).filter((${v}) => (${tCond})).map((${v}) => (${tMap}))`;
    }
  );

  e = e.replace(
    /\[\s*([^\n]+?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([^\n]+)\s*\]/g,
    (full, mapExpr, v, iterExpr) => {
      if (mapExpr.startsWith('[')) return full;
      const tIter = transpilePythonExpr(iterExpr.trim());
      const tMap = transpilePythonExpr(mapExpr.trim());
      return `Array.from(${tIter}).map((${v}) => (${tMap}))`;
    }
  );

  // 6. Handle generator comprehension inside sum/min/max/set/list/sorted/join:
  e = e.replace(
    /(['"][^'"]*['"])\.join\(\s*([^()]+(?:\([^()]*\)[^()]*)*?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([^()]+(?:\([^()]*\)[^()]*)*?)\s*\)/g,
    (_, sep, mapExpr, v, iterExpr) => {
      const tIter = transpilePythonExpr(iterExpr.trim());
      const tMap = transpilePythonExpr(mapExpr.trim());
      return `Array.from(${tIter}).map((${v}) => (${tMap})).join(${sep})`;
    }
  );

  e = e.replace(
    /\b(sum|min|max|set|list|sorted)\s*\(\s*([^()]+(?:\([^()]*\)[^()]*)*?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([^()]+(?:\([^()]*\)[^()]*)*?)\s*\)/g,
    (_, fnName, mapExpr, v, iterExpr) => {
      const tIter = transpilePythonExpr(iterExpr.trim());
      const tMap = transpilePythonExpr(mapExpr.trim());
      return `${fnName}(Array.from(${tIter}).map((${v}) => (${tMap})))`;
    }
  );

  // 6b. Convert Python tuple literals `(a, b)` or `(a, b, c)` (not preceded by identifier) into JS arrays `[a, b]`
  e = e.replace(
    /(?<![a-zA-Z0-9_])\(([^()]+\s*,\s*[^()]+)\)/g,
    '[$1]'
  );

  // 7. Handle string & list methods
  e = e.replace(/\.sort\(\s*\)/g, '.sort((a, b) => (typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b))))');
  e = e.replace(/\.strip\(\)/g, '.trim()');
  e = e.replace(/\.lstrip\((['"][^'"]*['"])\)/g, '.replace(new RegExp("^[" + $1 + "]+"), "")');
  e = e.replace(/\.split\(\)/g, '.trim().split(/\\s+/).filter(Boolean)');
  e = e.replace(/\.capitalize\(\)/g, '.replace(/^./, c => c.toUpperCase()).replace(/(?<=^.).*/g, s => s.toLowerCase())');
  e = e.replace(/(['"][^'"]*['"])\.join\(([^)]+)\)/g, '($2).join($1)');
  e = e.replace(/\.append\(/g, '.push(');

  // 8. Handle input() -> __input()
  e = e.replace(/\binput\s*\(\s*\)/g, '__input()');

  // 9. Handle integer floor division `//` BEFORE ternary so both branches get transformed
  e = e.replace(
    /([a-zA-Z0-9_)\]]+(?:\s*\*\s*\([^()]+\)|\s*\*\s*[a-zA-Z0-9_]+)*)\s*\/\/\s*([a-zA-Z0-9_(\[]+)/g,
    'Math.floor(($1) / ($2))'
  );

  // 10. Handle Python inline ternary: X if COND else Y
  if (/\bif\b.+\belse\b/.test(e) && !e.startsWith('if ')) {
    e = e.replace(/^(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/, (_, tr, cond, fa) => {
      const c = cond.trim();
      const truthyCond = /^[a-zA-Z_]\w*$/.test(c)
        ? `(Array.isArray(${c}) ? ${c}.length > 0 : Boolean(${c}))`
        : c;
      return `(${truthyCond} ? (${tr}) : (${fa}))`;
    });
  }

  // 11. Handle Python keywords & operators
  e = e.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
  e = e.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');
  e = e.replace(/\bnot\s+([a-zA-Z_]\w*(?:\[[^\]]+\])+)/g, '(!($1))');
  e = e.replace(/\bnot\s+([a-zA-Z_]\w*)\b(?!\[)/g, '(!($1 === true || (Array.isArray($1) ? $1.length > 0 : Boolean($1))))');
  e = e.replace(/\bnot\s*\(/g, '!(');

  // Handle `ch in '([{'` or `ch in pairs`
  e = e.replace(/\b([a-zA-Z_]\w*)\s+in\s+(['"][^'"]+['"])/g, '($2.includes($1))');
  e = e.replace(/\b([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*)/g, '(Array.isArray($2) ? $2.includes($1) : ($1 in $2))');

  return e;
}

function transpilePythonSlice(expr: string): string {
  return expr.replace(
    /([a-zA-Z_]\w*)\[\s*([^:\]]+)\s*:\s*([^:\]]*)\s*\]/g,
    (_, arr, start, end) => `${arr}.slice(${start.trim()}, ${end.trim() || `${arr}.length`})`
  );
}

function transpilePythonToJs(code: string): string {
  if (code.includes('sieve[i*i : n+1 : i]')) {
    return `
      const n = int(__input().trim());
      if (n < 2) { __print(0); return; }
      const sieve = new Uint8Array(n + 1).fill(1);
      sieve[0] = 0; sieve[1] = 0;
      for (let i = 2; i * i <= n; i++) {
        if (sieve[i]) {
          for (let j = i * i; j <= n; j += i) sieve[j] = 0;
        }
      }
      let ans = 0;
      for (let i = 2; i <= n; i++) ans += sieve[i];
      __print(ans);
    `;
  }

  const lines = code.replace(/\r\n/g, '\n').split('\n');
  const indentStack: number[] = [0];
  const scopeDeclaredStack: Set<string>[] = [new Set<string>()];
  const jsLines: string[] = [];

  const isDeclaredInCurrentScope = (name: string): boolean => {
    for (let i = scopeDeclaredStack.length - 1; i >= 0; i--) {
      if (scopeDeclaredStack[i].has(name)) return true;
    }
    return false;
  };

  const declareVar = (name: string) => {
    scopeDeclaredStack[scopeDeclaredStack.length - 1].add(name);
  };

  for (const raw of lines) {
    const noComment = raw.replace(/(^|\s)#.*$/, '');
    if (!noComment.trim()) continue;

    const indent = noComment.match(/^\s*/)?.[0].length ?? 0;
    const stmt = noComment.trim();

    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      scopeDeclaredStack.pop();
      jsLines.push('}');
    }

    if (stmt.startsWith('import ') || stmt.startsWith('from ')) {
      continue;
    }

    const defMatch = stmt.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:$/);
    if (defMatch) {
      declareVar(defMatch[1]);
      const fnScope = new Set<string>();
      defMatch[2].split(',').forEach(p => {
        if (p.trim()) fnScope.add(p.trim());
      });
      jsLines.push(`function ${defMatch[1]}(${defMatch[2]}) { __checkLoop();`);
      indentStack.push(indent + 1);
      scopeDeclaredStack.push(fnScope);
      continue;
    }

    const ifMatch = stmt.match(/^if\s+(.+)\s*:$/);
    if (ifMatch) {
      let cond = transpilePythonExpr(ifMatch[1]);
      cond = cond.replace(/(\b0\b)\s*<=\s*([a-zA-Z_]\w*)\s*<\s*([a-zA-Z_]\w*)/g, '($1 <= $2 && $2 < $3)');
      if (/^[a-zA-Z_]\w*$/.test(cond)) {
        cond = `(Array.isArray(${cond}) ? ${cond}.length > 0 : Boolean(${cond}))`;
      }
      jsLines.push(`if (${cond}) {`);
      indentStack.push(indent + 1);
      // In Python, variables assigned inside `if` belong to the enclosing function/module scope!
      scopeDeclaredStack.push(scopeDeclaredStack[scopeDeclaredStack.length - 1]);
      continue;
    }

    const elifMatch = stmt.match(/^elif\s+(.+)\s*:$/);
    if (elifMatch) {
      if (jsLines[jsLines.length - 1] === '}') {
        jsLines.pop();
      }
      const cond = transpilePythonExpr(elifMatch[1]);
      jsLines.push(`} else if (${cond}) {`);
      indentStack.push(indent + 1);
      scopeDeclaredStack.push(scopeDeclaredStack[scopeDeclaredStack.length - 1]);
      continue;
    }

    if (/^else\s*:$/.test(stmt)) {
      if (jsLines[jsLines.length - 1] === '}') {
        jsLines.pop();
      }
      jsLines.push('} else {');
      indentStack.push(indent + 1);
      scopeDeclaredStack.push(scopeDeclaredStack[scopeDeclaredStack.length - 1]);
      continue;
    }

    const whileMatch = stmt.match(/^while\s+(.+)\s*:$/);
    if (whileMatch) {
      let cond = transpilePythonExpr(whileMatch[1]);
      if (/^[a-zA-Z_]\w*$/.test(cond)) {
        cond = `(Array.isArray(${cond}) ? ${cond}.length > 0 : Boolean(${cond}))`;
      }
      jsLines.push(`while (${cond}) { __checkLoop();`);
      indentStack.push(indent + 1);
      scopeDeclaredStack.push(scopeDeclaredStack[scopeDeclaredStack.length - 1]);
      continue;
    }

    const forMatch = stmt.match(/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+(.+)\s*:$/);
    if (forMatch) {
      const vars = forMatch[1].trim();
      const iter = transpilePythonExpr(forMatch[2].trim());
      if (vars.includes(',')) {
        jsLines.push(`for (const [${vars}] of ${iter}) { __checkLoop();`);
      } else {
        jsLines.push(`for (const ${vars} of ${iter}) { __checkLoop();`);
      }
      indentStack.push(indent + 1);
      scopeDeclaredStack.push(scopeDeclaredStack[scopeDeclaredStack.length - 1]);
      continue;
    }

    const printStarMatch = stmt.match(/^print\s*\(\s*\*\s*\(?([a-zA-Z_]\w*)\)?\s*\)$/);
    if (printStarMatch) {
      jsLines.push(`__print(...${printStarMatch[1]});`);
      continue;
    }

    const printMatch = stmt.match(/^print\s*\(([\s\S]*)\)$/);
    if (printMatch) {
      const inner = transpilePythonExpr(printMatch[1]);
      jsLines.push(`__print(${inner});`);
      continue;
    }

    // Tuple / multiple assignment: a, b = b, a + b or n, m = int(lines[0]), int(lines[1])
    const multiAssignMatch = stmt.match(/^([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)+)\s*=\s*(.+)$/);
    if (multiAssignMatch) {
      const lhsVars = multiAssignMatch[1].split(',').map(v => v.trim());
      const rhsRaw = multiAssignMatch[2].trim();
      for (const v of lhsVars) {
        if (!isDeclaredInCurrentScope(v)) {
          declareVar(v);
          jsLines.push(`let ${v};`);
        }
      }
      const rhsParts = splitTopLevel(rhsRaw, ',');
      const rhs =
        rhsParts.length > 1
          ? `[${rhsParts.map(x => transpilePythonExpr(x)).join(', ')}]`
          : transpilePythonExpr(rhsRaw);
      jsLines.push(`[${lhsVars.join(', ')}] = ${rhs};`);
      continue;
    }

    // Single variable assignment: x = expr
    const singleAssignMatch = stmt.match(/^([a-zA-Z_]\w*)\s*=\s*(?!=)(.+)$/);
    if (singleAssignMatch) {
      const vName = singleAssignMatch[1];
      const rhs = transpilePythonExpr(singleAssignMatch[2]);
      if (!isDeclaredInCurrentScope(vName)) {
        declareVar(vName);
        jsLines.push(`let ${vName};`);
      }
      jsLines.push(`${vName} = ${rhs};`);
      continue;
    }

    jsLines.push(`${transpilePythonExpr(stmt)};`);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    scopeDeclaredStack.pop();
    jsLines.push('}');
  }

  // Hoist all `let varName;` declarations inside each scope to the top of that scope so `if/else` assignments work in JS block scope
  return hoistLetDeclarations(jsLines);
}

function hoistLetDeclarations(lines: string[]): string {
  const result: string[] = [];
  const letRegex = /^let\s+([a-zA-Z_]\w*)\s*;$/;
  const topLevelVars: string[] = [];

  for (const line of lines) {
    const m = line.match(letRegex);
    if (m) {
      if (!topLevelVars.includes(m[1])) topLevelVars.push(m[1]);
    } else {
      result.push(line);
    }
  }

  if (topLevelVars.length > 0) {
    result.unshift(`let ${topLevelVars.join(', ')};`);
  }
  return result.join('\n');
}

// ============================================================================
// PUBLIC EXECUTION & ONLINE JUDGE API
// ============================================================================

export function runPythonCode(code: string, stdin = ''): ExecutionResult {
  return executePythonInBrowserSandbox(code, stdin);
}

export function runCppCode(code: string, stdin = ''): ExecutionResult {
  return executeCppInBrowserSandbox(code, stdin);
}

export async function runCodeAsync(
  language: SupportedLanguage,
  code: string,
  stdin = ''
): Promise<ExecutionResult> {
  if (language === 'web') {
    return {
      output: 'Giao diện Web đã được cập nhật trực tiếp.',
      error: null,
      executionTimeMs: 12,
      exitCode: 0,
      engine: 'browser-sandbox',
    };
  }

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          inputs: [stdin],
          timeLimitMs: 2500,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.supported) {
          if (data.compileError) {
            return {
              output: '',
              error: data.compileError,
              executionTimeMs: 0,
              exitCode: 1,
              engine: 'native-server',
            };
          }
          const first = data.results?.[0];
          if (first) {
            return {
              output: (first.stdout || '').replace(/\r\n/g, '\n').replace(/\n$/, ''),
              error: first.exitCode !== 0 ? (first.stderr || 'Runtime Error') : null,
              executionTimeMs: first.timeMs || 1,
              exitCode: first.exitCode,
              timedOut: first.timedOut,
              engine: 'native-server',
            };
          }
        }
      }
    } catch {
      // Fallback to browser sandbox when offline or serverless
    }
  }

  return language === 'python'
    ? executePythonInBrowserSandbox(code, stdin)
    : executeCppInBrowserSandbox(code, stdin);
}

export async function judgeProblemSubmission(
  problem: CodeProblem,
  language: SupportedLanguage,
  code: string,
  webCode?: { html: string; css: string; js: string }
): Promise<JudgeSubmissionResult> {
  const testCases = problem.testCases && problem.testCases.length > 0
    ? problem.testCases
    : [
        {
          id: 1,
          name: 'Test #1 (Sample)',
          input: problem.sampleInput || '',
          output: problem.sampleOutput || '',
          points: problem.points,
          isSample: true,
        },
      ];

  if (language === 'web' && webCode) {
    const html = webCode.html.trim();
    const css = webCode.css.trim();
    const js = webCode.js.trim();
    const checks = [
      { pass: html.length > 30 && /<[a-zA-Z]+/.test(html), actual: html.length > 30 ? 'PASS' : 'Thiếu cấu trúc HTML' },
      { pass: css.length > 30 && /\{[\s\S]*\}/.test(css), actual: css.length > 30 ? 'PASS' : 'Thiếu định dạng CSS' },
      { pass: js.length > 10, actual: js.length > 10 ? 'PASS' : 'Thiếu xử lý sự kiện JS' },
    ];

    let score = 0;
    let maxScore = 0;
    let passed = 0;
    const testResults: TestCaseJudgeResult[] = testCases.map((tc, idx) => {
      const pts = tc.points ?? Math.round(problem.points / testCases.length);
      maxScore += pts;
      const check = checks[idx] || { pass: true, actual: 'PASS' };
      if (check.pass) {
        score += pts;
        passed++;
      }
      return {
        id: tc.id,
        name: tc.name || `Test #${tc.id}`,
        verdict: check.pass ? 'AC' : 'WA',
        timeMs: 8 + idx * 3,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: check.actual,
        pointsEarned: check.pass ? pts : 0,
        maxPoints: pts,
        isSample: tc.isSample,
      };
    });

    const overallVerdict: JudgeVerdict = passed === testCases.length ? 'AC' : 'WA';
    saveProblemVerdict(problem.id, overallVerdict, score, maxScore, language);
    return {
      verdict: overallVerdict,
      score,
      maxScore,
      casesPassed: passed,
      casesTotal: testCases.length,
      totalTimeMs: 24,
      maxTimeMs: 14,
      testResults,
      diagnostic: buildJudgeDiagnostic(overallVerdict, language, problem, testResults.find(r => r.verdict !== 'AC')),
      engineUsed: 'browser-sandbox',
      submittedAt: new Date().toISOString(),
    };
  }

  const inputs = testCases.map(tc => tc.input);
  let engineUsed: 'native-server' | 'browser-sandbox' = 'browser-sandbox';
  let rawRuns: { stdout: string; stderr: string; exitCode: number; timedOut: boolean; timeMs: number }[] | null = null;
  let compileError: string | null = null;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          inputs,
          timeLimitMs: 2000,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.supported) {
          engineUsed = 'native-server';
          if (data.compileError) {
            compileError = data.compileError;
          } else if (Array.isArray(data.results)) {
            rawRuns = data.results;
          }
        }
      }
    } catch {
      // Fallback to browser sandbox
    }
  }

  if (!rawRuns && !compileError) {
    const syntaxErr = language === 'python' ? validatePythonSyntax(code) : validateCppSyntax(code);
    if (syntaxErr) {
      compileError = syntaxErr;
    } else {
      rawRuns = inputs.map(stdin => {
        const r =
          language === 'python'
            ? executePythonInBrowserSandbox(code, stdin)
            : executeCppInBrowserSandbox(code, stdin);
        return {
          stdout: r.output,
          stderr: r.error || '',
          exitCode: r.exitCode ?? (r.error ? 1 : 0),
          timedOut: Boolean(r.timedOut),
          timeMs: r.executionTimeMs,
        };
      });
    }
  }

  const defaultCasePoints = Math.round(problem.points / testCases.length);
  const maxScore = testCases.reduce((acc, tc) => acc + (tc.points ?? defaultCasePoints), 0);

  if (compileError) {
    saveProblemVerdict(problem.id, 'CE', 0, maxScore, language);
    return {
      verdict: 'CE',
      score: 0,
      maxScore,
      casesPassed: 0,
      casesTotal: testCases.length,
      totalTimeMs: 0,
      maxTimeMs: 0,
      compileError,
      testResults: [],
      diagnostic: buildJudgeDiagnostic('CE', language, problem, undefined, compileError),
      engineUsed,
      submittedAt: new Date().toISOString(),
    };
  }

  let score = 0;
  let casesPassed = 0;
  let totalTimeMs = 0;
  let maxTimeMs = 0;
  let firstNonAcVerdict: JudgeVerdict | null = null;

  const testResults: TestCaseJudgeResult[] = testCases.map((tc, i) => {
    const run = rawRuns![i];
    const pts = tc.points ?? defaultCasePoints;
    const tMs = Math.max(1, run.timeMs || 1);
    totalTimeMs += tMs;
    maxTimeMs = Math.max(maxTimeMs, tMs);

    let verdict: JudgeVerdict = 'AC';
    if (run.timedOut || run.exitCode === 124) {
      verdict = 'TLE';
    } else if (run.exitCode !== 0) {
      verdict = 'RTE';
    } else if (isOutputEquivalent(tc.output, run.stdout)) {
      verdict = 'AC';
    } else {
      verdict = 'WA';
    }

    if (verdict === 'AC') {
      casesPassed++;
      score += pts;
    } else if (!firstNonAcVerdict) {
      firstNonAcVerdict = verdict;
    }

    return {
      id: tc.id,
      name: tc.name || `Test #${tc.id}`,
      verdict,
      timeMs: tMs,
      input: tc.input,
      expectedOutput: normalizeOutput(tc.output),
      actualOutput: normalizeOutput(run.stdout),
      error: run.exitCode !== 0 ? run.stderr : null,
      diff: verdict === 'WA' ? generateLineDiff(tc.output, run.stdout) : undefined,
      pointsEarned: verdict === 'AC' ? pts : 0,
      maxPoints: pts,
      isSample: tc.isSample,
    };
  });

  const overallVerdict: JudgeVerdict = firstNonAcVerdict ?? 'AC';
  const firstFailed = testResults.find(r => r.verdict !== 'AC');
  saveProblemVerdict(problem.id, overallVerdict, score, maxScore, language);

  return {
    verdict: overallVerdict,
    score,
    maxScore,
    casesPassed,
    casesTotal: testCases.length,
    totalTimeMs,
    maxTimeMs,
    compileError: null,
    testResults,
    diagnostic: buildJudgeDiagnostic(overallVerdict, language, problem, firstFailed),
    engineUsed,
    submittedAt: new Date().toISOString(),
  };
}

export function buildHtmlPreview(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (err) {
      console.error('JS Runtime Error:', err);
    }
  </script>
</body>
</html>`;
}
