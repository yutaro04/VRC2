import { NextResponse } from "next/server";
import { getAllDevices } from "@/repositories/deviceRepository";

/**
 * GET /api/devices
 * すべてのデバイスを取得
 */
export async function GET() {
  try {
    const devices = await getAllDevices();
    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      { message: "デバイスの取得に失敗しました" },
      { status: 500 }
    );
  }
}
