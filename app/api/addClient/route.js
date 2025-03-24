import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { firstName, lastName, email, phoneNumber, password } = await req.json();

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
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

    // Create a client associated with the user
    await prisma.clients.create({
      data: {
        user_id: user.user_id,
      },
    });

    return NextResponse.json({ message: 'Client added successfully', user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while adding the client' }, { status: 500 });
  }
}
