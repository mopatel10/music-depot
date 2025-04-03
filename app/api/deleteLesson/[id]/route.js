import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
<<<<<<< HEAD
  const { id } = params; 
=======
  const { id } = await params; // Extract the lesson ID from params

>>>>>>> e3056e23d501439fe4f191a01f575f82f5e589b7
  try {
    
    const deletedLesson = await prisma.lessons.delete({
      where: {
        lesson_id: String(id), 
      },
    });

    return new Response(
      JSON.stringify({ message: 'Lesson deleted successfully', lesson: deletedLesson }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to delete lesson' }),
      { status: 500 }
    );
  }
}