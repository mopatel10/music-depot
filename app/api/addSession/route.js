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

    // Check if the lesson exists and get its capacity
    const lesson = await prisma.lessons.findUnique({
      where: {
        lesson_id: body.lesson_id
      },
      select: {
        capacity: true,
        lesson_name: true
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if attendingCapacity exceeds lesson capacity
    if (body.attendingcapacity && body.attendingcapacity > lesson.capacity) {
      return NextResponse.json({
        error: "Attending capacity exceeds lesson capacity",
        lesson_capacity: lesson.capacity,
        requested_capacity: body.attendingcapacity
      }, { status: 400 });
    }

    // Check if client_id is provided (since it's optional)
    if (body.client_id) {
      // Check if the client is already booked at this time
      const existingClientBooking = await prisma.lesson_schedule.findFirst({
        where: {
          client_id: body.client_id,
          date: date,
          AND: [
            {
              OR: [
                {
                  // New start time falls within existing booking
                  AND: [
                    { start_time: { lte: startTime } },
                    { end_time: { gt: startTime } }
                  ]
                },
                {
                  // New end time falls within existing booking
                  AND: [
                    { start_time: { lt: endTime } },
                    { end_time: { gte: endTime } }
                  ]
                },
                {
                  // New booking completely contains existing booking
                  AND: [
                    { start_time: { gte: startTime } },
                    { end_time: { lte: endTime } }
                  ]
                }
              ]
            }
          ],
          cancelled: false
        },
        include: {
          lessons: {
            select: {
              lesson_name: true
            }
          }
        }
      });

      if (existingClientBooking) {
        return NextResponse.json({
          error: "Client is already booked during this time period",
          conflicting_session: {
            session_id: existingClientBooking.session_id,
            lesson_name: existingClientBooking.lessons.lesson_name,
            start_time: existingClientBooking.start_time,
            end_time: existingClientBooking.end_time,
            date: existingClientBooking.date
          }
        }, { status: 409 });
      }
    }

    // Check if room is booked during this time
    const existingRoomBooking = await prisma.lesson_schedule.findFirst({
      where: {
        room_id: body.room_id,
        date: date,
        AND: [
          {
            OR: [
              {
                // New start time is within the existing booking
                AND: [
                  { start_time: { lte: startTime } },
                  { end_time: { gt: startTime } }
                ]
              },
              {
                // New end time is within the existing booking
                AND: [
                  { start_time: { lt: endTime } },
                  { end_time: { gte: endTime } }
                ]
              },
              {
                // new booking is completely within a current booking 
                AND: [
                  { start_time: { gte: startTime } },
                  { end_time: { lte: endTime } }
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

    if (existingRoomBooking) {
      return NextResponse.json({
        error: "Room is already booked during this time period",
        conflicting_session: {
          session_id: existingRoomBooking.session_id,
          lesson_name: existingRoomBooking.lessons.lesson_name,
          start_time: existingRoomBooking.start_time,
          end_time: existingRoomBooking.end_time,
          date: existingRoomBooking.date
        }
      }, { status: 409 });
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
        client_id: body.client_id
      },
    });

    return NextResponse.json({ message: "Session created successfully", session });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}