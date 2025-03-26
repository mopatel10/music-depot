import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch lessons with their instructor's name
    const lessons = await prisma.lessons.findMany({
      select: {
        lesson_id:true,
        lesson_name:true,
        instructors: {
          include: {
            users: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    // Transform and return lesson data with instructor name
    const formattedData = lessons.map((lesson) => ({
      lesson_id: lesson.lesson_id,
      lesson_name: lesson.lesson_name,
      instructor_name: `${lesson.instructors.users.first_name} ${lesson.instructors.users.last_name}`,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}