'use client'

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapLibreDraw from "maplibre-gl-draw";
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl-draw/dist/mapbox-gl-draw.css";

export function useMapAdminLogic() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const drawInstance = useRef(null);
  const [zones, setZones] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  // Загрузка зон и маркеров из базы данных при инициализации
  useEffect(() => {
    const loadDataFromDB = async () => {
      try {
        // Загрузка зон
        const zonesResponse = await fetch('/admin/api/map/zone/loadZones');
        const zonesResult = await zonesResponse.json();
        
        if (zonesResult.success && zonesResult.zones) {
          setZones(zonesResult.zones);
          
          // Добавляем зоны из БД в drawInstance
          if (drawInstance.current && zonesResult.zones.length > 0) {
            const geojson = {
              type: "FeatureCollection",
              features: zonesResult.zones
            };
            drawInstance.current.add(geojson);
          }
        }

        // Загрузка маркеров
        const markersResponse = await fetch('/admin/api/map/marker/loadMarkers');
        const markersResult = await markersResponse.json();
        
        if (markersResult.success && markersResult.markers) {
          setMarkers(markersResult.markers);
          console.log('✅ Маркеры загружены:', markersResult.markers.length);
        }
      } catch (error) {
        console.error('Error loading data from DB:', error);
      }
    };

    loadDataFromDB();
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

    // Инициализация инструмента рисования
    drawInstance.current = new MapLibreDraw({
      displayControlsDefault: false,
      controls: {},
      defaultMode: "simple_select",
    });

    mapInstance.current.addControl(drawInstance.current);

    // Отображение существующих маркеров после загрузки карты
    mapInstance.current.on('load', () => {
      console.log('🗺️ Карта загружена, отображаем маркеры...');
      markers.forEach(marker => {
        new maplibregl.Marker({ color: '#FF0000' })
          .setLngLat([marker.x, marker.y])
          .setPopup(new maplibregl.Popup().setText(`Маркер #${marker.id}`))
          .addTo(mapInstance.current);
      });
    });

    // Обработка событий рисования
    mapInstance.current.on("draw.create", (e) => {
      const features = e.features;
      setZones((prev) => [...prev, ...features]);
    });

    mapInstance.current.on("draw.delete", (e) => {
      const deletedFeatures = e.features;
      deletedFeatures.forEach(feature => {
        const zoneId = feature.properties?.id;
        if (zoneId && typeof zoneId === 'number') {
          handleDeleteZone(zoneId);
        }
      });
    });

    mapInstance.current.on("draw.update", (e) => {
      const currentZones = drawInstance.current.getAll().features;
      setZones(currentZones);
    });
  }, []);

  // Функция для удаления зоны из базы данных
  const handleDeleteZone = async (zoneId) => {
    if (!zoneId || typeof zoneId !== 'number') {
      console.warn('Invalid zone ID:', zoneId);
      return;
    }

    const confirmed = window.confirm(`Вы уверены, что хотите удалить зону ${zoneId}?`);
    if (!confirmed) return;

    try {
      const response = await fetch('/admin/api/map/zone/deleteZone', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: zoneId }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Зона удалена из БД:', zoneId);
        
        // Удаляем из локального состояния
        setZones(prev => prev.filter(zone => {
          const zoneDbId = zone.properties?.id || zone.id;
          return zoneDbId !== zoneId;
        }));

        // Удаляем из drawInstance
        if (drawInstance.current) {
          const allFeatures = drawInstance.current.getAll();
          const updatedFeatures = allFeatures.features.filter(feature => {
            const featureDbId = feature.properties?.id || feature.id;
            return featureDbId !== zoneId;
          });
          drawInstance.current.set({
            type: 'FeatureCollection',
            features: updatedFeatures
          });
        }
      } else {
        console.error('❌ Ошибка удаления зоны:', result.error);
      }
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
    }
  };

  // Функция для сохранения зон в базе данных
  const handleSaveZones = async () => {
    setIsSaving(true);
    try {
      const currentZones = drawInstance.current.getAll().features;
      
      const response = await fetch('/admin/api/map/zone/saveZones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zones: currentZones }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Zones saved successfully');
        
        // Обновляем локальные зоны с новыми ID из базы данных
        if (result.zones && result.zones.length > 0) {
          const updatedZones = currentZones.map((zone, index) => {
            const savedZone = result.zones[index];
            return {
              ...zone,
              properties: {
                ...zone.properties,
                id: savedZone.id
              }
            };
          });
          
          setZones(updatedZones);
          
          // Обновляем drawInstance с новыми ID
          if (drawInstance.current) {
            const geojson = {
              type: "FeatureCollection",
              features: updatedZones
            };
            drawInstance.current.set(geojson);
          }
        }
      } else {
        console.error('Error saving zones:', result.error);
      }
    } catch (error) {
      console.error('Error saving zones:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Функция для удаления зоны по клику на карту
  const handleDeleteZoneByClick = () => {
    if (!drawInstance.current || !mapInstance.current) return;

    drawInstance.current.changeMode('simple_select');
    
    const handleClick = (e) => {
      const selectedFeatures = drawInstance.current.getSelected();
      
      if (selectedFeatures.features.length > 0) {
        const feature = selectedFeatures.features[0];
        const zoneId = feature.properties?.id;
        
        if (zoneId && typeof zoneId === 'number') {
          handleDeleteZone(zoneId);
        } else {
          alert('Эта зона еще не сохранена в базе данных. Сначала сохраните зоны.');
        }
      } else {
        alert('Пожалуйста, выберите зону для удаления');
      }
      
      mapInstance.current.off('click', handleClick);
    };
    
    mapInstance.current.once('click', handleClick);
  };

  // Функция для добавления маркера по клику на карту
  const handleAddMarker = () => {
    if (!mapInstance.current) return;

    console.log('🎯 Режим добавления маркера активирован');
    setIsAddingMarker(true);

    const handleClick = async (e) => {
      const { lng, lat } = e.lngLat;
      console.log('📍 Клик на карте:', { lng, lat });

      try {
        const response = await fetch('/admin/api/map/marker/addMarker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ x: lng, y: lat }),
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Маркер добавлен:', result.marker);
          
          // Добавляем маркер на карту
          new maplibregl.Marker({ color: '#FF0000' })
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup().setText(`Маркер #${result.marker.id}`))
            .addTo(mapInstance.current);

          setMarkers(prev => [...prev, result.marker]);
        } else {
          console.error('❌ Ошибка добавления маркера:', result.error);
        }
      } catch (error) {
        console.error('❌ Ошибка сети при добавлении маркера:', error);
      }

      setIsAddingMarker(false);
      mapInstance.current.off('click', handleClick);
    };

    mapInstance.current.once('click', handleClick);
  };

  return { 
    mapContainer, 
    handleSaveZones, 
    isSaving, 
    drawInstance, 
    handleDeleteZoneByClick,
    handleAddMarker,
    isAddingMarker
  };
}
