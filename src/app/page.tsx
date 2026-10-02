"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  Edit3,
  Check,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Server,
  ArrowRight,
  LayoutGrid,
  FileText,
  SlidersHorizontal,
  Cpu,
} from "lucide-react";

interface SubZone {
  id: string;
  name: string;
  capacity: string;
  subrackCode: string;
  description: string;
  bgStyle?: string;
}

interface ColumnConfig {
  colNumber: number;
  bgStyle?: string;
  isWarningZone?: boolean;
  warningLabel?: string;
  zones: SubZone[];
}

interface SystemItem {
  system_code: string;
  system_name: string;
}

const defaultColumns: ColumnConfig[] = [
  {
    colNumber: 1,
    zones: [
      {
        id: "1-1",
        name: "Archive",
        capacity: "125 pos",
        subrackCode: "ARC1",
        description: "Lưu trữ mẫu đối chứng/mẫu lưu sau khi phân tích xong.",
      },
    ],
  },
  {
    colNumber: 2,
    zones: [
      {
        id: "2-1",
        name: "Archive",
        capacity: "125 pos",
        subrackCode: "ARC2",
        description: "Lưu trữ mẫu đối chứng/mẫu lưu sau khi phân tích xong.",
      },
    ],
  },
  {
    colNumber: 3,
    zones: [
      {
        id: "3-1",
        name: "RESULT_P",
        capacity: "75 pos",
        subrackCode: "RESULT_P",
        description: "Mẫu đã phân tích thành công, kết quả đạt yêu cầu.",
      },
      {
        id: "3-2",
        name: "INCOMPLETE",
        capacity: "75 pos",
        subrackCode: "INCOMPLETE",
        description:
          "Mẫu chưa hoàn tất quy trình (thiếu thông tin, chờ chạy tiếp).",
      },
    ],
  },
  {
    colNumber: 4,
    zones: [
      {
        id: "4-1",
        name: "CCM buffer",
        capacity: "50 pos",
        subrackCode: "BUFFER",
        description:
          "Khu vực đệm trung chuyển mẫu trước khi vào mô-đun CCM.",
      },
      {
        id: "4-2",
        name: "Error",
        capacity: "25 pos",
        subrackCode: "ERROR",
        description: "Mẫu bị lỗi.",
        bgStyle: "bg-rose-50/60",
      },
      {
        id: "4-3",
        name: "Default",
        capacity: "25 pos",
        subrackCode: "DEFAULT",
        description: "Vị trí xả mẫu mặc định.",
      },
      {
        id: "4-4",
        name: "QS1",
        capacity: "50 pos",
        subrackCode: "QS1",
        description: "Khu vực riêng cho mẫu QC/ưu tiên.",
      },
    ],
  },
  {
    colNumber: 5,
    isWarningZone: true,
    warningLabel: "",
    zones: [
      {
        id: "5-1",
        name: "Khu vực phân cách",
        capacity: "N/A",
        subrackCode: "Retricted",
        description: "Ranh giới an toàn phân tách Outsort.",
      },
    ],
  },
  {
    colNumber: 6,
    bgStyle: "bg-[#E2EFDA]",
    zones: [
      {
        id: "6-1",
        name: "CCM-3",
        capacity: "Tùy chọn",
        subrackCode: "CCM-3",
        description: "Máy xét nghiệm kết nối trực tiếp CCM 3.",
      },
    ],
  },
  {
    colNumber: 7,
    bgStyle: "bg-[#E2EFDA]",
    zones: [
      {
        id: "7-1",
        name: "CCM-2",
        capacity: "Tùy chọn",
        subrackCode: "CCM-2",
        description: "Máy xét nghiệm kết nối trực tiếp CCM 2.",
      },
    ],
  },
  {
    colNumber: 8,
    bgStyle: "bg-[#E2EFDA]",
    zones: [
      {
        id: "8-1",
        name: "CCM-1",
        capacity: "Tùy chọn",
        subrackCode: "CCM-1",
        description: "Máy xét nghiệm kết nối trực tiếp CCM 1.",
      },
    ],
  },
];

const getRowCountFromCapacity = (capacityStr: string): number => {
  const match = capacityStr.match(/\d+/);
  if (!match) return 0;
  return Math.max(1, Math.ceil(parseInt(match[0], 10) / 5));
};

export default function Home() {
  const [systemsList, setSystemsList] = useState<SystemItem[]>([]);
  const [selectedSystemCode, setSelectedSystemCode] = useState<string>("p512-default");
  const [systemName, setSystemName] = useState("Máy p512 Mặc định");
  const [title, setTitle] = useState("Phân bổ khu vực xuất mẫu cho máy p512/p612");
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSystemsList = async () => {
    try {
      const res = await fetch("/api/layouts");
      const data = await res.json();
      if (Array.isArray(data)) setSystemsList(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách hệ thống:", err);
    }
  };

  const loadSystemConfig = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/layouts?systemCode=${code}`);
      const data = await res.json();
      if (data && data.columns_data) {
        setTitle(data.title || "Phân bổ khu vực xuất mẫu");
        setSystemName(data.system_name || code);
        setColumns(data.columns_data);
      } else {
        setColumns(defaultColumns);
      }
    } catch (err) {
      console.error("Lỗi khi tải cấu hình:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemsList();
    loadSystemConfig(selectedSystemCode);
  }, []);

  const handleSystemChange = (code: string) => {
    setSelectedSystemCode(code);
    if (code === "new") {
      const newCode = `p512-${Date.now().toString().slice(-4)}`;
      setSelectedSystemCode(newCode);
      setSystemName(`Máy p512 Mới (${newCode})`);
      setColumns(defaultColumns);
    } else {
      loadSystemConfig(code);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/layouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemCode: selectedSystemCode,
          systemName,
          title,
          columns,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Lưu cấu hình thành công!");
        fetchSystemsList();
      } else {
        alert("Lỗi khi lưu: " + result.error);
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => window.print();

  const updateZone = (
    colIndex: number,
    zoneIndex: number,
    field: keyof SubZone,
    value: string
  ) => {
    const newCols = [...columns];
    newCols[colIndex].zones[zoneIndex] = {
      ...newCols[colIndex].zones[zoneIndex],
      [field]: value,
    };
    setColumns(newCols);
  };

  const addZoneToColumn = (colIndex: number) => {
    const newCols = [...columns];
    const col = newCols[colIndex];
    col.zones.push({
      id: `${col.colNumber}-${col.zones.length + 1}-${Date.now()}`,
      name: "Phân khu mới",
      capacity: "25 pos",
      subrackCode: "NEW",
      description: "Mô tả phân khu mới",
    });
    setColumns(newCols);
  };

  const removeZoneFromColumn = (colIndex: number, zoneIndex: number) => {
    const newCols = [...columns];
    if (newCols[colIndex].zones.length <= 1) return;
    newCols[colIndex].zones.splice(zoneIndex, 1);
    setColumns(newCols);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white text-slate-800">
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= SECTION 1: BỘ ĐIỀU KHIỂN & CHỌN LAYOUT ================= */}
        <header className="print:hidden bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Đang xem:</span>
              <span className="text-sm font-extrabold uppercase">OUTSORT LAYOUT</span>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-slate-500" />
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block">
                  Cấu hình Hệ Thống
                </label>
                <select
                  value={selectedSystemCode}
                  onChange={(e) => handleSystemChange(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded-lg text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="p512-default">Máy px12 Mặc Định</option>
                  {systemsList.map((sys) => (
                    <option key={sys.system_code} value={sys.system_code}>
                      {sys.system_name} ({sys.system_code})
                    </option>
                  ))}
                  <option value="new">+ Tạo cấu hình máy mới...</option>
                </select>
              </div>

              {isEditing && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">
                    Tên Hệ Thống
                  </label>
                  <input
                    type="text"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    className="p-1 border border-blue-400 rounded text-sm font-medium bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/insort"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition font-medium text-xs shadow-sm"
            >
              <span>Sang Insort Layout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium text-xs shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Đang lưu..." : "Lưu DB"}
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-xs shadow-sm"
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              {isEditing ? "Hoàn tất" : "Chỉnh sửa"}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-200 transition font-medium text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              In Layout
            </button>
          </div>
        </header>

        {/* ================= SECTION 2: SƠ ĐỒ LAYOUT XUẤT MẪU (OUTSORT) ================= */}
        <section className="bg-white p-6 border border-slate-300 rounded-2xl shadow-sm print:shadow-none print:border-none print:p-0">
          <div className="flex items-center justify-between border-b pb-3 mb-4 print:hidden">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wide">
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              SECTION 1:  LAYOUT XUẤT MẪU (OUTSORT)
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" /> Đang tải cấu hình layout...
            </div>
          ) : (
            <div>
              {/* Tiêu đề Trang */}
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold text-center underline mb-4 p-2 border border-blue-400 rounded focus:outline-none print:border-none print:p-0"
                />
              ) : (
                <h1 className="text-2xl font-bold text-center underline mb-4 text-slate-900">
                  {title}
                </h1>
              )}

              {/* TÁCH BIỆT 1: THẺ THÔNG TIN HỆ THỐNG (SYSTEM INFO) */}
              <div className="mb-2 bg-slate-100 border-2 border-black p-2.5 flex items-center justify-between flex-wrap gap-2 text-slate-900 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-700 print:hidden" />
                  <span>Bệnh viện:</span>
                  <span className="font-bold text-base text-blue-900">{systemName}</span>
                </div>
                <div className="text-xs bg-white px-2 py-1 rounded border border-slate-300 font-mono">
                  Mã máy: <span className="font-bold">{selectedSystemCode}</span>
                </div>
              </div>

              {/* TÁCH BIỆT 2: THẺ HEADER TÊN LAYOUT CHÍNH */}
              <div className="bg-[#1B365D] text-white text-center font-bold text-lg py-2 uppercase border-2 border-black tracking-widest shadow-inner">
                OUTSORT LAYOUT
              </div>

              {/* Lưới 8 Cột */}
              <div className="grid grid-cols-8 border-x-2 border-b-2 border-black text-center text-sm font-semibold">
                {columns.map((col) => (
                  <div
                    key={col.colNumber}
                    className="bg-[#1B365D] text-white py-1.5 border-r border-b-2 border-black last:border-r-0 font-bold text-base"
                  >
                    {col.colNumber}
                  </div>
                ))}

                {columns.map((col, colIdx) => {
                  if (col.isWarningZone) {
                    return (
                      <div
                        key={col.colNumber}
                        className="bg-red-600 border-r-2 border-black flex items-center justify-center relative min-h-[380px]"
                      >
                        <span className="text-white text-xs font-bold [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest opacity-90">
                          {col.warningLabel}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={col.colNumber}
                      className={`border-r-2 last:border-r-0 border-black flex flex-col justify-between ${
                        col.bgStyle || "bg-white"
                      } min-h-[380px]`}
                    >
                      {col.zones.map((zone, zoneIdx) => {
                        const rowCount = getRowCountFromCapacity(zone.capacity);

                        return (
                          <div
                            key={zone.id}
                            className={`p-2 border-b last:border-b-0 border-black flex-1 flex flex-col justify-between relative overflow-hidden group ${
                              zone.bgStyle || ""
                            }`}
                          >
                            {rowCount > 0 && (
                              <div className="absolute inset-0 flex flex-col justify-center items-center gap-1 opacity-15 pointer-events-none p-1">
                                {Array.from({
                                  length: Math.min(rowCount, 12),
                                }).map((_, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className="flex gap-1 justify-center items-center w-full"
                                  >
                                    {[1, 2, 3, 4, 5].map((hole) => (
                                      <div
                                        key={hole}
                                        className="w-2.5 h-2.5 rounded-full border border-slate-800 bg-slate-600 shadow-inner"
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}

                            {isEditing && col.zones.length > 1 && (
                              <button
                                onClick={() =>
                                  removeZoneFromColumn(colIdx, zoneIdx)
                                }
                                className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded opacity-80 hover:opacity-100 text-xs z-20 print:hidden"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}

                            <div className="relative z-10 flex flex-col justify-between h-full">
                              {isEditing ? (
                                <div className="space-y-1 bg-white/90 p-1 rounded shadow-sm print:bg-transparent print:p-0 print:shadow-none">
                                  <input
                                    type="text"
                                    value={zone.name}
                                    onChange={(e) =>
                                      updateZone(
                                        colIdx,
                                        zoneIdx,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-xs font-bold p-0.5 border border-blue-300 rounded text-center print:border-none print:p-0"
                                  />
                                  <select
                                    value={zone.capacity}
                                    onChange={(e) =>
                                      updateZone(
                                        colIdx,
                                        zoneIdx,
                                        "capacity",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-[11px] p-0.5 border border-blue-200 rounded text-center bg-white print:border-none print:p-0"
                                  >
                                    <option value="25 pos">25 pos (5 hàng)</option>
                                    <option value="50 pos">50 pos (10 hàng)</option>
                                    <option value="75 pos">75 pos (15 hàng)</option>
                                    <option value="125 pos">125 pos (25 hàng)</option>
                                    <option value="150 pos">150 pos (30 hàng)</option>
                                    <option value="Tùy chọn">Tùy chọn</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={zone.subrackCode}
                                    onChange={(e) =>
                                      updateZone(
                                        colIdx,
                                        zoneIdx,
                                        "subrackCode",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-[10px] p-0.5 border border-blue-200 rounded text-center print:border-none print:p-0"
                                  />
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-sm text-black leading-tight drop-shadow-sm">
                                      {zone.name}
                                    </div>
                                    <div className="text-xs text-slate-800 font-semibold">
                                      {zone.capacity}
                                    </div>
                                  </div>
                                  <div className="text-[11px] text-slate-900 font-normal border-t border-slate-400/60 pt-1 mt-auto bg-white/40 backdrop-blur-[1px] rounded-sm">
                                    Subrack: <span className="font-bold">{zone.subrackCode}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {isEditing && (
                        <button
                          onClick={() => addZoneToColumn(colIdx)}
                          className="m-1 py-1 px-2 bg-blue-50 border border-blue-300 text-blue-600 rounded text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-100 z-10 print:hidden"
                        >
                          <Plus className="w-3 h-3" /> Thêm chia nhỏ
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ================= SECTION 3: BẢNG CHÚ GIẢI & MÔ TẢ CHI TIẾT ================= */}
        <section className="bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-sm print:hidden">
          <div className="bg-[#1B365D] text-white px-5 py-3 font-bold text-base flex items-center gap-2 border-b-2 border-slate-800">
            <FileText className="w-5 h-5 text-blue-300" />
            <span>SECTION 2: MÔ TẢ CHI TIẾT CHỨC NĂNG CÁC CỘT</span>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-800 font-bold uppercase text-[11px] tracking-wider">
                  <th className="p-3 border-r border-slate-300 w-24 text-center">Cột số</th>
                  <th className="p-3 border-r border-slate-300 w-36">Mã Subrack</th>
                  <th className="p-3 border-r border-slate-300 w-48">Tên Phân Khu</th>
                  <th className="p-3 border-r border-slate-300 w-32">Sức Chứa</th>
                  <th className="p-3">Giải Thích Chi Tiết Chức Năng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {columns.flatMap((col, colIdx) =>
                  col.zones.map((zone, zoneIdx) => (
                    <tr
                      key={`${col.colNumber}-${zone.id}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 border-r border-slate-200 font-bold text-center text-slate-700 bg-slate-50/50">
                        Cột {col.colNumber}
                      </td>
                      <td className="p-3 border-r border-slate-200 font-bold">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-md text-xs inline-block text-slate-800 font-mono">
                          {zone.subrackCode}
                        </span>
                      </td>
                      <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">
                        {zone.name}
                      </td>
                      <td className="p-3 border-r border-slate-200 text-slate-700">
                        {zone.capacity}
                      </td>
                      <td className="p-3 text-slate-800">
                        {isEditing ? (
                          <input
                            type="text"
                            value={zone.description}
                            onChange={(e) =>
                              updateZone(colIdx, zoneIdx, "description", e.target.value)
                            }
                            className="w-full p-1.5 border border-blue-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          zone.description
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}