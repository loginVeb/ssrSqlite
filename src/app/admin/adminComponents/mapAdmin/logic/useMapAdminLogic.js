// Функции файла useMapAdminLogic.js:
// Основное назначение: Главный хук для координации всех компонентов карты в админ-панели.

import { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useMapInitialization } from "./mapInitialization";
import { useZoneManagement } from "./zoneLogic/useZoneManagement";
import { useDrawingHandlers } from "./zoneLogic/useDrawingHandlers";
import { useDeleteHandlers } from "./zoneLogic/useDeleteHandlers";
import { useSaveZones } from "./zoneLogic/useSaveHandlers";
import { useMarkerHandlers } from "./markerLogic/useMarkerHandlers";

export function useMapAdminLogic() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const drawInstance = useRef(null);
  const [zones, setZones] = useState([]);
  const [isAddingMarkers, setIsAddingMarkers] = useState(false);
  const [markers, setMarkers] = useState([]);
  const markersRef = useRef([]);

  // Загрузка маркеров из БД
  const loadMarkers = async () => {
    try {
      const response = await fetch('/admin/api/map/marker/getMarkers');
      const data = await response.json();
      
      if (data.success && data.markers) {
        console.log('✅ Загружено маркеров из БД:', data.markers.length);
        
        // Импортируем улучшенную функцию для отображения маркеров
        const { displayMarkers } = await import('./markerLogic/markerDisplayEnhanced.js');
        const { validateMarkers } = await import('./markerLogic/markerDisplayEnhanced.js');
        
        // Валидируем маркеры перед отображением
        const validMarkers = validateMarkers(data.markers);
        console.log('✅ Валидных маркеров:', validMarkers.length);
        
        // Отображаем маркеры на карте
        if (mapInstance.current) {
          displayMarkers(mapInstance.current, validMarkers, markersRef);
        }
        
        // Обновляем состояние маркеров
        setMarkers(validMarkers);
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

  const { markers: newMarkers } = useMarkerHandlers(mapInstance, isAddingMarkers, markersRef);

  // Загрузка маркеров при монтировании карты и обновление при добавлении новых
  useEffect(() => {
    if (mapInstance.current) {
      loadMarkers();
    }
  }, [mapInstance.current, isAddingMarkers]);

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
