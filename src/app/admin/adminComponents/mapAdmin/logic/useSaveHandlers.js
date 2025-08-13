import { useState } from "react";
import { saveZonesToDB } from './useApiCalls';

export function useSaveHandlers(drawInstance, zones, setZones, updateZonesWithIds) {
  const [isSaving, setIsSaving] = useState(false);

  // Функция для сохранения зон в базе данных
  const handleSaveZones = async () => {
    setIsSaving(true);
    try {
      const currentZones = drawInstance.current.getAll().features;
      
      const result = await saveZonesToDB(currentZones);
      
      if (result.success) {
        console.log('Zones saved successfully');
        updateZonesWithIds(currentZones, result.zones);
      } else {
        console.error('Error saving zones:', result.error);
      }
    } catch (error) {
      console.error('Error saving zones:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSaveZones, isSaving };
}
