import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";

export function useMarkerHandlers(mapInstance, isAddingMarkers, markersRef) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!mapInstance.current || !isAddingMarkers) return;

    const handleMapClick = async (e) => {
      // Предотвращаем всплытие события к другим обработчикам
      e.preventDefault();
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      
      const { lng, lat } = e.lngLat;
      console.log('📍 Клик на карте для добавления маркера:', { lng, lat });

      try {
        const response = await fetch('/admin/api/map/marker/addMarker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ x: lng, y: lat }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Маркер добавлен в БД:', result.marker);
          console.log('🎯 Создаю маркер на карте:', [result.marker.x, result.marker.y]);
          
            // Создаем HTML-элемент для маркера с эмодзи 📍
            const markerElement = document.createElement('div');
            markerElement.innerHTML = '📍';
            markerElement.style.fontSize = '24px';
            markerElement.style.cursor = 'pointer';
            markerElement.style.userSelect = 'none';
            markerElement.style.pointerEvents = 'auto';
            
            const newMarker = new maplibregl.Marker({
              element: markerElement,
              anchor: 'bottom',
              offset: [0, -12]
            })
              .setLngLat([result.marker.x, result.marker.y])
              .setPopup(new maplibregl.Popup().setText(`Маркер #${result.marker.id}`))
              .addTo(mapInstance.current);

          console.log('✅ Маркер создан и добавлен на карту:', newMarker);
          
          // Добавляем в состояние и в markersRef
          setMarkers(prev => [...prev, { ...result.marker, mapMarker: newMarker }]);
          
          // Добавляем маркер в markersRef для синхронизации
          if (markersRef.current) {
            markersRef.current.push(newMarker);
          }
        } else {
          console.error('❌ Ошибка добавления маркера:', result.error);
        }
      } catch (error) {
        console.error('❌ Ошибка при добавлении маркера:', error);
      }
    };

    // Добавляем обработчик клика
    mapInstance.current.on('click', handleMapClick);

    // Очистка
    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('click', handleMapClick);
      }
    };
  }, [mapInstance, isAddingMarkers]);

  return { markers };
}
