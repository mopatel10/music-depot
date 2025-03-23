import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    // Basic validation
    if (!body.lesson_id || !body.instructor_id || !body.room_id || !body.start_time || !body.end_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate start and end times
    const startTime = new Date(body.start_time);
    const endTime = new Date(body.end_time);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error('Invalid start or end time');
    }

    // Validate date format (optional)
    let date = null;
    if (body.date) {
      date = new Date(body.date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
    }

    // Create session
    const session = await prisma.lesson_schedule.create({
      data: {
        lesson_id: body.lesson_id,
        instructor_id: body.instructor_id,
        room_id: body.room_id,
        start_time: startTime,
        end_time: endTime,
        cancelled: body.cancelled || false,
        attendingcapacity: body.attendingcapacity,
        date: date,
      },
    });

    return NextResponse.json({ message: "Session created successfully", session });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
