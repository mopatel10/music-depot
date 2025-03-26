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

    // Determine user role
    let role = 'user'; // default role
    if (user.admin) {
      role = 'admin';
    } else if (user.instructors) {
      role = 'instructor';
    } else if (user.clients) {
      role = 'client';
    }

    // Create token with role included
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: role 
      }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    return NextResponse.json({ token, role }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}