import prisma from "@/lib/prismaClient";

export async function POST(request) {
  try {
    const { zones } = await request.json();
    
    if (!Array.isArray(zones)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid zones format" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const savedZones = [];
    
    // Обрабатываем каждую зону из запроса
    for (const zone of zones) {
      const zoneId = zone.properties?.id;
      const zoneName = zone.properties?.name || 'Без названия';
      
      if (zoneId && zoneId > 0) {
        // Обновляем существующую зону
        const updatedZone = await prisma.map_zone.update({
          where: { id: zoneId },
          data: {
            name: zoneName,
            geojson: JSON.stringify(zone),
          },
        });
        savedZones.push(updatedZone);
      } else {
        // Создаем новую зону
        const newZone = await prisma.map_zone.create({
          data: {
            name: zoneName,
            geojson: JSON.stringify(zone),
          },
        });
        savedZones.push(newZone);
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, zones: savedZones }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error saving zones:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
