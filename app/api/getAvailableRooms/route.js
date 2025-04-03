import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  
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

  // Convert date
  const isoDate = new Date(dateParam + "T00:00:00.000Z").toISOString();

  // Convert the time parameters to Date objects.
  const startTime = new Date(startTimeParam);
  const endTime = new Date(endTimeParam);

 
  const conflictingSessions = await prisma.lesson_schedule.findMany({
    where: {
      date: isoDate,
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

  
  const bookedRoomIds = conflictingSessions.map((session) => session.room_id);

  
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