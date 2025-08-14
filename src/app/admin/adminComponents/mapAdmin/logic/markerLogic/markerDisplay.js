// Унифицированная логика отображения маркеров на карте

import maplibregl from "maplibre-gl";

// Отображение маркеров на карте с очисткой старых
export function displayMarkers(mapInstance, markers, markersRef) {
  if (!mapInstance || !markers) return;

  // Очищаем старые маркеры
  if (markersRef.current) {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }

  // Отображаем новые маркеры
  if (markers.length > 0) {
    console.log('🗺️ Отображаем маркеры на карте:', markers.length);
    
    markers.forEach(marker => {
      const mapMarker = new maplibregl.Marker({
        color: '#FF0000',
        anchor: 'bottom',
        offset: [0, -8]
      })
        .setLngLat([marker.x, marker.y])
        .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
        .addTo(mapInstance);
      
      markersRef.current.push(mapMarker);
    });
  }
}

// Добавление нового маркера на карту
export function addMarkerToMap(mapInstance, marker, markersRef) {
  if (!mapInstance || !marker) return;

  const mapMarker = new maplibregl.Marker({
    color: '#FF0000',
    anchor: 'bottom',
    offset: [0, -8]
  })
    .setLngLat([marker.x, marker.y])
    .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
    .addTo(mapInstance);

  markersRef.current.push(mapMarker);
  return mapMarker;
}
