import { useState } from "react";
import { saveZonesToDB } from './api';

export function useSaveZones(drawInstance, zones, setZones) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveZones = async () => {
    setIsSaving(true);
    try {
      const currentZones = drawInstance.current?.getAll().features || [];
      const result = await saveZonesToDB(currentZones);
      
      if (result.success) {
        console.log('Zones saved successfully');
      }
    } catch (error) {
      console.error('Error saving zones:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSaveZones, isSaving };
}
