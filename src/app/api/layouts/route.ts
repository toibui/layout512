import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

// 1. Lấy danh sách hoặc lấy 1 layout cụ thể theo system_code
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const systemCode = searchParams.get("systemCode");

  try {
    if (systemCode) {
      const result = await sql`
        SELECT * FROM system_layouts WHERE system_code = ${systemCode} LIMIT 1
      `;
      return NextResponse.json(result[0] || null);
    } else {
      // Lấy danh sách tất cả các hệ thống đã lưu
      const list = await sql`
        SELECT system_code, system_name, updated_at FROM system_layouts ORDER BY updated_at DESC
      `;
      return NextResponse.json(list);
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// 2. Lưu / Cập nhật cấu hình hệ thống (UPSERT)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { systemCode, systemName, title, columns } = body;

    if (!systemCode || !columns) {
      return NextResponse.json({ error: "Thiếu dữ liệu bắt buộc" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO system_layouts (system_code, system_name, title, columns_data, updated_at)
      VALUES (${systemCode}, ${systemName}, ${title}, ${JSON.stringify(columns)}, NOW())
      ON CONFLICT (system_code) 
      DO UPDATE SET 
        system_name = EXCLUDED.system_name,
        title = EXCLUDED.title,
        columns_data = EXCLUDED.columns_data,
        updated_at = NOW()
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}