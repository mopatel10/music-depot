// /app/api/UpdateSession/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const { sessionId, cancelled } = await req.json();
    await prisma.lesson_schedule.update({
      where: { session_id: sessionId },
      data: { cancelled },
    });

    return NextResponse.json({ message: "Session updated successfully" });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
