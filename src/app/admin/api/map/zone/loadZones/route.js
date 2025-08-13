import prisma from "@/lib/prismaClient";

export async function GET() {
  try {
    const zones = await prisma.map_zone.findMany();
    
    // Преобразуем geojson строку обратно в объект и добавляем ID из БД
    const zoneFeatures = zones.map((zone) => {
      try {
        const feature = JSON.parse(zone.geojson);
        // Добавляем ID из базы данных в properties
        if (feature.properties) {
          feature.properties.id = zone.id;
        } else {
          feature.properties = { id: zone.id };
        }
        return feature;
      } catch (error) {
        console.error("Error parsing geojson for zone:", zone.id, error);
        return null;
      }
    }).filter(Boolean);
    
    return new Response(
      JSON.stringify({ success: true, zones: zoneFeatures }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error loading zones:", error);
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
