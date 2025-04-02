import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  // Extract query parameters from the request URL.
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const startTimeParam = searchParams.get("start_time");
  const endTimeParam = searchParams.get("end_time");

  if (!dateParam || !startTimeParam || !endTimeParam) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  // Convert date to an ISO string.
  const isoDate = new Date(dateParam + "T00:00:00.000Z").toISOString();

  // Convert the time parameters to Date objects.
  const startTime = new Date(startTimeParam);
  const endTime = new Date(endTimeParam);

  // Fetch sessions that conflict with the provided date and time.
  const conflictingSessions = await prisma.lesson_schedule.findMany({
    where: {
      date: isoDate, // Use the full ISO date
      AND: [
        {
          OR: [
            {
              AND: [
                { start_time: { lte: startTime } },
                { end_time: { gt: startTime } }
              ]
            },
            {
              AND: [
                { start_time: { lt: endTime } },
                { end_time: { gte: endTime } }
              ]
            },
            {
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
    select: { room_id: true }
  });

  // Extract the IDs of the booked rooms.
  const bookedRoomIds = conflictingSessions.map((session) => session.room_id);

  // Fetch rooms that are not booked during the specified time.
  const availableRooms = await prisma.rooms.findMany({
    where: {
      room_id: { notIn: bookedRoomIds }
    },
    select: {
      room_id: true,
      room_type: true,
    }
  });

  return NextResponse.json(availableRooms);
}