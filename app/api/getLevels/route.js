import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const instructorId = request.nextUrl.searchParams.get("instructorId");

  try {
    if (!instructorId) {
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 });
    }

    // Fetch lesson levels for a specific instructor
    const instructor = await prisma.instructors.findUnique({
      where: { instructor_id: instructorId }, // Use instructorId as String (UUID)
      include: {
        instructor_specialty: {
          include: {
            lesson_levels: {
              select: {
                level_id: true,
                level_name: true,
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    // Extract lesson levels from the instructor's specialties
    const levels = instructor.instructor_specialty.flatMap((specialty) => specialty.lesson_levels);

    return NextResponse.json(levels);
  } catch (error) {
    console.error("Error fetching levels:", error);
    return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 });
  }
}
