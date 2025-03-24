import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
      // Fetch financial data with joined information
      const financials = await prisma.registration.findMany({
        select: {
          paid: true,
          payment_method: true,
          amount_paid: true,
          clients: {
            select: {
              users: {
                select: {
                  first_name: true,
                  last_name: true
                }
              }
            }
          },
          lessons: {
            select: {
              lesson_name: true
            }
          }
        }
      });

      // Transform the data to match the expected format
      const formattedFinancials = financials.map(financial => ({
        client_name: `${financial.clients?.users?.first_name || 'Unknown'} ${financial.clients?.users?.last_name || 'User'}`,
        paid: financial.paid,
        payment_method: financial.payment_method,
        lesson_name: financial.lessons?.lesson_name || 'N/A',
        amount: financial.amount_paid.toString()
      }));

      return NextResponse.json(formattedFinancials, { status: 200 });
    } catch (error) {
      console.error('Request error', error);
      return NextResponse.json({ 
        error: 'Error fetching financial data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
}