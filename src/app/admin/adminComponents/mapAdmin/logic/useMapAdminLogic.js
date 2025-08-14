import { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
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
  const [markers, setMarkers] = useState([]);

  // Загрузка маркеров из БД
  const loadMarkers = async () => {
    try {
      const response = await fetch('/admin/api/map/marker/getMarkers');
      const data = await response.json();
      
      if (data.success && data.markers) {
        console.log('✅ Загружено маркеров из БД:', data.markers.length);
        
        // Отображаем маркеры на карте
        if (mapInstance.current) {
          data.markers.forEach(marker => {
            new maplibregl.Marker({ 
              color: '#FF0000',
              scale: 1.5
            })
              .setLngLat([marker.x, marker.y])
              .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
              .addTo(mapInstance.current);
          });
        }
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки маркеров:', error);
    }
  };

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

  const { markers: newMarkers } = useMarkerHandlers(mapInstance, isAddingMarkers);

  // Загрузка маркеров при монтировании
  useEffect(() => {
    if (mapInstance.current) {
      loadMarkers();
    }
  }, [mapInstance.current]);

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
