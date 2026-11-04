import React, { useState, useMemo, useEffect } from 'react';
import {
  Code2,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Circle,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Layers,
  Bot,
  Globe,
  Award,
} from 'lucide-react';
import { CODE_PROBLEMS, CodeProblem, SupportedLanguage } from './codeProblemsData';
import { getProblemProgressMap, ProblemUserProgress } from './codeExecutionEngine';
import { OnlineCodeEditor } from './OnlineCodeEditor';

interface CodeStudioHubProps {
  onNavigateTab?: (tab: string) => void;
}

export const CodeStudioHub: React.FC<CodeStudioHubProps> = ({ onNavigateTab }) => {
  // Đọc tham số URL khi editor được mở sang 1 tab mới bên cạnh
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isUrlEditorMode = urlParams?.get('mode') === 'editor';
  const urlProbCode = urlParams?.get('prob');
  const urlLang = urlParams?.get('lang') as SupportedLanguage | null;
  const initialProb = urlProbCode
    ? CODE_PROBLEMS.find(p => p.code === urlProbCode || p.id === urlProbCode)
    : null;

  const [viewMode, setViewMode] = useState<'hub' | 'editor'>(isUrlEditorMode ? 'editor' : 'hub');
  const [selectedProblem, setSelectedProblem] = useState<CodeProblem | null>(initialProb || null);
  const [editorLanguage, setEditorLanguage] = useState<SupportedLanguage>(
    initialProb ? initialProb.recommendedLang : urlLang || 'python'
  );

  // Tiến độ làm bài lưu trong localStorage
  const [progressMap, setProgressMap] = useState<Record<string, ProblemUserProgress>>(() =>
    getProblemProgressMap()
  );

  useEffect(() => {
    const syncProgress = () => setProgressMap(getProblemProgressMap());
    window.addEventListener('storage', syncProgress);
    window.addEventListener('focus', syncProgress);
    return () => {
      window.removeEventListener('storage', syncProgress);
      window.removeEventListener('focus', syncProgress);
    };
  }, []);

  // Filters
  const [activeCategoryTab, setActiveCategoryTab] = useState<
    'all' | 'algorithm' | 'cpp' | 'python' | 'web'
  >('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [hideSolved, setHideSolved] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'ac_rate' | 'submissions'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Merge static problem bank with user's live judge progress
  const enrichedProblems = useMemo(() => {
    return CODE_PROBLEMS.map(p => {
      const userProg = progressMap[p.id];
      const mergedStatus = userProg?.status || p.status;
      const numericAcRate = parseFloat(String(p.acRate).replace('%', '')) || 75;
      const submissionsCount = (p.solvedCount || 200) + (userProg ? 1 : 0);
      return {
        ...p,
        mergedStatus,
        bestScore: userProg?.bestScore ?? (mergedStatus === 'AC' ? p.points : 0),
        numericAcRate,
        submissionsCount,
      };
    });
  }, [progressMap]);

  const categoryCounts = useMemo(() => {
    return {
      all: enrichedProblems.length,
      algorithm: enrichedProblems.filter(p => p.categoryFilter === 'algorithm').length,
      cpp: enrichedProblems.filter(
        p => p.categoryFilter === 'cpp' || p.recommendedLang === 'cpp'
      ).length,
      python: enrichedProblems.filter(
        p => p.categoryFilter === 'python' || p.recommendedLang === 'python'
      ).length,
      web: enrichedProblems.filter(p => p.categoryFilter === 'web' || p.recommendedLang === 'web')
        .length,
    };
  }, [enrichedProblems]);

  const solvedStats = useMemo(() => {
    const solved = enrichedProblems.filter(p => p.mergedStatus === 'AC');
    const totalXP = solved.reduce((sum, p) => sum + p.points, 0);
    return {
      acCount: solved.length,
      totalCount: enrichedProblems.length,
      percent: Math.round((solved.length / Math.max(1, enrichedProblems.length)) * 100),
      totalXP,
    };
  }, [enrichedProblems]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return enrichedProblems
      .filter(p => {
        if (activeCategoryTab === 'algorithm' && p.categoryFilter !== 'algorithm') return false;
        if (
          activeCategoryTab === 'cpp' &&
          p.categoryFilter !== 'cpp' &&
          p.recommendedLang !== 'cpp'
        )
          return false;
        if (
          activeCategoryTab === 'python' &&
          p.categoryFilter !== 'python' &&
          p.recommendedLang !== 'python'
        )
          return false;
        if (activeCategoryTab === 'web' && p.categoryFilter !== 'web') return false;

        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCode = p.code.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchCode && !matchCat && !matchTags) return false;
        }

        if (filterLang !== 'all' && p.recommendedLang !== filterLang && p.categoryFilter !== filterLang) {
          return false;
        }

        if (
          filterDifficulty !== 'all' &&
          p.difficulty.toLowerCase() !== filterDifficulty.toLowerCase()
        ) {
          return false;
        }

        if (hideSolved && p.mergedStatus === 'AC') {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ac_rate') return b.numericAcRate - a.numericAcRate;
        if (sortBy === 'submissions') return b.submissionsCount - a.submissionsCount;
        return 0;
      });
  }, [
    enrichedProblems,
    activeCategoryTab,
    searchKeyword,
    filterLang,
    filterDifficulty,
    hideSolved,
    sortBy,
  ]);

  // Mở bài tập trong trình chấm OnlineCodeEditor ngay lập tức
  const handleOpenProblem = (p: CodeProblem, openInNewTab = true) => {
    if (openInNewTab) {
      const url = `?tab=code_studio&mode=editor&prob=${encodeURIComponent(p.code)}&lang=${p.recommendedLang}`;
      window.open(url, '_blank');
      return;
    }
    setSelectedProblem(p);
    setEditorLanguage(p.recommendedLang);
    setViewMode('editor');
  };

  const handleOpenFreeEditor = (lang: SupportedLanguage = 'python', openInNewTab = true) => {
    if (openInNewTab) {
      const url = `?tab=code_studio&mode=editor&lang=${lang}`;
      window.open(url, '_blank');
      return;
    }
    setSelectedProblem(null);
    setEditorLanguage(lang);
    setViewMode('editor');
  };

  const handleRandomProblem = () => {
    const rand = CODE_PROBLEMS[Math.floor(Math.random() * CODE_PROBLEMS.length)];
    handleOpenProblem(rand);
  };

  if (viewMode === 'editor' || isUrlEditorMode) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-[#0B0F17] flex flex-col">
        <OnlineCodeEditor
          initialLanguage={editorLanguage}
          problem={selectedProblem}
          onVerdictUpdate={() => setProgressMap(getProblemProgressMap())}
          onBackToHub={() => {
            setProgressMap(getProblemProgressMap());
            if (isUrlEditorMode) {
              window.close();
              setTimeout(() => {
                window.location.href = window.location.pathname + '?tab=code_studio';
              }, 150);
            } else {
              setViewMode('hub');
            }
          }}
          isStandaloneFullscreen={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 py-6 px-3 sm:px-6 space-y-6">
      {/* ================= SECTION 1: TOP HERO BANNER ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Hero Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] rounded-2xl p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11.5px] font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-xs border border-white/20">
                HỆ THỐNG CHẤM BÀI TỰ ĐỘNG ONLINE JUDGE
              </span>
              <span className="px-3 py-1 rounded-full text-[11.5px] font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wider shadow-xs">
                NTV-Judge Engine v3.5
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight pt-1">
              Kho Bài Tập Lập Trình &amp; Đấu Trường Thuật Toán
            </h1>

            <p className="text-sm sm:text-[15px] text-blue-100 leading-relaxed max-w-xl">
              Tích hợp đầy đủ đề bài, định dạng Input/Output, bộ Testcases chuẩn (.in/.out) và trình chấm tự động{' '}
              <strong>AC / WA / TLE / RTE / CE</strong> cho C++, Python &amp; Thiết kế Web.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => handleOpenProblem(CODE_PROBLEMS[0])}
              className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>LÀM BÀI &amp; CHẤM THỬ NGAY (ADIVB)</span>
            </button>
            <button
              onClick={() => handleOpenFreeEditor('python')}
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>&lt;&gt; MỞ CODE SANDBOX TỰ DO</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Code Studio Preview Card */}
        <div className="lg:col-span-5 bg-[#0D131F] rounded-2xl border border-gray-800 p-5 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs sm:text-sm">TinPath Online Judge</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  Chấm Testcase Tự Động
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenFreeEditor('cpp')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 transition-colors cursor-pointer"
                >
                  C++ 17
                </button>
                <button
                  onClick={() => handleOpenFreeEditor('python')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
                >
                  Python 3
                </button>
                <button
                  onClick={() => handleOpenFreeEditor('web')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
                >
                  HTML/CSS
                </button>
              </div>
            </div>

            <div className="mt-3 bg-[#070A11] p-3.5 rounded-xl border border-gray-800/80 font-mono text-[12px] leading-relaxed text-gray-300">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  solution.cpp — ADIVB (10/10 Testcases)
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">• Verdict: AC (100đ)</span>
              </div>
              <pre className="overflow-x-auto text-emerald-300/90">
                <code>{`#include <iostream>
using namespace std;
int main() {
    long long a, b;
    if (cin >> a >> b) cout << a / b << endl;
    return 0;
}`}</code>
              </pre>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Đã nạp {CODE_PROBLEMS.length} bài tập chuẩn kèm bộ Testcases
            </span>

            <button
              onClick={() => handleOpenFreeEditor('cpp')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              Mở IDE Toàn Màn Hình ↗
            </button>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: CATEGORY FILTER TABS ================= */}
      <div className="bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] p-2.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveCategoryTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategoryTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tất cả bài tập</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-xs">
              {categoryCounts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('algorithm')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategoryTab === 'algorithm'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <span>Thuật toán &amp; HSG</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-[#253248] text-xs font-semibold">
              {categoryCounts.algorithm}
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('cpp')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategoryTab === 'cpp'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <span className="font-mono font-bold">&lt;&gt;</span>
            <span>Lập trình C++</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-[#253248] text-xs font-semibold">
              {categoryCounts.cpp}
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('python')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategoryTab === 'python'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <span className="font-mono font-bold">&gt;_</span>
            <span>Lập trình Python</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-[#253248] text-xs font-semibold">
              {categoryCounts.python}
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryTab('web')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategoryTab === 'web'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Thiết kế Web</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-[#253248] text-xs font-semibold">
              {categoryCounts.web}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs text-gray-500 font-medium">
          <span>
            Đã giải AC:{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {solvedStats.acCount}/{solvedStats.totalCount} bài
            </strong>
          </span>
          <button
            onClick={handleRandomProblem}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1E293B] text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-500" /> Bài ngẫu nhiên
          </button>
        </div>
      </div>

      {/* ================= SECTION 3: MAIN 2-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Table (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                Ngân Hàng Bài Tập Chấm Tự Động (Có Đề Bài • Input/Output • Bộ Testcases)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="newest">Mặc định bộ đề</option>
                <option value="ac_rate">Tỷ lệ AC cao</option>
                <option value="submissions">Lượt giải nhiều</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead className="bg-gray-50/80 dark:bg-[#0F172A] text-gray-600 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-[#1E293B] select-none">
                <tr>
                  <th className="py-3 px-3 text-center w-10">TT</th>
                  <th className="py-3 px-3 w-32">MÃ BÀI</th>
                  <th className="py-3 px-4">TÊN BÀI TẬP &amp; BỘ TEST</th>
                  <th className="py-3 px-3">NGÔN NGỮ</th>
                  <th className="py-3 px-3 text-center">ĐỘ KHÓ</th>
                  <th className="py-3 px-3 text-center w-28">TỶ LỆ AC</th>
                  <th className="py-3 px-4 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1E293B]">
                {filteredProblems.map(prob => {
                  const isAC = prob.mergedStatus === 'AC';
                  const isAttempted = prob.mergedStatus === 'attempted';
                  const testCount = prob.testCases?.length || 1;

                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-blue-50/40 dark:hover:bg-[#1E293B]/50 transition-colors group"
                    >
                      {/* Status Icon */}
                      <td className="py-3.5 px-3 text-center" title={isAC ? 'Đã AC (Accepted)' : isAttempted ? 'Đã thử nhưng chưa AC' : 'Chưa làm'}>
                        {isAC ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : isAttempted ? (
                          <XCircle className="w-4 h-4 text-rose-500 mx-auto" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto" />
                        )}
                      </td>

                      {/* Problem Code */}
                      <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        <span
                          onClick={() => handleOpenProblem(prob)}
                          className="cursor-pointer hover:underline"
                        >
                          {prob.code}
                        </span>
                      </td>

                      {/* Title & Metadata Tags */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => handleOpenProblem(prob)}
                          className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors"
                        >
                          {prob.title}
                        </div>

                        {showTags && (
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                              ✓ {testCount} testcases
                            </span>
                            <span>•</span>
                            <span>⏱ {prob.timeLimit || '1.0s'}</span>
                            <span>•</span>
                            <span className="text-[#2563EB] dark:text-[#60A5FA] font-medium">
                              {prob.category}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Recommended Language Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                            prob.recommendedLang === 'cpp'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : prob.recommendedLang === 'python'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {prob.recommendedLang === 'cpp'
                            ? 'C++ / Python'
                            : prob.recommendedLang === 'python'
                            ? 'Python / C++'
                            : 'HTML / CSS / JS'}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-semibold text-xs ${
                            prob.difficulty === 'Easy'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : prob.difficulty === 'Medium'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {prob.difficulty === 'Easy'
                            ? `Dễ (${prob.points}đ)`
                            : prob.difficulty === 'Medium'
                            ? `T.Bình (${prob.points}đ)`
                            : `Khó (${prob.points}đ)`}
                        </span>
                      </td>

                      {/* AC Rate with Bar */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-14 h-1.5 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                prob.numericAcRate > 70
                                  ? 'bg-emerald-500'
                                  : prob.numericAcRate > 45
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, prob.numericAcRate)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-gray-600 dark:text-gray-300">
                            {prob.acRate}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {isAC ? (
                            <button
                              onClick={() => handleOpenProblem(prob)}
                              className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã AC ({prob.bestScore}đ)
                            </button>
                          ) : isAttempted ? (
                            <button
                              onClick={() => handleOpenProblem(prob)}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" /> Sửa bài
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenProblem(prob)}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                            >
                              Làm bài &amp; Chấm
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenProblem(prob, true)}
                            title="Mở bài này trong tab trình duyệt mới"
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
              Hiển thị {filteredProblems.length} / {enrichedProblems.length} bài tập chuẩn
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded border border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1E293B] disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-xs">
                1
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded border border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1E293B]"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Search Filters & Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Bộ Lọc Tìm Kiếm */}
          <div className="bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-[#1E293B]">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                Bộ Lọc Tìm Kiếm
              </h3>
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  placeholder="Tìm mã bài (VD: ADIVB, NVT003, BFS)..."
                  className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                NGÔN NGỮ &amp; NHÁNH
              </label>
              <select
                value={filterLang}
                onChange={e => setFilterLang(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-3 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="all">Tất cả ngôn ngữ</option>
                <option value="algorithm">Thuật toán &amp; Cấu trúc dữ liệu</option>
                <option value="cpp">Lập trình C++</option>
                <option value="python">Lập trình Python</option>
                <option value="web">Thiết kế Web (HTML/CSS)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                ĐỘ KHÓ &amp; DẠNG BÀI
              </label>
              <select
                value={filterDifficulty}
                onChange={e => setFilterDifficulty(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-3 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="all">Tất cả độ khó</option>
                <option value="Easy">Dễ (100đ)</option>
                <option value="Medium">Trung bình (150đ - 200đ)</option>
                <option value="Hard">Khó (300đ)</option>
              </select>
            </div>

            <div className="space-y-2 pt-1 text-xs text-gray-700 dark:text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideSolved}
                  onChange={e => setHideSolved(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Ẩn bài tập đã hoàn thành (AC)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showTags}
                  onChange={e => setShowTags(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Hiển thị số lượng Testcases &amp; Giới hạn</span>
              </label>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setFilterLang('all');
                  setFilterDifficulty('all');
                  setHideSolved(false);
                  setActiveCategoryTab('all');
                }}
                className="w-full py-2 rounded-xl border border-gray-200 dark:border-[#334155] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E293B] font-semibold text-xs cursor-pointer"
              >
                Đặt lại bộ lọc
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
                  TRỢ GIẢNG AI CHẤM CODE
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Phân tích lỗi WA, TLE, RTE, CE
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab && onNavigateTab('personalized_ai')}
              className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-colors shadow-xs cursor-pointer"
              title="Mở trợ giảng AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Card: TIẾN ĐỘ LUYỆN TẬP ONLINE JUDGE */}
          <div className="bg-white dark:bg-[#131B29] rounded-2xl border border-gray-200 dark:border-[#1E293B] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                TIẾN ĐỘ CHẤM BÀI (AC)
              </h4>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                +{solvedStats.totalXP} XP
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">
                Đã giải thành công {solvedStats.acCount} / {solvedStats.totalCount} bài
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {solvedStats.percent}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-gray-100 dark:bg-[#1E293B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all"
                style={{ width: `${solvedStats.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
