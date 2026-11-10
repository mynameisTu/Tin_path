import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  BarChart2,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Classroom, Assignment, UserProfile } from '../../types';
import { exportToGoogleSheets } from '../../services/workspaceService';
import { isDemoUser } from '../../data/demoData';
import { storageService } from '../../services/storageService';

interface TeacherDashboardProps {
  currentTab: string;
  user?: UserProfile;
  classrooms: Classroom[];
  assignments: Assignment[];
  onAddClassroom: (cls: Classroom) => void;
  onAddAssignment: (assign: Assignment) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentTab,
  user,
  classrooms,
  assignments,
  onAddClassroom,
  onAddAssignment,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'classes' | 'assignments' | 'tests' | 'materials' | 'stats'>('overview');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [showCreateAssign, setShowCreateAssign] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [exportingSheet, setExportingSheet] = useState(false);
  const [sheetNotice, setSheetNotice] = useState<string | null>(null);

  // Quick stats
  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentCount, 0);
  const totalSubmissions = assignments.reduce((acc, a) => acc + (a.submissionsCount || 0), 0);
  const completionRate = assignments.length > 0 && totalStudents > 0
    ? `${Math.min(100, Math.round((totalSubmissions / (assignments.length * totalStudents)) * 100))}%`
    : assignments.length > 0 ? '0%' : '—';

  const isDemo = isDemoUser(user) || storageService.isDemoMode();

  // Handle export gradebook to Google Sheets
  const handleExportGradebook = async () => {
    try {
      setExportingSheet(true);
      setSheetNotice(null);
      const headers = ['STT', 'Họ và tên học sinh', 'Lớp', 'Điểm kiểm tra 15p', 'Điểm thi thử', 'Tỷ lệ hoàn thành'];
      const rows = [
        [1, 'Trần Bảo Long', '12 Tin', 9.5, 9.2, '98%'],
        [2, 'Nguyễn Thị Mỹ Duyên', '12 Tin', 8.5, 8.8, '92%'],
        [3, 'Lê Hoàng Nam', '12 Tin', 8.0, 7.5, '85%'],
        [4, 'Nguyễn Văn An', '12 Tin', 8.5, 8.0, '90%'],
        [5, 'Võ Thị Thanh Thảo', '12 Tin', 7.5, 7.0, '80%'],
      ];

      const res = await exportToGoogleSheets(`Bảng điểm Lớp Tin học - ${user?.schoolName || 'THPT'}`, headers, rows);
      setSheetNotice(`Đã xuất thành công sang Google Sheets! Link: ${res.spreadsheetUrl}`);
    } catch (e: any) {
      setSheetNotice(`Không thể xuất Google Sheets: ${e.message}`);
    } finally {
      setExportingSheet(false);
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newClass: Classroom = {
      id: `class_${Date.now()}`,
      name: newClassName.trim(),
      code: `TIN${Math.floor(100 + Math.random() * 900)}`,
      grade: '12',
      schoolName: user?.schoolName || 'THPT Chuyên Lê Khiết',
      teacherId: user?.id || 'teacher_01',
      teacherName: user?.displayName || 'Giáo viên Tin học',
      studentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddClassroom(newClass);
    setNewClassName('');
    setShowCreateClass(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;
    const newAssign: Assignment = {
      id: `assign_${Date.now()}`,
      classroomId: classrooms[0]?.id || 'class_1',
      title: assignTitle.trim(),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      questionCount: 15,
      allowRetake: true,
      status: 'active',
      submissionsCount: 0,
    };
    onAddAssignment(newAssign);
    setAssignTitle('');
    setShowCreateAssign(false);
  };

  return (
    <div className="space-y-6 text-[#202020] dark:text-[#E0E0E0]">
      {/* Teacher Top Bar */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-[#2878C8]" />
              Không Gian Quản Trị Giáo Viên Tin Học
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Quản lý lớp học, giao bài tập, soạn đề kiểm tra ma trận GDPT 2018 và theo dõi tiến độ học sinh
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateClass(true)}
              className="px-4 py-2 rounded-lg bg-[#2878C8] text-white text-sm font-semibold hover:bg-[#2068B0] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Tạo lớp học mới
            </button>
            <button
              onClick={() => setShowCreateAssign(true)}
              className="px-4 py-2 rounded-lg bg-[#202020] dark:bg-white text-white dark:text-[#202020] text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-4 h-4" /> Giao bài tập
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#2C2C2C] flex flex-wrap gap-2 text-sm">
          {[
            { id: 'overview', label: '1. Tổng quan' },
            { id: 'classes', label: '2. Lớp học' },
            { id: 'assignments', label: '3. Bài tập' },
            { id: 'tests', label: '4. Kiểm tra' },
            { id: 'materials', label: '5. Học liệu' },
            { id: 'stats', label: '6. Thống kê & Báo cáo' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                activeSection === sec.id
                  ? 'bg-blue-50 text-[#2878C8] font-bold dark:bg-blue-950 dark:text-blue-300 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: TỔNG QUAN */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Lớp quản lý</span>
              <span className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                {classrooms.length}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Tổng số học sinh</span>
              <span className="text-3xl font-bold text-[#2878C8] tabular-nums">
                {totalStudents}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Bài tập đang giao</span>
              <span className="text-3xl font-bold text-amber-500 tabular-nums">
                {assignments.filter((a) => a.status === 'active').length}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-gray-200 dark:border-[#333] shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Tỷ lệ nộp bài</span>
              <span className="text-3xl font-bold text-[#22A06B] tabular-nums">
                {completionRate}
              </span>
            </div>
          </div>

          {/* Quick lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Classrooms */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Danh sách lớp học trực tuyến
                </h3>
                <span className="text-xs text-gray-500">{classrooms.length} lớp</span>
              </div>

              {classrooms.length === 0 ? (
                <div className="py-8 px-4 rounded-xl border border-dashed border-gray-200 dark:border-[#333] text-center space-y-2.5">
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Chưa có lớp học trực tuyến nào
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Tạo lớp học mới và chia sẻ mã lớp cho học sinh để bắt đầu giao bài tập và theo dõi tiến độ ôn thi GDPT 2018.
                  </p>
                  <button
                    onClick={() => setShowCreateClass(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#2878C8] text-white text-xs font-semibold hover:bg-[#2068B0] transition-colors"
                  >
                    Tạo lớp học ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {classrooms.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] flex items-center justify-between text-sm"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base">{cls.name}</h4>
                        <div className="flex items-center gap-2.5 text-xs text-gray-500 mt-1">
                          <span>Mã tham gia: <strong className="text-[#2878C8]">{cls.code}</strong></span>
                          <span>·</span>
                          <span>{cls.studentCount} học sinh</span>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                        Đang hoạt động
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Students requiring attention */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Học sinh cần hỗ trợ bổ sung
                </h3>
                {isDemo && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium">
                    Minh họa
                  </span>
                )}
              </div>

              {!isDemo && (classrooms.length === 0 || totalStudents === 0) ? (
                <div className="py-8 px-4 rounded-xl border border-dashed border-gray-200 dark:border-[#333] text-center space-y-2">
                  <Users className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Chưa có học sinh cần hỗ trợ
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Hệ thống sẽ tự động phát hiện học sinh bị hổng kiến thức sau khi các em làm bài tập hoặc đề kiểm tra.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base">
                      <span>Lê Hoàng Nam (12 Tin)</span>
                      <span className="text-amber-600">Điểm TB: 6.2đ</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                      Thường trả lời sai dạng câu hỏi đúng/sai chủ đề 12B (Kết nối mạng). Cần giao thêm bài tập luyện tập chuyên đề mạng.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base">
                      <span>Võ Thị Thanh Thảo (12 Tin)</span>
                      <span className="text-amber-600">Điểm TB: 6.5đ</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                      Cần củng cố kiến thức CSDL quan hệ 11F (khóa ngoại, các lệnh SELECT SQL).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LỚP HỌC */}
      {activeSection === 'classes' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quản lý lớp học</h3>
            <button
              onClick={() => setShowCreateClass(true)}
              className="px-4 py-2 rounded-lg bg-[#2878C8] text-white text-sm font-semibold hover:bg-[#2068B0]"
            >
              + Tạo lớp
            </button>
          </div>

          {classrooms.length === 0 ? (
            <div className="py-12 px-4 rounded-xl border border-dashed border-gray-200 dark:border-[#333] text-center space-y-3">
              <Users className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-base">Chưa có lớp học nào</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Bấm "Tạo lớp" để tạo lớp học trực tuyến đầu tiên và chia sẻ mã lớp cho học sinh tham gia.
              </p>
              <button
                onClick={() => setShowCreateClass(true)}
                className="px-4 py-2 rounded-lg bg-[#2878C8] text-white text-xs font-bold hover:bg-[#2068B0] transition-colors"
              >
                + Tạo lớp học ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {classrooms.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] space-y-2.5 text-sm"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">{c.name}</h4>
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 text-[#2878C8] font-bold text-xs">
                      Mã: {c.code}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    Trường: {c.schoolName} · Khối: {c.grade} · Sĩ số: {c.studentCount} học sinh
                  </p>
                  <div className="pt-2 flex gap-2.5">
                    <button className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] text-xs font-semibold hover:bg-white dark:hover:bg-[#333]">
                      Xem danh sách học sinh
                    </button>
                    <button className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#444] text-xs font-semibold hover:bg-white dark:hover:bg-[#333]">
                      Bảng điểm lớp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: BÀI TẬP */}
      {activeSection === 'assignments' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Danh sách bài tập đã giao</h3>
            <button
              onClick={() => setShowCreateAssign(true)}
              className="px-4 py-2 rounded-lg bg-[#2878C8] text-white text-sm font-semibold hover:bg-[#2068B0]"
            >
              + Tạo bài tập mới
            </button>
          </div>

          {assignments.length === 0 ? (
            <div className="py-12 px-4 rounded-xl border border-dashed border-gray-200 dark:border-[#333] text-center space-y-3">
              <FileText className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-base">Chưa có bài tập nào được giao</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Giao bài tập trắc nghiệm theo ma trận GDPT 2018 để học sinh ôn luyện và hệ thống chấm điểm tự động.
              </p>
              <button
                onClick={() => setShowCreateAssign(true)}
                className="px-4 py-2 rounded-lg bg-[#2878C8] text-white text-xs font-bold hover:bg-[#2068B0] transition-colors"
              >
                + Giao bài tập ngay
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#252525] flex items-center justify-between text-sm"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{a.title}</h4>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      Hạn nộp: {a.dueDate} · {a.questionCount} câu hỏi · Đã nộp: {a.submissionsCount} bài
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-blue-100 text-[#2878C8] font-semibold text-xs">
                    Đang diễn ra
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: THỐNG KÊ & XUẤT GOOGLE SHEETS */}
      {activeSection === 'stats' && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <BarChart2 className="w-5 h-5 text-[#2878C8]" />
                Báo cáo Thống kê & Phổ điểm Lớp học
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                Xuất danh sách và kết quả kiểm tra trực tiếp sang Google Sheets
              </p>
            </div>

            <button
              onClick={handleExportGradebook}
              disabled={exportingSheet}
              className="px-5 py-2.5 rounded-xl bg-[#22A06B] text-white text-sm font-bold hover:bg-[#1B8055] transition-colors flex items-center gap-2 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {exportingSheet ? 'Đang xuất Google Sheets...' : 'Xuất bảng điểm sang Google Sheets'}
            </button>
          </div>

          {sheetNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-sm text-emerald-900 dark:text-emerald-200">
              {sheetNotice}
            </div>
          )}

          {!isDemo && (classrooms.length === 0 || totalStudents === 0) ? (
            <div className="p-8 rounded-xl border border-dashed border-gray-200 dark:border-[#333] text-center space-y-2 bg-gray-50 dark:bg-[#252525]">
              <BarChart2 className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Chưa có dữ liệu thống kê từ học sinh
              </p>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Hệ thống sẽ tự động tổng hợp phổ điểm, tỷ lệ Giỏi / Khá / Trung bình ngay khi học sinh trong lớp hoàn thành các bài thi thử hoặc bài tập được giao.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] text-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Phân bố điểm thi thử gần nhất:</h4>
                {isDemo && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium">
                    Dữ liệu minh họa
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                  <span className="text-xs text-gray-500 block mb-1">Giỏi (8.0 - 10.0đ)</span>
                  <span className="font-bold text-emerald-600 text-lg tabular-nums">42%</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                  <span className="text-xs text-gray-500 block mb-1">Khá (6.5 - 7.75đ)</span>
                  <span className="font-bold text-blue-600 text-lg tabular-nums">38%</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                  <span className="text-xs text-gray-500 block mb-1">Trung bình (5.0 - 6.25đ)</span>
                  <span className="font-bold text-amber-600 text-lg tabular-nums">15%</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333]">
                  <span className="text-xs text-gray-500 block mb-1">Dưới 5.0đ</span>
                  <span className="font-bold text-red-600 text-lg tabular-nums">5%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Create Classroom */}
      {showCreateClass && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateClass}
            className="bg-white dark:bg-[#1E1E1E] p-6 sm:p-7 rounded-xl max-w-md w-full border border-gray-200 dark:border-[#333] shadow-2xl text-sm space-y-4"
          >
            <h4 className="font-bold text-base text-gray-900 dark:text-white">Tạo lớp học trực tuyến mới</h4>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Tên lớp học</label>
              <input
                type="text"
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="VD: 12A1 - Luyện đề tốt nghiệp Tin học"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-sm focus:outline-none focus:border-[#2878C8]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateClass(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#444] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#252525]"
              >
                Hủy
              </button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-sm shadow-xs transition-colors">
                Tạo lớp
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Create Assignment */}
      {showCreateAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAssignment}
            className="bg-white dark:bg-[#1E1E1E] p-6 sm:p-7 rounded-xl max-w-md w-full border border-gray-200 dark:border-[#333] shadow-2xl text-sm space-y-4"
          >
            <h4 className="font-bold text-base text-gray-900 dark:text-white">Giao bài tập mới</h4>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Tiêu đề bài tập</label>
              <input
                type="text"
                required
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="VD: 20 câu trắc nghiệm đúng/sai CSDL quan hệ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-white dark:bg-[#121212] text-sm focus:outline-none focus:border-[#2878C8]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateAssign(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#444] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#252525]"
              >
                Hủy
              </button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-[#2878C8] hover:bg-[#2068B0] text-white font-bold text-sm shadow-xs transition-colors">
                Giao bài
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
