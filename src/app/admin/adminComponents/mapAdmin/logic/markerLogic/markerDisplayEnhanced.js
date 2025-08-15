// Улучшенная логика отображения маркеров на карте с диагностикой

import maplibregl from "maplibre-gl";

// Отображение маркеров на карте с очисткой старых
export function displayMarkers(mapInstance, markers, markersRef) {
  if (!mapInstance || !markers) {
    console.warn('⚠️ Нет карты или маркеров для отображения');
    return;
  }

  //console.log('🗺️ Начинаем отображение маркеров:', markers.length);

  // Очищаем старые маркеры
  if (markersRef.current) {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }

  // Проверяем границы карты
  const bounds = mapInstance.getBounds();
  console.log('📍 Границы карты:', bounds);

  // Отображаем новые маркеры
  if (markers.length > 0) {
    markers.forEach((marker, index) => {
      console.log(`📍 Маркер ${index + 1}:`, { x: marker.x, y: marker.y });
      
      // Проверяем координаты
      if (!marker.x || !marker.y) {
        console.error(`❌ Неверные координаты для маркера ${marker.id}:`, marker);
        return;
      }

      // Проверяем, находятся ли координаты в пределах видимости
      if (!bounds.contains([marker.x, marker.y])) {
        console.warn(`⚠️ Маркер ${marker.id} вне видимой области:`, [marker.x, marker.y]);
      }

      try {
        // Создаем кастомный элемент маркера для лучшей видимости
        const markerElement = document.createElement('div');
        markerElement.style.width = '10px';
        markerElement.style.height = '10px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = '#FF0000';
        markerElement.style.border = '2px solid white';
        markerElement.style.position = 'absolute';
        markerElement.style.top = '0';
        markerElement.style.left = '0';
        markerElement.style.cursor = 'pointer';
        markerElement.style.transform = 'translate(-50%, -50%)';
        markerElement.style.pointerEvents = 'auto';
        
        // Добавляем внутреннюю точку для лучшей видимости
        const innerDot = document.createElement('div');
        innerDot.style.width = '6px';
        innerDot.style.height = '6px';
        innerDot.style.borderRadius = '50%';
        innerDot.style.backgroundColor = 'white';
        innerDot.style.position = 'absolute';
        innerDot.style.top = '50%';
        innerDot.style.left = '50%';
        innerDot.style.transform = 'translate(-50%, -50%)';
        markerElement.appendChild(innerDot);

        const mapMarker = new maplibregl.Marker({
          element: markerElement,
          anchor: 'bottom',
          offset: [0, -12]
        })
          .setLngLat([marker.x, marker.y])
          .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
          .addTo(mapInstance);

        console.log(`✅ Маркер ${marker.id} успешно добавлен на карту`);
        markersRef.current.push(mapMarker);
      } catch (error) {
        console.error(`❌ Ошибка при добавлении маркера ${marker.id}:`, error);
      }
    });

    // Принудительное обновление карты
    if (mapInstance._rerender) {
      mapInstance._rerender();
    }
  }
}

// Добавление нового маркера на карту
export function addMarkerToMap(mapInstance, marker, markersRef) {
  if (!mapInstance || !marker) {
    console.warn('⚠️ Нет карты или маркера для добавления');
    return null;
  }

  console.log('🎯 Добавляем новый маркер на карту:', marker);

  try {
    // Создаем кастомный элемент маркера
    const markerElement = document.createElement('div');
    markerElement.style.width = '10px';
    markerElement.style.height = '10px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.backgroundColor = '#FF0000';
    markerElement.style.border = '3px solid white';
    markerElement.style.zIndex = '1000';
    markerElement.style.position = 'relative';
    markerElement.style.cursor = 'pointer';

    const mapMarker = new maplibregl.Marker({
      element: markerElement,
      anchor: 'bottom',
      offset: [0, -12]
    })
      .setLngLat([marker.x, marker.y])
      .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
      .addTo(mapInstance);

    console.log('✅ Новый маркер успешно добавлен на карту');
    markersRef.current.push(mapMarker);
    
    // Принудительное обновление карты
    if (mapInstance._rerender) {
      mapInstance._rerender();
    }
    
    return mapMarker;
  } catch (error) {
    console.error('❌ Ошибка при добавлении маркера:', error);
    return null;
  }
}

// Проверка координат маркеров
export function validateMarkers(markers) {
  return markers.filter(marker => {
    const isValid = marker.x && marker.y && 
                   typeof marker.x === 'number' && 
                   typeof marker.y === 'number' &&
                   !isNaN(marker.x) && 
                   !isNaN(marker.y);
    
    if (!isValid) {
      console.warn('❌ Неверные координаты маркера:', marker);
    }
    
    return isValid;
  });
}
