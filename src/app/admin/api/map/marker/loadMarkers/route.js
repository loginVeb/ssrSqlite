import prisma from '@/lib/prismaClient';

export async function GET(request) {
  try {
    console.log('📍 Получен запрос на загрузку маркеров');
    
    const markers = await prisma.marker_in_the_zone.findMany({
      orderBy: { id: 'asc' }
    });

    console.log('✅ Маркеры успешно загружены:', markers.length);
    
    return Response.json({ 
      success: true, 
      markers: markers.map(marker => ({
        id: marker.id,
        x: marker.x,
        y: marker.y,
        map_zone_id: marker.map_zone_id
      }))
    });
    
  } catch (error) {
    console.error('❌ Ошибка при загрузке маркеров:', error);
    return Response.json({ success: false, error: error.message });
  }
}
