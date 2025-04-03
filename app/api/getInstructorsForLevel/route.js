import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const levelId = request.nextUrl.searchParams.get("levelId");

  try {
    if (!levelId) {
      return NextResponse.json({ error: "Level ID is required" }, { status: 400 });
    }

    // Find instructors(based on level and specialties)
    const instructors = await prisma.instructors.findMany({
      where: {
        instructor_specialty: {
          some: {
            level_id: levelId
          }
        }
      },
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
          }
        }
      },
      orderBy: {
        users: {
          last_name: 'asc',
        }
      }
    });

    // Format the instructor data information
    const formattedInstructors = instructors.map(instructor => ({
      instructor_id: instructor.instructor_id,
      first_name: instructor.users.first_name,
      last_name: instructor.users.last_name
    }));

    return NextResponse.json(formattedInstructors);
  } catch (error) {
    console.error("Error fetching instructors for level:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}