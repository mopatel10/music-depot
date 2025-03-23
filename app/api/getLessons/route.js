import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch lessons from the database
    const lessons = await prisma.lessons.findMany({

      select: {
        lesson_id:true,
        lesson_name: true,
      },
    });
    console.log(lessons);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
