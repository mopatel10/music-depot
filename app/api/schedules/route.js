import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");
    const date = searchParams.get("date");

    let data = [];
    switch (view) {
      case "ViewLessons":
        if (date) {
          // Fetch lessons for the specific date
          const startOfDay = new Date(`${date}T00:00:00.000Z`);
          const endOfDay = new Date(`${date}T23:59:59.999Z`);
          data = await prisma.lessons.findMany({
            where: {
              start_date: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
            include: {
              instructors: {
                include: {
                  users: true, // Include user details for the instructor
                },
              },
              lesson_levels: true, // Include lesson levels
              lesson_schedule: true, // Include lesson schedules
            },
          });
        } else {
          // Fetch all lessons if no date is provided
          data = await prisma.lessons.findMany({
            include: {
              instructors: {
                include: {
                  users: true, // Include user details for the instructor
                },
              },
              lesson_levels: true, // Include lesson levels
              lesson_schedule: true, // Include lesson schedules
            },
          });
        }
        break;

      case "ViewInstructors":
        // Fetch instructors and their related lessons
        data = await prisma.instructors.findMany({
          include: {
            lessons: true, // Include lessons for each instructor
          },
        });
        break;

      case "ViewClients":
        // Fetch clients
        data = await prisma.clients.findMany();
        break;

      default:
        return NextResponse.json({ error: "Invalid view type" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}