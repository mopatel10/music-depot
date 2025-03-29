import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all lesson levels
    const levels = await prisma.lesson_levels.findMany({
      select: {
        level_id: true,
        level_name: true,
      },
      orderBy: {
        level_name: 'asc'
      }
    });

    return NextResponse.json(levels);
  } catch (error) {
    console.error("Error fetching all levels:", error);
    return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 });
  }
}