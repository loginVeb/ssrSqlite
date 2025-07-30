'use client'

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapLibreDraw from "maplibre-gl-draw"; // Для рисования
import "maplibre-gl/dist/maplibre-gl.css";

export function useMapAdminLogic() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const drawInstance = useRef(null); // Инструмент рисования
  const [rectangles, setRectangles] = useState([]); // Сохранённые прямоугольники

  useEffect(() => {
    if (mapInstance.current) return;

    // Инициализация карты
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
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
      displayControlsDefault: true, // Включаем отображение контролов по умолчанию
      controls: {
        polygon: true,  // Включаем рисование полигонов (прямоугольники)
        trash: true,    // Кнопка удаления
      },
      defaultMode: "draw_polygon", // Режим по умолчанию
    });

    mapInstance.current.addControl(drawInstance.current);

    console.log("MapLibreDraw initialized:", drawInstance.current);

    // Обработка события завершения рисования
    mapInstance.current.on("draw.create", (e) => {
      const features = e.features;
      setRectangles((prev) => [...prev, ...features]); // Добавляем в состояние
      console.log("Draw create event:", features);
    });

    // Обработка события удаления
    mapInstance.current.on("draw.delete", (e) => {
      const remaining = rectangles.filter(
        (rect) => !e.features.some((f) => f.id === rect.id)
      );
      setRectangles(remaining);
      console.log("Draw delete event:", e.features);
    });
  }, []);

  // Отдельный useEffect для обработки rectangles
  useEffect(() => {
    if (!mapInstance.current || rectangles.length === 0) return;

    // Удаляем старые источники и слои
    if (mapInstance.current.getSource("rectangles-source")) {
      mapInstance.current.removeSource("rectangles-source");
    }
    if (mapInstance.current.getLayer("rectangles-layer")) {
      mapInstance.current.removeLayer("rectangles-layer");
    }

    // Создаём GeoJSON из прямоугольников
    const geojson = {
      type: "FeatureCollection",
      features: rectangles.map((rect) => ({
        type: "Feature",
        geometry: rect.geometry,
        properties: {
          id: rect.id,
          name: "Зона", // Можно добавить пользовательские метки
        },
      })),
    };

    // Добавляем источник и слой для прямоугольников
    mapInstance.current.addSource("rectangles-source", {
      type: "geojson",
      data: geojson,
    });

    // Добавляем слой для отображения прямоугольников
    mapInstance.current.addLayer({
      id: "rectangles-layer",
      type: "fill",
      source: "rectangles-source",
      paint: {
        "fill-color": "#00f",
        "fill-opacity": 0.5,
      },
    });
  }, [rectangles]); // Добавляем зависимость от rectangles

  // Возвращаем объект с mapContainer
  return { mapContainer };
}