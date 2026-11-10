import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Target,
  Brain,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Send,
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Compass,
  Award,
  Zap,
  Check,
  RotateCcw,
  ChevronRight,
  GraduationCap,
  Info,
  Sliders,
  Filter,
  Flame,
  FileText,
  BarChart3,
  Play,
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  X,
  Circle,
  MessageSquare,
  Bot,
  Trash2,
} from 'lucide-react';
import {
  UserProfile,
  ExamAttempt,
  SubjectTopicId,
  CognitiveLevel,
  Exam,
  DiagnosticReport,
  CognitiveLevelStat,
  CompetencyStat,
  TopicDiagnosticDetail,
  AiRoadmapPlan,
  RoadmapDayItem,
  TopicMasteryInfo,
  TopicMasteryStatus,
} from '../../types';
import { OFFICIAL_EXAMS } from '../../data/officialExamsData';
import { TOPIC_LESSONS } from '../../data/topicsData';
import {
  askThinkingAiTutor,
  askSearchGroundedInfo,
  requestAdaptiveStudyPlan,
  requestDiagnosticAnalysis,
} from '../../services/geminiClient';
import { askRagTutor } from '../../services/ragService';
import { storageService } from '../../services/storageService';

interface PersonalizedAIProps {
  user: UserProfile;
  examAttempts: ExamAttempt[];
  onUpdateUser: (updated: UserProfile) => void;
  onNavigateTopic: (topicId: SubjectTopicId) => void;
  onStartExam?: (examId: string) => void;
  onStartTopicQuiz?: (topicId: SubjectTopicId, count?: number) => void;
  onStartDailyChallenge?: () => void;
  onNavigateTab?: (tab: string) => void;
}

// 4 main navigation tabs for clear, logical UX
export type MainAITab = 'tutor' | 'roadmap' | 'diagnostic' | 'knowledge_map';

// Quick prompt suggestions for high-school students
const SUGGESTED_QUESTIONS = [
  {
    title: 'Phân biệt Switch & Router',
    question: 'Phân biệt nguyên lý hoạt động của Switch (đọc MAC tầng Data Link) và Router (định tuyến IP tầng Network) theo SGK Tin học 12?',
    topic: '12B',
  },
  {
    title: 'Mệnh đề WHERE vs HAVING trong SQL',
    question: 'Khi nào dùng mệnh đề WHERE và khi nào dùng HAVING trong câu lệnh truy vấn SQL? Cho ví dụ minh họa cụ thể?',
    topic: '11F',
  },
  {
    title: 'Phân loại AI hẹp (ANI) vs AI tổng quát (AGI)',
    question: 'Sự khác biệt cốt lõi giữa Trí tuệ nhân tạo hẹp (ANI) và Trí tuệ nhân tạo tổng quát (AGI) là gì? Ý nghĩa bài kiểm tra Turing?',
    topic: '12A',
  },
  {
    title: 'Độ phức tạp Thuật toán Tìm kiếm nhị phân',
    question: 'Điều kiện tiên quyết để thực hiện Tìm kiếm nhị phân (Binary Search) là gì? Vì sao độ phức tạp thuật toán lại là O(log n)?',
    topic: '11F_CS',
  },
];

// Helper to determine Competency Code according to MOET Table 1
const getCompetencyCode = (topicId: string): 'NLa' | 'NLb' | 'NLc' => {
  if (['12B', '12F', '12E_ICT'].includes(topicId)) return 'NLa';
  if (['12A', '12D', '12G'].includes(topicId)) return 'NLb';
  return 'NLc'; // 11F, 11E_ICT, 11F_CS, 10_PYTHON, 12F_CS
};

// Curriculum Lesson Titles & Specific Gaps mapping from Book
const CURRICULUM_TOPIC_GAPS: Record<string, { lessons: string[]; defaultTraps: string }> = {
  '12A': {
    lessons: [
      'Bài 1: Khái niệm & 5 đặc trưng cơ bản của AI (Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề)',
      'Bài 1: Phân loại AI hẹp (ANI) vs AI tổng quát (AGI) & Ý nghĩa bài kiểm tra Turing (Turing Test 1950)',
      'Bài 2: Tác động của AI đối với việc làm, cảnh báo xã hội và an ninh mạng (Deepfake, bảo vệ dữ liệu cá nhân)',
    ],
    defaultTraps: 'Dễ nhầm lẫn giữa AI hẹp (thực hiện nhiệm vụ cụ thể) với AI tổng quát (AGI - tự suy nghĩ và thích ứng như con người).',
  },
  '12B': {
    lessons: [
      'Bài 1: Phân biệt thiết bị mạng: Switch (đọc địa chỉ MAC) vs Router (đọc địa chỉ IP để định tuyến)',
      'Bài 2: Chuyển đổi nhị phân IPv4 (32 bit, 4 octet) và cấu trúc địa chỉ IPv6 (128 bit hexa)',
      'Bài 2: Vai trò máy chủ phân giải tên miền DNS và cơ chế bắt tay 3 bước của giao thức TCP/IP',
    ],
    defaultTraps: 'Nhầm lẫn phạm vi hoạt động của Switch (tầng Data Link, dùng MAC) với Router (tầng Network, dùng IP).',
  },
  '12D': {
    lessons: [
      'Bài 1: Đạo đức, tính nhân văn và hành vi ứng xử văn minh trong môi trường số',
      'Bài 2: Quyền tác giả, bản quyền phần mềm và phòng chống xâm phạm dữ liệu cá nhân',
    ],
    defaultTraps: 'Nhầm lẫn giữa phần mềm nguồn mở (Open Source) và phần mềm miễn phí (Freeware).',
  },
  '12G': {
    lessons: [
      'Bài 1: Phân loại nhóm nghề dịch vụ: Hỗ trợ kỹ thuật CNTT, quản trị hệ thống và vận hành mạng',
      'Bài 2: Xu hướng nghề nghiệp trong kỷ nguyên Trí tuệ nhân tạo và chuyển đổi số',
    ],
    defaultTraps: 'Nhầm lẫn nhiệm vụ của chuyên viên Quản trị mạng với Lập trình viên phần mềm.',
  },
  '12F': {
    lessons: [
      'Bài 1: Cấu trúc thẻ ngữ nghĩa semantic HTML5 (header, nav, section, article, table, form)',
      'Bài 2: Mô hình hộp CSS Box Model (phân biệt margin viền ngoài và padding vùng đệm bên trong)',
    ],
    defaultTraps: 'Nhầm lẫn giữa Margin (khoảng cách bên ngoài đường viền) và Padding (khoảng cách giữa nội dung và đường viền).',
  },
  '11F': {
    lessons: [
      'Bài 1: Mô hình CSDL quan hệ: Bản ghi (Record), Thuộc tính (Field), Khóa chính (Primary Key) & Khóa ngoại (Foreign Key)',
      'Bài 2: Cú pháp truy vấn SQL: Mệnh đề WHERE lọc dòng vs HAVING lọc nhóm sau GROUP BY',
      'Bài 2: Quy tắc toàn vẹn dữ liệu và liên kết quan hệ 1 - Nhiều (1-N) giữa các bảng',
    ],
    defaultTraps: 'Nhầm lẫn mệnh đề WHERE (lọc dữ liệu từng dòng trước khi gộp) với HAVING (lọc nhóm sau khi GROUP BY).',
  },
  '11F_CS': {
    lessons: [
      'Bài 1: Thuật toán tìm kiếm nhị phân (Binary Search) - điều kiện mảng đã sắp xếp và độ phức tạp O(log n)',
      'Bài 2: Kĩ thuật lập trình đệ quy, sắp xếp chọn / chèn / nổi bọt và truy vết từng bước chạy',
    ],
    defaultTraps: 'Quên điều kiện tiên quyết của tìm kiếm nhị phân: Mảng bắt buộc phải được sắp xếp theo thứ tự.',
  },
  '10_PYTHON': {
    lessons: [
      'Bài 1: Chỉ số mảng âm, cú pháp cắt lát chuỗi/danh sách (slicing [start:stop:step])',
      'Bài 2: Phạm vi biến cục bộ (local) và toàn cục (global) trong hàm Python',
    ],
    defaultTraps: 'Nhầm lẫn quy tắc stop trong hàm range(start, stop): giá trị stop không bao giờ được lấy.',
  },
};

export const PersonalizedAI: React.FC<PersonalizedAIProps> = ({
  user,
  examAttempts,
  onUpdateUser,
  onNavigateTopic,
  onStartExam,
  onStartTopicQuiz,
  onStartDailyChallenge,
  onNavigateTab,
}) => {
  // Navigation: Active tab (Default is 'tutor' - most wanted and logical entry)
  const [activeTab, setActiveTab] = useState<MainAITab>('tutor');

  // Exam diagnostic taking sub-mode (Only active when student chooses to take/retake test)
  const [isTakingExam, setIsTakingExam] = useState<boolean>(false);

  // Stored diagnostic report & AI roadmap
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(() => {
    return storageService.getDiagnosticReport();
  });

  const [aiRoadmap, setAiRoadmap] = useState<AiRoadmapPlan | null>(() => {
    return storageService.getRoadmapPlan();
  });

  // Target and Study Preferences (synchronized with user profile)
  const [targetScoreInput, setTargetScoreInput] = useState<number>(() => user.targetScore || 8.5);
  const [dailyMinutesInput, setDailyMinutesInput] = useState<number>(() => user.dailyStudyMinutes || 45);
  const [trackInput, setTrackInput] = useState<'CS' | 'ICT'>(() => user.track || 'CS');

  // Days remaining until National Exam (June 25, 2026)
  const daysRemaining = useMemo(() => {
    const examDate = new Date('2026-06-25T08:00:00');
    const now = new Date();
    const diff = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 120;
  }, []);

  // Diagnostic Exam Taking State
  const [selectedExamId, setSelectedExamId] = useState<string>(OFFICIAL_EXAMS[0].id);
  const currentExam = useMemo(() => {
    return OFFICIAL_EXAMS.find((e) => e.id === selectedExamId) || OFFICIAL_EXAMS[0];
  }, [selectedExamId]);

  const [part1Answers, setPart1Answers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [part2Answers, setPart2Answers] = useState<Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }>>({});

  const [isAnalyzingDiagnostic, setIsAnalyzingDiagnostic] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Filters for Knowledge Map
  const [masteryFilter, setMasteryFilter] = useState<'all' | TopicMasteryStatus>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | '10' | '11' | '12'>('all');

  // AI Tutor Chat State
  const [tutorMode, setTutorMode] = useState<'rag' | 'thinking'>('rag');
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    model?: string;
    ragSources?: Array<{ title: string; bookSource: string }>;
  }>>([
    {
      sender: 'ai',
      text: `Xin chào ${user.displayName || 'bạn'}! 👋\n\nMình là **Trợ lý Gia sư AI Tin học TinPath**. Mình luôn sẵn sàng đồng hành cùng bạn:\n\n• 📖 **Giải đáp lý thuyết SGK** Tin học 10, 11, 12 (kèm trích dẫn chuẩn GDPT 2018).\n• 💡 **Phân tích bẫy trắc nghiệm** đề thi tốt nghiệp THPT.\n• 💻 **Hướng dẫn cú pháp SQL, thuật toán Python** và kỹ năng giải bài Đúng/Sai.\n\nBạn đang muốn ôn tập chuyên đề nào hoặc gặp câu hỏi khó nào cần giải đáp? Hãy hỏi mình ngay nhé!`,
      model: 'TinPath AI + RAG SGK GDPT 2018',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    if (activeTab === 'tutor') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAskingAi, activeTab]);

  // Topic mastery calculation
  const topicMastery: Record<SubjectTopicId, TopicMasteryInfo> = useMemo(() => {
    return storageService.calculateTopicMastery(examAttempts, diagnosticReport || undefined);
  }, [examAttempts, diagnosticReport]);

  // Filtered part2 questions for user track
  const part2Questions = useMemo(() => {
    return currentExam.part2Questions.filter(
      (q) => !q.trackRequirement || q.trackRequirement === 'ALL' || q.trackRequirement === trackInput
    );
  }, [currentExam, trackInput]);

  // Active today's task from Roadmap
  const todaysTask = useMemo(() => {
    if (!aiRoadmap || !aiRoadmap.dailyRoadmap || aiRoadmap.dailyRoadmap.length === 0) {
      return null;
    }
    const inProgress = aiRoadmap.dailyRoadmap.find((d) => d.status === 'in_progress');
    if (inProgress) return inProgress;
    const nextTodo = aiRoadmap.dailyRoadmap.find((d) => d.status === 'todo');
    return nextTodo || aiRoadmap.dailyRoadmap[aiRoadmap.dailyRoadmap.length - 1];
  }, [aiRoadmap]);

  // Current calculated proficiency score
  const currentProficiency = useMemo(() => {
    if (diagnosticReport) return diagnosticReport.score;
    if (user.diagnosticScore) return user.diagnosticScore;
    if (examAttempts.length > 0) {
      const latest = examAttempts[examAttempts.length - 1];
      return latest.totalScore;
    }
    return null;
  }, [diagnosticReport, user.diagnosticScore, examAttempts]);

  // Filtered topics for Knowledge Map
  const filteredTopics = useMemo(() => {
    return Object.values(topicMastery).filter((t) => {
      if (masteryFilter !== 'all' && t.status !== masteryFilter) return false;
      const lesson = TOPIC_LESSONS[t.topicId];
      if (gradeFilter !== 'all' && lesson && lesson.grade !== gradeFilter) return false;
      return true;
    });
  }, [topicMastery, masteryFilter, gradeFilter]);

  // Calculate official Ministry exam score
  const calculateExamScore = (
    exam: Exam,
    p1Ans: Record<string, 'A' | 'B' | 'C' | 'D'>,
    p2Ans: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }>
  ) => {
    let part1Score = 0;
    let part1Correct = 0;
    for (const q of exam.part1Questions) {
      if (p1Ans[q.id] === q.correctAnswer) {
        part1Score += 0.25;
        part1Correct += 1;
      }
    }

    const p2Filtered = exam.part2Questions.filter(
      (q) => !q.trackRequirement || q.trackRequirement === 'ALL' || q.trackRequirement === trackInput
    );

    let part2Score = 0;
    const part2Details = p2Filtered.map((q) => {
      const selections = p2Ans[q.id] || {};
      let correctStatements = 0;
      for (const stmt of q.statements) {
        if (selections[stmt.id] === stmt.isCorrect) {
          correctStatements += 1;
        }
      }
      let qScore = 0;
      if (correctStatements === 1) qScore = 0.1;
      else if (correctStatements === 2) qScore = 0.25;
      else if (correctStatements === 3) qScore = 0.5;
      else if (correctStatements === 4) qScore = 1.0;

      part2Score += qScore;
      return {
        questionId: q.id,
        correctStatements,
        score: qScore,
      };
    });

    const totalScore = Math.min(10, Number((part1Score + part2Score).toFixed(2)));

    return {
      totalScore,
      part1Score: Number(part1Score.toFixed(2)),
      part1Correct,
      part2Score: Number(part2Score.toFixed(2)),
      part2Details,
    };
  };

  // Run AI analysis on exam
  const runAiAnalysisOnExam = async (
    exam: Exam,
    p1Ans: Record<string, 'A' | 'B' | 'C' | 'D'>,
    p2Ans: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }>,
    finalScore: number,
    scoresData: any
  ) => {
    setIsAnalyzingDiagnostic(true);

    // 1. Tallying Cognitive Levels (Biết, Hiểu, Vận dụng)
    const cogStats: Record<CognitiveLevel, { correct: number; total: number }> = {
      biet: { correct: 0, total: 0 },
      hieu: { correct: 0, total: 0 },
      van_dung: { correct: 0, total: 0 },
    };

    // 2. Tallying MOET Competencies (NLa, NLb, NLc)
    const compStats: Record<'NLa' | 'NLb' | 'NLc', { correct: number; total: number }> = {
      NLa: { correct: 0, total: 0 },
      NLb: { correct: 0, total: 0 },
      NLc: { correct: 0, total: 0 },
    };

    // 3. Tallying Topics and Missing Gaps
    const topicStats: Record<
      string,
      {
        topicId: SubjectTopicId;
        topicName: string;
        correct: number;
        total: number;
        knowCorrect: number;
        knowTotal: number;
        undCorrect: number;
        undTotal: number;
        appCorrect: number;
        appTotal: number;
      }
    > = {};

    const wrongQuestions: Array<{
      id: string;
      topicId: SubjectTopicId;
      topicName: string;
      level: CognitiveLevel;
      content: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
      conceptualTrap?: string;
    }> = [];

    // Process Part 1
    for (const q of exam.part1Questions) {
      const userChoice = p1Ans[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      const cLevel: CognitiveLevel = q.level || 'biet';
      cogStats[cLevel].total += 1;
      if (isCorrect) cogStats[cLevel].correct += 1;

      const compCode = getCompetencyCode(q.topicId);
      compStats[compCode].total += 1;
      if (isCorrect) compStats[compCode].correct += 1;

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = {
          topicId: q.topicId as SubjectTopicId,
          topicName: q.topicName || 'Chuyên đề',
          correct: 0,
          total: 0,
          knowCorrect: 0,
          knowTotal: 0,
          undCorrect: 0,
          undTotal: 0,
          appCorrect: 0,
          appTotal: 0,
        };
      }
      topicStats[q.topicId].total += 1;
      if (cLevel === 'biet') topicStats[q.topicId].knowTotal += 1;
      if (cLevel === 'hieu') topicStats[q.topicId].undTotal += 1;
      if (cLevel === 'van_dung') topicStats[q.topicId].appTotal += 1;

      if (isCorrect) {
        topicStats[q.topicId].correct += 1;
        if (cLevel === 'biet') topicStats[q.topicId].knowCorrect += 1;
        if (cLevel === 'hieu') topicStats[q.topicId].undCorrect += 1;
        if (cLevel === 'van_dung') topicStats[q.topicId].appCorrect += 1;
      } else {
        const cAnswer = q.correctAnswer || 'A';
        wrongQuestions.push({
          id: q.id,
          topicId: q.topicId as SubjectTopicId,
          topicName: q.topicName || 'Chuyên đề',
          level: cLevel,
          content: q.content,
          userAnswer: userChoice ? `Đáp án ${userChoice}: ${q.options[userChoice]}` : 'Chưa chọn',
          correctAnswer: `Đáp án ${cAnswer}: ${q.options[cAnswer]}`,
          explanation: q.explanation || 'Xem lại kiến thức bài học trong SGK.',
        });
      }
    }

    // Process Part 2
    for (const q of part2Questions) {
      const selections = p2Ans[q.id] || {};
      const cLevel: CognitiveLevel = q.level || 'hieu';

      for (const stmt of q.statements) {
        const isCorrect = selections[stmt.id] === stmt.isCorrect;
        cogStats[cLevel].total += 1;
        if (isCorrect) cogStats[cLevel].correct += 1;

        const compCode = getCompetencyCode(q.topicId);
        compStats[compCode].total += 1;
        if (isCorrect) compStats[compCode].correct += 1;

        if (!topicStats[q.topicId]) {
          topicStats[q.topicId] = {
            topicId: q.topicId as SubjectTopicId,
            topicName: q.topicName || 'Chuyên đề',
            correct: 0,
            total: 0,
            knowCorrect: 0,
            knowTotal: 0,
            undCorrect: 0,
            undTotal: 0,
            appCorrect: 0,
            appTotal: 0,
          };
        }
        topicStats[q.topicId].total += 1;
        if (cLevel === 'biet') topicStats[q.topicId].knowTotal += 1;
        if (cLevel === 'hieu') topicStats[q.topicId].undTotal += 1;
        if (cLevel === 'van_dung') topicStats[q.topicId].appTotal += 1;

        if (isCorrect) {
          topicStats[q.topicId].correct += 1;
          if (cLevel === 'biet') topicStats[q.topicId].knowCorrect += 1;
          if (cLevel === 'hieu') topicStats[q.topicId].undCorrect += 1;
          if (cLevel === 'van_dung') topicStats[q.topicId].appCorrect += 1;
        } else {
          wrongQuestions.push({
            id: `${q.id}_${stmt.id}`,
            topicId: q.topicId as SubjectTopicId,
            topicName: q.topicName || 'Chuyên đề',
            level: cLevel,
            content: `[Đúng/Sai] ${q.context} -> Ý ${stmt.id.toUpperCase()}: ${stmt.text}`,
            userAnswer: selections[stmt.id] !== undefined ? (selections[stmt.id] ? 'Chọn Đúng' : 'Chọn Sai') : 'Chưa chọn',
            correctAnswer: stmt.isCorrect ? 'Đúng' : 'Sai',
            explanation: stmt.explanation || 'Đối chiếu mệnh đề với kiến thức chuẩn SGK.',
          });
        }
      }
    }

    const cognitiveLevels = {
      biet: {
        level: 'biet' as CognitiveLevel,
        name: 'Nhận biết',
        scopeDesc: 'Khái niệm, thuật ngữ và định nghĩa SGK',
        correctCount: cogStats.biet.correct,
        totalCount: Math.max(1, cogStats.biet.total),
        percentage: Math.round((cogStats.biet.correct / Math.max(1, cogStats.biet.total)) * 100),
        avgTimeSec: 45,
        statusLabel: cogStats.biet.correct / Math.max(1, cogStats.biet.total) >= 0.8 ? 'Đạt chuẩn' : 'Cần củng cố',
        pedagogicalRemark: 'Nắm chắc kiến thức định nghĩa và lý thuyết cốt lõi trong sách giáo khoa.',
      },
      hieu: {
        level: 'hieu' as CognitiveLevel,
        name: 'Thông hiểu',
        scopeDesc: 'Giải thích nguyên lý và phân biệt đối tượng',
        correctCount: cogStats.hieu.correct,
        totalCount: Math.max(1, cogStats.hieu.total),
        percentage: Math.round((cogStats.hieu.correct / Math.max(1, cogStats.hieu.total)) * 100),
        avgTimeSec: 75,
        statusLabel: cogStats.hieu.correct / Math.max(1, cogStats.hieu.total) >= 0.8 ? 'Đạt chuẩn' : 'Cần củng cố',
        pedagogicalRemark: 'Hiểu bản chất vấn đề, phân biệt rõ các giao thức và cấu trúc dữ liệu.',
      },
      van_dung: {
        level: 'van_dung' as CognitiveLevel,
        name: 'Vận dụng',
        scopeDesc: 'Phân tích, viết code và giải quyết bài toán',
        correctCount: cogStats.van_dung.correct,
        totalCount: Math.max(1, cogStats.van_dung.total),
        percentage: Math.round((cogStats.van_dung.correct / Math.max(1, cogStats.van_dung.total)) * 100),
        avgTimeSec: 130,
        statusLabel: cogStats.van_dung.correct / Math.max(1, cogStats.van_dung.total) >= 0.8 ? 'Đạt chuẩn' : 'Cần củng cố',
        pedagogicalRemark: 'Rèn luyện thêm kỹ năng truy vết thuật toán và viết truy vấn SQL phức tạp.',
      },
    };

    const competencies = {
      nla: {
        code: 'NLa' as const,
        title: 'Sử dụng và quản lý các phương tiện CNTT và truyền thông',
        focusDesc: 'Mạng máy tính, an toàn thông tin và ứng dụng số',
        correctCount: compStats.NLa.correct,
        totalCount: Math.max(1, compStats.NLa.total),
        percentage: Math.round((compStats.NLa.correct / Math.max(1, compStats.NLa.total)) * 100),
        statusLabel: compStats.NLa.correct / Math.max(1, compStats.NLa.total) >= 0.7 ? 'Thành thạo' : 'Cần luyện thêm',
        pedagogicalRemark: compStats.NLa.correct / Math.max(1, compStats.NLa.total) >= 0.7
          ? 'Thành thạo cấu trúc mạng và thiết bị số.'
          : 'Cần củng cố kiến thức mạng máy tính và giao thức TCP/IP.',
      },
      nlb: {
        code: 'NLb' as const,
        title: 'Ứng xử nhân văn và có trách nhiệm trong môi trường số',
        focusDesc: 'Đạo đức, pháp luật, văn hóa mạng và an toàn dữ liệu',
        correctCount: compStats.NLb.correct,
        totalCount: Math.max(1, compStats.NLb.total),
        percentage: Math.round((compStats.NLb.correct / Math.max(1, compStats.NLb.total)) * 100),
        statusLabel: compStats.NLb.correct / Math.max(1, compStats.NLb.total) >= 0.7 ? 'Thành thạo' : 'Cần luyện thêm',
        pedagogicalRemark: compStats.NLb.correct / Math.max(1, compStats.NLb.total) >= 0.7
          ? 'Nắm vững đạo đức công nghệ và pháp luật môi trường số.'
          : 'Cần ôn lại quy định bản quyền phần mềm và đặc trưng AI.',
      },
      nlc: {
        code: 'NLc' as const,
        title: 'Giải quyết vấn đề với sự trợ giúp của CNTT & truyền thông',
        focusDesc: 'Thuật toán, lập trình Python, CSDL và SQL',
        correctCount: compStats.NLc.correct,
        totalCount: Math.max(1, compStats.NLc.total),
        percentage: Math.round((compStats.NLc.correct / Math.max(1, compStats.NLc.total)) * 100),
        statusLabel: compStats.NLc.correct / Math.max(1, compStats.NLc.total) >= 0.7 ? 'Thành thạo' : 'Cần luyện thêm',
        pedagogicalRemark: compStats.NLc.correct / Math.max(1, compStats.NLc.total) >= 0.7
          ? 'Tư duy thuật toán và xử lý dữ liệu đạt yêu cầu.'
          : 'Điểm yếu trọng điểm: Cần củng cố truy vấn SQL và thuật toán mảng.',
      },
    };

    const topicDetails: TopicDiagnosticDetail[] = Object.values(topicStats).map((stat) => {
      const pct = Math.round((stat.correct / Math.max(1, stat.total)) * 100);
      let status: 'mastered' | 'acceptable' | 'urgent_gap' = 'acceptable';
      let label = 'Cần luyện thêm';
      if (pct >= 80) {
        status = 'mastered';
        label = 'Nắm vững kiến thức';
      } else if (pct < 50) {
        status = 'urgent_gap';
        label = 'Lỗ hổng nghiêm trọng';
      }

      const gapsMeta = CURRICULUM_TOPIC_GAPS[stat.topicId] || {
        lessons: [`Bài học trọng tâm chuyên đề ${stat.topicName}`],
        defaultTraps: 'Cần chú ý đọc kỹ yêu cầu phủ định và các điều kiện biên.',
      };

      return {
        topicId: stat.topicId,
        topicName: stat.topicName,
        competencyCode: getCompetencyCode(stat.topicId),
        correctQuestions: stat.correct,
        totalQuestions: stat.total,
        percentage: pct,
        knowCorrect: stat.knowCorrect,
        knowTotal: stat.knowTotal,
        understandCorrect: stat.undCorrect,
        understandTotal: stat.undTotal,
        applyCorrect: stat.appCorrect,
        applyTotal: stat.appTotal,
        masteryStatus: status,
        masteryLabel: label,
        specificMissingGaps: gapsMeta.lessons,
        examTrapWarning: gapsMeta.defaultTraps,
      };
    });

    const topicBreakdown = topicDetails.map((td) => ({
      topicId: td.topicId,
      topicName: td.topicName,
      correct: td.correctQuestions,
      total: td.totalQuestions,
      percentage: td.percentage,
    }));

    let ranking = 'Khá - Nền tảng tốt, cần rèn luyện thêm cấp độ Vận dụng';
    let assessment = `Học sinh đạt ${finalScore.toFixed(2)}/10 điểm trong đề thi tốt nghiệp THPT chuẩn (Phần I: ${scoresData.part1Score}đ, Phần II: ${scoresData.part2Score}đ). Nắm được kiến thức cốt lõi nhưng còn thiếu sót ở các câu hỏi phân hóa thực tiễn.`;

    if (finalScore >= 9.0) {
      ranking = 'Xuất sắc - Nền tảng vững vàng toàn diện';
      assessment = `Học sinh có tư duy Tin học xuất sắc với ${finalScore.toFixed(2)}/10 điểm trong đề thi THPTQG chuẩn. Làm chủ cả phần trắc nghiệm nhiều phương án lẫn đúng/sai.`;
    } else if (finalScore >= 8.0) {
      ranking = 'Giỏi - Nắm chắc kiến thức cốt lõi';
      assessment = `Kết quả thi THPTQG đạt ${finalScore.toFixed(2)}/10 điểm rất ấn tượng. Nền tảng kiến thức vững vàng, chỉ gặp một vài sai sót nhỏ ở các câu hỏi bẫy hoặc vận dụng thực tiễn.`;
    } else if (finalScore < 5.0) {
      ranking = 'Cần củng cố nền tảng kiến thức';
      assessment = `Kết quả đạt ${finalScore.toFixed(2)}/10 điểm cho thấy học sinh còn bị hổng kiến thức nền tảng trong chương trình lớp 11 và 12. Cần bám sát lộ trình từng ngày của TinPath để ôn tập lại.`;
    }

    const report: DiagnosticReport = {
      id: `diag_${Date.now()}`,
      score: finalScore,
      submittedAt: new Date().toISOString(),
      examId: exam.id,
      examTitle: exam.title,
      part1Score: scoresData.part1Score,
      part1Correct: scoresData.part1Correct,
      part2Score: scoresData.part2Score,
      part2Details: scoresData.part2Details,
      cognitiveLevels,
      competencies,
      topicDetails,
      topicBreakdown,
      wrongQuestions,
      analysis: {
        overallAssessment: assessment,
        levelRanking: ranking,
        strengths: topicDetails.filter((t) => t.percentage >= 70).map((t) => `Nắm vững chuyên đề ${t.topicName} (${t.percentage}% chính xác).`),
        weaknesses: topicDetails
          .filter((t) => t.percentage < 70)
          .map((t) => `Lỗ hổng [${t.topicName}]: ${t.specificMissingGaps[0]} (Độ chính xác: ${t.percentage}%).`),
        pedagogicalAdvice: `Dành ${dailyMinutesInput} phút mỗi ngày theo lộ trình: 20 phút đọc lại lý thuyết các bài học bị hổng, 20 phút giải bài tập trắc nghiệm và 5 phút đối chiếu lời giải chi tiết.`,
        recommendedWeakTopics: topicDetails.filter((t) => t.percentage < 70).map((t) => t.topicId),
      },
    };

    storageService.saveDiagnosticReport(report);
    setDiagnosticReport(report);

    onUpdateUser({
      ...user,
      diagnosticScore: finalScore,
    });

    setIsAnalyzingDiagnostic(false);
    setIsTakingExam(false);
    setActiveTab('diagnostic');
  };

  // Submit assessment
  const handleSubmitDiagnostic = async () => {
    const scores = calculateExamScore(currentExam, part1Answers, part2Answers);
    await runAiAnalysisOnExam(currentExam, part1Answers, part2Answers, scores.totalScore, scores);
  };

  // Use existing attempt from history
  const handleUseExistingExamAttempt = async (attempt: ExamAttempt) => {
    const matchingExam = OFFICIAL_EXAMS.find((e) => e.id === attempt.examId) || OFFICIAL_EXAMS[0];
    setSelectedExamId(matchingExam.id);

    const p1: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
    const p2: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }> = {};

    Object.values(attempt.answers || {}).forEach((ans) => {
      if (ans.type === 'single_choice' && ans.selectedOption) {
        p1[ans.questionId] = ans.selectedOption;
      } else if (ans.type === 'true_false_group' && ans.trueFalseSelections) {
        p2[ans.questionId] = ans.trueFalseSelections;
      }
    });

    const scores = calculateExamScore(matchingExam, p1, p2);
    setPart1Answers(p1);
    setPart2Answers(p2);

    await runAiAnalysisOnExam(matchingExam, p1, p2, attempt.totalScore, scores);
  };

  // Quick fill sample answers for testing
  const handleQuickFillSampleAnswers = () => {
    const p1: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
    currentExam.part1Questions.forEach((q, idx) => {
      if (idx === 3 || idx === 7 || idx === 12 || idx === 18) {
        const wrongOpts = (['A', 'B', 'C', 'D'] as const).filter((o) => o !== q.correctAnswer);
        p1[q.id] = wrongOpts[0];
      } else {
        p1[q.id] = q.correctAnswer || 'A';
      }
    });

    const p2: Record<string, { a?: boolean; b?: boolean; c?: boolean; d?: boolean }> = {};
    part2Questions.forEach((q, qIdx) => {
      p2[q.id] = {};
      q.statements.forEach((stmt, sIdx) => {
        if ((qIdx === 0 && sIdx === 1) || (qIdx === 1 && sIdx === 2) || (qIdx === 2 && sIdx === 0)) {
          p2[q.id][stmt.id] = !stmt.isCorrect;
        } else {
          p2[q.id][stmt.id] = stmt.isCorrect;
        }
      });
    });

    setPart1Answers(p1);
    setPart2Answers(p2);
  };

  // Generate Adaptive Roadmap Plan
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);

    try {
      const weakTopics = diagnosticReport?.analysis.recommendedWeakTopics || ['12B', '11F', '11F_CS'];
      const examDateStr = '2026-06-25';

      const planFromGemini = await requestAdaptiveStudyPlan({
        studentName: user.displayName || 'Học sinh',
        grade: user.grade || '12',
        track: trackInput,
        targetScore: targetScoreInput,
        dailyStudyMinutes: dailyMinutesInput,
        diagnosticScore: currentProficiency || 7.0,
        weakTopics,
        daysRemaining,
      });

      storageService.saveRoadmapPlan(planFromGemini);
      setAiRoadmap(planFromGemini);

      onUpdateUser({
        ...user,
        targetScore: targetScoreInput,
        dailyStudyMinutes: dailyMinutesInput,
        track: trackInput,
      });
    } catch {
      const fallbackPlan = buildLocalFallbackRoadmap(targetScoreInput);
      storageService.saveRoadmapPlan(fallbackPlan);
      setAiRoadmap(fallbackPlan);
    } finally {
      setIsGeneratingPlan(false);
      setActiveTab('roadmap');
    }
  };

  function buildLocalFallbackRoadmap(target: number): AiRoadmapPlan {
    const examDateStr = '2026-06-25';
    const items: RoadmapDayItem[] = [
      {
        day: 1,
        topicCode: '12B',
        topicTitle: 'Mạng máy tính & Thiết bị mạng (Switch vs Router) (NLa - Mức Biết & Hiểu)',
        keyTask: 'Ôn tập Bài 1: Phân biệt Switch đọc MAC vs Router đọc IP và các thiết bị kết nối mạng',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Trắc nghiệm nhiều lựa chọn',
        status: 'in_progress',
      },
      {
        day: 2,
        topicCode: '12B',
        topicTitle: 'Giao thức mạng TCP/IP & Địa chỉ IPv4/IPv6 (NLa - Mức Vận dụng)',
        keyTask: 'Ôn tập Bài 2: Chuyển đổi nhị phân địa chỉ IPv4, cấu trúc IPv6 và cơ chế DNS',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Trắc nghiệm Đúng/Sai & Bài tập tính toán',
        status: 'todo',
      },
      {
        day: 3,
        topicCode: '11F',
        topicTitle: 'Hệ quản trị CSDL quan hệ: Khóa chính & Khóa ngoại (NLc - Mức Biết & Hiểu)',
        keyTask: 'Ôn tập Bài 1: Mô hình quan hệ, liên kết 1-N, xác định thuộc tính khóa và tính toàn vẹn',
        minutes: Math.max(30, dailyMinutesInput - 10),
        focusQuestionType: 'Trắc nghiệm nhiều lựa chọn',
        status: 'todo',
      },
      {
        day: 4,
        topicCode: '11F',
        topicTitle: 'Truy vấn SQL có điều kiện: Mệnh đề WHERE vs HAVING (NLc - Mức Vận dụng)',
        keyTask: 'Luyện tập Bài 2: Viết câu lệnh SELECT, WHERE lọc dòng, GROUP BY và HAVING lọc nhóm',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Trắc nghiệm Đúng/Sai đa ý',
        status: 'todo',
      },
      {
        day: 5,
        topicCode: '12A',
        topicTitle: 'Trí tuệ nhân tạo: 5 Đặc trưng & Bài kiểm tra Turing (NLb - Mức Biết & Hiểu)',
        keyTask: 'Ôn tập Bài 1 & 2: Phân biệt ANI vs AGI, đạo đức công nghệ và cảnh báo Deepfake',
        minutes: Math.max(30, dailyMinutesInput - 10),
        focusQuestionType: 'Trắc nghiệm nhiều lựa chọn',
        status: 'todo',
      },
      {
        day: 6,
        topicCode: '11F_CS',
        topicTitle: 'Thuật toán Tìm kiếm nhị phân & Độ phức tạp O(log n) (NLc - Mức Vận dụng)',
        keyTask: 'Luyện tập Bài 1: Truy vết từng bước chạy thuật toán Binary Search và xử lý mảng sắp xếp',
        minutes: dailyMinutesInput,
        focusQuestionType: 'Truy vết mã nguồn Python',
        status: 'todo',
      },
      {
        day: 7,
        topicCode: 'ALL',
        topicTitle: 'Thi thử Đề tổng hợp 28 câu chuẩn ma trận Bộ GD&ĐT (Đánh giá lại tiến độ)',
        keyTask: 'Làm bài thi thử 50 phút đúng cấu trúc: 24 câu nhiều lựa chọn + 4 câu đúng/sai',
        minutes: 50,
        focusQuestionType: 'Đề thi thử tổng hợp',
        status: 'todo',
      },
    ];

    return {
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      targetScore: target,
      dailyStudyMinutes: dailyMinutesInput,
      track: trackInput,
      daysRemaining,
      examDate: examDateStr,
      assessmentSummary: `Lộ trình bứt phá mục tiêu ${target} điểm dựa trên ma trận năng lực và 3 cấp độ tư duy.`,
      targetStrategy: `Tập trung bù đắp các lỗ hổng cấp độ Vận dụng ở chuyên đề 12B, 11F và củng cố chắc chắn điểm Nhận biết.`,
      dailyRoadmap: items,
    };
  }

  // Toggle Roadmap Item Completion
  const handleToggleDayStatus = (dayNumber: number) => {
    if (!aiRoadmap) return;
    const item = aiRoadmap.dailyRoadmap.find((d) => d.day === dayNumber);
    if (!item) return;

    const nextStatus: 'todo' | 'in_progress' | 'completed' =
      item.status === 'completed' ? 'todo' : item.status === 'todo' ? 'in_progress' : 'completed';

    const updated = storageService.updateRoadmapDayStatus(dayNumber, nextStatus);
    if (updated) {
      setAiRoadmap({ ...updated });
    }
  };

  // AI Chat handler
  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend || inputQuestion).trim();
    if (!question || isAskingAi) return;

    setInputQuestion('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: question }]);
    setIsAskingAi(true);

    try {
      if (tutorMode === 'thinking') {
        const res = await askThinkingAiTutor({
          topicTitle: 'Ôn thi Tin học THPT GDPT 2018',
          userQuestion: question,
          studentContext: `Học sinh lớp ${user.grade}, trường ${user.schoolName || 'THPT'}, định hướng ${user.track}, mục tiêu điểm ${user.targetScore}`,
        });
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.text,
            model: res.modelUsed,
          },
        ]);
      } else {
        try {
          const res = await askRagTutor({
            topicTitle: 'Ôn thi Tin học THPT GDPT 2018',
            userQuestion: question,
            studentContext: `Học sinh lớp ${user.grade}, trường ${user.schoolName || 'THPT'}, định hướng ${user.track}, mục tiêu điểm ${user.targetScore}`,
          });
          setChatMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: res.text,
              model: res.modelUsed,
              ragSources: res.sourceChunks,
            },
          ]);
        } catch {
          const fallbackRes = await askThinkingAiTutor({
            topicTitle: 'Ôn thi Tin học THPT GDPT 2018',
            userQuestion: question,
            studentContext: `Học sinh lớp ${user.grade}`,
          });
          setChatMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: fallbackRes.text,
              model: 'Gemini Flash AI',
            },
          ]);
        }
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Xin lỗi bạn, kết nối tới Trợ lý AI tạm thời bị gián đoạn. Bạn vui lòng thử lại sau ít giây nhé!',
          model: 'TinPath AI Assistant',
        },
      ]);
    } finally {
      setIsAskingAi(false);
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    setChatMessages([
      {
        sender: 'ai',
        text: `Đã làm mới cuộc hội thoại. Bạn có thể hỏi bất cứ câu hỏi nào về lý thuyết SGK Tin học hoặc bài tập ôn thi nhé!`,
        model: 'TinPath AI + RAG SGK GDPT 2018',
      },
    ]);
  };

  // =========================================================================
  // VIEW: DIAGNOSTIC EXAM TAKING (Full Screen Modal/View)
  // =========================================================================
  if (isTakingExam) {
    return (
      <div className="w-full space-y-6 pb-12">
        {/* Header with back button */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-[#262626]">
            <div>
              <button
                type="button"
                onClick={() => setIsTakingExam(false)}
                className="mb-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-[#2878C8] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Gia sư AI</span>
              </button>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Bài kiểm tra Đánh giá Năng lực THPT Quốc gia
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl leading-relaxed">
                Đề thi chuẩn cấu trúc Bộ GD&ĐT gồm 24 câu trắc nghiệm nhiều phương án (Phần I) và 4 câu trắc nghiệm Đúng/Sai đa ý (Phần II). Dữ liệu này là cơ sở để phân bổ theo 3 cấp độ tư duy và 3 thành phần năng lực.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleQuickFillSampleAnswers}
                className="px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-[#2878C8] dark:text-blue-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Điền nhanh câu trả lời mẫu (Test)</span>
              </button>
            </div>
          </div>

          {/* Exam Selector */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Chọn đề thi đánh giá năng lực:
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#2878C8]"
              >
                {OFFICIAL_EXAMS.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.part1Questions.length + ex.part2Questions.length} câu - 50 phút)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Hoặc sử dụng bài thi đã làm trong lịch sử:
              </label>
              {examAttempts.length > 0 ? (
                <div className="flex items-center gap-2">
                  <select
                    id="existing_attempt_select"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#333] bg-white dark:bg-[#121212] text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#2878C8]"
                  >
                    {examAttempts.map((att) => (
                      <option key={att.id} value={att.id}>
                        {att.examTitle} — {att.totalScore.toFixed(2)}đ ({new Date(att.submittedAt).toLocaleDateString('vi-VN')})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const selectEl = document.getElementById('existing_attempt_select') as HTMLSelectElement;
                      const found = examAttempts.find((a) => a.id === selectEl?.value);
                      if (found) handleUseExistingExamAttempt(found);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shrink-0 transition-colors"
                  >
                    Dùng kết quả này
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic pt-2">Chưa có bài thi nào trong lịch sử.</p>
              )}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {/* Part 1 */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#262626]">
              <div>
                <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg">
                  Phần I: Câu trắc nghiệm nhiều phương án lựa chọn (24 câu)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Mỗi câu trả lời đúng được 0.25 điểm. Tối đa 6.0 điểm.</p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2878C8] px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                Đã chọn: {Object.keys(part1Answers).length} / {currentExam.part1Questions.length} câu
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {currentExam.part1Questions.map((q, idx) => (
                <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#2878C8] text-white text-xs font-black">
                      Câu {idx + 1}
                    </span>
                    <span className="text-xs text-gray-500 font-bold">[{q.topicName}]</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {q.level === 'biet' ? 'Nhận biết' : q.level === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-relaxed mb-4">
                    {q.content}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPart1Answers((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-start gap-3 ${
                          part1Answers[q.id] === opt
                            ? 'bg-blue-50 dark:bg-blue-950/70 border-[#2878C8] text-[#2878C8] font-bold shadow-xs'
                            : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          part1Answers[q.id] === opt ? 'bg-[#2878C8] text-white' : 'bg-gray-100 dark:bg-[#2A2A2A]'
                        }`}>
                          {opt}
                        </span>
                        <span className="leading-snug pt-0.5">{q.options[opt]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2 */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-sm">
            <div className="pb-4 border-b border-gray-100 dark:border-[#262626]">
              <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg">
                Phần II: Câu trắc nghiệm Đúng / Sai (4 câu)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Thang điểm lũy tiến: đúng 1 ý = 0.1đ | đúng 2 ý = 0.25đ | đúng 3 ý = 0.5đ | đúng 4 ý = 1.0đ. Tối đa 4.0 điểm.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {part2Questions.map((q, qIdx) => (
                <div key={q.id} className="p-5 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-black">
                      Câu {qIdx + 1}
                    </span>
                    <span className="text-xs text-gray-500 font-bold">[{q.topicName}]</span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-4 leading-relaxed">
                    {q.context}
                  </p>

                  <div className="space-y-3">
                    {q.statements.map((stmt) => (
                      <div
                        key={stmt.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-[#181818] border border-gray-200 dark:border-[#333] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-bold text-sm text-[#2878C8] uppercase shrink-0 pt-0.5">
                            {stmt.id})
                          </span>
                          <span className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                            {stmt.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() =>
                              setPart2Answers((prev) => ({
                                ...prev,
                                [q.id]: { ...(prev[q.id] || {}), [stmt.id]: true },
                              }))
                            }
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              part2Answers[q.id]?.[stmt.id] === true
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-emerald-50'
                            }`}
                          >
                            Đúng
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPart2Answers((prev) => ({
                                ...prev,
                                [q.id]: { ...(prev[q.id] || {}), [stmt.id]: false },
                              }))
                            }
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              part2Answers[q.id]?.[stmt.id] === false
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-rose-50'
                            }`}
                          >
                            Sai
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <h4 className="font-black text-gray-900 dark:text-white text-base">
                Hoàn tất bài kiểm tra đánh giá năng lực?
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                AI sẽ tính điểm và bóc tách ma trận theo 3 cấp độ tư duy & chuẩn Bảng 1 Bộ GD&ĐT.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsTakingExam(false)}
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-100"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={isAnalyzingDiagnostic}
                onClick={handleSubmitDiagnostic}
                className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzingDiagnostic ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang phân tích ma trận năng lực...</span>
                  </>
                ) : (
                  <>
                    <span>Nộp bài & Phân tích</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN DASHBOARD VIEW
  // =========================================================================
  return (
    <div className="w-full space-y-6 pb-12">
      {/* ===================================================================== */}
      {/* TOP HEADER: BRANDING & QUICK SUMMARY */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#2878C8] to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Gia Sư AI TinPath
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-[#2878C8] border border-blue-200 dark:border-blue-900">
                  GDPT 2018 • RAG SGK
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                Hỏi đáp lý thuyết SGK 10, 11, 12 • Lộ trình cá nhân hóa 7 ngày • Chẩn đoán bẫy đề thi THPT Quốc gia
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Thi THPTQG 2026: còn <strong>{daysRemaining} ngày</strong></span>
            </span>

            {currentProficiency !== null && (
              <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[#2878C8] dark:text-blue-400 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Năng lực: <strong>{currentProficiency.toFixed(1)}/10đ</strong></span>
              </span>
            )}
          </div>
        </div>

        {/* 4 CLEAR TABS NAVIGATION (NO LOCKS, DIRECT ACCESS) */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#262626] grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('tutor')}
            className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeTab === 'tutor'
                ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#2878C8] text-[#2878C8] shadow-xs'
                : 'bg-gray-50/60 dark:bg-[#202020] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-400'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeTab === 'tutor' ? 'bg-[#2878C8] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs sm:text-sm font-black truncate">Trợ lý Gia sư AI</div>
              <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">Hỏi đáp & Giải bài tập</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeTab === 'roadmap'
                ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#2878C8] text-[#2878C8] shadow-xs'
                : 'bg-gray-50/60 dark:bg-[#202020] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-400'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeTab === 'roadmap' ? 'bg-[#2878C8] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              <Target className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs sm:text-sm font-black truncate">Lộ trình học tập</div>
              <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">Kế hoạch thích ứng 7 ngày</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diagnostic')}
            className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeTab === 'diagnostic'
                ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#2878C8] text-[#2878C8] shadow-xs'
                : 'bg-gray-50/60 dark:bg-[#202020] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-400'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeTab === 'diagnostic' ? 'bg-[#2878C8] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs sm:text-sm font-black truncate">Chẩn đoán năng lực</div>
              <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">Ma trận 3 cấp độ tư duy</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('knowledge_map')}
            className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeTab === 'knowledge_map'
                ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#2878C8] text-[#2878C8] shadow-xs'
                : 'bg-gray-50/60 dark:bg-[#202020] border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-gray-400'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeTab === 'knowledge_map' ? 'bg-[#2878C8] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              <Compass className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs sm:text-sm font-black truncate">Bản đồ tri thức</div>
              <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">11 chuyên đề GDPT 2018</div>
            </div>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: TRỢ LÝ GIA SƯ AI (HỎI ĐÁP & HỖ TRỢ TRỰC TUYẾN) */}
      {/* ===================================================================== */}
      {activeTab === 'tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area (2 columns on large screen) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] shadow-sm flex flex-col h-[680px]">
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#2878C8] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-base">
                    Gia sư Tin học GDPT 2018
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Sẵn sàng hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>

              {/* Mode switch & clear chat */}
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-gray-100 dark:bg-[#252525] flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTutorMode('rag')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      tutorMode === 'rag'
                        ? 'bg-white dark:bg-[#333] text-[#2878C8] shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                    title="Trích dẫn sách giáo khoa GDPT 2018"
                  >
                    📖 RAG SGK
                  </button>
                  <button
                    type="button"
                    onClick={() => setTutorMode('thinking')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      tutorMode === 'thinking'
                        ? 'bg-white dark:bg-[#333] text-indigo-600 shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                    title="Suy luận chuyên sâu & giải bài tập"
                  >
                    🧠 Suy luận sâu
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors"
                  title="Làm mới cuộc trò chuyện"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 pr-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#2878C8] text-white shadow-xs'
                        : 'bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-[#333]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-normal">
                      {msg.text}
                    </div>

                    {msg.ragSources && msg.ragSources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-blue-200/50 dark:border-gray-700 text-xs text-[#2878C8] dark:text-blue-400 font-semibold space-y-1">
                        <div className="flex items-center gap-1 font-bold">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Trích dẫn nguồn SGK GDPT 2018:</span>
                        </div>
                        <div className="pl-4 space-y-0.5 font-normal text-gray-600 dark:text-gray-400">
                          {msg.ragSources.map((s, sIdx) => (
                            <div key={sIdx}>• {s.bookSource}: {s.title}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAskingAi && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-2xl bg-gray-100 dark:bg-[#222] border border-gray-200 dark:border-[#333] text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#2878C8]" />
                    <span>Gia sư AI đang tra cứu SGK và suy luận câu trả lời...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 border-t border-gray-100 dark:border-[#2C2C2C] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Nhập câu hỏi lý thuyết hoặc bài tập Tin học cần giải đáp..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#141414] text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#2878C8]"
              />
              <button
                type="submit"
                disabled={isAskingAi || !inputQuestion.trim()}
                className="px-5 py-3 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-sm sm:text-base disabled:opacity-40 flex items-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </form>
          </div>

          {/* Sidebar: Suggested Questions & Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-[#262626]">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                <h4 className="font-black text-black dark:text-white text-sm uppercase tracking-wide">
                  Câu hỏi ôn tập gợi ý
                </h4>
              </div>

              <div className="space-y-3">
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.question)}
                    className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-[#333] hover:border-[#2878C8] dark:hover:border-blue-500 bg-gray-50/70 dark:bg-[#202020] text-left transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm text-black dark:text-white group-hover:text-[#2878C8] leading-snug">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-[#2878C8] shrink-0 mt-0.5">
                        {item.topic}
                      </span>
                    </div>
                    <p className="text-sm text-black dark:text-gray-300 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                      {item.question}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Diagnostic / Roadmap Shortcuts */}
            <div className="bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-[#2878C8]" />
                <h4 className="font-black text-gray-900 dark:text-white text-base">
                  Lộ trình ôn thi của bạn
                </h4>
              </div>
              <p className="text-sm text-black dark:text-gray-200 leading-relaxed">
                Mục tiêu hiện tại: <strong className="text-black dark:text-white">{user.targetScore || 8.5} điểm</strong> ({user.dailyStudyMinutes || 45} phút/ngày).
              </p>
              <div className="pt-1 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('roadmap')}
                  className="w-full py-3 px-4 rounded-xl bg-[#2878C8] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#2068B0] transition-colors"
                >
                  <Calendar className="w-4.5 h-4.5" />
                  <span>Xem kế hoạch 7 ngày</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTakingExam(true)}
                  className="w-full py-3 px-4 rounded-xl bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-4.5 h-4.5 text-[#2878C8]" />
                  <span>Làm bài thi đánh giá năng lực</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: LỘ TRÌNH CÁ NHÂN HÓA & KẾ HOẠCH 7 NGÀY */}
      {/* ===================================================================== */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Today's Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2878C8] via-indigo-600 to-cyan-600 p-6 sm:p-8 text-white shadow-md">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Nhiệm vụ học tập hôm nay
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {todaysTask ? todaysTask.topicTitle : 'Lộ trình ôn tập thích ứng TinPath AI'}
                </h2>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  {todaysTask
                    ? `${todaysTask.keyTask} (${todaysTask.minutes} phút - ${todaysTask.focusQuestionType})`
                    : 'Bám sát kế hoạch từng ngày để củng cố các lỗ hổng kiến thức và nâng cao điểm số môn Tin học.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-white/90">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-4 h-4" /> {todaysTask ? `${todaysTask.minutes} phút` : `${dailyMinutesInput} phút`}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <BookOpen className="w-4 h-4" /> {todaysTask ? `Chuyên đề: ${todaysTask.topicCode}` : 'Kiến thức trọng tâm'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <Award className="w-4 h-4" /> +25 XP khi hoàn thành
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                {todaysTask && (
                  <button
                    type="button"
                    onClick={() => {
                      if (todaysTask.topicCode === 'ALL') {
                        if (onStartExam) onStartExam(selectedExamId);
                      } else {
                        if (onStartTopicQuiz) onStartTopicQuiz(todaysTask.topicCode as SubjectTopicId, 10);
                        else onNavigateTopic(todaysTask.topicCode as SubjectTopicId);
                      }
                    }}
                    className="px-7 py-3.5 rounded-2xl bg-white text-[#2878C8] hover:bg-blue-50 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <Play className="w-5 h-5 fill-[#2878C8]" />
                    <span>Vào học ngay</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Goal & Preferences Settings Card */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#262626]">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#2878C8]" />
                  Thiết lập mục tiêu điểm số & Quỹ thời gian học
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Thay đổi mục tiêu để AI tự động điều chỉnh độ khó và cường độ ôn tập phù hợp.
                </p>
              </div>

              <button
                type="button"
                disabled={isGeneratingPlan}
                onClick={handleGeneratePlan}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
              >
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang lập lộ trình...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Cập nhật lộ trình bằng AI</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Target score */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Mục tiêu điểm thi THPTQG
                  </label>
                  <span className="text-xl font-black text-[#2878C8]">
                    {targetScoreInput} <span className="text-xs font-normal text-gray-400">/ 10</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={targetScoreInput}
                  onChange={(e) => setTargetScoreInput(Number(e.target.value))}
                  className="w-full accent-[#2878C8] h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>6.0 (Cơ bản)</span>
                  <span>8.5 (Giỏi)</span>
                  <span>10.0 (Tuyệt đối)</span>
                </div>
              </div>

              {/* Study time */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Thời gian học mỗi ngày
                  </label>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    {dailyMinutesInput} phút
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyMinutesInput(mins)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        dailyMinutesInput === mins
                          ? 'bg-[#2878C8] text-white shadow-xs'
                          : 'bg-white dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#333]'
                      }`}
                    >
                      {mins}p
                    </button>
                  ))}
                </div>
              </div>

              {/* Track */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Phân ban định hướng
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#2878C8]">
                    {trackInput}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTrackInput('CS')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      trackInput === 'CS'
                        ? 'bg-[#2878C8] text-white'
                        : 'bg-white dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#333]'
                    }`}
                  >
                    CS (Khoa học máy tính)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackInput('ICT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      trackInput === 'ICT'
                        ? 'bg-[#2878C8] text-white'
                        : 'bg-white dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#333]'
                    }`}
                  >
                    ICT (Tin ứng dụng)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 7 Days Timeline List */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#262626]">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2878C8]" />
                Kế hoạch học tập 7 ngày thích ứng
              </h3>
              <span className="text-xs text-gray-500">Đánh dấu tích khi bạn hoàn thành nhiệm vụ</span>
            </div>

            <div className="space-y-3">
              {(aiRoadmap?.dailyRoadmap || buildLocalFallbackRoadmap(targetScoreInput).dailyRoadmap).map((item) => {
                const isCompleted = item.status === 'completed';
                const isInProgress = item.status === 'in_progress';

                return (
                  <div
                    key={item.day}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40'
                        : isInProgress
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 border-[#2878C8]'
                        : 'bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2C2C2C]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => handleToggleDayStatus(item.day)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-gray-300 dark:border-gray-600 text-transparent hover:border-[#2878C8]'
                        }`}
                        title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành (+25 XP)'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#2A2A2A] text-gray-800 dark:text-gray-200 text-xs font-black">
                            Ngày {item.day}
                          </span>
                          <span className="text-xs font-bold text-[#2878C8]">[{item.topicCode}]</span>
                          <span className="text-xs text-gray-500 font-medium">• {item.minutes} phút</span>
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Đã hoàn thành (+25 XP)
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm sm:text-base font-bold mt-1.5 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {item.topicTitle}
                        </h4>

                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          {item.keyTask}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.topicCode === 'ALL') {
                            if (onStartExam) onStartExam(selectedExamId);
                          } else {
                            if (onStartTopicQuiz) onStartTopicQuiz(item.topicCode as SubjectTopicId, 10);
                            else onNavigateTopic(item.topicCode as SubjectTopicId);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{item.topicCode === 'ALL' ? 'Thi thử tổng hợp' : 'Vào học ngay'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: CHẨN ĐOÁN & MA TRẬN NĂNG LỰC */}
      {/* ===================================================================== */}
      {activeTab === 'diagnostic' && (
        <div className="space-y-6">
          {diagnosticReport ? (
            <>
              {/* Header Overview Card */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-[#262626]">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 inline-block mb-1.5">
                      Báo cáo Chẩn đoán Năng lực Chuyên sâu
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      Phân tích kiến thức đã vững & Lỗ hổng cần bù đắp
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Bài thi: {diagnosticReport.examTitle} • Điểm đạt:{' '}
                      <strong className="text-blue-600 dark:text-blue-400 text-base">
                        {diagnosticReport.score.toFixed(2)}/10
                      </strong>{' '}
                      (Phần I: {diagnosticReport.part1Score}đ, Phần II: {diagnosticReport.part2Score}đ)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsTakingExam(true)}
                      className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-[#2878C8] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-blue-200 dark:border-blue-900"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thi lại đầu vào</span>
                    </button>
                  </div>
                </div>

                {/* Overall Assessment */}
                <div className="mt-5 p-4 rounded-xl bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-[#333]">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" /> Nhận định tổng quan từ Gia sư AI:
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {diagnosticReport.analysis.overallAssessment}
                  </p>
                </div>
              </div>

              {/* 3 Cognitive Levels */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
                <div className="pb-4 border-b border-gray-100 dark:border-[#262626]">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    Phân bổ Năng lực theo 3 Cấp độ Tư duy GDPT 2018
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Đối chiếu tỷ lệ trả lời đúng theo cấu trúc đề thi tốt nghiệp THPT chuẩn.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['biet', 'hieu', 'van_dung'] as const).map((lvl) => {
                    const item = diagnosticReport.cognitiveLevels[lvl];
                    const isPassed = item.percentage >= 80;

                    return (
                      <div
                        key={lvl}
                        className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/70 dark:bg-[#202020] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className={`text-base font-black ${isPassed ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {item.percentage}%
                          </span>
                        </div>

                        <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isPassed ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Đúng {item.correctCount}/{item.totalCount} câu</span>
                          <span>Chuẩn mục tiêu: ≥80%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MOET Competencies */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs">
                <div className="pb-4 border-b border-gray-100 dark:border-[#262626]">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    3 Thành phần Năng lực cốt lõi theo Bảng 1 Bộ GD&ĐT
                  </h3>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'nla', data: diagnosticReport.competencies?.nla, code: 'NLa' },
                    { key: 'nlb', data: diagnosticReport.competencies?.nlb, code: 'NLb' },
                    { key: 'nlc', data: diagnosticReport.competencies?.nlc, code: 'NLc' },
                  ].map(({ key, data, code }) => (
                    <div key={key} className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#202020] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-xs font-black bg-blue-100 text-[#2878C8]">
                          {code}
                        </span>
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          {data?.percentage ?? 0}%
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                        {data?.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {data?.pedagogicalRemark}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Details & Missing Gaps */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-gray-100 dark:border-[#262626]">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    Ma trận Lỗ hổng kiến thức từng chuyên đề SGK
                  </h3>
                </div>

                <div className="space-y-3">
                  {diagnosticReport.topicDetails?.map((td) => (
                    <div
                      key={td.topicId}
                      className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#202020] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#2878C8] text-white text-xs font-black">
                            {td.topicId}
                          </span>
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {td.topicName}
                          </span>
                          <span className="text-xs text-gray-500">({td.percentage}%)</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {td.specificMissingGaps?.[0] || 'Kiến thức trọng tâm chuyên đề'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onStartTopicQuiz) onStartTopicQuiz(td.topicId, 10);
                          else onNavigateTopic(td.topicId);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#2878C8] text-white font-bold text-xs self-end sm:self-auto shrink-0 shadow-xs hover:bg-[#2068B0] transition-colors"
                      >
                        Luyện 10 câu
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Empty State: Prompt user to take diagnostic */
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-8 sm:p-12 text-center space-y-5 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2878C8] flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Chưa có dữ liệu chẩn đoán năng lực
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Hãy làm bài kiểm tra đánh giá năng lực 28 câu chuẩn ma trận Bộ GD&ĐT để AI phân tích 3 cấp độ tư duy và phát hiện chính xác lỗ hổng kiến thức của bạn.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTakingExam(true)}
                  className="px-6 py-3 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Bắt đầu làm bài thi đánh giá (50 phút)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: BẢN ĐỒ TRI THỨC (11 CHUYÊN ĐỀ GDPT 2018) */}
      {/* ===================================================================== */}
      {activeTab === 'knowledge_map' && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2C2C2C] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-[#262626]">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                Bản đồ tri thức 11 chuyên đề GDPT 2018
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Mức độ thành thạo, tỷ lệ chính xác và bài học bám sát chương trình ôn thi THPT Quốc gia.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value as any)}
                className="px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#333] bg-gray-50 dark:bg-[#222] text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200"
              >
                <option value="all">Tất cả khối lớp</option>
                <option value="12">Lớp 12 (Trọng tâm đề thi)</option>
                <option value="11">Lớp 11</option>
                <option value="10">Lớp 10</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((t) => {
              const isNeedsImp = t.status === 'needs_improvement';
              const isProf = t.status === 'proficient';

              return (
                <div
                  key={t.topicId}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNeedsImp
                      ? 'bg-rose-50/40 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/40'
                      : isProf
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#2878C8] text-white font-black text-xs">
                        {t.topicId}
                      </span>
                      <span className="text-xs font-bold text-gray-500">{t.statusLabel}</span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">
                      {t.topicName}
                    </h4>

                    <div className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Độ chính xác: <strong>{t.percentage}%</strong> ({t.totalCorrect}/{t.totalAnswered} câu)
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-[#2C2C2C] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTopic(t.topicId)}
                      className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#282828] text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
                    >
                      Lý thuyết
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onStartTopicQuiz) onStartTopicQuiz(t.topicId, 10);
                        else onNavigateTopic(t.topicId);
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      Luyện 10 câu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
