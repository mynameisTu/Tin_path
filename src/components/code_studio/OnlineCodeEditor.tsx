import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Terminal,
  Eye,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Wand2,
  Bug,
  Gauge,
  BookOpen,
  ArrowLeft,
  Copy,
  Check,
  Award,
  Layers,
  Cpu,
  FileText,
  XCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { SupportedLanguage, CodeProblem } from './codeProblemsData';
import {
  runCodeAsync,
  judgeProblemSubmission,
  buildHtmlPreview,
  ExecutionResult,
  JudgeSubmissionResult,
  JudgeVerdict,
  TestCaseJudgeResult,
} from './codeExecutionEngine';

interface OnlineCodeEditorProps {
  problem?: CodeProblem | null;
  initialLang?: SupportedLanguage;
  initialLanguage?: SupportedLanguage;
  onBack?: () => void;
  onBackToHub?: () => void;
  isStandaloneFullscreen?: boolean;
  onVerdictUpdate?: (problemId: string, verdict: JudgeVerdict, score: number) => void;
}

const DEFAULT_STARTER: Record<SupportedLanguage, { code?: string; html?: string; css?: string; js?: string }> = {
  python: {
    code: `# TinPath Python 3.11 Sandbox
a, b = map(int, input().split())
print(a + b)`,
  },
  cpp: {
    code: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << endl;
    }
    return 0;
}`,
  },
  web: {
    html: `<div class="banner">
  <h1>TinPath Web Studio</h1>
  <p>Chỉnh sửa HTML, CSS, JS và xem kết quả trực tiếp!</p>
  <button id="actionBtn">Đổi màu nền</button>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  margin: 0;
  background: #f8fafc;
  transition: background 0.3s;
}
.banner {
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
}
h1 { color: #2563eb; margin-bottom: 8px; }
p { color: #64748b; margin-bottom: 20px; }
button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}`,
    js: `const btn = document.getElementById('actionBtn');
const colors = ['#f8fafc', '#eff6ff', '#f0fdf4', '#fefce8', '#fdf2f8'];
let idx = 0;
btn.addEventListener('click', () => {
  idx = (idx + 1) % colors.length;
  document.body.style.background = colors[idx];
});`,
  },
};

function formatMathText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\$\$([^$]+)\$\$/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\times/g, '×')
    .replace(/\\dots/g, '...')
    .replace(/\\bmod/g, 'mod')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\vdots/g, '⋮');
}

const VERDICT_META: Record<
  JudgeVerdict,
  { label: string; short: string; bg: string; border: string; text: string; badgeBg: string }
> = {
  AC: {
    label: 'Accepted — Chấp nhận kết quả (Đạt 100%)',
    short: 'AC',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    badgeBg: 'bg-emerald-500 text-slate-950',
  },
  WA: {
    label: 'Wrong Answer — Sai kết quả ở một số testcase',
    short: 'WA',
    bg: 'bg-rose-950/60',
    border: 'border-rose-500/40',
    text: 'text-rose-300',
    badgeBg: 'bg-rose-500 text-white',
  },
  TLE: {
    label: 'Time Limit Exceeded — Quá thời gian giới hạn',
    short: 'TLE',
    bg: 'bg-amber-950/60',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
    badgeBg: 'bg-amber-500 text-slate-950',
  },
  RTE: {
    label: 'Runtime Error — Lỗi phát sinh trong khi chạy',
    short: 'RTE',
    bg: 'bg-orange-950/60',
    border: 'border-orange-500/40',
    text: 'text-orange-300',
    badgeBg: 'bg-orange-500 text-white',
  },
  CE: {
    label: 'Compilation Error — Lỗi biên dịch / cú pháp',
    short: 'CE',
    bg: 'bg-purple-950/60',
    border: 'border-purple-500/40',
    text: 'text-purple-300',
    badgeBg: 'bg-purple-500 text-white',
  },
};

export const OnlineCodeEditor: React.FC<OnlineCodeEditorProps> = ({
  problem,
  initialLang,
  initialLanguage,
  onBack,
  onBackToHub,
  isStandaloneFullscreen,
  onVerdictUpdate,
}) => {
  const handleBackAction = onBack || onBackToHub;
  const [language, setLanguage] = useState<SupportedLanguage>(
    problem?.recommendedLang || initialLang || initialLanguage || 'python'
  );

  // Code state
  const [pythonCode, setPythonCode] = useState<string>(DEFAULT_STARTER.python.code!);
  const [cppCode, setCppCode] = useState<string>(DEFAULT_STARTER.cpp.code!);
  const [htmlCode, setHtmlCode] = useState<string>(DEFAULT_STARTER.web.html!);
  const [cssCode, setCssCode] = useState<string>(DEFAULT_STARTER.web.css!);
  const [jsCode, setJsCode] = useState<string>(DEFAULT_STARTER.web.js!);
  const [webTab, setWebTab] = useState<'html' | 'css' | 'js'>('html');

  // Left Problem Drawer state
  const [showProblemPane, setShowProblemPane] = useState<boolean>(true);
  const [problemTab, setProblemTab] = useState<'statement' | 'testcases' | 'judge'>('statement');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Execution & Judge state
  const [stdin, setStdin] = useState<string>(problem?.sampleInput || '18 4');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [judgeResult, setJudgeResult] = useState<JudgeSubmissionResult | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseJudgeResult | null>(null);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Right bottom panel mode: 'console' | 'ai'
  const [rightBottomTab, setRightBottomTab] = useState<'console' | 'ai'>('console');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Load starter code when problem changes
  useEffect(() => {
    if (problem) {
      setLanguage(problem.recommendedLang);
      if (problem.starterCode.python) setPythonCode(problem.starterCode.python);
      if (problem.starterCode.cpp) setCppCode(problem.starterCode.cpp);
      if (problem.starterCode.html) setHtmlCode(problem.starterCode.html);
      if (problem.starterCode.css) setCssCode(problem.starterCode.css);
      if (problem.starterCode.js) setJsCode(problem.starterCode.js);
      setStdin(problem.sampleInput || '');
      setExecResult(null);
      setJudgeResult(null);
      setSelectedTestCase(null);
      setProblemTab('statement');
      setShowProblemPane(true);
    }
  }, [problem]);

  const activeCode = language === 'python' ? pythonCode : language === 'cpp' ? cppCode : htmlCode;
  const lineCount =
    language === 'web'
      ? (webTab === 'html' ? htmlCode : webTab === 'css' ? cssCode : jsCode).split('\n').length
      : activeCode.split('\n').length;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleRunCode = async (overrideStdin?: string) => {
    const inputToUse = overrideStdin !== undefined ? overrideStdin : stdin;
    if (overrideStdin !== undefined) {
      setStdin(overrideStdin);
    }
    setIsRunning(true);
    setRightBottomTab('console');
    try {
      const res = await runCodeAsync(
        language,
        language === 'python' ? pythonCode : cppCode,
        inputToUse
      );
      setExecResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleJudgeProblem = async () => {
    if (!problem) {
      handleRunCode();
      return;
    }
    setIsJudging(true);
    setShowProblemPane(true);
    setProblemTab('judge');
    try {
      const res = await judgeProblemSubmission(
        problem,
        language,
        language === 'python' ? pythonCode : cppCode,
        language === 'web' ? { html: htmlCode, css: cssCode, js: jsCode } : undefined
      );
      setJudgeResult(res);
      const firstFailed = res.testResults.find(r => r.verdict !== 'AC');
      setSelectedTestCase(firstFailed || res.testResults[0] || null);
      if (onVerdictUpdate) {
        onVerdictUpdate(problem.id, res.verdict, res.score);
      }
    } finally {
      setIsJudging(false);
    }
  };

  const handleResetCode = () => {
    if (problem) {
      if (language === 'python' && problem.starterCode.python) setPythonCode(problem.starterCode.python);
      if (language === 'cpp' && problem.starterCode.cpp) setCppCode(problem.starterCode.cpp);
      if (language === 'web') {
        if (problem.starterCode.html) setHtmlCode(problem.starterCode.html);
        if (problem.starterCode.css) setCssCode(problem.starterCode.css);
        if (problem.starterCode.js) setJsCode(problem.starterCode.js);
      }
    } else {
      if (language === 'python') setPythonCode(DEFAULT_STARTER.python.code!);
      if (language === 'cpp') setCppCode(DEFAULT_STARTER.cpp.code!);
      if (language === 'web') {
        setHtmlCode(DEFAULT_STARTER.web.html!);
        setCssCode(DEFAULT_STARTER.web.css!);
        setJsCode(DEFAULT_STARTER.web.js!);
      }
    }
    setExecResult(null);
    setJudgeResult(null);
  };

  const handleSaveCode = () => {
    try {
      const key = `tinpath_saved_code_${problem?.id || 'sandbox'}_${language}`;
      const payload =
        language === 'web' ? JSON.stringify({ htmlCode, cssCode, jsCode }) : activeCode;
      localStorage.setItem(key, payload);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // ignore storage errors
    }
  };

  const handleAskAI = async (mode: 'explain' | 'debug' | 'optimize' | 'complexity') => {
    setRightBottomTab('ai');
    setAiLoading(true);

    const codeToAnalyze =
      language === 'web'
        ? `HTML:\n${htmlCode}\nCSS:\n${cssCode}\nJS:\n${jsCode}`
        : activeCode;

    const prompts: Record<typeof mode, string> = {
      explain: `Hãy giải thích ngắn gọn từng bước hoạt động của đoạn code ${language.toUpperCase()} sau cho học sinh THPT:\n\n${codeToAnalyze}`,
      debug: `Hãy kiểm tra lỗi cú pháp hoặc lỗi logic (edge cases, tràn số, chia cho 0) trong đoạn code ${language.toUpperCase()} sau và gợi ý cách sửa:\n\n${codeToAnalyze}`,
      optimize: `Hãy đề xuất cách tối ưu hóa hiệu năng và làm sạch mã nguồn (Clean Code) cho đoạn code ${language.toUpperCase()} sau:\n\n${codeToAnalyze}`,
      complexity: `Hãy phân tích độ phức tạp thuật toán Thời gian Big-O Time Complexity và Bộ nhớ Space Complexity của đoạn code sau:\n\n${codeToAnalyze}`,
    };

    try {
      const res = await fetch('/api/gemini/thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: problem ? `Bài tập ${problem.code}: ${problem.title}` : `Lập trình ${language.toUpperCase()}`,
          userQuestion: prompts[mode],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.explanation || data.answer || 'Đã phân tích xong đoạn mã của bạn.');
      } else {
        throw new Error('Fallback local AI');
      }
    } catch {
      const fallbackMap: Record<typeof mode, string> = {
        explain: `### Giải thích luồng hoạt động (${language.toUpperCase()})\n1. **Đọc dữ liệu đầu vào (Input)**: Đọc các tham số từ luồng chuẩn \`stdin\`.\n2. **Xử lý thuật toán**: Thực hiện tính toán và kiểm tra điều kiện theo yêu cầu bài **${problem?.title || 'Code Sandbox'}**.\n3. **Xuất kết quả (Output)**: In kết quả chuẩn hóa ra \`stdout\` để hệ thống Judge đối chiếu với ${problem?.testCases?.length || 10} testcases.`,
        debug: `### Rà soát lỗi tiềm ẩn (Debug Checklist)\n- **Kiểu dữ liệu 64-bit**: Với C++, khi dữ liệu lên tới $10^{12}$ hoặc tích 3 số $10^9$, hãy dùng \`long long\` thay vì \`int\` để tránh tràn số (Overflow).\n- **Biên dữ liệu (Edge Cases)**: Kiểm tra các trường hợp $n = 0, n = 1$, số âm hoặc mẫu số bằng $0$.\n- **Định dạng kết quả**: Chú ý xuống dòng \`\\n\` hoặc khoảng trắng giữa các phần tử.`,
        optimize: `### Gợi ý tối ưu hóa mã nguồn\n- Trong C++, thêm \`ios::sync_with_stdio(false); cin.tie(nullptr);\` ở đầu hàm \`main()\` để tăng tốc độ nhập xuất khi dữ liệu lớn.\n- Trong Python, sử dụng \`sys.stdin.read().split()\` nhanh hơn nhiều so với gọi \`input()\` lặp lại nhiều lần.`,
        complexity: `### Phân tích Độ phức tạp (Big-O)\n- **Độ phức tạp thời gian (Time Complexity)**: Đạt mức tối ưu cho giới hạn thời gian \`${problem?.timeLimit || '1.0s'}\`.\n- **Độ phức tạp không gian (Space Complexity)**: Sử dụng bộ nhớ nằm gọn trong giới hạn \`${problem?.memoryLimit || '256 MB'}\`.`,
      };
      setAiResponse(fallbackMap[mode]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col ${
        isStandaloneFullscreen
          ? 'h-screen w-screen rounded-none border-0'
          : 'h-[calc(100vh-110px)] min-h-[700px] rounded-3xl border border-slate-800'
      } bg-[#0B1120] overflow-hidden shadow-2xl`}
    >
      {/* Top IDE Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#0F172A] border-b border-slate-800">
        <div className="flex items-center gap-3">
          {handleBackAction && (
            <button
              onClick={handleBackAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Danh sách bài
            </button>
          )}

          {problem && (
            <button
              onClick={() => setShowProblemPane(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                showProblemPane
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Ẩn / Hiện khung đề bài"
            >
              {showProblemPane ? (
                <PanelLeftClose className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftOpen className="w-3.5 h-3.5" />
              )}
              Đề bài
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {problem && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {problem.code}
                  </span>
                )}
                <h2 className="text-sm font-bold text-white truncate max-w-[260px] sm:max-w-md">
                  {problem ? problem.title : 'TinPath Code Studio — Sandbox Tự Do'}
                </h2>
                {judgeResult && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      VERDICT_META[judgeResult.verdict].badgeBg
                    }`}
                  >
                    {judgeResult.verdict} • {judgeResult.score}/{judgeResult.maxScore}đ
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {problem
                  ? `${problem.category} • Giới hạn: ${problem.timeLimit || '1.0s'} / ${problem.memoryLimit || '256 MB'} • ${problem.testCases?.length || 1} testcases`
                  : 'Môi trường thực thi trực tuyến Python 3, C++17 & Web'}
              </p>
            </div>
          </div>
        </div>

        {/* Language Selector & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(
              [
                { id: 'python', label: 'Python 3.11' },
                { id: 'cpp', label: 'C++ (GCC 13)' },
                { id: 'web', label: 'HTML / CSS / JS' },
              ] as { id: SupportedLanguage; label: string }[]
            ).map(lang => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  setExecResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === lang.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetCode}
            title="Khôi phục code mẫu"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            {savedToast ? 'Đã lưu!' : 'Lưu bài'}
          </button>

          <button
            onClick={() => handleRunCode()}
            disabled={isRunning || isJudging}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            {isRunning ? 'Đang chạy...' : 'Chạy thử'}
          </button>

          {problem && (
            <button
              onClick={handleJudgeProblem}
              disabled={isJudging || isRunning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Award className="w-4 h-4" />
              {isJudging ? 'Đang chấm test...' : `Chấm bài (${problem.testCases?.length || 1} test)`}
            </button>
          )}
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT PANE: Problem Statement, Testcases & Judge Results (4 columns when visible) */}
        {problem && showProblemPane && (
          <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0B1120] overflow-hidden">
            {/* Problem Sub-navigation Tabs */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setProblemTab('statement')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    problemTab === 'statement'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Đề bài
                </button>
                <button
                  onClick={() => setProblemTab('testcases')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    problemTab === 'testcases'
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Bộ Test ({problem.testCases?.length || 1})
                </button>
                <button
                  onClick={() => setProblemTab('judge')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    problemTab === 'judge'
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Kết quả chấm
                  {judgeResult && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-black ${
                        VERDICT_META[judgeResult.verdict].badgeBg
                      }`}
                    >
                      {judgeResult.verdict}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Left Pane Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200">
              {problemTab === 'statement' && (
                <>
                  {/* Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {problem.difficulty === 'Easy'
                        ? 'Dễ (Easy)'
                        : problem.difficulty === 'Medium'
                        ? 'Trung bình (Medium)'
                        : 'Khó (Hard)'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      +{problem.points} XP
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400 bg-slate-800/80">
                      ⏱ {problem.timeLimit || '1.0s'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400 bg-slate-800/80">
                      💾 {problem.memoryLimit || '256 MB'}
                    </span>
                  </div>

                  {/* Problem Statement */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Nội dung bài toán
                    </h3>
                    <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {formatMathText(problem.description)}
                    </div>
                  </div>

                  {/* Input & Output Specification */}
                  {(problem.inputDesc || problem.outputDesc) && (
                    <div className="grid grid-cols-1 gap-3">
                      {problem.inputDesc && (
                        <div className="bg-slate-900/50 border border-slate-800/90 rounded-xl p-3.5">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-1">
                            Dữ liệu vào (Input)
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                            {formatMathText(problem.inputDesc)}
                          </p>
                        </div>
                      )}
                      {problem.outputDesc && (
                        <div className="bg-slate-900/50 border border-slate-800/90 rounded-xl p-3.5">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
                            Kết quả ra (Output)
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                            {formatMathText(problem.outputDesc)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Constraints */}
                  {problem.constraints && (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-1">
                        Giới hạn & Ràng buộc
                      </h4>
                      <p className="text-xs font-mono text-slate-300">
                        {formatMathText(problem.constraints)}
                      </p>
                    </div>
                  )}

                  {/* Sample Input / Output Box */}
                  {problem.sampleInput !== undefined && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                          Ví dụ mẫu (Sample I/O)
                        </h4>
                        <button
                          onClick={() => handleRunCode(problem.sampleInput || '')}
                          className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-blue-400" />
                          Nạp vào STDIN & Chạy thử
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-[#080D1A] border border-slate-800 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Sample Input
                            </span>
                            <button
                              onClick={() => handleCopy(problem.sampleInput || '', 'sample-in')}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedField === 'sample-in' ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              {copiedField === 'sample-in' ? 'Đã chép' : 'Chép'}
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-amber-300 whitespace-pre-wrap break-all">
                            {problem.sampleInput || '(Trống)'}
                          </pre>
                        </div>

                        <div className="bg-[#080D1A] border border-slate-800 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Sample Output
                            </span>
                            <button
                              onClick={() => handleCopy(problem.sampleOutput || '', 'sample-out')}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedField === 'sample-out' ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              {copiedField === 'sample-out' ? 'Đã chép' : 'Chép'}
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap break-all">
                            {problem.sampleOutput || '(Trống)'}
                          </pre>
                        </div>
                      </div>

                      {problem.sampleExplanation && (
                        <p className="text-xs text-slate-400 italic bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800/60">
                          💡 Giải thích: {formatMathText(problem.sampleExplanation)}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {problemTab === 'testcases' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
                        Danh sách bộ Test chuẩn ({problem.testCases?.length || 1} testcases)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Bấm vào bất kỳ testcase nào để nạp dữ liệu vào ô STDIN và chạy kiểm thử.
                      </p>
                    </div>
                    <button
                      onClick={handleJudgeProblem}
                      disabled={isJudging}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Chấm toàn bộ
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(problem.testCases || []).map(tc => (
                      <div
                        key={tc.id}
                        className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {tc.name || `Test #${tc.id}`}
                            </span>
                            {tc.points && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">
                                {tc.points} điểm
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRunCode(tc.input)}
                            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-cyan-400" />
                            Chạy test này
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="bg-[#080D1A] p-2 rounded-lg border border-slate-800/80">
                            <div className="text-[10px] text-slate-500 mb-0.5">INPUT:</div>
                            <div className="text-amber-300 truncate">{tc.input}</div>
                          </div>
                          <div className="bg-[#080D1A] p-2 rounded-lg border border-slate-800/80">
                            <div className="text-[10px] text-slate-500 mb-0.5">EXPECTED OUTPUT:</div>
                            <div className="text-emerald-300 truncate">{tc.output}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {problemTab === 'judge' && (
                <div className="space-y-4">
                  {isJudging ? (
                    <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <div className="text-sm font-bold text-white">
                        Hệ thống Online Judge đang chấm {problem.testCases?.length || 1} testcases...
                      </div>
                      <p className="text-xs text-slate-400">
                        Đang kiểm tra biên dịch, đo thời gian chạy và so khớp kết quả với sai số chuẩn $10^{-4}$.
                      </p>
                    </div>
                  ) : !judgeResult ? (
                    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                      <Award className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                      <div className="text-sm font-bold text-white">Chưa có lượt chấm bài nào</div>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Nhấn nút <strong>"Chấm bài"</strong> trên thanh công cụ để chạy thử nghiệm mã nguồn của bạn qua toàn bộ {problem.testCases?.length || 1} bộ test chuẩn.
                      </p>
                      <button
                        onClick={handleJudgeProblem}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Chấm bài ngay
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Verdict Summary Banner */}
                      <div
                        className={`p-4 rounded-2xl border ${VERDICT_META[judgeResult.verdict].bg} ${
                          VERDICT_META[judgeResult.verdict].border
                        } space-y-3`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`px-3 py-1 rounded-xl text-sm font-black ${
                                VERDICT_META[judgeResult.verdict].badgeBg
                              }`}
                            >
                              {judgeResult.verdict}
                            </span>
                            <div>
                              <div
                                className={`text-xs font-extrabold ${
                                  VERDICT_META[judgeResult.verdict].text
                                }`}
                              >
                                {VERDICT_META[judgeResult.verdict].label}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                                <span>
                                  Điểm: <strong className="text-white">{judgeResult.score}/{judgeResult.maxScore}</strong>
                                </span>
                                <span>
                                  Test đạt: <strong className="text-white">{judgeResult.casesPassed}/{judgeResult.casesTotal}</strong>
                                </span>
                                <span>
                                  Tổng thời gian: <strong className="text-white">{judgeResult.totalTimeMs} ms</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {judgeResult.compileError && (
                          <pre className="p-3 rounded-xl bg-black/50 border border-purple-500/30 text-xs font-mono text-purple-200 whitespace-pre-wrap">
                            {judgeResult.compileError}
                          </pre>
                        )}
                      </div>

                      {/* Per-testcase Pills */}
                      {judgeResult.testResults.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Chi tiết từng Testcase (Bấm để xem Input / Output)
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {judgeResult.testResults.map(tr => {
                              const isSelected = selectedTestCase?.id === tr.id;
                              return (
                                <button
                                  key={tr.id}
                                  onClick={() => setSelectedTestCase(tr)}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? 'ring-2 ring-blue-500 bg-slate-800/90 border-blue-500/50'
                                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white truncate">
                                      Test #{tr.id}
                                    </span>
                                    <span
                                      className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                        VERDICT_META[tr.verdict].badgeBg
                                      }`}
                                    >
                                      {tr.verdict}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                                    <span>{tr.timeMs} ms</span>
                                    <span>
                                      {tr.pointsEarned}/{tr.maxPoints}đ
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Selected Testcase I/O Diff Inspector */}
                      {selectedTestCase && (
                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-white">
                              Chi tiết {selectedTestCase.name} —{' '}
                              <span className={VERDICT_META[selectedTestCase.verdict].text}>
                                {selectedTestCase.verdict} ({selectedTestCase.timeMs} ms)
                              </span>
                            </span>
                            <button
                              onClick={() => handleRunCode(selectedTestCase.input)}
                              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                            >
                              Nạp vào STDIN
                            </button>
                          </div>

                          <div className="space-y-2 text-xs font-mono">
                            <div className="p-2.5 rounded-xl bg-[#080D1A] border border-slate-800">
                              <div className="text-[10px] text-slate-500 mb-1">DỮ LIỆU VÀO (INPUT):</div>
                              <pre className="text-amber-300 whitespace-pre-wrap break-all">
                                {selectedTestCase.input || '(Trống)'}
                              </pre>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="p-2.5 rounded-xl bg-[#080D1A] border border-slate-800">
                                <div className="text-[10px] text-slate-500 mb-1">ĐÁP ÁN CHUẨN (EXPECTED):</div>
                                <pre className="text-emerald-300 whitespace-pre-wrap break-all">
                                  {selectedTestCase.expectedOutput || '(Trống)'}
                                </pre>
                              </div>
                              <div className="p-2.5 rounded-xl bg-[#080D1A] border border-slate-800">
                                <div className="text-[10px] text-slate-500 mb-1">KẾT QUẢ CỦA BẠN (ACTUAL):</div>
                                <pre
                                  className={`whitespace-pre-wrap break-all ${
                                    selectedTestCase.verdict === 'AC'
                                      ? 'text-emerald-300'
                                      : 'text-rose-300'
                                  }`}
                                >
                                  {selectedTestCase.actualOutput ||
                                    selectedTestCase.error ||
                                    '(Không in ra kết quả)'}
                                </pre>
                              </div>
                            </div>
                            {selectedTestCase.diff && (
                              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200">
                                <div className="text-[10px] font-bold uppercase text-rose-400 mb-1">
                                  So sánh sai khác (Diff):
                                </div>
                                <pre className="whitespace-pre-wrap text-[11px]">
                                  {selectedTestCase.diff}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Diagnostic Hint Card */}
                      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          Nhận xét & Chẩn đoán từ NTV-Judge AI
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {judgeResult.diagnostic.summary}
                        </p>
                        <p className="text-[11px] text-indigo-300/90">
                          ⏱ {judgeResult.diagnostic.timeComplexityHint}
                        </p>
                        <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                          {judgeResult.diagnostic.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANE: Code Editor + Console / Live Preview */}
        <div
          className={`${
            problem && showProblemPane ? 'lg:col-span-7' : 'lg:col-span-12'
          } flex flex-col overflow-hidden bg-[#0B1120]`}
        >
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-slate-800">
            {language === 'web' ? (
              <div className="flex items-center gap-1">
                {(['html', 'css', 'js'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setWebTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                      webTab === tab
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    index.{tab}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {language === 'python' ? 'solution.py' : 'solution.cpp'}
              </div>
            )}

            {/* Quick AI Assist Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAskAI('explain')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                Giải thích
              </button>
              <button
                onClick={() => handleAskAI('debug')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Bug className="w-3 h-3" />
                Tìm lỗi
              </button>
              <button
                onClick={() => handleAskAI('complexity')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Gauge className="w-3 h-3" />
                Big-O
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 flex overflow-hidden relative font-mono text-sm border-b border-slate-800">
            {/* Line Numbers Gutter */}
            <div className="w-12 py-4 bg-[#0B1120] border-r border-slate-800/80 text-right pr-3 select-none text-slate-600 text-xs leading-6">
              {Array.from({ length: Math.max(lineCount, 16) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Textarea Code Input */}
            <textarea
              value={
                language === 'python'
                  ? pythonCode
                  : language === 'cpp'
                  ? cppCode
                  : webTab === 'html'
                  ? htmlCode
                  : webTab === 'css'
                  ? cssCode
                  : jsCode
              }
              onChange={e => {
                const val = e.target.value;
                if (language === 'python') setPythonCode(val);
                else if (language === 'cpp') setCppCode(val);
                else if (webTab === 'html') setHtmlCode(val);
                else if (webTab === 'css') setCssCode(val);
                else setJsCode(val);
              }}
              spellCheck={false}
              className="flex-1 p-4 bg-[#0B1120] text-slate-100 font-mono text-sm leading-6 focus:outline-none resize-none overflow-y-auto selection:bg-blue-500/30"
              placeholder="Nhập mã nguồn của bạn tại đây..."
            />
          </div>

          {/* Bottom Console / STDIN / Web Preview / AI Tutor */}
          <div className="h-[270px] flex flex-col bg-[#0F172A] overflow-hidden">
            {/* Bottom Panel Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRightBottomTab('console')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    rightBottomTab === 'console'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'web' ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Live Web Preview
                    </>
                  ) : (
                    <>
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      Console & Dữ liệu vào (STDIN)
                    </>
                  )}
                </button>

                <button
                  onClick={() => setRightBottomTab('ai')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    rightBottomTab === 'ai'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Trợ lý AI Code
                </button>
              </div>

              {execResult && rightBottomTab === 'console' && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Cpu className="w-3 h-3" />
                    {execResult.engine === 'native-server' ? 'Native Compiler' : 'Browser Sandbox'}
                  </span>
                  {execResult.error ? (
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Lỗi thực thi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Thành công
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    {execResult.executionTimeMs} ms
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {rightBottomTab === 'console' ? (
                language === 'web' ? (
                  <div className="flex-1 bg-white">
                    <iframe
                      title="TinPath Web Live Preview"
                      srcDoc={buildHtmlPreview(htmlCode, cssCode, jsCode)}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                    {/* Multi-line STDIN box (5 cols) */}
                    <div className="md:col-span-5 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 p-3 bg-[#090E1A]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Dữ liệu vào (Standard Input - STDIN)
                        </span>
                        {problem?.sampleInput && (
                          <button
                            onClick={() => setStdin(problem.sampleInput || '')}
                            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                          >
                            Nạp Sample Input
                          </button>
                        )}
                      </div>
                      <textarea
                        value={stdin}
                        onChange={e => setStdin(e.target.value)}
                        placeholder="Nhập dữ liệu đầu vào (nhiều dòng hoặc cách nhau bởi dấu cách)..."
                        className="flex-1 w-full bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    {/* STDOUT Output Console (7 cols) */}
                    <div className="md:col-span-7 flex flex-col p-3 font-mono text-xs overflow-y-auto bg-[#070B14]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Kết quả đầu ra (Standard Output - STDOUT)
                      </div>
                      {!execResult ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-1.5 text-center">
                          <Terminal className="w-6 h-6 stroke-[1.5]" />
                          <p className="text-xs">
                            Nhấn <strong className="text-slate-300">"Chạy thử"</strong> để kiểm tra với STDIN hoặc{' '}
                            <strong className="text-emerald-400">"Chấm bài"</strong> để chấm toàn bộ Testcases.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {execResult.output && (
                            <pre className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-300 whitespace-pre-wrap leading-relaxed">
                              {execResult.output}
                            </pre>
                          )}
                          {execResult.error && (
                            <pre className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 whitespace-pre-wrap leading-relaxed">
                              {execResult.error}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* AI Code Tutor Panel */
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {aiLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-medium">
                        Trợ lý AI TinPath đang phân tích mã nguồn của bạn...
                      </p>
                    </div>
                  ) : aiResponse ? (
                    <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Chọn một tính năng AI phía trên (Giải thích, Tìm lỗi, Big-O) để nhận gợi ý trực tiếp.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
