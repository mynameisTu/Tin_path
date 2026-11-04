import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Download,
  Trash2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Code2,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  FileCode
} from 'lucide-react';
import { SupportedLanguage, CodeProblem } from './codeProblemsData';
import { runPythonCode, runCppCode, buildHtmlPreview, ExecutionResult } from './codeExecutionEngine';

interface OnlineCodeEditorProps {
  initialLanguage?: SupportedLanguage;
  problem?: CodeProblem | null;
  onBackToHub?: () => void;
  isStandaloneFullscreen?: boolean;
}

const DEFAULT_PYTHON_CODE = `# Online Python 3 Compiler (TinPath Editor)
# Viết và chạy mã nguồn Python trực tuyến
def tinh_giai_thua(n):
    if n <= 1:
        return 1
    return n * tinh_giai_thua(n - 1)

# Thực thi in kết quả ra màn hình
print("Xin chào từ TinPath Python!")
so = 5
ket_qua = tinh_giai_thua(so)
print(f"Giai thừa của {so} là: {ket_qua}")
`;

const DEFAULT_CPP_CODE = `#include <iostream>
using namespace std;

// TinPath Online C++20 Compiler
long long tinhGiaiThua(int n) {
    if (n <= 1) return 1;
    return n * tinhGiaiThua(n - 1);
}

int main() {
    cout << "Xin chào từ TinPath C++20!" << endl;
    int n = 5;
    cout << "Giai thừa của " << n << " là: " << tinhGiaiThua(n) << endl;
    return 0;
}
`;

const DEFAULT_HTML_CODE = `<h1>Xin chào!</h1>
<p>Hãy sửa code HTML ở đây và xem kết quả bên phải.</p>
`;

const DEFAULT_CSS_CODE = `body {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 24px;
  background: #ffffff;
  color: #1e293b;
}

h1 {
  color: #2563eb;
  margin-top: 0;
}

p {
  color: #475569;
  font-size: 16px;
  line-height: 1.6;
}
`;

export const OnlineCodeEditor: React.FC<OnlineCodeEditorProps> = ({
  initialLanguage = 'python',
  problem = null,
  onBackToHub,
  isStandaloneFullscreen = false
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(
    problem?.language || initialLanguage
  );

  // Code state per language
  const [pythonCode, setPythonCode] = useState(
    problem?.starterCode.python || DEFAULT_PYTHON_CODE
  );
  const [cppCode, setCppCode] = useState(
    problem?.starterCode.cpp || DEFAULT_CPP_CODE
  );
  const [htmlCode, setHtmlCode] = useState(
    problem?.starterCode.html || DEFAULT_HTML_CODE
  );
  const [cssCode, setCssCode] = useState(
    problem?.starterCode.css || DEFAULT_CSS_CODE
  );

  // Web active tab (HTML or CSS)
  const [webTab, setWebTab] = useState<'html' | 'css'>('html');
  const [instantRunWeb, setInstantRunWeb] = useState(true);
  const [viewportMode, setViewportMode] = useState<'full' | 'tablet' | 'mobile'>('full');

  // Terminal & STDIN state
  const [stdin, setStdin] = useState(problem?.sampleInput || '');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>({
    stdout: 'Xin chào từ TinPath Python!\nGiai thừa của 5 là: 120',
    exitCode: 0,
    executionTimeSec: 0.02
  });

  // Editor cursor & statistics
  const [cursorPos, setCursorPos] = useState({ line: 11, col: 42 });
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isStandaloneFullscreen);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When problem changes
  useEffect(() => {
    if (problem) {
      setActiveLang(problem.language);
      if (problem.starterCode.python) setPythonCode(problem.starterCode.python);
      if (problem.starterCode.cpp) setCppCode(problem.starterCode.cpp);
      if (problem.starterCode.html) setHtmlCode(problem.starterCode.html);
      if (problem.starterCode.css) setCssCode(problem.starterCode.css);
      if (problem.sampleInput) setStdin(problem.sampleInput);
    }
  }, [problem]);

  const getCurrentCode = () => {
    if (activeLang === 'python') return pythonCode;
    if (activeLang === 'cpp') return cppCode;
    return webTab === 'html' ? htmlCode : cssCode;
  };

  const handleCodeChange = (newCode: string) => {
    if (activeLang === 'python') setPythonCode(newCode);
    else if (activeLang === 'cpp') setCppCode(newCode);
    else {
      if (webTab === 'html') setHtmlCode(newCode);
      else setCssCode(newCode);
    }
  };

  // Run code handler
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      if (activeLang === 'python') {
        const res = await runPythonCode(pythonCode, stdin);
        setExecutionResult(res);
      } else if (activeLang === 'cpp') {
        const res = await runCppCode(cppCode, stdin);
        setExecutionResult(res);
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLang, pythonCode, cppCode, stdin]);

  // Tab key indents by 4 spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const current = getCurrentCode();
      const updated = current.substring(0, start) + '    ' + current.substring(end);
      handleCodeChange(updated);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Cursor position tracking
  const handleCursorMove = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value.substring(0, textareaRef.current.selectionStart);
    const lines = text.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Download code file
  const handleDownloadFile = () => {
    let filename = 'main.py';
    let code = pythonCode;
    let mime = 'text/x-python';

    if (activeLang === 'cpp') {
      filename = 'main.cpp';
      code = cppCode;
      mime = 'text/x-c++src';
    } else if (activeLang === 'web') {
      filename = 'index.html';
      code = buildHtmlPreview(htmlCode, cssCode);
      mime = 'text/html';
    }

    const blob = new Blob([code], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset / Clear code
  const handleClearCode = () => {
    if (confirm('Bạn có chắc muốn xóa và khôi phục code mẫu ban đầu?')) {
      if (activeLang === 'python') setPythonCode(DEFAULT_PYTHON_CODE);
      else if (activeLang === 'cpp') setCppCode(DEFAULT_CPP_CODE);
      else {
        setHtmlCode(DEFAULT_HTML_CODE);
        setCssCode(DEFAULT_CSS_CODE);
      }
    }
  };

  // Copy output
  const handleCopyOutput = () => {
    if (!executionResult?.stdout) return;
    navigator.clipboard.writeText(executionResult.stdout);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 1500);
  };

  const lineCount = getCurrentCode().split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(14, lineCount) }, (_, i) => i + 1);

  return (
    <div
      className={`flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 h-screen w-screen'
          : 'h-[calc(100vh-64px)] min-h-[680px] w-full rounded-2xl border border-gray-200 dark:border-[#222A38] shadow-xl overflow-hidden my-3'
      }`}
    >
      {/* Top Main Navbar for Code Studio */}
      <div className="h-12 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-[#1F2937] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Danh sách bài tập
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
              <span className="text-[#2563EB]">Tin</span>
              <span className="text-[#38BDF8]">Path</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold ml-1">
                Code Studio Online
              </span>
            </span>

            {problem && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 ml-2">
                Bài: {problem.code} - {problem.title}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Studio Body: Left Rail + Left Editor + Right Terminal/Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* 1. LEFT VERTICAL RAIL (Language Switcher - Matches Image 3) */}
        <aside className="w-14 sm:w-16 bg-white dark:bg-[#0D131F] border-r border-gray-200 dark:border-[#1F2937] flex flex-col items-center py-3 gap-3 shrink-0 select-none">
          {/* Brand Logo TP Badge */}
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
            TP
          </div>

          <div className="w-8 h-px bg-gray-200 dark:bg-[#1F2937] my-1" />

          {/* Python Tab Button */}
          <button
            onClick={() => setActiveLang('python')}
            title="Lập trình Python 3"
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono text-xs transition-all relative ${
              activeLang === 'python'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <span className="text-sm font-bold leading-none">&gt;_</span>
            <span className="text-[9px] uppercase tracking-tighter mt-0.5">py</span>
            {activeLang === 'python' && (
              <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 bg-emerald-500 rounded-r" />
            )}
          </button>

          {/* C++ Tab Button */}
          <button
            onClick={() => setActiveLang('cpp')}
            title="Lập trình C++20"
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono text-xs transition-all relative ${
              activeLang === 'cpp'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-300 dark:border-blue-800'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <span className="text-xs font-bold leading-none">C++</span>
            <span className="text-[9px] uppercase tracking-tighter mt-0.5">20</span>
            {activeLang === 'cpp' && (
              <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 bg-blue-500 rounded-r" />
            )}
          </button>

          {/* Web (HTML/CSS) Tab Button */}
          <button
            onClick={() => setActiveLang('web')}
            title="Thiết kế Web (HTML & CSS)"
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono text-xs transition-all relative ${
              activeLang === 'web'
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 font-bold border border-teal-300 dark:border-teal-800'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-tighter mt-0.5">web</span>
            {activeLang === 'web' && (
              <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 bg-teal-500 rounded-r" />
            )}
          </button>

          <div className="mt-auto">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                title="Quay lại kho bài tập"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E293B]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </aside>

        {/* 2. SPLIT PANE: LEFT (Code Editor) & RIGHT (Output Console / Web Preview) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-[#1F2937]">
          {/* ================= LEFT HALF: CODE EDITOR ================= */}
          <div className="flex flex-col h-full bg-white dark:bg-[#131B29] overflow-hidden">
            {/* Editor Toolbar (Matches Image 2 & Image 3) */}
            <div className="h-11 bg-gray-50/90 dark:bg-[#0F172A] border-b border-gray-200 dark:border-[#1E293B] px-3 flex items-center justify-between shrink-0 select-none">
              {/* File / Sub-tab name */}
              <div className="flex items-center gap-2">
                {activeLang === 'python' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] text-xs font-semibold text-gray-800 dark:text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>main.py</span>
                  </div>
                )}

                {activeLang === 'cpp' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] text-xs font-semibold text-gray-800 dark:text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>main.cpp</span>
                  </div>
                )}

                {activeLang === 'web' && (
                  <div className="flex items-center gap-1 bg-gray-200/70 dark:bg-[#1E293B] p-0.5 rounded-lg text-xs font-bold">
                    <button
                      onClick={() => setWebTab('html')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        webTab === 'html'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                      }`}
                    >
                      HTML
                    </button>
                    <button
                      onClick={() => setWebTab('css')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        webTab === 'css'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                      }`}
                    >
                      CSS
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Delete, Download, Run */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleClearCode}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#334155] text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B] flex items-center gap-1 transition-colors"
                  title="Xoá và đặt lại code mẫu"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">Xóa code</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#334155] text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B] flex items-center gap-1 transition-colors"
                  title="Tải file code về máy"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span className="hidden sm:inline">
                    Tải .{activeLang === 'python' ? 'py' : activeLang === 'cpp' ? 'cpp' : 'html'}
                  </span>
                </button>

                {/* Big Green Run Button */}
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  title="Phím tắt: Ctrl + Enter"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Đang chạy...' : 'Chạy (Run)'}</span>
                </button>
              </div>
            </div>

            {/* Code Textarea with Line Numbers */}
            <div className="flex-1 flex overflow-hidden relative font-mono text-[13px] sm:text-[14px]">
              {/* Line Numbers Gutter */}
              <div className="w-10 sm:w-12 bg-gray-50/60 dark:bg-[#0F172A] border-r border-gray-100 dark:border-[#1E293B] text-right py-3 pr-2 text-gray-400 select-none text-xs leading-[22px] shrink-0 font-mono">
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              {/* Editable Code Canvas */}
              <textarea
                ref={textareaRef}
                value={getCurrentCode()}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleCursorMove}
                onClick={handleCursorMove}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="flex-1 h-full p-3 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none resize-none font-mono leading-[22px] overflow-auto tab-4 selection:bg-blue-500/20"
                placeholder="Viết mã nguồn tại đây..."
              />
            </div>

            {/* Status Bar at Bottom */}
            <div className="h-6 bg-gray-50 dark:bg-[#0B101B] border-t border-gray-200 dark:border-[#1E293B] px-3 flex items-center justify-between text-[11px] text-gray-500 select-none shrink-0 font-mono">
              <div className="flex items-center gap-3">
                <span>Dòng: {cursorPos.line}, Cột: {cursorPos.col}</span>
                <span>Khoảng trắng: 4</span>
              </div>
              <div className="flex items-center gap-3">
                <span>UTF-8</span>
                <span className="hidden sm:inline">Phím tắt: Ctrl + Enter để chạy</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT HALF: EXECUTION / OUTPUT PANE ================= */}
          <div className="flex flex-col h-full bg-[#0A0E17] text-white overflow-hidden">
            {activeLang === 'web' ? (
              /* --- WEB LIVE PREVIEW (Matches Image 2) --- */
              <div className="flex flex-col h-full bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white">
                <div className="h-11 bg-gray-50 dark:bg-[#0F172A] border-b border-gray-200 dark:border-[#1E293B] px-3 flex items-center justify-between select-none shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Kết quả Web Trực Tiếp</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={instantRunWeb}
                        onChange={(e) => setInstantRunWeb(e.target.checked)}
                        className="rounded text-emerald-500 focus:ring-emerald-400"
                      />
                      <span>Chạy tức thời</span>
                    </label>

                    <button
                      onClick={() => setExecutionResult({ ...executionResult!, executionTimeSec: 0.01 })}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" /> Chạy
                    </button>

                    <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-[#334155] rounded-lg p-0.5">
                      <button
                        onClick={() => setViewportMode('full')}
                        className={`p-1 rounded ${viewportMode === 'full' ? 'bg-gray-200 dark:bg-[#334155]' : ''}`}
                        title="Vừa khung"
                      >
                        <Laptop className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewportMode('tablet')}
                        className={`p-1 rounded ${viewportMode === 'tablet' ? 'bg-gray-200 dark:bg-[#334155]' : ''}`}
                        title="Tablet (768px)"
                      >
                        <Tablet className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewportMode('mobile')}
                        className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-gray-200 dark:bg-[#334155]' : ''}`}
                        title="Mobile (375px)"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sandboxed Live Web Preview Frame */}
                <div className="flex-1 bg-gray-100 dark:bg-[#070A11] p-2 sm:p-4 overflow-auto flex justify-center items-start">
                  <div
                    className={`h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 border border-gray-200 dark:border-[#333] ${
                      viewportMode === 'mobile'
                        ? 'w-[375px]'
                        : viewportMode === 'tablet'
                        ? 'w-[768px]'
                        : 'w-full'
                    }`}
                  >
                    <iframe
                      title="Web Preview Sandbox"
                      srcDoc={buildHtmlPreview(htmlCode, cssCode)}
                      sandbox="allow-scripts"
                      className="w-full h-full border-none bg-white text-black"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* --- PYTHON & C++ TERMINAL CONSOLE (Matches Image 3) --- */
              <div className="flex flex-col h-full bg-[#0B0F19] overflow-hidden">
                {/* Console Output Header */}
                <div className="h-11 bg-[#0F172A] border-b border-[#1E293B] px-3 sm:px-4 flex items-center justify-between select-none shrink-0 font-mono text-xs">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold tracking-wide uppercase">
                      CONSOLE OUTPUT ({activeLang === 'python' ? 'python 3.12' : 'g++ 20'})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      • Trực tuyến
                    </span>

                    <button
                      onClick={handleCopyOutput}
                      className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                      title="Sao chép kết quả"
                    >
                      {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setExecutionResult(null)}
                      className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                      title="Xóa màn hình console"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dark Terminal Screen */}
                <div className="flex-1 p-4 font-mono text-[13px] sm:text-[13.5px] leading-relaxed overflow-auto select-text space-y-2">
                  {/* System Ready Banner */}
                  <div className="text-gray-400 text-xs">
                    [TinPath Engine] Sẵn sàng thực thi {activeLang === 'python' ? 'Python 3.12.2' : 'C++20 (GCC)'}
                    <span className="text-emerald-400 ml-2 font-bold">• Trực tuyến</span>
                  </div>

                  {/* Standard Output Content */}
                  {executionResult ? (
                    <div className="space-y-1 pt-1">
                      {executionResult.stderr ? (
                        <pre className="text-rose-400 font-mono whitespace-pre-wrap">
                          {executionResult.stderr}
                        </pre>
                      ) : (
                        <pre className="text-amber-300 font-mono whitespace-pre-wrap leading-relaxed font-medium">
                          {executionResult.stdout}
                        </pre>
                      )}

                      <div className="border-t border-[#1F2937] my-3 pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Chương trình hoàn tất trong {executionResult.executionTimeSec} giây.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic pt-2 text-xs">
                      Nhấn nút "Chạy (Run)" hoặc tổ hợp phím Ctrl + Enter để biên dịch và chạy mã nguồn.
                    </div>
                  )}
                </div>

                {/* STDIN Input Box at Bottom (Matches Image 3) */}
                <div className="border-t border-[#1E293B] bg-[#0A0E17] p-3 space-y-1.5 select-none shrink-0 font-mono">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-bold text-gray-300 tracking-wide uppercase">
                      DỮ LIỆU ĐẦU VÀO (STANDARD INPUT / STDIN)
                    </span>
                    <span className="text-gray-500 italic">tùy chọn</span>
                  </div>
                  <input
                    type="text"
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="> Nhập tham số input() tại đây nếu có..."
                    className="w-full bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-200 placeholder-gray-500 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

