import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const instructors = await prisma.instructors.findMany({
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // Format data to return instructor_id with first_name and last_name
    const formattedData = instructors.map((instructor) => ({
      instructor_id: instructor.instructor_id,
      first_name: instructor.users.first_name,
      last_name: instructor.users.last_name,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}
