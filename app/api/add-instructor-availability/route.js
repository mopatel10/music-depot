import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    // Basic validation
    if (!body.instructor_id || !body.start_time || !body.end_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate start and end times
    const startTime = new Date(body.start_time);
    const endTime = new Date(body.end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error("Invalid start or end time");
    }

    // Validate date format 
    let date = null;
    if (body.date) {
      date = new Date(body.date);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
    }

    // Check if the instructor already has an availability at the specified time
    const existingAvailability = await prisma.instructor_availability.findFirst({
      where: {
        instructor_id: body.instructor_id,
        date: date,
        AND: [
          {
            OR: [
              {
                // New start time falls within existing session
                AND: [
                  { start_time: { lte: startTime } },
                  { end_time: { gt: startTime } }
                ]
              },
              {
                // New end time falls within existing session
                AND: [
                  { start_time: { lt: endTime } },
                  { end_time: { gte: endTime } }
                ]
              },
              {
                // New session completely contains existing session
                AND: [
                  { start_time: { gte: startTime } },
                  { end_time: { lte: endTime } }
                ]
              }
            ]
          }
        ]
      }
    });

    if (existingAvailability) {
      return NextResponse.json(
        { 
          error: "Instructor already has availability during this time period",
          conflicting_session: existingAvailability
        },
        { status: 409 }
      );
    }

    // Create session
    const session = await prisma.instructor_availability
    .create({
      data: {
        instructor_id: body.instructor_id,
        start_time: startTime,
        end_time: endTime,
        date: date,
      },
    });

    return NextResponse.json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}