import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
  try {
    
    const { id } = await req.json(); 

    if (!id) {
      return new Response(JSON.stringify({ message: "Session ID is required" }), { status: 400 });
    }

    // Delete the session from the lesson_schedule table
    const deletedSession = await prisma.lesson_schedule.delete({
      where: {
        session_id: id, 
      },
    });

    return new Response(
      JSON.stringify({ message: "Session deleted successfully", session: deletedSession }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting session:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete session" }),
      { status: 500 }
    );
  }
}
