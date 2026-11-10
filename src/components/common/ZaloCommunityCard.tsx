import React, { useState } from 'react';
import { ExternalLink, X, Copy, CheckCircle } from 'lucide-react';

const ZALO_GROUP_LINK = 'https://zalo.me/g/rc9dareytfp58ogjn6zy';
// Zalo QR image - generated from the actual group link
const ZALO_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ZALO_GROUP_LINK)}&bgcolor=ffffff&color=000000&margin=10&format=png`;

interface ZaloCommunityCardProps {
  compact?: boolean;
}

export const ZaloCommunityCard: React.FC<ZaloCommunityCardProps> = ({ compact = false }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ZALO_GROUP_LINK).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-[#333] shadow-xs overflow-hidden flex flex-col">
        {/* Header styled like VNOI dark title box */}
        <div className="bg-[#202020] text-white px-4 py-2.5 flex items-center justify-between text-sm font-bold">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#0068FF] text-white font-extrabold flex items-center justify-center text-[11px] tracking-tight">
              Z
            </span>
            <span className="uppercase tracking-wide">Nhóm Zalo thảo luận</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-[#0068FF]/30 text-blue-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            1.4k+ online
          </span>
        </div>

        {/* Content body */}
        <div className="p-4 flex flex-col items-center text-center space-y-3">
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
            Cộng đồng Ôn thi Tin học GDPT 2018 Quảng Ngãi
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Nơi thầy cô & thủ khoa hỗ trợ giải đáp câu hỏi trắc nghiệm, bài tập SQL, Python 24/7.
          </p>

          {/* Real QR Code Image */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="p-2.5 bg-white rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700/60 shadow-xs cursor-pointer hover:border-[#0068FF] transition-all group relative"
            title="Nhấn để phóng to mã QR"
          >
            <img
              src={ZALO_QR_URL}
              alt="QR Code nhóm Zalo KHKT TinPath"
              className="w-32 h-32 object-contain transition-transform group-hover:scale-105 rounded"
              loading="lazy"
            />
            <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 font-medium rounded">
              🔍 Phóng to
            </span>
          </div>

          {/* Link display */}
          <div className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-950 border border-blue-700/60">
            <span className="text-xs text-blue-300 font-mono flex-1 truncate text-left">
              zalo.me/g/rc9dareytfp58ogjn6zy
            </span>
            <button
              onClick={handleCopyLink}
              className="shrink-0 p-1 rounded text-blue-400 hover:text-white transition-colors"
              title="Sao chép link"
            >
              {copied
                ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                : <Copy className="w-3.5 h-3.5" />
              }
            </button>
          </div>

          <div className="w-full pt-1 space-y-1.5">
            <a
              href={ZALO_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4" /> Tham gia nhóm Zalo
            </a>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Mở ứng dụng Zalo trên điện thoại & quét mã
            </span>
          </div>
        </div>
      </div>

      {/* Enlarged QR Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#1E1E1E] rounded-2xl max-w-xs w-full p-6 border border-gray-200 dark:border-[#333] shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#0068FF] text-white font-black flex items-center justify-center text-sm">
                  Z
                </span>
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  Nhóm Zalo KHKT – TinPath
                </span>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Quét mã bằng camera hoặc tính năng <strong>Quét QR</strong> trên ứng dụng Zalo để tham gia nhóm:
            </p>

            {/* Large QR Code */}
            <div className="p-4 bg-white rounded-xl border-2 border-blue-200 inline-block shadow-md mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(ZALO_GROUP_LINK)}&bgcolor=ffffff&color=000000&margin=12&format=png`}
                alt="QR Code Zalo KHKT TinPath"
                className="w-52 h-52 object-contain rounded"
              />
            </div>

            {/* Group info */}
            <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-3 space-y-1.5 text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Cộng đồng Ôn thi Tin học GDPT 2018 Quảng Ngãi
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-[11px]">
                  zalo.me/g/rc9dareytfp58ogjn6zy
                </span>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 p-1 rounded text-gray-400 hover:text-blue-600 transition-colors"
                  title="Sao chép link"
                >
                  {copied
                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    : <Copy className="w-3.5 h-3.5" />
                  }
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={ZALO_GROUP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#0068FF] hover:bg-[#0052cc] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <ExternalLink className="w-4 h-4" /> Mở Zalo
              </a>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#2C2C2C] dark:hover:bg-[#383838] text-gray-700 dark:text-gray-300 text-sm font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
