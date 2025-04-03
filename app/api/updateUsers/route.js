import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    // Parse request body
    const { 
      user_id,
      first_name, 
      last_name, 
      email, 
      phone_number, 
      employment_type 
    } = await req.json();

    // Validate input
    if (!user_id || !first_name || !last_name || !email || !phone_number) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Find the user to update
    const currentUser = await prisma.users.findUnique({
      where: { user_id: user_id },
      include: {
        instructors: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { user_id: user_id },
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number
      }
    });

    // Update instructor when applicable
    if (currentUser.instructors && employment_type) {
      await prisma.instructors.update({
        where: { user_id: user_id },
        data: {
          employment_type: employment_type
        }
      });
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // validation for email
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'An account with this email already exists' 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'Failed to update user profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}