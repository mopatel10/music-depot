import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { 
    firstName, 
    lastName, 
    email, 
    phoneNumber, 
    password, 
    employmentType 
  } = await req.json();

  // Validate all required fields
  if (!firstName || !lastName || !email || !phoneNumber || !password || !employmentType) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a user
    const user = await prisma.users.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        password: hashedPassword,
        status: 'A', // Assuming 'A' for active
      },
    });

    // Create an instructor associated with the user
    const instructor = await prisma.instructors.create({
      data: {
        user_id: user.user_id,
        employment_type: employmentType,
      },
    });

    return NextResponse.json({ 
      message: 'Instructor added successfully', 
      user,
      instructor 
    }, { status: 201 });
  } catch (error) {
    console.error(error);

    // Handle unique constraint violation for email
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'An account with this email already exists' 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'An error occurred while adding the instructor' 
    }, { status: 500 });
  }
}