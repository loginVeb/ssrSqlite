import { useEffect } from "react";
import { loadZonesFromDB } from './useApiCalls';

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

  // Функция для обновления локальных зон с новыми ID из базы данных
  const updateZonesWithIds = (currentZones, savedZones) => {
    if (savedZones && savedZones.length > 0) {
      const updatedZones = currentZones.map((zone, index) => {
        const savedZone = savedZones[index];
        return {
          ...zone,
          properties: {
            ...zone.properties,
            id: savedZone.id
          }
        };
      });
      
      setZones(updatedZones);
      
      // Обновляем drawInstance с новыми ID
      if (drawInstance.current) {
        const geojson = {
          type: "FeatureCollection",
          features: updatedZones
        };
        drawInstance.current.set(geojson);
      }
    }
  };

  return { updateZonesWithIds };
}
