/**
 * supabaseDbService.ts
 * Thay thế hoàn toàn storageService.ts (localStorage) bằng Supabase PostgreSQL
 * Hỗ trợ chế độ dự phòng: nếu chưa cấu hình Supabase → fallback sang localStorage
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  UserProfile,
  ExamAttempt,
  XPTransaction,
  Classroom,
  Assignment,
  ExamComment,
  StudyRoadmapItem,
  Exam,
} from '../types';
import { OFFICIAL_EXAMS } from '../data/officialExamsData';

// ---------------------------------------------------------------------------
// FALLBACK: Đọc/Ghi localStorage (dùng khi chưa cấu hình Supabase)
// ---------------------------------------------------------------------------
const LS = {
  get: <T>(key: string): T | null => {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  },
  set: <T>(key: string, val: T) => {
    localStorage.setItem(key, JSON.stringify(val));
  },
};

const STORAGE_KEYS = {
  USER_PROFILE: 'tinpath_user_profile',
  EXAM_ATTEMPTS: 'tinpath_exam_attempts',
  XP_TRANSACTIONS: 'tinpath_xp_transactions',
  CLASSROOMS: 'tinpath_classrooms',
  ASSIGNMENTS: 'tinpath_assignments',
  COMMENTS: 'tinpath_exam_comments',
};

// ---------------------------------------------------------------------------
// PROFILE — Lấy hồ sơ người dùng hiện tại
// ---------------------------------------------------------------------------
export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return LS.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  // Map snake_case DB → camelCase TypeScript
  return mapDbProfileToLocal(data);
}

export async function updateProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const current = LS.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    if (current) LS.set(STORAGE_KEYS.USER_PROFILE, { ...current, ...updates });
    return true;
  }

  // Loại trừ các trường đặc quyền (role, email, xp) khỏi payload client update
  const safePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.displayName !== undefined) safePayload.display_name = updates.displayName;
  if (updates.avatarUrl !== undefined) safePayload.avatar_url = updates.avatarUrl;
  if (updates.schoolId !== undefined) safePayload.school_id = updates.schoolId;
  if (updates.schoolName !== undefined) safePayload.school_name = updates.schoolName;
  if (updates.district !== undefined) safePayload.district = updates.district;
  if (updates.grade !== undefined) safePayload.grade = updates.grade;
  if (updates.track !== undefined) safePayload.track = updates.track;
  if (updates.targetScore !== undefined) safePayload.target_score = updates.targetScore;
  if (updates.dailyStudyMinutes !== undefined) safePayload.daily_study_minutes = updates.dailyStudyMinutes;
  if (updates.streakDays !== undefined) safePayload.streak_days = updates.streakDays;
  if (updates.lastActiveDate !== undefined) safePayload.last_active_date = updates.lastActiveDate;
  if (updates.completedDailyToday !== undefined) safePayload.completed_daily_today = updates.completedDailyToday;
  if (updates.onboardingCompleted !== undefined) safePayload.onboarding_completed = updates.onboardingCompleted;
  if (updates.diagnosticScore !== undefined) safePayload.diagnostic_score = updates.diagnosticScore;

  const { error } = await supabase
    .from('profiles')
    .update(safePayload)
    .eq('id', userId);

  if (error) {
    console.warn('Lỗi cập nhật hồ sơ Supabase:', error.message);
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// EXAM ATTEMPTS — Lưu và lấy lịch sử thi
// ---------------------------------------------------------------------------
function isUuid(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export async function saveExamAttempt(attempt: ExamAttempt): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const existing = LS.get<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS) || [];
    LS.set(STORAGE_KEYS.EXAM_ATTEMPTS, [...existing, attempt]);
    return true;
  }

  try {
    let effectiveUserId = attempt.userId;
    if (!isUuid(effectiveUserId)) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        effectiveUserId = user.id;
      } else {
        console.warn('Không thể lưu exam_attempt vào Supabase: Người dùng chưa đăng nhập tài khoản Supabase thật.');
        return false;
      }
    }

    const payload: any = {
      exam_id: attempt.examId,
      exam_title: attempt.examTitle,
      user_id: effectiveUserId,
      track: attempt.track,
      started_at: attempt.startedAt,
      submitted_at: attempt.submittedAt,
      duration_seconds: attempt.durationSeconds,
      total_score: attempt.totalScore,
      part1_score: attempt.part1Score,
      part2_score: attempt.part2Score,
      correct_part1_count: attempt.correctPart1Count,
      part2_breakdown: attempt.part2Breakdown,
      answers: attempt.answers,
      xp_earned: attempt.xpEarned,
    };

    if (isUuid(attempt.id)) {
      payload.id = attempt.id;
    }

    const { error } = await supabase.from('exam_attempts').insert(payload);
    if (error) {
      console.warn('Lỗi lưu exam_attempt vào Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveExamAttempt exception:', err);
    return false;
  }
}

/**
 * Nộp bài thi trực tiếp cho Server RPC để chấm điểm và cấp XP an toàn
 * Không làm lộ đáp án và chống can thiệp điểm từ phía browser
 */
export async function submitExamAttemptSecure(params: {
  examId: string;
  track: 'CS' | 'ICT';
  startedAt: string;
  answers: Record<string, any>;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Chưa cấu hình Supabase' };
  }
  try {
    const { data, error } = await supabase.rpc('submit_exam_attempt_secure', {
      p_exam_id: params.examId,
      p_track: params.track,
      p_started_at: params.startedAt,
      p_answers: params.answers,
    });
    if (error) {
      console.warn('submit_exam_attempt_secure RPC error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('submitExamAttemptSecure exception:', err);
    return { success: false, error: err?.message || 'Lỗi kết nối RPC' };
  }
}

export async function getExamAttempts(userId: string): Promise<ExamAttempt[]> {
  if (!isSupabaseConfigured()) {
    return (LS.get<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS) || [])
      .filter(a => a.userId === userId);
  }

  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error || !data) return [];

  return data.map(mapDbAttemptToLocal);
}

// ---------------------------------------------------------------------------
// XP TRANSACTIONS — Ghi điểm thưởng
// ---------------------------------------------------------------------------
export async function addXPTransaction(tx: XPTransaction): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const existing = LS.get<XPTransaction[]>(STORAGE_KEYS.XP_TRANSACTIONS) || [];
    LS.set(STORAGE_KEYS.XP_TRANSACTIONS, [...existing, tx]);
    return true;
  }

  const { error } = await supabase.from('xp_transactions').insert({
    id: tx.id,
    user_id: tx.userId,
    amount: tx.amount,
    source: tx.source,
    description: tx.description,
    created_at: tx.timestamp,
  });

  return !error;
}

// ---------------------------------------------------------------------------
// LEADERBOARD — Bảng xếp hạng thật theo trường, huyện hoặc toàn tỉnh
// ---------------------------------------------------------------------------
export async function getLeaderboard(filter?: {
  scope: 'school' | 'district' | 'province';
  value: string;
}): Promise<{ rank: number; name: string; schoolName: string; district: string; xp: number; streak: number; isCurrentUser: boolean }[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  let query = supabase
    .from('leaderboard_public')
    .select('id, display_name, school_name, district, xp, streak_days')
    .order('xp', { ascending: false })
    .limit(50);

  if (filter?.scope === 'school') {
    query = query.eq('school_name', filter.value);
  } else if (filter?.scope === 'district') {
    query = query.eq('district', filter.value);
  }

  const { data, error } = await query;
  if (error || !data) {
    if (error) console.warn('Lỗi truy vấn leaderboard_public:', error.message);
    return [];
  }

  const { data: { user } } = await supabase.auth.getUser();

  return data.map((row, idx) => ({
    rank: idx + 1,
    name: row.display_name,
    schoolName: row.school_name || '',
    district: row.district || '',
    xp: row.xp,
    streak: row.streak_days,
    isCurrentUser: row.id === user?.id,
  }));
}

// ---------------------------------------------------------------------------
// COMMENTS — Bình luận đề thi
// ---------------------------------------------------------------------------
export async function getExamComments(examId: string): Promise<ExamComment[]> {
  if (!isSupabaseConfigured()) {
    return (LS.get<ExamComment[]>(STORAGE_KEYS.COMMENTS) || [])
      .filter(c => c.examId === examId);
  }

  const { data, error } = await supabase
    .from('exam_comments')
    .select('*')
    .eq('exam_id', examId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    examId: row.exam_id,
    examTitle: '',
    userId: row.user_id,
    userName: row.user_name,
    userSchool: row.user_school || '',
    content: row.content,
    createdAt: row.created_at,
    likes: row.likes,
  }));
}

export async function addExamComment(comment: ExamComment): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const existing = LS.get<ExamComment[]>(STORAGE_KEYS.COMMENTS) || [];
    LS.set(STORAGE_KEYS.COMMENTS, [comment, ...existing]);
    return true;
  }

  const { error } = await supabase.from('exam_comments').insert({
    exam_id: comment.examId,
    user_id: comment.userId,
    user_name: comment.userName,
    user_school: comment.userSchool,
    content: comment.content,
  });

  return !error;
}

// ---------------------------------------------------------------------------
// CLASSROOMS — Lớp học giáo viên
// ---------------------------------------------------------------------------
export async function getTeacherClassrooms(teacherId: string): Promise<Classroom[]> {
  if (!isSupabaseConfigured()) {
    return (LS.get<Classroom[]>(STORAGE_KEYS.CLASSROOMS) || [])
      .filter(c => c.teacherId === teacherId);
  }

  const { data, error } = await supabase
    .from('classrooms')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    code: row.code,
    grade: row.grade,
    schoolName: row.school_name,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    studentCount: row.student_count,
    createdAt: row.created_at,
  }));
}

export async function saveClassroom(cls: Classroom): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }
  try {
    let teacherId = cls.teacherId;
    if (!isUuid(teacherId)) {
      const { data: { user } } = await supabase.auth.getUser();
      teacherId = user?.id || '';
    }

    const payload: any = {
      id: cls.id,
      name: cls.name,
      code: cls.code,
      grade: cls.grade,
      school_name: cls.schoolName,
      teacher_name: cls.teacherName,
      student_count: cls.studentCount || 0,
    };
    if (isUuid(teacherId)) {
      payload.teacher_id = teacherId;
    }

    const { error } = await supabase.from('classrooms').upsert(payload);
    if (error) {
      console.warn('Lỗi lưu classroom vào Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveClassroom exception:', err);
    return false;
  }
}

export async function saveAssignment(asg: Assignment): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }
  try {
    const { error } = await supabase.from('assignments').upsert({
      id: asg.id,
      classroom_id: asg.classroomId,
      title: asg.title,
      topic_id: asg.topicId,
      due_date: asg.dueDate,
      question_count: asg.questionCount,
      allow_retake: asg.allowRetake,
      status: asg.status || 'active',
    });
    if (error) {
      console.warn('Lỗi lưu assignment vào Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveAssignment exception:', err);
    return false;
  }
}

export async function recordDailyChallengeAttempt(params: {
  userId: string;
  score: number;
  totalQuestions?: number;
  correctCount: number;
  xpAwarded?: number;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    // 1. Ưu tiên gọi RPC submit_daily_challenge_secure để tính điểm & cấp XP chuẩn phía server
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_daily_challenge_secure', {
      p_correct_count: params.correctCount,
      p_score: params.score,
      p_total_questions: params.totalQuestions || 10,
    });

    if (!rpcError && rpcData?.success) {
      return true;
    }

    // 2. Dự phòng: Ghi nhận trực tiếp bảng daily_challenge_attempts nếu RPC không khả dụng
    let effectiveUserId = params.userId;
    if (!isUuid(effectiveUserId)) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) effectiveUserId = user.id;
      else return false;
    }

    const { error } = await supabase.from('daily_challenge_attempts').upsert({
      user_id: effectiveUserId,
      challenge_date: new Date().toISOString().split('T')[0],
      score: params.score,
      total_questions: params.totalQuestions || 10,
      correct_count: params.correctCount,
      xp_awarded: params.xpAwarded || 30,
    }, { onConflict: 'user_id,challenge_date' });

    if (error) {
      console.warn('Lỗi ghi daily_challenge_attempt vào Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('recordDailyChallengeAttempt exception:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// EXAMS — Lấy danh sách đề thi chính thức từ Supabase (fallback: OFFICIAL_EXAMS)
// Sử dụng view bảo mật exam_questions_public không làm lộ đáp án / lời giải
// ---------------------------------------------------------------------------
export async function getExams(): Promise<Exam[]> {
  if (!isSupabaseConfigured()) {
    return OFFICIAL_EXAMS;
  }
  try {
    const { data: dbExams, error } = await supabase
      .from('exams')
      .select('*')
      .order('year', { ascending: false });

    if (error || !dbExams || dbExams.length === 0) {
      if (error) console.warn('Lỗi truy vấn exams:', error.message);
      return OFFICIAL_EXAMS;
    }

    // Truy vấn view an toàn exam_questions_public (ẩn correct_answer và isCorrect)
    const { data: dbQuestions, error: qErr } = await supabase
      .from('exam_questions_public')
      .select('*');

    if (qErr || !dbQuestions || dbQuestions.length === 0) {
      if (qErr) console.warn('Lỗi truy vấn exam_questions_public:', qErr.message);
      return OFFICIAL_EXAMS;
    }

    return dbExams.map(ex => {
      const examQs = dbQuestions.filter(q => q.exam_id === ex.id);
      const part1 = examQs
        .filter(q => q.type === 'single_choice')
        .map(q => ({
          id: q.id,
          type: 'single_choice' as const,
          topicId: q.topic_id,
          topicName: q.topic_name || '',
          level: q.level,
          content: q.content,
          options: q.options || {},
          correctAnswer: q.correct_answer,
          explanation: q.explanation || null,
          codeSnippet: q.code_snippet,
        }));

      const part2 = examQs
        .filter(q => q.type === 'true_false_group')
        .map(q => ({
          id: q.id,
          type: 'true_false_group' as const,
          topicId: q.topic_id,
          topicName: q.topic_name || '',
          level: q.level,
          trackRequirement: q.track_requirement,
          context: q.content,
          statements: q.statements || [],
          codeSnippet: q.code_snippet,
          tableData: q.table_data,
        }));

      const fallback = OFFICIAL_EXAMS.find(e => e.id === ex.id);
      return {
        id: ex.id,
        title: ex.title,
        source: ex.source,
        durationMinutes: ex.duration_minutes,
        year: ex.year,
        difficulty: ex.difficulty,
        description: ex.description || '',
        baseXP: ex.base_xp || 100,
        totalScore: 10 as const,
        part1Questions: part1.length > 0 ? part1 : (fallback?.part1Questions || []),
        part2Questions: part2.length > 0 ? part2 : (fallback?.part2Questions || []),
      };
    });
  } catch (err) {
    console.warn('Supabase getExams fallback to local:', err);
    return OFFICIAL_EXAMS;
  }
}

// ---------------------------------------------------------------------------
// MAPPER FUNCTIONS — DB snake_case → TypeScript camelCase
// ---------------------------------------------------------------------------
function mapDbProfileToLocal(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    province: row.province || 'Quảng Ngãi',
    district: row.district || '',
    schoolId: row.school_id || '',
    schoolName: row.school_name || '',
    grade: row.grade || '12',
    track: row.track || 'CS',
    targetScore: Number(row.target_score) || 8.5,
    dailyStudyMinutes: row.daily_study_minutes || 45,
    xp: row.xp || 0,
    streakDays: row.streak_days || 0,
    lastActiveDate: row.last_active_date || new Date().toISOString().split('T')[0],
    completedDailyToday: row.completed_daily_today || false,
    onboardingCompleted: row.onboarding_completed || false,
    diagnosticScore: row.diagnostic_score ? Number(row.diagnostic_score) : undefined,
    createdAt: row.created_at,
  };
}

function mapDbAttemptToLocal(row: any): ExamAttempt {
  return {
    id: row.id,
    examId: row.exam_id,
    examTitle: row.exam_title,
    userId: row.user_id,
    track: row.track,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
    durationSeconds: row.duration_seconds,
    totalScore: Number(row.total_score),
    part1Score: Number(row.part1_score),
    part2Score: Number(row.part2_score),
    correctPart1Count: row.correct_part1_count,
    part2Breakdown: row.part2_breakdown || [],
    answers: row.answers || {},
    xpEarned: row.xp_earned || 0,
  };
}
