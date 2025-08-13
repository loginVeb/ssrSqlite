import { useEffect } from "react";

export function useDrawingHandlers(mapInstance, drawInstance, zones, setZones) {
  useEffect(() => {
    if (!mapInstance.current || !drawInstance.current) return;

    // Обработка событий рисования
    mapInstance.current.on("draw.create", (e) => {
      const features = e.features;
      setZones((prev) => [...prev, ...features]);
    });

    mapInstance.current.on("draw.delete", (e) => {
      const deletedFeatures = e.features;
      deletedFeatures.forEach(feature => {
        const zoneId = feature.properties?.id;
        if (zoneId && typeof zoneId === 'number') {
          // Обработка удаления будет в другом хуке
        }
      });
    });

    mapInstance.current.on("draw.update", (e) => {
      const currentZones = drawInstance.current.getAll().features;
      setZones(currentZones);
    });
  }, [mapInstance, drawInstance, zones, setZones]);
}
