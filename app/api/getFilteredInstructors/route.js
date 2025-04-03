// File: app/api/getFilteredInstructors/route.js
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get('levelId');
    const instrumentId = searchParams.get('instrumentId');
    const date = searchParams.get('date');
    
    // Build the where clause for filtering instructors
    let whereConditions = {};
    
    // If we have a level ID, filter by instructors who can teach that level
    if (levelId) {
      whereConditions.instructor_specialty = {
        some: {
          level_id: levelId
        }
      };
    }
    
    // If we have an instrument ID, filter by instructors who can teach that instrument
    if (instrumentId) {
      // If we already have a level filter, we need to adjust how we filter for instrument
      if (whereConditions.instructor_specialty) {
        whereConditions.instructor_specialty.some = {
          ...whereConditions.instructor_specialty.some,
          instrument_id: parseInt(instrumentId)
        };
      } else {
        whereConditions.instructor_specialty = {
          some: {
            instrument_id: parseInt(instrumentId)
          }
        };
      }
    }
    
    // If we have a date, filter by instructors available on that day
    if (date) {
      const parsedDate = new Date(date);
      
      // First, we need instructors who have availability records for this date
      if (!whereConditions.instructor_availability) {
        whereConditions.instructor_availability = {
          some: {
            date: parsedDate
          }
        };
      } else {
        whereConditions.instructor_availability.some = {
          ...whereConditions.instructor_availability.some,
          date: parsedDate
        };
      }
      
      // Also exclude instructors who have lessons scheduled on this date that fill their capacity
      // This is more complex and might require a separate check after the main query
    }
    
    // Query instructors with the constructed filters
    const instructors = await prisma.instructors.findMany({
      where: whereConditions,
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      }
    });
    
    // Format the results to match your frontend expectations
    const formattedInstructors = instructors.map(instructor => ({
      instructor_id: instructor.instructor_id,
      first_name: instructor.users.first_name,
      last_name: instructor.users.last_name
    }));
    
    return NextResponse.json(formattedInstructors);
  } catch (error) {
    console.error('Error filtering instructors:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}