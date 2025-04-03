import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const { 
    client_id, 
    lesson_id, 
    amount_paid, 
    payment_method, 
    paid 
  } = await req.json();

  // Validation for required fields
  if (!client_id || !lesson_id || !amount_paid || !payment_method) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    // Create a registration record
    const registration = await prisma.registration.create({
      data: {
        client_id,
        lesson_id,
        amount_paid: parseFloat(amount_paid),
        payment_method,
        paid,
        date_registered: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Lesson registration completed successfully', 
      registration 
    }, { status: 201 });
  } catch (error) {
    console.error(error);

    // Handle violations or other database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ 
        error: 'This registration may already exist' 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'An error occurred while processing the registration' 
    }, { status: 500 });
  }
}