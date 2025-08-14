import { useState } from "react";
import { saveZonesToDB } from '../api';

export function useSaveZones(drawInstance, zones, setZones) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveZones = async () => {
    setIsSaving(true);
    try {
      const currentZones = drawInstance.current?.getAll().features || [];
      
      // Подготавливаем зоны для сохранения
      const zonesToSave = currentZones.map(feature => {
        const zone = {
          ...feature,
          properties: {
            ...feature.properties,
            // Удаляем временные ID для новых зон
            id: feature.properties?.id && feature.properties.id > 0 ? feature.properties.id : undefined
          }
        };
        return zone;
      });

      const result = await saveZonesToDB(zonesToSave);
      
      if (result.success && result.zones) {
        console.log('Zones saved successfully');
        
        // Обновляем локальное состояние с новыми ID из БД
        const updatedZones = result.zones.map(zone => {
          const parsedGeojson = JSON.parse(zone.geojson);
          parsedGeojson.properties = {
            ...parsedGeojson.properties,
            id: zone.id
          };
          return parsedGeojson;
        });
        
        setZones(updatedZones);
        
        // Обновляем drawInstance с новыми ID
        if (drawInstance.current && updatedZones.length > 0) {
          const geojson = {
            type: "FeatureCollection",
            features: updatedZones
          };
          drawInstance.current.set(geojson);
        }
      }
    } catch (error) {
      console.error('Error saving zones:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSaveZones, isSaving };
}
