import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Find user and include related role tables
    const user = await prisma.users.findUnique({ 
      where: { email: email },
      include: {
        clients: true,
        instructors: true,
        admin: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

      // Determine user role and get the role-specific ID
      let role = 'user'; // default role
      let userId = null;

      if (user.admin) {
        role = 'admin';
        userId = user.admin.admin_id;
      } else if (user.instructors) {
        role = 'instructor';
        userId = user.instructors.instructor_id;
      } else if (user.clients) {
        role = 'client';
        userId = user.clients.client_id;
      }

    // Create token with role and appropriate ID included
    const token = jwt.sign(
      { 
        userId: user.user_id, // Use the correct field from prisma schema
        role: role,
        userId: userId // Include the role-specific ID
      }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    return NextResponse.json({ 
      token, 
      role, 
      userId: user.user_id, // Return the user_id from the schema
      userId  // Return the role-specific ID
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}