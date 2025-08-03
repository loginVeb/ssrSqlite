import prisma from "@/lib/prismaClient";

export async function POST(request) {
  try {
    const { zones } = await request.json();
    
    // Удаляем все существующие зоны
    await prisma.map_zone.deleteMany();
    
    // Сохраняем новые зоны
    const savedZones = await Promise.all(
      zones.map((zone) => {
        return prisma.map_zone.create({
          data: {
            name: zone.properties?.name || null,
            geojson: JSON.stringify(zone),
          },
        });
      })
    );
    
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
