import { useEffect, useState } from "react";

export function useMarkerHandlers(mapInstance, isAddingMarkers) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!mapInstance.current || !isAddingMarkers) return;

    const handleMapClick = async (e) => {
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
          
          // Отображаем маркер на карте
          const newMarker = new maplibregl.Marker({ color: '#FF0000' })
            .setLngLat([result.marker.x, result.marker.y])
            .setPopup(new maplibregl.Popup().setText(`Маркер #${result.marker.id}`))
            .addTo(mapInstance.current);

          // Добавляем в состояние
          setMarkers(prev => [...prev, { ...result.marker, mapMarker: newMarker }]);
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
