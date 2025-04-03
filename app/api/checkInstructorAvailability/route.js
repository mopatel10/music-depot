// File: app/api/checkInstructorAvailability/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('instructorId');
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    if (!instructorId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Parse date and times
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);
    let parsedDate = null;
    
    if (date) {
      parsedDate = new Date(date);
      // Ensure it's just the date portion
      parsedDate = new Date(parsedDate.toISOString().split('T')[0]);
    }

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
      return NextResponse.json({ error: "Invalid start or end time" }, { status: 400 });
    }

    // Validate that end time is after start time
    if (parsedEndTime <= parsedStartTime) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // Check if the instructor has any session scheduled during this time
    const existingInstructorSession = await prisma.lesson_schedule.findFirst({
      where: {
        instructor_id: instructorId,
        date: parsedDate,
        AND: [
          {
            OR: [
              {
                // New start time is within the existing booking
                AND: [
                  { start_time: { lte: parsedStartTime } },
                  { end_time: { gt: parsedStartTime } }
                ]
              },
              {
                // New end time is within the existing booking
                AND: [
                  { start_time: { lt: parsedEndTime } },
                  { end_time: { gte: parsedEndTime } }
                ]
              },
              {
                // New booking completely contains existing booking
                AND: [
                  { start_time: { gte: parsedStartTime } },
                  { end_time: { lte: parsedEndTime } }
                ]
              },
              {
                // Existing booking completely contains new booking
                AND: [
                  { start_time: { lte: parsedStartTime } },
                  { end_time: { gte: parsedEndTime } }
                ]
              }
            ]
          }
        ],
        cancelled: false
      },
      include: {
        lessons: { select: { lesson_name: true } }
      }
    });

    if (existingInstructorSession) {
      return NextResponse.json({
        available: false,
        error: "Instructor is already booked during this time",
        conflicting_session: {
          session_id: existingInstructorSession.session_id,
          lesson_name: existingInstructorSession.lessons.lesson_name,
          start_time: existingInstructorSession.start_time,
          end_time: existingInstructorSession.end_time,
          date: existingInstructorSession.date
        }
      }, { status: 200 });
    }

    // Extract just the time portion for comparison with TIME fields in the database
    const startTimeOnly = new Date(parsedStartTime);
    const endTimeOnly = new Date(parsedEndTime);
    
    // Check if instructor has availability for this date and time in instructor_availability table
    let instructorHasAvailability = true;
    
    if (parsedDate) {
      // Look for an availability record that covers the requested time slot
      const instructorAvailability = await prisma.instructor_availability.findFirst({
        where: {
          instructor_id: instructorId,
          date: parsedDate,
          start_time: {
            lte: startTimeOnly
          },
          end_time: {
            gte: endTimeOnly
          }
        }
      });

      instructorHasAvailability = !!instructorAvailability;
    }

    return NextResponse.json({
      available: instructorHasAvailability,
      message: instructorHasAvailability ? 
        "Instructor is available during this time" : 
        "Instructor has no availability record for this time"
    });

  } catch (error) {
    console.error("Error checking instructor availability:", error);
    return NextResponse.json({ error: "Failed to check instructor availability" }, { status: 500 });
  }
}