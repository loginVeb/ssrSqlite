import prisma from "@/lib/prismaClient";

export async function GET() {
  try {
    const zones = await prisma.map_zone.findMany();
    
    // Преобразуем geojson строку обратно в объект
    const zoneFeatures = zones.map((zone) => {
      try {
        return JSON.parse(zone.geojson);
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
