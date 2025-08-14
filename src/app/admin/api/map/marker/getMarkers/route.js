import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';

export async function GET() {
  try {
    const markers = await prisma.marker_in_the_zone.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      markers: markers
    });
  } catch (error) {
    console.error('Ошибка при получении маркеров:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
