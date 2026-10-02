"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const insortData = [
  {
    colNumber: 1,
    isRestricted: true,
    zones: [
      {
        title: "Restricted",
        posText: "",
        subrackCode: "RESTRICTED",
        posCount: 0,
      },
    ],
  },
  {
    colNumber: 2,
    zones: [
      {
        title: "Holder for Hitachi rack",
        posText: "75 pos",
        subrackCode: "INPUT1",
        posCount: 75, // 15 hàng x 5
      },
      {
        title: "Holder for Hitachi rack",
        posText: "75 pos",
        subrackCode: "INPUT2",
        posCount: 75, // 15 hàng x 5
      },
    ],
  },
  {
    colNumber: 3,
    zones: [
      {
        title: "Holder for Hitachi rack",
        posText: "75 pos",
        subrackCode: "INPUT3",
        posCount: 75, // 15 hàng x 5
      },
      {
        title: "Holder for Hitachi rack",
        posText: "75 pos",
        subrackCode: "INPUT4",
        posCount: 75, // 15 hàng x 5
      },
    ],
  },
  {
    colNumber: 4,
    zones: [
      {
        title: "Rack holder",
        posText: "50 pos",
        subrackCode: "INPUT5",
        posCount: 50, // 10 hàng x 5
      },
      {
        title: "Rack holder",
        posText: "50 pos",
        subrackCode: "INPUT6",
        posCount: 50, // 10 hàng x 5
      },
      {
        title: "Rack holder",
        posText: "50 pos",
        subrackCode: "INPUT7",
        posCount: 50, // 10 hàng x 5
      },
    ],
  },
];

export default function InsortPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* Nút điều hướng quay lại Outsort */}
      <div className="max-w-6xl mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B365D] text-white text-sm font-semibold rounded-lg hover:bg-[#142847] transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Outsort Layout</span>
        </Link>
      </div>

      {/* Khung hiển thị chính */}
      <div className="max-w-6xl mx-auto bg-white border-2 border-[#1B365D] shadow-2xl rounded-md overflow-hidden">
        {/* Tên giao diện phía trên */}
        <div className="p-4 bg-white text-center border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
            Phân bổ khu vực nạp mẫu cho máy p512
          </h1>
        </div>

        {/* Header xanh đen đậm tương đồng Outsort */}
        <div className="bg-[#1B365D] text-white text-center font-bold text-xl py-3 uppercase tracking-wider">
          INSORT LAYOUT
        </div>

        {/* Khung Lưới 4 Cột */}
        <div className="grid grid-cols-4 border-t border-[#1B365D]">
          {/* Hàng số cột 1, 2, 3, 4 */}
          {insortData.map((col) => (
            <div
              key={col.colNumber}
              className="bg-[#1B365D] text-white font-bold text-center py-1.5 border-r border-slate-600 last:border-r-0 text-lg"
            >
              {col.colNumber}
            </div>
          ))}

          {/* Chi tiết từng Cột */}
          {insortData.map((col) => {
            // Cột 1: Restricted (Màu đỏ)
            if (col.isRestricted) {
              return (
                <div
                  key={col.colNumber}
                  className="bg-red-600 border-r border-[#1B365D] flex items-center justify-center min-h-[580px] p-2"
                >
                  <span className="text-black text-2xl font-extrabold uppercase tracking-widest text-center">
                    Restricted
                  </span>
                </div>
              );
            }

            return (
              <div
                key={col.colNumber}
                className="border-r border-[#1B365D] last:border-r-0 flex flex-col bg-white min-h-[580px]"
              >
                {col.zones.map((zone, idx) => {
                  const rowsCount = zone.posCount > 0 ? Math.ceil(zone.posCount / 5) : 0;

                  return (
                    <div
                      key={idx}
                      style={{ flexGrow: zone.posCount || 1 }}
                      className="border-b border-[#1B365D] last:border-b-0 p-3 flex flex-col justify-between items-center text-center relative"
                    >
                      {/* Tiêu đề & Dung tích (Giữ nguyên văn bản gốc) */}
                      <div className="z-10 w-full text-center">
                        <div className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                          {zone.title}
                        </div>
                        {zone.posText && (
                          <div className="font-bold text-slate-700 text-xs md:text-sm mt-0.5">
                            {zone.posText}
                          </div>
                        )}
                      </div>

                      {/* Hiệu ứng đục lỗ (Dot Matrix) tương đồng Outsort */}
                      {rowsCount > 0 && (
                        <div className="my-2 flex flex-col justify-center items-center gap-1.5 opacity-80">
                          {Array.from({ length: Math.min(rowsCount, 12) }).map((_, rIdx) => (
                            <div key={rIdx} className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((hole) => (
                                <div
                                  key={hole}
                                  className="w-2.5 h-2.5 rounded-full bg-gray-300 border border-gray-400 shadow-inner"
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Thẻ Subrack nổi ở đáy (Phong cách Outsort) */}
                      <div className="w-full pt-1 z-10">
                        <div className="bg-slate-50 border border-slate-300 rounded-full py-0.5 px-2 text-[11px] font-bold text-slate-700 shadow-sm inline-block w-full">
                          Subrack: <span className="text-black font-extrabold">{zone.subrackCode}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}