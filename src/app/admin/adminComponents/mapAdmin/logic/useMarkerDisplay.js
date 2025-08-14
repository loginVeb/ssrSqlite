import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export function useMarkerDisplay(mapInstance, markers = []) {
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Очищаем старые маркеры
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Добавляем новые маркеры
    markers.forEach(markerData => {
      console.log('Добавляю маркер на карту:', markerData); // Отладочное сообщение
      console.log('Текущий экземпляр карты:', mapInstance.current); // Логирование экземпляра карты
      console.log('Координаты маркера:', markerData.x, markerData.y); // Логирование координат
      console.log('Текущие координаты карты:', mapInstance.current.getCenter()); // Логирование центра карты
      const marker = new maplibregl.Marker({
        zIndex: 1001,
        color: '#FF0000',
        scale: 1.2,
        draggable: false
      })
        .setLngLat([markerData.x, markerData.y])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px; font-size: 14px;">
                <strong>Маркер #${markerData.id}</strong><br/>
                Координаты: ${markerData.x.toFixed(4)}, ${markerData.y.toFixed(4)}
              </div>
            `)
        )
        .addTo(mapInstance.current);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
    };
  }, [mapInstance, markers]);

  return { clearMarkers: () => markersRef.current.forEach(m => m.remove()) };
}
