import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { URL } from 'url';

export async function GET(req) {
  try {
    // Extract ID from URL search params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If a specific user ID is provided, fetch that user
    if (id) {
      const user = await prisma.users.findUnique({
        where: { user_id: id },
        include: {
          clients: true,
          instructors: true
        }
      });

      if (!user) {
        return NextResponse.json({ 
          error: 'User not found' 
        }, { status: 404 });
      }

      // Determine role and details
      let role = 'Unknown';
      let additionalInfo = {};

      if (user.clients) {
        role = 'Client';
        additionalInfo = {
          client_id: user.clients.client_id
        };
      } else if (user.instructors) {
        role = 'Instructor';
        additionalInfo = {
          instructor_id: user.instructors.instructor_id,
          employment_type: user.instructors.employment_type
        };
      }

      return NextResponse.json({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        status: user.status,
        role: role,
        ...additionalInfo
      });
    }

    // If no specific user ID, fetch all users
    const users = await prisma.users.findMany({
      include: {
        clients: true,
        instructors: true
      },
      orderBy: {
        first_name: 'asc'
      }
    });

    // Transform users to include role and additional details
    const formattedUsers = users.map(user => {
      // Determine role and additional details
      let role = 'Unknown';
      let additionalInfo = {};

      if (user.clients) {
        role = 'Client';
        additionalInfo = {
          client_id: user.clients.client_id
        };
      } else if (user.instructors) {
        role = 'Instructor';
        additionalInfo = {
          instructor_id: user.instructors.instructor_id,
          employment_type: user.instructors.employment_type
        };
      }

      return {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        status: user.status,
        role: role,
        ...additionalInfo
      };
    });

    return NextResponse.json({
      total_users: formattedUsers.length,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}