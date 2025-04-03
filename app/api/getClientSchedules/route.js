import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export async function GET() {
  try {
    // Fetch all lesson 
    const schedules = await prisma.lesson_schedule.findMany({
      where: {
        client_id: {
          not: null, 
        },
      },
      select: {
        client_id: true,
        start_time: true,
        end_time: true,
        date: true,
        clients: { 
          select: {
            users: {
              select: {
                first_name: true,
                last_name: true,
              }
            }
          }
        },
        lessons:{
            select:{
            lesson_name:true}
        }
      },
    });



   
    // Format schedules for Calendar
    const formattedSchedules = schedules.map(schedule => {
        const start_time = new Date(schedule.start_time);
        const end_time = new Date(schedule.end_time);

        // Convert times 
        const formattedStartTime = `${start_time.getHours().toString().padStart(2, '0')}:${start_time.getMinutes().toString().padStart(2, '0')}`;
        const formattedEndTime = `${end_time.getHours().toString().padStart(2, '0')}:${end_time.getMinutes().toString().padStart(2, '0')}`;
        const formattedDate = schedule.date? new Date(schedule.date).toISOString().split("T")[0] : null;
        
        const clientFirstName = schedule.clients?.users?.first_name;
        const clientLastName = schedule.clients?.users?.last_name;
        const lessonName = schedule.lessons.lesson_name;
        
        return {
          client_id: schedule.client_id,
          start: formattedStartTime, 
          end: formattedEndTime,     
          title: `Lesson for ${clientFirstName} ${clientLastName}`, 
          date: formattedDate,     
          client_first_name: clientFirstName, // Storing the client's first name
          client_last_name: clientLastName, 
          lesson_name: lessonName,  // Storing the client's last name
        };
      });
      
      console.log(formattedSchedules);
     // Output the formatted result
    return NextResponse.json(formattedSchedules); // Send the schedules as a response
  } catch (error) {
    console.error("Error fetching client schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch client schedules" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
