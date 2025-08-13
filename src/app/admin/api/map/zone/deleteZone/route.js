import prisma from "@/lib/prismaClient";

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id || typeof id !== 'number') {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid zone ID" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await prisma.map_zone.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Zone deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting zone:", error);
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
