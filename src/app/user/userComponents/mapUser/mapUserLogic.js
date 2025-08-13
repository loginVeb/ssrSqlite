'use client'

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function useMapUserLogic() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [zones, setZones] = useState([]);

  // Загрузка зон из базы данных при инициализации
  useEffect(() => {
    const loadZonesFromDB = async () => {
      try {
        const response = await fetch('/admin/api/map/loadZones');
        const result = await response.json();

        if (result.success && result.zones) {
          setZones(result.zones);
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
  }, []);

  // Отображение зон на карте при изменении zones
  useEffect(() => {
    if (!mapInstance.current) return;

    // Если зон нет, удаляем источники и слои если они существуют
    if (zones.length === 0) {
      if (mapInstance.current.getLayer("zones-layer")) {
        mapInstance.current.removeLayer("zones-layer");
      }
      if (mapInstance.current.getSource("zones-source")) {
        mapInstance.current.removeSource("zones-source");
      }
      return;
    }

    // Удаляем старые источники и слои
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
          name: "Зона",
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
        "fill-outline-color": "rgba(0, 128, 0, 0.5)",
      },
    });
  }, [zones]);

  return { mapContainer };
}
