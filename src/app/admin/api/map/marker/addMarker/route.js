import prisma from '@/lib/prismaClient';

export async function POST(request) {
  try {
    const { x, y, map_zone_id } = await request.json();
    
    console.log('📍 Получен запрос на добавление маркера:', { x, y, map_zone_id });
    
    if (typeof x !== 'number' || typeof y !== 'number') {
      console.error('❌ Неверные координаты маркера:', { x, y });
      return Response.json({ success: false, error: 'Неверные координаты' });
    }

    const marker = await prisma.marker_in_the_zone.create({
      data: {
        x,
        y,
        map_zone_id: map_zone_id || null
      }
    });

    console.log('✅ Маркер успешно добавлен:', marker);

    return Response.json({ 
      success: true, 
      marker: {
        id: marker.id,
        x: marker.x,
        y: marker.y,
        map_zone_id: marker.map_zone_id
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении маркера:', error);
    return Response.json({ success: false, error: error.message });
  }
}
