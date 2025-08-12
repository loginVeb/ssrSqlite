'use client'

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapLibreDraw from "maplibre-gl-draw"; // Для рисования
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl-draw/dist/mapbox-gl-draw.css"; // Стили для инструментов

export function useMapAdminLogic() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const drawInstance = useRef(null); // Храним экземпляр рисования
  const [zones, setZones] = useState([]); // Сохранённые зоны
  const [isSaving, setIsSaving] = useState(false); // Состояние сохранения

  // Загрузка зон из базы данных при инициализации
  useEffect(() => {
    const loadZonesFromDB = async () => {
      try {
        const response = await fetch('/api/map/loadZones');
        const result = await response.json();
        
        if (result.success && result.zones) {
          setZones(result.zones);
          
          // Добавляем зоны из БД в drawInstance
          if (drawInstance.current && result.zones.length > 0) {
            const geojson = {
              type: "FeatureCollection",
              features: result.zones
            };
            drawInstance.current.add(geojson);
          }
        }
      } catch (error) {
        console.error('Error loading zones from DB:', error);
      }
    };

    loadZonesFromDB();
  }, []);

  useEffect(() => {
    if (mapInstance.current) return;

    // Инициализация карты
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg"
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite",
            paint: {
              "raster-opacity": 0.7,
            },
          },
        ],
      },
      center: [33.11646223068238, 57.14298050115737],
      zoom: 13,
    });

    // Инициализация инструмента рисования с родными кнопками polygon и trash
    drawInstance.current = new MapLibreDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,  // Включаем рисование полигонов (прямоугольники)
        trash: true,    // Кнопка удаления
      },
      defaultMode: "simple_select", // Режим выбора по умолчанию (рисование выключено)
    });

    mapInstance.current.addControl(drawInstance.current);

    // Обработка события завершения рисования
    mapInstance.current.on("draw.create", (e) => {
      const features = e.features;
      setZones((prev) => [...prev, ...features]); // Добавляем в состояние
    });

    // Обработка события удаления
    mapInstance.current.on("draw.delete", (e) => {
      const deletedFeatures = e.features;
      
      // Удаляем зоны из БД по ID
      deletedFeatures.forEach(feature => {
        // Используем ID из properties или напрямую из feature
        const zoneId = feature.properties?.id || feature.id;
        if (zoneId) {
          handleDeleteZone(zoneId);
        }
      });
      
      // Обновляем локальное состояние
      const currentZones = drawInstance.current.getAll().features;
      setZones(currentZones);
    });

    // Обработка события редактирования
    mapInstance.current.on("draw.update", (e) => {
      const currentZones = drawInstance.current.getAll().features;
      setZones(currentZones);
    });
  }, []); // Пустой массив зависимостей для useEffect

  // Отдельный useEffect для обработки zones
  useEffect(() => {
    if (!mapInstance.current) return;

    // Если зон нет, удаляем источники и слои если они существуют
    if (zones.length === 0) {
      // Сначала удаляем слой, затем источник
      if (mapInstance.current.getLayer("zones-layer")) {
        mapInstance.current.removeLayer("zones-layer");
      }
      if (mapInstance.current.getSource("zones-source")) {
        mapInstance.current.removeSource("zones-source");
      }
      return;
    }

    // Удаляем старые источники и слои (в правильном порядке)
    if (mapInstance.current.getLayer("zones-layer")) {
      mapInstance.current.removeLayer("zones-layer");
    }
    if (mapInstance.current.getSource("zones-source")) {
      mapInstance.current.removeSource("zones-source");
    }

    // Создаём GeoJSON из зон
    const geojson = {
      type: "FeatureCollection",
      features: zones.map((zone) => ({
        type: "Feature",
        geometry: zone.geometry,
        properties: {
          id: zone.id,
          name: "Зона", // Можно добавить пользовательские метки
        },
      })),
    };

    // Добавляем источник и слой для зон
    mapInstance.current.addSource("zones-source", {
      type: "geojson",
      data: geojson,
    });

    mapInstance.current.addLayer({
      id: "zones-layer",
      type: "fill",
      source: "zones-source",
      paint: {
        "fill-color": "rgba(0, 255, 0, 0.3)",
        "fill-outline-color": "rgba(212, 151, 18, 0.3)"
      }
    });
  }, [zones]); // Добавляем зависимость от zones

  // Функция для сохранения зон в базе данных
  const handleSaveZones = async () => {
    setIsSaving(true);
    try {
      // Получаем все текущие зоны из инструмента рисования
      const currentZones = drawInstance.current.getAll().features;
      
      const response = await fetch('/api/map/saveZones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zones: currentZones }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Zones saved successfully');
        // Можно добавить уведомление об успешном сохранении
      } else {
        console.error('Error saving zones:', result.error);
        // Можно добавить уведомление об ошибке
      }
    } catch (error) {
      console.error('Error saving zones:', error);
      // Можно добавить уведомление об ошибке
    } finally {
      setIsSaving(false);
    }
  };

  // Функция для удаления зоны из базы данных
  const handleDeleteZone = async (zoneId) => {
    if (!zoneId) {
      console.warn('Zone ID is missing');
      return;
    }

    const confirmed = window.confirm(`Вы уверены, что хотите удалить зону ${zoneId}?`);
    if (!confirmed) return;

    setIsSaving(true);
    try {
      console.log('Отправка запроса на удаление зоны:', zoneId);

      const response = await fetch('/api/map/deleteZone', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: Number(zoneId) }), // ✅ Числовой ID
      });

      const result = await response.json();
      console.log('Ответ от сервера:', result);

      if (result.success) {
        console.log('✅ Зона удалена из БД:', zoneId);

        // Удаляем из локального состояния
        setZones(prev => prev.filter(zone => 
          zone.id !== zoneId && 
          zone.properties?.id !== zoneId
        ));

        // Удаляем из drawInstance
        if (drawInstance.current) {
          const allFeatures = drawInstance.current.getAll();
          const updatedFeatures = allFeatures.features.filter(
            feature => feature.id !== zoneId && feature.properties?.id !== zoneId
          );
          drawInstance.current.set({
            type: 'FeatureCollection',
            features: updatedFeatures
          });
        }

        alert('Зона успешно удалена!');
      } else {
        console.error('❌ Ошибка удаления зоны:', result.error);
        alert('Ошибка при удалении зоны: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
      alert('Ошибка при удалении зоны: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Возвращаем объект с mapContainer, функцией сохранения и drawInstance
  return { mapContainer, handleSaveZones, isSaving, drawInstance };
}