// Логика работы с маркерами для админской карты

// Загрузка маркеров из базы данных
export async function loadMarkersFromDB() {
  try {
    const response = await fetch('/admin/api/map/marker/loadMarkers');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Маркеры загружены:', result.markers.length);
      return result.markers;
    } else {
      console.error('❌ Ошибка загрузки маркеров:', result.error);
      return [];
    }
  } catch (error) {
    console.error('❌ Ошибка сети при загрузке маркеров:', error);
    return [];
  }
}

// Добавление маркера в базу данных
export async function addMarkerToDB(lng, lat) {
  try {
    console.log('📍 Добавление маркера:', { lng, lat });
    
    const response = await fetch('/admin/api/map/marker/addMarker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x: lng, y: lat }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Маркер добавлен в БД:', result.marker);
      return result.marker;
    } else {
      console.error('❌ Ошибка добавления маркера:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Ошибка сети при добавлении маркера:', error);
    return null;
  }
}

// Отображение маркеров на карте
export function displayMarkersOnMap(mapInstance, markers) {
  if (!mapInstance || !markers || markers.length === 0) {
    console.log('⚠️ Нет маркеров для отображения');
    return;
  }

  console.log('🗺️ Отображение маркеров на карте:', markers.length);
  
  markers.forEach(marker => {
    new maplibregl.Marker({ color: '#FF0000' })
      .setLngLat([marker.x, marker.y])
      .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
      .addTo(mapInstance);
  });
}

// Обработчик клика для добавления маркера
export function createMarkerClickHandler(mapInstance, onMarkerAdded) {
  return async (e) => {
    const { lng, lat } = e.lngLat;
    console.log('📍 Клик на карте для добавления маркера:', { lng, lat });

    const marker = await addMarkerToDB(lng, lat);
    
    if (marker) {
      // Отображаем маркер на карте
      new maplibregl.Marker({ color: '#FF0000' })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
        .addTo(mapInstance);
      
      // Вызываем callback для обновления состояния
      if (onMarkerAdded) {
        onMarkerAdded(marker);
      }
    }
  };
}
