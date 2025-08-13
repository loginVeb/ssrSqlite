import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import MapLibreDraw from "maplibre-gl-draw";

export function useMapInitialization(mapContainer, mapInstance, drawInstance) {
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
  }, []);
}
