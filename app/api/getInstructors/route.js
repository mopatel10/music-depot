import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch instructors and their users' first and last name
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

    // Transform and return only the instructor's ID, first name, and last name
    const formattedData = instructors.map((instructor) => ({
      instructor_id: instructor.instructor_id,
      first_name: instructor.users.first_name,
      last_name: instructor.users.last_name,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}
