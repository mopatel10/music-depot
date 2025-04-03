import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
     
      const instruments = await prisma.instruments.findMany({
        select: {
          instrument_id: true,
          instrument_name: true,
      }
    });

      return NextResponse.json(instruments, { status: 200 });
    } catch (error) {
      console.error('Request error', error);
      return NextResponse.json({ 
        error: 'Error fetching financial data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
}