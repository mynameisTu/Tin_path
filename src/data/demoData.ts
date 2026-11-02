/**
 * demoData.ts
 * Module chứa dữ liệu mẫu và tài khoản trải nghiệm (Demo Showcase)
 * Được tách biệt hoàn toàn khỏi luồng dữ liệu học tập thật của người dùng.
 * Phục vụ giới thiệu tính năng, trưng bày KHKT và trải nghiệm không cần tạo tài khoản thật.
 */
import { UserProfile, Classroom, Assignment, ExamAttempt } from '../types';

export const DEMO_STUDENT_EMAIL = 'hocsinh@tinpath.edu.vn';
export const DEMO_TEACHER_EMAIL = 'giaovien@tinpath.edu.vn';

/**
 * Kiểm tra xem tài khoản hiện tại có phải là tài khoản trải nghiệm/demo hay không
 */
export function isDemoUser(user?: UserProfile | null): boolean {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();
  return email === DEMO_STUDENT_EMAIL || email === DEMO_TEACHER_EMAIL || user.id.startsWith('demo_');
}

/**
 * Hồ sơ mẫu dành riêng cho chế độ trải nghiệm Học sinh (Demo Student)
 */
export const DEMO_STUDENT_PROFILE: UserProfile = {
  id: 'demo_student_qn',
  email: DEMO_STUDENT_EMAIL,
  displayName: 'Nguyễn Văn An (Trải nghiệm)',
  role: 'student',
  province: 'Quảng Ngãi',
  district: 'TP. Quảng Ngãi',
  schoolId: 'qn_le_khiet',
  schoolName: 'THPT chuyên Lê Khiết',
  grade: '12',
  track: 'CS',
  targetScore: 9.0,
  dailyStudyMinutes: 45,
  xp: 320,
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedDailyToday: false,
  onboardingCompleted: true,
  diagnosticScore: 7.5,
  createdAt: new Date().toISOString(),
};

/**
 * Hồ sơ mẫu dành riêng cho chế độ trải nghiệm Giáo viên (Demo Teacher)
 */
export const DEMO_TEACHER_PROFILE: UserProfile = {
  id: 'demo_teacher_qn',
  email: DEMO_TEACHER_EMAIL,
  displayName: 'Thầy Nguyễn Trọng Bình (Trải nghiệm)',
  role: 'teacher',
  province: 'Quảng Ngãi',
  district: 'TP. Quảng Ngãi',
  schoolId: 'qn_le_khiet',
  schoolName: 'THPT chuyên Lê Khiết',
  grade: '12',
  track: 'CS',
  targetScore: 10,
  dailyStudyMinutes: 60,
  xp: 1250,
  streakDays: 30,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedDailyToday: true,
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
};

/**
 * Lớp học mẫu dùng trong chế độ trải nghiệm Giáo viên
 */
export const DEMO_CLASSROOMS: Classroom[] = [
  {
    id: 'demo_class_12tin1',
    name: '12 Tin Học - Luyện Thi Tốt Nghiệp THPT 2026',
    code: 'TIN12-QN',
    grade: '12',
    schoolName: 'THPT chuyên Lê Khiết',
    teacherId: 'demo_teacher_qn',
    teacherName: 'Thầy Nguyễn Trọng Bình',
    studentCount: 38,
    createdAt: '2025-09-05',
  },
  {
    id: 'demo_class_12a2',
    name: '12A2 - Chuyên đề Định hướng Khoa học máy tính',
    code: 'CS12-LK',
    grade: '12',
    schoolName: 'THPT chuyên Lê Khiết',
    teacherId: 'demo_teacher_qn',
    teacherName: 'Thầy Nguyễn Trọng Bình',
    studentCount: 35,
    createdAt: '2025-09-05',
  },
];

/**
 * Bài tập mẫu dùng trong chế độ trải nghiệm Giáo viên
 */
export const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 'demo_assign_01',
    classroomId: 'demo_class_12tin1',
    title: 'Bài tập tuần: 15 câu trắc nghiệm Kiến trúc Mạng & TCP/IP (GDPT 2018)',
    topicId: '12B',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    questionCount: 15,
    allowRetake: true,
    status: 'active',
    submissionsCount: 29,
  },
  {
    id: 'demo_assign_02',
    classroomId: 'demo_class_12tin1',
    title: 'Kiểm tra 15 phút: Cú pháp SQL và Mô hình CSDL quan hệ',
    topicId: '11F',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    questionCount: 10,
    allowRetake: false,
    status: 'active',
    submissionsCount: 18,
  },
];

/**
 * Lịch sử thi mẫu dùng trong chế độ trải nghiệm Học sinh
 */
export const DEMO_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'demo_attempt_01',
    examId: 'thpt_le_khiet_2026',
    examTitle: 'Đề thi thử THPT 2026 - Chuyên Lê Khiết',
    userId: 'demo_student_qn',
    track: 'CS',
    startedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    durationSeconds: 2700,
    totalScore: 8.5,
    part1Score: 5.5,
    part2Score: 3.0,
    correctPart1Count: 22,
    part2Breakdown: [
      { questionId: 'thuxa_p2_c1', correctStatementsCount: 4, scoreAwarded: 1.0 },
      { questionId: 'thuxa_p2_c2', correctStatementsCount: 3, scoreAwarded: 0.5 },
      { questionId: 'thuxa_p2_c3_cs', correctStatementsCount: 3, scoreAwarded: 0.5 },
      { questionId: 'thuxa_p2_c4_cs', correctStatementsCount: 4, scoreAwarded: 1.0 },
    ],
    answers: {},
    xpEarned: 85,
  },
];

/**
 * Danh sách sinh viên tiêu biểu mô phỏng VNOI Showcase (chỉ dùng khi minh họa)
 */
export const DEMO_VNOI_STUDENTS = [
  {
    rank: 1,
    username: 'fextivity',
    fullName: 'Trần Xuân Bách',
    schoolName: 'THPT chuyên Lê Khiết',
    rating: 3236,
    score: 88.18,
    problemsSolved: 332,
    isCurrentUser: false,
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
    title: 'Kiện tướng Olympic',
  },
  {
    rank: 2,
    username: 'hollwo_pelw',
    fullName: 'Phạm Quốc Hùng',
    schoolName: 'THPT Trần Quốc Tuấn',
    rating: 2814,
    score: 44.60,
    problemsSolved: 139,
    isCurrentUser: false,
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=c0aede',
    title: 'Cao thủ Bậc 1',
  },
  {
    rank: 3,
    username: 'Hollowed',
    fullName: 'Lê Bảo Anh',
    schoolName: 'THPT Bình Sơn',
    rating: 2785,
    score: 66.56,
    problemsSolved: 110,
    isCurrentUser: false,
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc',
    title: 'Tinh anh Bậc 2',
  },
  {
    rank: 4,
    username: 'marvinthang',
    fullName: 'Nguyễn Đức Thắng',
    schoolName: 'THPT Ba Gia',
    rating: 2759,
    score: 148.46,
    problemsSolved: 1059,
    isCurrentUser: false,
    hasFlame: true,
  },
  {
    rank: 5,
    username: 'BaoJiaoPisu',
    fullName: 'Lê Ngọc Bảo Anh',
    schoolName: 'THPT Số 1 Tư Nghĩa',
    rating: 2745,
    score: 98.13,
    problemsSolved: 334,
    isCurrentUser: false,
  },
];
