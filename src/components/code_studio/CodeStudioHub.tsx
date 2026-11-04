import React, { useState, useMemo } from 'react';
import {
  Code2,
  Terminal,
  Play,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Circle,
  ArrowRight,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Layers,
  Cpu,
  Trophy,
  Bot,
  Zap,
  Globe
} from 'lucide-react';
import { CODE_PROBLEMS, CodeProblem, SupportedLanguage } from './codeProblemsData';
import { OnlineCodeEditor } from './OnlineCodeEditor';

interface CodeStudioHubProps {
  onNavigateTab?: (tab: string) => void;
}

export const CodeStudioHub: React.FC<CodeStudioHubProps> = ({ onNavigateTab }) => {
  // Mode: 'hub' (problem list & banners) or 'editor' (split IDE)
  const [viewMode, setViewMode] = useState<'hub' | 'editor'>('hub');
  const [selectedProblem, setSelectedProblem] = useState<CodeProblem | null>(null);
  const [editorLanguage, setEditorLanguage] = useState<SupportedLanguage>('python');

  // Filters
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'cpp' | 'python' | 'web'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [hideSolved, setHideSolved] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'ac_rate' | 'submissions'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return CODE_PROBLEMS.filter((p) => {
      // Category tab
      if (activeCategoryTab !== 'all' && p.language !== activeCategoryTab) {
        return false;
      }
      // Search keyword
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchCat) return false;
      }
      // Language filter select
      if (filterLang !== 'all' && p.language !== filterLang) {
        return false;
      }
      // Difficulty filter select
      if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) {
        return false;
      }
      // Hide solved
      if (hideSolved && p.status === 'ac') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'ac_rate') return b.acRate - a.acRate;
      if (sortBy === 'submissions') return b.submissions - a.submissions;
      return 0;
    });
  }, [activeCategoryTab, searchKeyword, filterLang, filterDifficulty, hideSolved, sortBy]);

  // Open editor for a specific problem
  const handleOpenProblem = (p: CodeProblem) => {
    setSelectedProblem(p);
    setEditorLanguage(p.language);
    setViewMode('editor');
  };

  // Open free code editor
  const handleOpenFreeEditor = (lang: SupportedLanguage = 'python') => {
    setSelectedProblem(null);
    setEditorLanguage(lang);
    setViewMode('editor');
  };

  // Random problem
  const handleRandomProblem = () => {
    const rand = CODE_PROBLEMS[Math.floor(Math.random() * CODE_PROBLEMS.length)];
    handleOpenProblem(rand);
  };

  if (viewMode === 'editor') {
    return (
      <div className="w-full h-full">
        <OnlineCodeEditor
          initialLanguage={editorLanguage}
          problem={selectedProblem}
          onBackToHub={() => setViewMode('hub')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 py-6 px-3 sm:px-6 space-y-6">
      {/* ================= SECTION 1: TOP HERO BANNER (Matches Image 4) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Hero Card (Gradient Blue) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] rounded-2xl p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11.5px] font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-xs border border-white/20">
                MÔI TRƯỜNG IDE TRỰC TUYẾN
              </span>
              <span className="px-3 py-1 rounded-full text-[11.5px] font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wider shadow-xs">
                TinPath Compiler v3.2
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight pt-1">
              Kho Bài Tập Lập Trình &amp; Đấu Trường Thuật Toán
            </h1>

            <p className="text-sm sm:text-[15px] text-blue-100 leading-relaxed max-w-xl">
              Hệ thống tự động Online Judge cho học sinh chuyên Tin &amp; THPT Trần Quốc Tuấn (C++, Python &amp; HTML/CSS).
              Biên dịch trực tiếp trên trình duyệt, chấm bài tức thời.
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <button
              onClick={() => handleOpenFreeEditor('python')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>&lt;&gt; MỞ TRÌNH SOẠN THẢO CODE EDITOR (C++ • PYTHON • HTML/CSS)</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Code Studio Preview Card (Dark Monospace Terminal) */}
        <div className="lg:col-span-5 bg-[#0D131F] rounded-2xl border border-gray-800 p-5 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs sm:text-sm">TinPath Code Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  Trực Tuyến
                </span>
              </div>

              {/* Quick Language Pills */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenFreeEditor('cpp')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 transition-colors"
                >
                  C++ 20
                </button>
                <button
                  onClick={() => handleOpenFreeEditor('python')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors"
                >
                  Python 3
                </button>
                <button
                  onClick={() => handleOpenFreeEditor('web')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 transition-colors"
                >
                  HTML/CSS
                </button>
              </div>
            </div>

            {/* Code Snippet Preview Window */}
            <div className="mt-3 bg-[#070A11] p-3.5 rounded-xl border border-gray-800/80 font-mono text-[12px] leading-relaxed text-gray-300">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  main.cpp
                </span>
                <span className="text-emerald-400 text-[10px]">• Auto-Run</span>
              </div>
              <pre className="overflow-x-auto text-emerald-300/90">
                <code>{`#include <iostream>
using namespace std;
int main() {
    cout << "TinPath Online Judge";
    return 0;
}`}</code>
              </pre>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Sẵn sàng biên dịch &amp; chạy tức thì
            </span>

            <button
              onClick={() => handleOpenFreeEditor('cpp')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
            >
              Mở Code Editor Toàn Màn Hình ↗
            </button>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: CATEGORY FILTER TABS (Matches Image 4) ================= */}
      <div className="bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] p-2.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveCategoryTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeCategoryTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tất cả bài tập</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-xs">420</span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('cpp')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeCategoryTab === 'cpp'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <span className="font-mono font-bold">&lt;&gt;</span>
            <span>Lập trình C++</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-[#253248] text-xs font-semibold">245</span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('python')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeCategoryTab === 'python'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <span className="font-mono font-bold">&gt;_</span>
            <span>Lập trình Python</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-[#253248] text-xs font-semibold">140</span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('web')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeCategoryTab === 'web'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Thiết kế Web (HTML/CSS)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-[#253248] text-xs font-semibold">35</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs text-gray-500 font-medium">
          <span>Tổng cộng: <strong className="text-gray-800 dark:text-gray-200">420 bài</strong></span>
          <button
            onClick={handleRandomProblem}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1E293B] text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-semibold transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-500" /> Bài ngẫu nhiên
          </button>
        </div>
      </div>

      {/* ================= SECTION 3: MAIN 2-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Table (8 cols on large screens) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] shadow-xs overflow-hidden">
          {/* Table Header Controls */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                Danh Sách Bài Tập Tuyển Chọn (C++ • Python • Web Design)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="newest">Mới nhất</option>
                <option value="ac_rate">Tỷ lệ AC cao</option>
                <option value="submissions">Lượt nộp nhiều</option>
              </select>
            </div>
          </div>

          {/* Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead className="bg-gray-50/80 dark:bg-[#0F172A] text-gray-600 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-[#1E293B] select-none">
                <tr>
                  <th className="py-3 px-3 text-center w-10">TT</th>
                  <th className="py-3 px-3 w-28">MÃ BÀI</th>
                  <th className="py-3 px-4">TÊN BÀI TẬP</th>
                  <th className="py-3 px-3">PHÂN LOẠI</th>
                  <th className="py-3 px-3 text-center">ĐỘ KHÓ</th>
                  <th className="py-3 px-3 text-center w-28">TỶ LỆ AC</th>
                  <th className="py-3 px-3 text-center">LƯỢT NỘP</th>
                  <th className="py-3 px-4 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1E293B]">
                {filteredProblems.map((prob, idx) => {
                  const isAC = prob.status === 'ac';
                  const isAttempted = prob.status === 'attempted';

                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-blue-50/40 dark:hover:bg-[#1E293B]/50 transition-colors group"
                    >
                      {/* Status Icon */}
                      <td className="py-3 px-3 text-center">
                        {isAC ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : isAttempted ? (
                          <XCircle className="w-4 h-4 text-rose-500 mx-auto" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto" />
                        )}
                      </td>

                      {/* Problem Code */}
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {prob.code}
                      </td>

                      {/* Title & Metadata Tags */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => handleOpenProblem(prob)}
                          className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors"
                        >
                          {prob.title}
                        </div>

                        {showTags && (
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                            <span>⏱ {prob.timeLimit}</span>
                            <span>•</span>
                            <span className="text-[#2563EB] dark:text-[#60A5FA] font-medium">{prob.category}</span>
                          </div>
                        )}
                      </td>

                      {/* Category Label */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                            prob.language === 'cpp'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : prob.language === 'python'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {prob.language === 'cpp'
                            ? 'Lập trình C++'
                            : prob.language === 'python'
                            ? 'Lập trình Python'
                            : 'Thiết kế Web'}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-semibold text-xs ${
                            prob.difficulty === 'easy'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : prob.difficulty === 'medium'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {prob.difficulty === 'easy'
                            ? `Dễ (${prob.points}đ)`
                            : prob.difficulty === 'medium'
                            ? `T.Bình (${prob.points}đ)`
                            : `Khó (${prob.points}đ)`}
                        </span>
                      </td>

                      {/* AC Rate with Bar */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                prob.acRate > 70
                                  ? 'bg-emerald-500'
                                  : prob.acRate > 40
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${prob.acRate}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-gray-600 dark:text-gray-300">
                            {prob.acRate}%
                          </span>
                        </div>
                      </td>

                      {/* Submissions */}
                      <td className="py-3 px-3 text-center font-mono text-gray-500">
                        {prob.submissions.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isAC ? (
                          <button
                            onClick={() => handleOpenProblem(prob)}
                            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-[#334155] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B] font-bold text-xs flex items-center gap-1 mx-auto transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Code lại
                          </button>
                        ) : isAttempted ? (
                          <button
                            onClick={() => handleOpenProblem(prob)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 mx-auto transition-colors shadow-xs"
                          >
                            Khắc phục
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenProblem(prob)}
                            className="px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 mx-auto transition-colors shadow-xs"
                          >
                            Code ngay ↗
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-[#1E293B] flex items-center justify-between text-xs text-gray-500 select-none">
            <span>
              Hiển thị 1 - {filteredProblems.length} trong tổng số 420 bài
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded border border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1E293B] disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-xs">1</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-100 dark:hover:bg-[#1E293B] font-medium text-xs">2</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-100 dark:hover:bg-[#1E293B] font-medium text-xs">3</button>
              <span>...</span>
              <button className="px-2.5 py-1 rounded hover:bg-gray-100 dark:hover:bg-[#1E293B] font-medium text-xs">42</button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded border border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1E293B]"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Search Filters & Widgets (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Bộ Lọc Tìm Kiếm (Matches Image 4) */}
          <div className="bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-[#1E293B]">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                Bộ Lọc Tìm Kiếm
              </h3>
            </div>

            {/* Keyword Input */}
            <div className="space-y-1.5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm mã bài, tên thuật toán..."
                  className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Language Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                NGÔN NGỮ &amp; NHÁNH
              </label>
              <select
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-3 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="all">Tất cả ngôn ngữ</option>
                <option value="cpp">Lập trình C++</option>
                <option value="python">Lập trình Python</option>
                <option value="web">Thiết kế Web (HTML/CSS)</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                ĐỘ KHÓ &amp; DẠNG BÀI
              </label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-3 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="all">Tất cả độ khó</option>
                <option value="easy">Dễ (100đ)</option>
                <option value="medium">Trung bình (200đ)</option>
                <option value="hard">Khó (300đ)</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1 text-xs text-gray-700 dark:text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideSolved}
                  onChange={(e) => setHideSolved(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Ẩn bài tập đã hoàn thành (AC)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showTags}
                  onChange={(e) => setShowTags(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Hiển thị phân loại thẻ tag</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setFilterLang('all');
                  setFilterDifficulty('all');
                  setHideSolved(false);
                  setActiveCategoryTab('all');
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Filter className="w-3.5 h-3.5" /> Áp dụng lọc
              </button>
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setFilterLang('all');
                  setFilterDifficulty('all');
                  setHideSolved(false);
                  setActiveCategoryTab('all');
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#334155] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B] font-semibold text-xs"
              >
                Đặt lại
              </button>
            </div>
          </div>

          {/* Card: TIN HỌC TQT AI Widget */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                  TIN HỌC TQT AI
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Trực tuyến hỗ trợ giải bài
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab && onNavigateTab('personalized_ai')}
              className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-colors shadow-xs"
              title="Mở trợ giảng AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Card: TIẾN ĐỘ THỬ THÁCH */}
          <div className="bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                TIẾN ĐỘ THỬ THÁCH
              </h4>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                Tuần 42
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">Hoàn thành 3 / 4 bài</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">75%</span>
            </div>

            <div className="w-full h-2.5 bg-gray-100 dark:bg-[#1E293B] rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
