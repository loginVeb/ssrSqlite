import { useRef, useState } from "react";
import { useMapInitialization } from "./useMapInitialization";
import { useZoneManagement } from "./useZoneManagement";
import { useDrawingHandlers } from "./useDrawingHandlers";
import { useDeleteHandlers } from "./useDeleteHandlers";
import { useSaveHandlers } from "./useSaveHandlers";
import { loadZonesFromDB, saveZonesToDB, deleteZoneFromDB } from "./api";

export function useMapAdminLogic() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const drawInstance = useRef(null);
  const [zones, setZones] = useState([]);

  // Использование всех хуков
  useMapInitialization(mapContainer, mapInstance, drawInstance);
  
  const { updateZonesWithIds } = useZoneManagement(drawInstance, zones, setZones);
  useDrawingHandlers(mapInstance, drawInstance, zones, setZones);
  
  const { handleDeleteZone, handleDeleteZoneByClick } = useDeleteHandlers(
    mapInstance, 
    drawInstance, 
    zones, 
    setZones
  );
  
  const { handleSaveZones, isSaving } = useSaveHandlers(
    drawInstance, 
    zones, 
    setZones, 
    updateZonesWithIds
  );

  return {
    mapContainer,
    handleSaveZones,
    isSaving,
    drawInstance,
    handleDeleteZoneByClick
  };
}
