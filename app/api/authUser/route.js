import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma"; 

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req) {
  try {

    const { email, password } = await req.json();



    const user = await prisma.users.findUnique({ where: { email: email } });


    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
 

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
