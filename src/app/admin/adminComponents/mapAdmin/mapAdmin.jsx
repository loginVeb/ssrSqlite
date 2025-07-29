// src/app/admin/adminComponents/mapAdmin/mapAdmin.jsx
'use client'

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./mapAdmin.module.css";

export default function MapAdmin() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    // Создаём собственный стиль с базовой картой OpenStreetMap и слоем спутниковых тайлов
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: "OSM + Satellite Overlay",
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
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
            id: "osm-base",
            type: "raster",
            source: "osm",
          },
          {
            id: "satellite-overlay",
            type: "raster",
            source: "satellite",
            paint: {
              "raster-opacity": 0.7, // Наложение спутника на основную карту
            },
          },
        ],
      },
      center: [33.11646223068238, 57.14298050115737],
      zoom: 13,
    });

    // Обработка ошибок загрузки
    mapInstance.current.on("error", (e) => {
      console.error("Ошибка загрузки карты:", e);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className={styles.mapAdminConainer}

    />
  );
}
