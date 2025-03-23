import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.instructor_id || !body.lesson_name || !body.level_id || !body.status || !body.start_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate date format
    const startDate = new Date(body.start_date);
    if (isNaN(startDate.getTime())) throw new Error('Invalid start date');
    
    console.log("Date:",startDate);
    // Create lesson
    const lesson = await prisma.lessons.create({
      data: {
        instructor_id: body.instructor_id,
        lesson_name: body.lesson_name,
        level_id: body.level_id,
        status: body.status,
        cost: parseFloat(body.cost),
        total_lessons: parseInt(body.total_lessons, 10),
        capacity: parseInt(body.capacity, 10),
        start_date: startDate,
      },
    });

    return NextResponse.json({ message: "Lesson created successfully", lesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
