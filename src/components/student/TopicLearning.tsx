import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle,
  Circle,
  Code,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Share2,
  FileText,
  CheckCircle2,
  Layers,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Edit3,
  Trophy,
  HelpCircle,
  Sparkles,
  Bookmark,
  Target,
  BarChart2,
  Compass,
  RotateCcw,
  Award,
  List,
  ShieldCheck,
  Cpu,
  Network,
  Database,
  Globe,
  Binary,
  Terminal,
  Image as ImageIcon,
  ZoomIn,
  X,
  LayoutGrid,
  Filter,
  GraduationCap,
  Clock,
  ChevronDown,
  BookMarked
} from 'lucide-react';
import { SubjectTopicId } from '../../types';
import { TOPIC_LESSONS, TopicLesson, PracticeQuizQuestion } from '../../data/topicsData';

interface TopicLearningProps {
  initialTopicId?: SubjectTopicId;
  completedTopics: Record<SubjectTopicId, boolean>;
  onToggleCompleteTopic: (topicId: SubjectTopicId) => void;
  onPracticeTopicQuiz: (topicId: SubjectTopicId) => void;
  onOpenLeaderboard?: () => void;
}

/**
 * Topic Visual Illustration Component
 * Renders tailored diagrams/visual charts for each topic
 */
const TopicIllustration: React.FC<{ topicId: SubjectTopicId }> = ({ topicId }) => {
  if (topicId === '12A') {
    return (
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4 text-sm font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider">
          <Cpu className="w-5 h-5" /> Sơ đồ minh hoạ: 5 Đặc trưng cốt lõi của Trí tuệ Nhân tạo (AI)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {[
            { title: '1. Khả năng Học', sub: 'Trích rút tri thức từ dữ liệu lớn (Dịch tự động, OCR)', color: 'bg-blue-100/90 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200' },
            { title: '2. Khả năng Suy luận', sub: 'Quy tắc logic NẾU-THÌ (Hệ chuyên gia MYCIN)', color: 'bg-indigo-100/90 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200' },
            { title: '3. Khả năng Nhận thức', sub: 'Cảm nhận qua sensor, LiDAR, camera (Xe tự lái)', color: 'bg-sky-100/90 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200' },
            { title: '4. Hiểu Ngôn ngữ', sub: 'NLP đàm thoại tự nhiên (Siri, Google Assistant)', color: 'bg-cyan-100/90 text-cyan-900 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200' },
            { title: '5. Giải quyết Vấn đề', sub: 'Tối ưu hóa tình huống phức tạp (Xếp thời khóa biểu)', color: 'bg-violet-100/90 text-violet-900 border-violet-300 dark:bg-violet-950 dark:text-violet-200' }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.color} shadow-xs flex flex-col justify-between gap-2`}>
              <div className="font-bold text-sm sm:text-base leading-snug">{item.title}</div>
              <div className="text-xs sm:text-[13px] opacity-80 leading-snug">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topicId === '12B') {
    return (
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50/70 via-sky-50/50 to-indigo-50/70 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-sm font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider">
          <Network className="w-5 h-5" /> Mô hình cấu trúc mạng LAN kết nối Internet qua Router & Switch
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white/90 dark:bg-[#1A1A1A] rounded-xl border border-blue-100 dark:border-blue-900/30 text-sm text-center font-medium">
          <div className="px-4 py-3 rounded-lg bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 font-bold border border-sky-200/60 dark:border-sky-900/50 shrink-0">
            Internet toàn cầu (WAN)
          </div>
          <ArrowRight className="w-5 h-5 text-[#2878C8] rotate-90 sm:rotate-0 shrink-0" />
          <div className="px-4 py-3 rounded-lg bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-900/50 shrink-0">
            Modem & Router (Định tuyến IP)
          </div>
          <ArrowRight className="w-5 h-5 text-[#2878C8] rotate-90 sm:rotate-0 shrink-0" />
          <div className="px-4 py-3 rounded-lg bg-blue-100 text-[#2878C8] dark:bg-blue-950 dark:text-[#60A5FA] font-bold border border-blue-200/60 dark:border-blue-900/50 shrink-0">
            Switch (Chuyển mạch MAC)
          </div>
          <ArrowRight className="w-5 h-5 text-[#2878C8] rotate-90 sm:rotate-0 shrink-0" />
          <div className="grid grid-cols-2 gap-2.5">
            <div className="px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#333] font-medium text-sm text-gray-800 dark:text-gray-200">
              Máy trạm PC / Laptop (LAN)
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50 font-medium text-sm">
              Access Point (Wi-Fi WLAN)
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '12D') {
    return (
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4 text-sm font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" /> Nguyên tắc 5 KHÔNG ứng xử nhân văn & Tuân thủ Luật An ninh mạng
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
            <span className="font-bold block text-sm sm:text-base mb-1">1. KHÔNG tung tin giả</span>
            <span className="text-xs sm:text-[13px] opacity-80 leading-snug">Chỉ chia sẻ tin từ nguồn kiểm chứng</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
            <span className="font-bold block text-sm sm:text-base mb-1">2. KHÔNG mạo danh</span>
            <span className="text-xs sm:text-[13px] opacity-80 leading-snug">Cảnh giác bẫy lừa đảo Deepfake</span>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300">
            <span className="font-bold block text-sm sm:text-base mb-1">3. KHÔNG quấy rối</span>
            <span className="text-xs sm:text-[13px] opacity-80 leading-snug">Chấm dứt bạo lực mạng, châm chọc</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span className="font-bold block text-sm sm:text-base mb-1">4. KHÔNG lộ dữ liệu</span>
            <span className="text-xs sm:text-[13px] opacity-80 leading-snug">Bảo mật mật khẩu và CCCD</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="font-bold block text-sm sm:text-base mb-1">5. LAN TOẢ điều tốt</span>
            <span className="text-xs sm:text-[13px] opacity-80 leading-snug">Ủng hộ thiện nguyện, việc tử tế</span>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '12F') {
    return (
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4 text-sm font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider">
          <Globe className="w-5 h-5" /> Mô hình hộp CSS Box Model (4 Lớp từ ngoài vào trong)
        </div>
        <div className="p-4 rounded-xl bg-amber-100/70 border border-amber-300 text-center font-bold text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Margin (Khoảng cách lề ngoài ngăn cách các phần tử lân cận)
          <div className="p-3.5 my-2 rounded-lg bg-emerald-100/80 border border-emerald-400 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200">
            Border (Đường viền bao bọc phần tử)
            <div className="p-3 my-2 rounded-md bg-sky-100 border border-sky-300 text-sky-950 dark:bg-sky-950/70 dark:text-sky-200">
              Padding (Vùng đệm bên trong đường viền)
              <div className="p-2.5 my-1.5 rounded bg-blue-600 text-white font-black text-sm shadow-xs">
                Content (Nội dung văn bản, hình ảnh)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '11F') {
    return (
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4 text-sm font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider">
          <Database className="w-5 h-5" /> Liên kết CSDL Quan hệ: Khoá chính (Primary Key) và Khoá ngoại (Foreign Key)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-blue-200 dark:border-[#333]">
            <div className="font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1.5">
              <span>BẢNG LỚP (Bảng Cha)</span>
            </div>
            <div className="text-[11.5px] p-2 bg-blue-50/50 dark:bg-blue-950/30 rounded border border-blue-100 dark:border-blue-900/30">
              <div>🔑 <strong className="text-blue-800 dark:text-blue-300">MaLop</strong> (Khoá chính)</div>
              <div className="text-gray-600 dark:text-gray-400">· TenLop, GiaoVienCN</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-indigo-200 dark:border-[#333]">
            <div className="font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
              <span>BẢNG HỌC SINH (Bảng Con)</span>
            </div>
            <div className="text-[11.5px] p-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded border border-indigo-100 dark:border-indigo-900/30">
              <div>🔑 <strong>MaHS</strong> (Khoá chính)</div>
              <div>🔗 <strong className="text-indigo-800 dark:text-indigo-300">MaLop</strong> (Khoá ngoại tham chiếu)</div>
              <div className="text-gray-600 dark:text-gray-400">· HoTen, NgaySinh, Diem</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '11F_CS') {
    return (
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-[#1A2333] dark:via-[#151D2A] dark:to-[#1E1E2E] border border-blue-200/80 dark:border-blue-900/40 my-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4 text-sm font-bold text-[#2878C8] dark:text-[#60A5FA] uppercase tracking-wider">
          <Binary className="w-5 h-5" /> So sánh độ phức tạp thuật toán tìm kiếm và sắp xếp
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200">
            <span className="font-bold block text-base sm:text-lg mb-1">O(log n)</span>
            <span className="text-xs sm:text-[13px] leading-snug">Tìm kiếm nhị phân (Chia đôi mảng đã sắp xếp)</span>
          </div>
          <div className="p-4 rounded-xl bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950 dark:text-blue-200">
            <span className="font-bold block text-base sm:text-lg mb-1">O(n)</span>
            <span className="text-xs sm:text-[13px] leading-snug">Tìm kiếm tuần tự (Duyệt lần lượt từ đầu)</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200">
            <span className="font-bold block text-base sm:text-lg mb-1">O(n log n)</span>
            <span className="text-xs sm:text-[13px] leading-snug">Sắp xếp tối ưu (Merge Sort, Quick Sort)</span>
          </div>
          <div className="p-4 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-200">
            <span className="font-bold block text-base sm:text-lg mb-1">O(n²)</span>
            <span className="text-xs sm:text-[13px] leading-snug">Sắp xếp nổi bọt, chèn, chọn</span>
          </div>
        </div>
      </div>
    );
  }

  if (topicId === '10_PYTHON') {
    return (
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-[#0D1F1A] dark:via-[#0F1B2A] dark:to-[#111A24] border border-emerald-200/80 dark:border-emerald-900/40 my-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4 text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          <Terminal className="w-5 h-5" /> Sơ đồ 6 Trụ cột Nền tảng của Lập trình Python (Lớp 10 & Note Ôn tập)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-4 rounded-xl bg-emerald-100/90 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 shadow-xs flex flex-col justify-between gap-2">
            <span className="font-bold block text-sm sm:text-base">1. Kiểu dữ liệu</span>
            <span className="text-xs sm:text-[13px] opacity-85 leading-snug">int, float, str, bool & ép kiểu type casting</span>
          </div>
          <div className="p-4 rounded-xl bg-blue-100/90 text-blue-900 border border-blue-300 dark:bg-blue-950 dark:text-blue-200 shadow-xs flex flex-col justify-between gap-2">
            <span className="font-bold block text-sm sm:text-base">2. Toán tử</span>
            <span className="text-xs sm:text-[13px] opacity-85 leading-snug">// chia nguyên, % chia dư, ** mũ, gán +=</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-100/90 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 shadow-xs flex flex-col justify-between gap-2">
            <span className="font-bold block text-sm sm:text-base">3. Rẽ nhánh</span>
            <span className="text-xs sm:text-[13px] opacity-85 leading-snug">if - elif - else, thụt lề 4 spaces, ATM</span>
          </div>
          <div className="p-4 rounded-xl bg-purple-100/90 text-purple-900 border border-purple-300 dark:bg-purple-950 dark:text-purple-200 shadow-xs flex flex-col justify-between gap-2">
            <span className="font-bold block text-sm sm:text-base">4. Cấu trúc lặp</span>
            <span className="text-xs sm:text-[13px] opacity-85 leading-snug">for range(), while, break, in hình sao</span>
          </div>
          <div className="p-4 rounded-xl bg-cyan-100/90 text-cyan-900 border border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200 shadow-xs flex flex-col justify-between gap-2">
            <span className="font-bold block text-sm sm:text-base">5. List & Dict</span>
            <span className="text-xs sm:text-[13px] opacity-85 leading-snug">Index âm [-1], Slicing [:], Dict Key-Value</span>
          </div>
          <div className="p-4 rounded-xl bg-rose-100/90 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-200 shadow-xs flex flex-col justify-between gap-2">
            <span className="font-bold block text-sm sm:text-base">6. Hàm & Big-O</span>
            <span className="text-xs sm:text-[13px] opacity-85 leading-snug">def ... return, SNT, cấp số cộng O(1)</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const formatMultiline = (text?: string): string => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n');
};

const FormattedTextContent: React.FC<{
  content?: string;
  className?: string;
}> = ({ content, className = '' }) => {
  if (!content) return null;
  const normalized = content.replace(/\\n/g, '\n');
  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <div className={`space-y-3.5 ${className}`}>
      {lines.map((line, idx) => {
        // Case 1: Bullet point starting with • or - or *
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          const rawText = line.replace(/^[•\-\*]\s*/, '');
          const colonMatch = rawText.match(/^([^:]{2,50}):\s*(.*)$/);
          if (colonMatch) {
            const [, title, desc] = colonMatch;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] sm:leading-[1.8]"
              >
                <span className="w-2 h-2 rounded-full bg-[#2878C8] shrink-0 mt-2 shadow-2xs" />
                <div className="flex-1">
                  <strong className="font-bold text-gray-950 dark:text-white mr-1.5">{title}:</strong>
                  <span>{desc}</span>
                </div>
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="flex items-start gap-3 text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] sm:leading-[1.8]"
            >
              <span className="w-2 h-2 rounded-full bg-[#2878C8] shrink-0 mt-2 shadow-2xs" />
              <div className="flex-1">{rawText}</div>
            </div>
          );
        }

        // Case 2: Numbered item starting with 1. 2. 3.
        const numMatch = line.match(/^(\d+)\.\s*(.*)$/);
        if (numMatch) {
          const [, num, itemContent] = numMatch;
          const colonMatch = itemContent.match(/^([^:]{2,50}):\s*(.*)$/);
          if (colonMatch) {
            const [, title, desc] = colonMatch;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-gray-50/80 dark:bg-[#232323] border border-gray-150 dark:border-[#303030] flex items-start gap-3 text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] sm:leading-[1.8] shadow-2xs transition-colors hover:border-[#2878C8]/30"
              >
                <span className="w-6 h-6 rounded-lg bg-blue-100/90 dark:bg-blue-950/80 text-[#2878C8] dark:text-[#60A5FA] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {num}
                </span>
                <div className="flex-1">
                  <strong className="font-bold text-gray-950 dark:text-white mr-1.5">{title}:</strong>
                  <span>{desc}</span>
                </div>
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl bg-gray-50/80 dark:bg-[#232323] border border-gray-150 dark:border-[#303030] flex items-start gap-3 text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] sm:leading-[1.8] shadow-2xs transition-colors hover:border-[#2878C8]/30"
            >
              <span className="w-6 h-6 rounded-lg bg-blue-100/90 dark:bg-blue-950/80 text-[#2878C8] dark:text-[#60A5FA] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                {num}
              </span>
              <div className="flex-1">{itemContent}</div>
            </div>
          );
        }

        // Case 3: Action steps like "Bước 1:", "Bước 2:"
        const stepMatch = line.match(/^(Bước\s*\d+):\s*(.*)$/i);
        if (stepMatch) {
          const [, stepLabel, stepContent] = stepMatch;
          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-900/40 flex items-start gap-3 text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] shadow-2xs"
            >
              <span className="px-2.5 py-0.5 rounded-md bg-[#2878C8] text-white font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                {stepLabel}
              </span>
              <div className="flex-1">{stepContent}</div>
            </div>
          );
        }

        // Case 4: Standard paragraph with generous line-height
        return (
          <p
            key={idx}
            className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] sm:leading-[1.8]"
          >
            {line}
          </p>
        );
      })}
    </div>
  );
};

const LessonImageViewer: React.FC<{
  imageUrl?: string;
  imageCaption?: string;
  images?: { url: string; caption?: string; alt?: string }[];
  onOpenPreview: (url: string, caption?: string) => void;
}> = ({ imageUrl, imageCaption, images, onOpenPreview }) => {
  const allImages = images && images.length > 0
    ? images
    : imageUrl
      ? [{ url: imageUrl, caption: imageCaption }]
      : [];

  if (allImages.length === 0) return null;

  return (
    <div className={`my-4 ${allImages.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'max-w-2xl mx-auto'}`}>
      {allImages.map((img, idx) => (
        <figure
          key={idx}
          className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A] shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div
            onClick={() => onOpenPreview(img.url, img.caption)}
            className="cursor-zoom-in relative overflow-hidden bg-gray-50 dark:bg-[#151515] flex items-center justify-center min-h-[180px] p-2"
          >
            <img
              src={img.url}
              alt={img.caption || 'Hình ảnh minh họa bài học'}
              loading="lazy"
              className="w-full max-h-[380px] object-contain transition-transform duration-300 group-hover:scale-[1.02] rounded-lg"
            />
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center gap-1.5 text-xs font-medium">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Phóng to</span>
            </div>
          </div>
          {img.caption && (
            <figcaption className="p-3 bg-gray-50/90 dark:bg-[#202020] border-t border-gray-100 dark:border-[#2C2C2C] flex items-start gap-2 text-xs sm:text-[13px] text-gray-700 dark:text-gray-300">
              <ImageIcon className="w-4 h-4 text-[#2878C8] shrink-0 mt-0.5" />
              <span className="font-medium italic leading-relaxed">{img.caption}</span>
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
};

export const TopicLearning: React.FC<TopicLearningProps> = ({
  initialTopicId,
  completedTopics,
  onToggleCompleteTopic,
  onPracticeTopicQuiz,
  onOpenLeaderboard,
}) => {
  // Mode: 'catalog' (Danh sách bài học dạng thẻ trực quan) OR 'lesson' (Đọc chi tiết bài học đã chọn)
  const [viewLayout, setViewLayout] = useState<'catalog' | 'lesson'>(
    initialTopicId ? 'lesson' : 'catalog'
  );

  const [selectedTopicId, setSelectedTopicId] = useState<SubjectTopicId>(
    initialTopicId || '12A'
  );

  // Sub-tabs inside lesson view to eliminate text density:
  // 'theory' (Lý thuyết) | 'concepts' (Mục tiêu & Khái niệm) | 'notes' (Ghi nhớ & Mẹo thi) | 'quiz' (Luyện trắc nghiệm)
  const [lessonSubTab, setLessonSubTab] = useState<'theory' | 'concepts' | 'notes' | 'quiz'>('theory');

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '12' | '11' | '10'>('all');
  const [trackFilter, setTrackFilter] = useState<'all' | 'ALL' | 'CS' | 'ICT'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');

  const [previewImage, setPreviewImage] = useState<{ url: string; caption?: string } | null>(null);

  // Interactive Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync initialTopicId if prop updates
  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
      setViewLayout('lesson');
      setLessonSubTab('theory');
    }
  }, [initialTopicId]);

  // Reset quiz when topic changes
  useEffect(() => {
    setUserAnswers({});
    setSubmittedQuiz(false);
    setQuizScore(0);
  }, [selectedTopicId]);

  const topicsList = Object.values(TOPIC_LESSONS);

  // Filter topics
  const filteredTopics = topicsList.filter((topic) => {
    const matchSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'all' || topic.grade === gradeFilter;
    const matchTrack = trackFilter === 'all' || topic.track === trackFilter || topic.track === 'ALL';
    const isTopicCompleted = Boolean(completedTopics[topic.id]);
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && isTopicCompleted) ||
      (statusFilter === 'uncompleted' && !isTopicCompleted);

    return matchSearch && matchGrade && matchTrack && matchStatus;
  });

  // Group filtered topics by grade
  const grade12Topics = filteredTopics.filter((t) => t.grade === '12');
  const grade11Topics = filteredTopics.filter((t) => t.grade === '11');
  const grade10Topics = filteredTopics.filter((t) => t.grade === '10');

  const activeTopic: TopicLesson = TOPIC_LESSONS[selectedTopicId] || TOPIC_LESSONS['12A'] || TOPIC_LESSONS['12D'];
  const isCompleted = Boolean(completedTopics[selectedTopicId]);

  // Helper for topic badge label matching the design
  const getTopicBadge = (topic: TopicLesson) => {
    if (topic.grade === '10' || topic.id === '10_PYTHON') {
      return 'Lớp 10';
    }
    if (topic.id.includes('_')) {
      return topic.id.replace('_', '(') + ')';
    }
    return topic.id;
  };

  // Topic order helpers
  const allTopicKeys = Object.keys(TOPIC_LESSONS) as SubjectTopicId[];
  const currentIndex = allTopicKeys.indexOf(selectedTopicId);
  const prevTopicId = currentIndex > 0 ? allTopicKeys[currentIndex - 1] : null;
  const nextTopicId = currentIndex < allTopicKeys.length - 1 ? allTopicKeys[currentIndex + 1] : null;

  // Open a topic from catalog
  const handleOpenTopic = (topicId: SubjectTopicId, tab: 'theory' | 'quiz' = 'theory') => {
    setSelectedTopicId(topicId);
    setLessonSubTab(tab);
    setViewLayout('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quiz submission handler
  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    if (submittedQuiz) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    const questions = activeTopic.practiceQuestions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setSubmittedQuiz(true);

    if (correctCount / questions.length >= 0.7 && !isCompleted) {
      onToggleCompleteTopic(activeTopic.id);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuiz(false);
    setQuizScore(0);
  };

  // Total completed progress
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const totalCount = Object.keys(TOPIC_LESSONS).length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6 w-full mx-auto">
      {/* ========================================================================= */}
      {/* TOP HEADER: SWITCHER BETWEEN CATALOG VIEW & LESSON VIEW */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2878C8] to-[#1D7BF2] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Danh Sách Bài Học & Chuyên Đề
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#2878C8] dark:bg-blue-950/80 dark:text-[#60A5FA] border border-blue-200 dark:border-blue-900/60 uppercase">
                GDPT 2018 · THPT 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Hệ thống 11 chuyên đề trọng tâm môn Tin học có cấu trúc bài giảng và trắc nghiệm chuẩn Bộ GD&ĐT
            </p>
          </div>
        </div>

        {/* View Layout Toggle & Progress Pill */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#383838]">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block">
                Tiến độ học tập
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#2878C8] dark:text-[#60A5FA] tabular-nums">
                {completedCount} / {totalCount} bài ({progressPercent}%)
              </span>
            </div>
            <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-[#333] overflow-hidden">
              <div
                className="h-full bg-[#2878C8] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="inline-flex rounded-xl p-1 bg-gray-100 dark:bg-[#262626] border border-gray-200 dark:border-[#3A3A3A]">
            <button
              onClick={() => setViewLayout('catalog')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                viewLayout === 'catalog'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#2878C8] dark:text-[#60A5FA] shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Danh mục thẻ</span>
            </button>
            <button
              onClick={() => setViewLayout('lesson')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                viewLayout === 'lesson'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#2878C8] dark:text-[#60A5FA] shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>Đọc bài học</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CATALOG OVERVIEW GRID (BỐ CỤC THẺ LƯỚI THOÁNG ĐÃNG) */}
      {/* ========================================================================= */}
      {viewLayout === 'catalog' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tổng chuyên đề</span>
                <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2878C8]">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-2 tabular-nums">
                {totalCount} bài
              </p>
              <span className="text-[11px] text-gray-500 mt-1 block">Lớp 12, 11 và 10 GDPT 2018</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Trọng tâm Lớp 12</span>
                <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  <Target className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2 tabular-nums">
                5 chuyên đề
              </p>
              <span className="text-[11px] text-gray-500 mt-1 block">Chiếm ~85% số câu hỏi THPT</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Đã hoàn thành</span>
                <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
                {completedCount} bài
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
                Đạt tỉ lệ {progressPercent}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Kho trắc nghiệm</span>
                <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <Edit3 className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 tabular-nums">
                110 câu hỏi
              </p>
              <span className="text-[11px] text-gray-500 mt-1 block">100% trích sách ôn thi Bộ GD&ĐT</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên bài, mã bài (12A, Python, SQL, AI, Mạng)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#444] bg-gray-50/50 dark:bg-[#151515] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#2878C8] focus:bg-white dark:focus:bg-[#181818] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1.5 self-start md:self-auto text-xs">
                <span className="text-gray-500 font-semibold mr-1 shrink-0">Trạng thái:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'completed', label: 'Đã học' },
                  { id: 'uncompleted', label: 'Chưa học' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      statusFilter === st.id
                        ? 'bg-[#2878C8] text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade & Track Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-[#2C2C2C]">
              {/* Grade Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 mr-1 shrink-0">Khối lớp:</span>
                {[
                  { id: 'all', label: 'Tất cả khối', count: topicsList.length },
                  { id: '12', label: 'Lớp 12 · Trọng tâm THPT', count: 5 },
                  { id: '11', label: 'Lớp 11 · Cơ sở nâng cao', count: 4 },
                  { id: '10', label: 'Lớp 10 · Lập trình Python', count: 2 },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGradeFilter(g.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      gradeFilter === g.id
                        ? 'bg-blue-50 text-[#2878C8] border border-blue-200 dark:bg-blue-950/60 dark:border-blue-900 dark:text-[#60A5FA]'
                        : 'bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#383838] text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <span>{g.label}</span>
                    <span className="opacity-70 font-normal">({g.count})</span>
                  </button>
                ))}
              </div>

              {/* Track filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-500 font-semibold mr-1 shrink-0">Định hướng:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'CS', label: 'CS (Khoa học MT)' },
                  { id: 'ICT', label: 'ICT (Ứng dụng tin)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrackFilter(t.id as any)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      trackFilter === t.id
                        ? 'bg-[#1D7BF2] text-white shadow-xs font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-[#252525]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty search notice */}
          {filteredTopics.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] space-y-3">
              <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                Không tìm thấy bài học nào phù hợp với bộ lọc
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Hãy thử xóa từ khóa tìm kiếm hoặc chọn lại bộ lọc "Tất cả khối" để xem đầy đủ 11 chuyên đề ôn thi.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setGradeFilter('all');
                  setTrackFilter('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-50 text-[#2878C8] font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 1: LỚP 12 - TRỌNG TÂM THI TỐT NGHIỆP THPT */}
          {/* ========================================================================= */}
          {grade12Topics.length > 0 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#2878C8]" />
                  <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    KHỐI LỚP 12 · TRỌNG TÂM THI TỐT NGHIỆP THPT (~85% ĐỀ THI)
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#2878C8] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                  {grade12Topics.length} chuyên đề
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                {grade12Topics.map((topic) => {
                  const completed = Boolean(completedTopics[topic.id]);
                  return (
                    <div
                      key={topic.id}
                      className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] hover:border-[#2878C8]/60 dark:hover:border-[#2878C8]/60 transition-all duration-200 p-5 shadow-xs hover:shadow-md flex flex-col justify-between group space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Badges row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 dark:text-[#60A5FA]">
                            {topic.code}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {topic.track && topic.track !== 'ALL' && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60">
                                Định hướng {topic.track}
                              </span>
                            )}
                            <button
                              onClick={() => onToggleCompleteTopic(topic.id)}
                              className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                              title={completed ? 'Đã hoàn thành' : 'Đánh dấu đã học'}
                            >
                              {completed ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                                  <CheckCircle className="w-3.5 h-3.5" /> Đã học
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded-md">
                                  <Circle className="w-3.5 h-3.5" /> Chưa học
                                </span>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#2878C8] dark:group-hover:text-[#60A5FA] transition-colors leading-snug line-clamp-2">
                          {topic.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-xs sm:text-[13px] text-black dark:text-gray-200 leading-relaxed line-clamp-2 font-medium">
                          {topic.summary}
                        </p>
                      </div>

                      {/* Meta stats & CTA Buttons */}
                      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-[#2C2C2C]">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" /> ~25 phút đọc
                          </span>
                          <span className="flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5 text-amber-500" /> {topic.practiceQuestions?.length || 10} câu trắc nghiệm
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleOpenTopic(topic.id, 'theory')}
                            className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-[#2878C8] text-[#2878C8] hover:text-white dark:bg-blue-950/50 dark:text-[#60A5FA] dark:hover:bg-[#2878C8] dark:hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Vào học bài
                          </button>
                          <button
                            onClick={() => handleOpenTopic(topic.id, 'quiz')}
                            className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-amber-500 hover:text-white dark:bg-[#282828] text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Luyện đề
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: LỚP 11 - CƠ SỞ & NÂNG CAO */}
          {/* ========================================================================= */}
          {grade11Topics.length > 0 && (
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600" />
                  <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    KHỐI LỚP 11 · CƠ SỞ NÂNG CAO (CSDL, HỆ ĐIỀU HÀNH & THUẬT TOÁN)
                  </h2>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">
                  {grade11Topics.length} chuyên đề
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                {grade11Topics.map((topic) => {
                  const completed = Boolean(completedTopics[topic.id]);
                  return (
                    <div
                      key={topic.id}
                      className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] hover:border-purple-500/60 transition-all duration-200 p-5 shadow-xs hover:shadow-md flex flex-col justify-between group space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                            {topic.code}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {topic.track && topic.track !== 'ALL' && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/80">
                                Định hướng {topic.track}
                              </span>
                            )}
                            <button
                              onClick={() => onToggleCompleteTopic(topic.id)}
                              className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              {completed ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                                  <CheckCircle className="w-3.5 h-3.5" /> Đã học
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded-md">
                                  <Circle className="w-3.5 h-3.5" /> Chưa học
                                </span>
                              )}
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug line-clamp-2">
                          {topic.title}
                        </h3>

                        <p className="text-xs sm:text-[13px] text-black dark:text-gray-200 leading-relaxed line-clamp-2 font-medium">
                          {topic.summary}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-[#2C2C2C]">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-purple-500" /> ~20 phút đọc
                          </span>
                          <span className="flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5 text-amber-500" /> {topic.practiceQuestions?.length || 10} câu trắc nghiệm
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleOpenTopic(topic.id, 'theory')}
                            className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-950/50 dark:text-purple-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Vào học bài
                          </button>
                          <button
                            onClick={() => handleOpenTopic(topic.id, 'quiz')}
                            className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-amber-500 hover:text-white dark:bg-[#282828] text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Luyện đề
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: LỚP 10 - NỀN TẢNG PYTHON */}
          {/* ========================================================================= */}
          {grade10Topics.length > 0 && (
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    KHỐI LỚP 10 · NỀN TẢNG LẬP TRÌNH PYTHON & THUẬT TOÁN CƠ BẢN
                  </h2>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  {grade10Topics.length} chuyên đề
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                {grade10Topics.map((topic) => {
                  const completed = Boolean(completedTopics[topic.id]);
                  return (
                    <div
                      key={topic.id}
                      className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] hover:border-emerald-500/60 transition-all duration-200 p-5 shadow-xs hover:shadow-md flex flex-col justify-between group space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {topic.code}
                          </span>

                          <button
                            onClick={() => onToggleCompleteTopic(topic.id)}
                            className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                          >
                            {completed ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                                <CheckCircle className="w-3.5 h-3.5" /> Đã học
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded-md">
                                <Circle className="w-3.5 h-3.5" /> Chưa học
                              </span>
                            )}
                          </button>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                          {topic.title}
                        </h3>

                        <p className="text-xs sm:text-[13px] text-black dark:text-gray-200 leading-relaxed line-clamp-2 font-medium">
                          {topic.summary}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-[#2C2C2C]">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" /> ~20 phút đọc
                          </span>
                          <span className="flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5 text-amber-500" /> {topic.practiceQuestions?.length || 10} câu trắc nghiệm
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleOpenTopic(topic.id, 'theory')}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-950/50 dark:text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Vào học bài
                          </button>
                          <button
                            onClick={() => handleOpenTopic(topic.id, 'quiz')}
                            className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-amber-500 hover:text-white dark:bg-[#282828] text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Luyện đề
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: FOCUSED LESSON READER (CHẾ ĐỘ ĐỌC TẬP TRUNG, KHÔNG DÀY ĐẶC CHỮ) */}
      {/* ========================================================================= */}
      {viewLayout === 'lesson' && (
        <div className="space-y-5">
          {/* Top Sticky Breadcrumb & Topic Selector Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-18 z-20 backdrop-blur-md bg-white/95 dark:bg-[#1E1E1E]/95">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setViewLayout('catalog')}
                className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-[#444] text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282828] flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Quay lại danh sách thẻ"
              >
                <ArrowLeft className="w-4 h-4 text-[#2878C8]" />
                <span>Danh sách bài</span>
              </button>

              <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>

              {/* Topic Quick Jump Dropdown */}
              <div className="relative inline-flex items-center">
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value as SubjectTopicId)}
                  className="pl-3 pr-8 py-1.5 rounded-xl border border-gray-300 dark:border-[#444] bg-gray-50 dark:bg-[#252525] text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:border-[#2878C8] cursor-pointer"
                >
                  {topicsList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code}: {t.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleCompleteTopic(activeTopic.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-gray-200 border border-transparent'
                }`}
              >
                {isCompleted ? (
                  <><CheckCircle className="w-4 h-4 text-emerald-600" /> Đã học xong</>
                ) : (
                  <><Circle className="w-4 h-4" /> Đánh dấu đã học</>
                )}
              </button>

              {/* Previous / Next Lesson Mini Buttons */}
              <button
                disabled={!prevTopicId}
                onClick={() => prevTopicId && setSelectedTopicId(prevTopicId)}
                className={`p-2 rounded-xl border border-gray-200 dark:border-[#383838] transition-colors ${
                  prevTopicId
                    ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#282828]'
                    : 'opacity-30 cursor-not-allowed text-gray-400'
                }`}
                title="Bài trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={!nextTopicId}
                onClick={() => nextTopicId && setSelectedTopicId(nextTopicId)}
                className={`p-2 rounded-xl border border-gray-200 dark:border-[#383838] transition-colors ${
                  nextTopicId
                    ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#282828]'
                    : 'opacity-30 cursor-not-allowed text-gray-400'
                }`}
                title="Bài sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lesson Header Banner */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 dark:text-[#60A5FA] font-bold text-xs">
                {activeTopic.code}
              </span>
              <span className="text-xs text-black dark:text-gray-200 font-semibold">Khối Lớp {activeTopic.grade}</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-xs text-black dark:text-gray-200 font-medium">{activeTopic.examWeight}</span>
              {activeTopic.track && activeTopic.track !== 'ALL' && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                  Định hướng {activeTopic.track}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-black text-black dark:text-white leading-tight">
              {activeTopic.title}
            </h1>

            {/* Summary info box */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/25 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-[#2878C8] shrink-0 mt-0.5" />
              <p className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.7]">
                {formatMultiline(activeTopic.summary)}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4 SUB-TABS: CHIA NHỎ NỘI DUNG, LOẠI BỎ TRIỆT ĐỂ CHỮ DÀY ĐẶC */}
          {/* ========================================================================= */}
          <div className="sticky top-32 z-10 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 dark:border-[#333] shadow-xs flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setLessonSubTab('theory')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                lessonSubTab === 'theory'
                  ? 'bg-[#2878C8] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252525]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lý thuyết trọng tâm</span>
            </button>

            <button
              onClick={() => setLessonSubTab('concepts')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                lessonSubTab === 'concepts'
                  ? 'bg-[#2878C8] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252525]'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Mục tiêu & Khái niệm</span>
            </button>

            <button
              onClick={() => setLessonSubTab('notes')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                lessonSubTab === 'notes'
                  ? 'bg-[#2878C8] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252525]'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Ghi nhớ & Mẹo thi</span>
            </button>

            <button
              onClick={() => setLessonSubTab('quiz')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                lessonSubTab === 'quiz'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Luyện trắc nghiệm ({activeTopic.practiceQuestions?.length || 10})</span>
            </button>
          </div>

          {/* SUB-TAB 1: LÝ THUYẾT TRỌNG TÂM */}
          {lessonSubTab === 'theory' && (
            <div className="space-y-4">
              {/* Visual Diagram Roadmap for Theory */}
              <TopicIllustration topicId={activeTopic.id} />

              {activeTopic.mainSections?.map((sec) => (
                <section
                  key={sec.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200/90 dark:border-[#333] p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="border-b border-gray-100 dark:border-[#2C2C2C] pb-3 flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2878C8] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {sec.number}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-black dark:text-white tracking-tight">
                      {sec.title.replace(/^[0-9]+\.\s*/, '')}
                    </h2>
                  </div>

                  {/* Formatted Content with Bullet & Number Parser */}
                  <FormattedTextContent content={sec.content} />

                  {/* Ảnh minh hoạ phần lớn */}
                  <LessonImageViewer
                    imageUrl={sec.imageUrl}
                    imageCaption={sec.imageCaption}
                    images={sec.images}
                    onOpenPreview={(url, caption) => setPreviewImage({ url, caption })}
                  />

                  {sec.table && (
                    <div className="overflow-x-auto border border-gray-200 dark:border-[#333] rounded-xl shadow-2xs">
                      <table className="w-full text-left text-sm sm:text-[15px]">
                        <thead className="bg-blue-50/90 dark:bg-blue-950/50 text-black dark:text-white border-b border-gray-200 dark:border-[#333]">
                          <tr>
                            {sec.table.headers.map((h, idx) => (
                              <th key={idx} className="p-3 font-bold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#2C2C2C]">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50/50 dark:hover:bg-[#252525]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 text-black dark:text-gray-100 font-normal leading-relaxed">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {sec.codeSnippet && (
                    <pre className="p-4 rounded-xl bg-[#1E1E1E] text-sky-400 font-mono text-xs sm:text-sm overflow-x-auto border border-[#333] leading-relaxed">
                      <code>{sec.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Subsections a, b */}
                  {sec.subSections && sec.subSections.length > 0 && (
                    <div className="space-y-3 pt-1">
                      {sec.subSections.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 sm:p-5 rounded-xl border border-gray-200/80 dark:border-[#333] bg-gray-50/60 dark:bg-[#202020] space-y-3"
                        >
                          <h3 className="text-sm sm:text-base font-bold text-black dark:text-white flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#2878C8] text-white font-black text-xs shrink-0">
                              {sub.letter}
                            </span>
                            <span>{sub.title.replace(/^[a-z]\)\s*/, '')}</span>
                          </h3>

                          <FormattedTextContent content={sub.content} />

                          <LessonImageViewer
                            imageUrl={sub.imageUrl}
                            imageCaption={sub.imageCaption}
                            images={sub.images}
                            onOpenPreview={(url, caption) => setPreviewImage({ url, caption })}
                          />

                          {sub.codeSnippet && (
                            <pre className="p-3.5 rounded-lg bg-[#181818] text-sky-400 font-mono text-xs overflow-x-auto border border-[#333]">
                              <code>{sub.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* SUB-TAB 2: MỤC TIÊU & KHÁI NIỆM */}
          {lessonSubTab === 'concepts' && (
            <div className="space-y-6">
              {/* Yêu cầu cần đạt chuẩn Bộ GD&ĐT */}
              <section className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200/90 dark:border-[#333] p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3.5 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <Target className="w-5 h-5 text-[#2878C8]" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Yêu cầu cần đạt theo chuẩn chương trình GDPT 2018
                  </h2>
                </div>

                <ul className="space-y-3.5">
                  {activeTopic.objectives?.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 flex items-center justify-center shrink-0 mt-1 text-xs font-bold shadow-2xs">
                        ✓
                      </span>
                      <span className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75]">{obj}</span>
                    </li>
                  ))}
                </ul>

                {/* Standards 3-col */}
                {activeTopic.standards && activeTopic.standards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3">
                    {activeTopic.standards.map((std, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-150 dark:border-[#2C2C2C] bg-gray-50/80 dark:bg-[#252525] space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 inline-block shadow-2xs">
                          {std.level}
                        </span>
                        <p className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75]">
                          {std.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Khái niệm trọng tâm */}
              {activeTopic.keyConcepts && activeTopic.keyConcepts.length > 0 && (
                <section className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200/90 dark:border-[#333] p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 pb-3.5 border-b border-gray-100 dark:border-[#2C2C2C]">
                    <Layers className="w-5 h-5 text-[#2878C8]" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Các khái niệm trọng tâm cần nắm vững
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {activeTopic.keyConcepts.map((kc, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl border border-gray-150 dark:border-[#2C2C2C] bg-gray-50/60 dark:bg-[#252525] space-y-2.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#2878C8] dark:text-[#60A5FA]">
                          {kc.term}
                        </h3>
                        <p className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] whitespace-pre-line">
                          {formatMultiline(kc.definition)}
                        </p>
                        {kc.example && (
                          <p className="text-sm sm:text-[15px] text-black dark:text-gray-200 font-normal leading-[1.75] pt-2 border-t border-gray-200/60 dark:border-[#333]">
                            <span className="font-semibold text-gray-500 dark:text-gray-400 italic">Ví dụ: </span>{kc.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tình huống khởi động */}
              {activeTopic.warmUp && (
                <section className="p-5 sm:p-6 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                    <Compass className="w-4.5 h-4.5" />
                    <span>Tình huống khởi động liên hệ thực tế</span>
                  </div>
                  <p className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] italic whitespace-pre-line">
                    "{formatMultiline(activeTopic.warmUp.context)}"
                  </p>
                  <p className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-semibold flex items-center gap-2 pt-1">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" /> {activeTopic.warmUp.question}
                  </p>
                </section>
              )}
            </div>
          )}

          {/* SUB-TAB 3: GHI NHỚ & BẪY ĐỀ THI */}
          {lessonSubTab === 'notes' && (
            <div className="space-y-6">
              {/* Ghi nhớ cốt lõi */}
              <section className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200/90 dark:border-[#333] p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3.5 border-b border-gray-100 dark:border-[#2C2C2C]">
                  <Bookmark className="w-5 h-5 text-[#2878C8]" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Ghi nhớ cốt lõi ôn thi
                  </h2>
                </div>

                <div className="space-y-3">
                  {activeTopic.memoryNotes?.map((note, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/25 border border-blue-100 dark:border-blue-900/30 shadow-2xs"
                    >
                      <Sparkles className="w-4.5 h-4.5 text-[#2878C8] shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-[15px] font-normal text-black dark:text-gray-100 leading-[1.75]">
                        {note}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bẫy đề thi & Mẹo làm bài */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <section className="p-5 sm:p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-3.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-base border-b border-amber-200/60 pb-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>Bẫy đề thi hay nhầm lẫn</span>
                  </div>
                  <ul className="space-y-3">
                    {activeTopic.application?.examTraps?.map((trap, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75]">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                        <span>{trap}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="p-5 sm:p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-3.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#2878C8] dark:text-[#60A5FA] font-bold text-base border-b border-blue-200/60 pb-2.5">
                    <Lightbulb className="w-5 h-5 text-[#2878C8]" />
                    <span>Kinh nghiệm & Mẹo điểm cao</span>
                  </div>
                  <ul className="space-y-3">
                    {activeTopic.application?.tips?.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75]">
                        <span className="w-2 h-2 rounded-full bg-[#2878C8] shrink-0 mt-2" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Tình huống thực tế */}
              {activeTopic.application?.realLife && (
                <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm">
                    <Globe className="w-4.5 h-4.5 text-[#2878C8]" />
                    <span>Ứng dụng thực tế đời sống</span>
                  </div>
                  <FormattedTextContent content={activeTopic.application.realLife} />
                </section>
              )}
            </div>
          )}

          {/* SUB-TAB 4: LUYỆN TẬP TRẮC NGHIỆM */}
          {lessonSubTab === 'quiz' && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-[#333] p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333] pb-5">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 dark:text-[#60A5FA]">
                    Đề Chuẩn Trích 100% Sách Ôn Thi Tốt Nghiệp (Bộ GD&ĐT)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-2">
                    Luyện trắc nghiệm: {activeTopic.title}
                  </h2>
                </div>

                {submittedQuiz && (
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Làm lại đề này
                  </button>
                )}
              </div>

              {/* Score result banner */}
              {submittedQuiz && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#2878C8] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      {Math.round((quizScore / (activeTopic.practiceQuestions?.length || 1)) * 10)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base">
                        Kết quả bài luyện: {quizScore} / {activeTopic.practiceQuestions?.length} câu đúng
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                        {quizScore === activeTopic.practiceQuestions?.length
                          ? 'Xuất sắc! Bạn đã nắm vững 100% kiến thức của chủ đề này.'
                          : 'Rất tốt! Hãy đọc kĩ phần lời giải thích từ sách để khắc phục các câu chưa đúng.'}
                      </p>
                    </div>
                  </div>

                  <span className="px-4 py-2 rounded-xl bg-[#2878C8] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs">
                    <Award className="w-4.5 h-4.5 text-amber-300" /> +20 XP Đạt Được
                  </span>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {activeTopic.practiceQuestions?.map((q, idx) => {
                  const selected = userAnswers[q.id];
                  const isCorrect = selected === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                        submittedQuiz
                          ? isCorrect
                            ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20'
                            : 'border-rose-300 bg-rose-50/30 dark:border-rose-800 dark:bg-rose-950/20'
                          : 'border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">
                          <span className="text-[#2878C8] font-black mr-2">Câu {idx + 1}:</span>
                          {q.question}
                        </h3>

                        {submittedQuiz && (
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300'
                            }`}
                          >
                            {isCorrect ? 'Đúng' : 'Chưa đúng'}
                          </span>
                        )}
                      </div>

                      {/* Options A, B, C, D */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                        {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                          const optText = q.options[optKey];
                          const isOptionSelected = selected === optKey;
                          const isOptionCorrectAnswer = q.correctAnswer === optKey;

                          let optionStyle = 'border-gray-200 dark:border-[#333] hover:border-[#2878C8] hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-black dark:text-gray-200';
                          if (submittedQuiz) {
                            if (isOptionCorrectAnswer) {
                              optionStyle = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                            } else if (isOptionSelected && !isCorrect) {
                              optionStyle = 'border-rose-400 bg-rose-100/70 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200';
                            } else {
                              optionStyle = 'opacity-60 border-gray-200 dark:border-[#333]';
                            }
                          } else if (isOptionSelected) {
                            optionStyle = 'border-[#2878C8] bg-blue-50 dark:bg-blue-950/40 text-[#2878C8] dark:text-[#60A5FA] font-bold ring-1 ring-[#2878C8]';
                          }

                          return (
                            <button
                              key={optKey}
                              disabled={submittedQuiz}
                              onClick={() => handleSelectOption(q.id, optKey)}
                              className={`w-full text-left p-4 sm:p-5 rounded-xl border flex items-center justify-between text-sm sm:text-[15px] transition-all leading-[1.6] ${optionStyle}`}
                            >
                              <div className="flex items-center gap-3.5">
                                <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 flex items-center justify-center font-black text-sm shrink-0">
                                  {optKey}
                                </span>
                                <span>{optText}</span>
                              </div>

                              {submittedQuiz && isOptionCorrectAnswer && (
                                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Lời giải chi tiết từ sách */}
                      {submittedQuiz && (
                        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#2878C8]">
                            <BookOpen className="w-4 h-4" /> Lời giải chi tiết từ Sách Ôn thi (Đáp án {q.correctAnswer}):
                          </div>
                          <p className="text-sm sm:text-[15px] text-black dark:text-gray-100 font-normal leading-[1.75] pt-0.5">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit button */}
              {!submittedQuiz && (
                <div className="pt-4 flex items-center justify-between border-t border-gray-200 dark:border-[#333]">
                  <span className="text-xs text-gray-500 font-medium">
                    Đã chọn {Object.keys(userAnswers).length} / {activeTopic.practiceQuestions?.length} câu hỏi
                  </span>

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length === 0}
                    className={`px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition-all ${
                      Object.keys(userAnswers).length > 0
                        ? 'bg-[#2878C8] text-white hover:bg-[#1D7BF2]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-[#333]'
                    }`}
                  >
                    Nộp bài và chấm điểm ngay <CheckCircle2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Next/Prev Topic Navigation Footer */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] flex items-center justify-between gap-3 shadow-xs">
            <button
              disabled={!prevTopicId}
              onClick={() => {
                if (prevTopicId) {
                  setSelectedTopicId(prevTopicId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold transition-all px-3 py-2 rounded-xl ${
                prevTopicId
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282828] hover:text-[#2878C8]'
                  : 'opacity-30 cursor-not-allowed text-gray-400'
              }`}
            >
              <ChevronLeft className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Bài trước</span>
            </button>

            <button
              onClick={() => setViewLayout('catalog')}
              className="px-4 py-2 rounded-xl bg-blue-50 text-[#2878C8] dark:bg-blue-950/60 dark:text-[#60A5FA] font-bold text-xs sm:text-sm hover:bg-blue-100 transition-colors"
            >
              Xem tất cả bài học
            </button>

            <button
              disabled={!nextTopicId}
              onClick={() => {
                if (nextTopicId) {
                  setSelectedTopicId(nextTopicId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold transition-all px-3 py-2 rounded-xl ${
                nextTopicId
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282828] hover:text-[#2878C8]'
                  : 'opacity-30 cursor-not-allowed text-gray-400'
              }`}
            >
              <span className="hidden sm:inline">Bài tiếp theo</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal phóng to ảnh */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] w-full bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-gray-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525]">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                <ImageIcon className="w-4 h-4 text-[#2878C8]" />
                <span className="truncate max-w-md sm:max-w-xl">{previewImage.caption || 'Xem ảnh minh hoạ chi tiết'}</span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#333] text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-5 overflow-auto flex items-center justify-center bg-gray-900/5 dark:bg-black/40">
              <img
                src={previewImage.url}
                alt={previewImage.caption || 'Chi tiết hình ảnh'}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
            {previewImage.caption && (
              <div className="px-4 py-3 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#252525] border-t border-gray-200 dark:border-[#333] italic">
                {previewImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicLearning;
