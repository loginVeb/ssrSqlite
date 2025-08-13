import { useRef, useState } from "react";
import { useMapInitialization } from "./useMapInitialization";
import { useZoneManagement } from "./useZoneManagement";
import { useDrawingHandlers } from "./useDrawingHandlers";
import { useDeleteHandlers } from "./useDeleteHandlers";
import { useSaveZones } from "./useSaveHandlers";
import { useMarkerHandlers } from "./useMarkerHandlers";

export function useMapAdminLogic() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const drawInstance = useRef(null);
  const [zones, setZones] = useState([]);
  const [isAddingMarkers, setIsAddingMarkers] = useState(false);

  // Использование всех хуков
  useMapInitialization(mapContainer, mapInstance, drawInstance);
  useZoneManagement(drawInstance, zones, setZones);
  useDrawingHandlers(mapInstance, drawInstance, zones, setZones);
  
  const { handleDeleteZone, handleDeleteZoneByClick } = useDeleteHandlers(
    mapInstance, 
    drawInstance, 
    zones, 
    setZones
  );
  
  const { handleSaveZones, isSaving } = useSaveZones(
    drawInstance, 
    zones, 
    setZones
  );

  const { markers } = useMarkerHandlers(mapInstance, isAddingMarkers);

  return {
    mapContainer,
    handleSaveZones,
    isSaving,
    drawInstance,
    handleDeleteZoneByClick,
    isAddingMarkers,
    setIsAddingMarkers,
    markers
  };
}
