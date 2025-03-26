import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch client and their users' first and last name
    const client = await prisma.clients.findMany({
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // Transform and return only the client's ID, first name, and last name
    const formattedData = client.map((client) => ({
      client_id: client.client_id,
      first_name: client.users.first_name,
      last_name: client.users.last_name,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}
