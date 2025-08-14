import { useEffect } from "react";
import { loadZonesFromDB } from '../api';

export function useZoneManagement(drawInstance, zones, setZones) {
  // Загрузка зон из базы данных при инициализации
  useEffect(() => {
    const loadZones = async () => {
      try {
        const result = await loadZonesFromDB();
        
        if (result.success && result.zones) {
          setZones(result.zones);
          
          // Добавляем зоны из БД в drawInstance
          if (drawInstance.current && result.zones.length > 0) {
            const geojson = {
              type: "FeatureCollection",
              features: result.zones
            };
            drawInstance.current.add(geojson);
          }
        }
      } catch (error) {
        console.error('Error loading zones:', error);
      }
    };

    loadZones();
  }, [drawInstance, setZones]);
}
