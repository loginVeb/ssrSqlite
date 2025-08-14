import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';

export async function POST(request) {
  try {
    const { x, y, map_zone_id } = await request.json();
    
    const marker = await prisma.marker_in_the_zone.create({
      data: {
        x,
        y,
        map_zone_id: map_zone_id || null
      }
    });

    return NextResponse.json({
      success: true,
      marker: marker
    });
  } catch (error) {
    console.error('Ошибка при добавлении маркера:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
