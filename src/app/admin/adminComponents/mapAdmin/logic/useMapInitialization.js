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

    // Инициализация инструмента рисования с кастомными стилями
    drawInstance.current = new MapLibreDraw({
      displayControlsDefault: false,
      controls: {},
      defaultMode: "simple_select",
      styles: [
        // Зеленый цвет для зон
        {
          'id': 'gl-draw-polygon-fill-inactive',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
          ],
          'paint': {
            'fill-color': '#00ff00',
            'fill-outline-color': '#00ff00',
            'fill-opacity': 0.15
          }
        },
        {
          'id': 'gl-draw-polygon-fill-active',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'true'],
            ['==', '$type', 'Polygon']
          ],
          'paint': {
            'fill-color': '#66ff66',
            'fill-outline-color': '#66ff66',
            'fill-opacity': 0.3
          }
        },
        {
          'id': 'gl-draw-polygon-stroke-inactive',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#00aa00',
            'line-width': 2
          }
        },
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'true'],
            ['==', '$type', 'Polygon']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#00aa00',
            'line-width': 3
          }
        },
        // Синий яркий цвет для маркеров
        {
          'id': 'gl-draw-point-inactive',
          'type': 'circle',
          'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['!=', 'mode', 'static']
          ],
          'paint': {
            'circle-radius': 3,
            'circle-color': '#0066ff',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        },
        {
          'id': 'gl-draw-point-active',
          'type': 'circle',
          'filter': ['all', ['==', 'active', 'true'],
            ['==', '$type', 'Point']
          ],
          'paint': {
            'circle-radius': 4,
            'circle-color': '#0066ff',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
          }
        }
      ]
    });

    mapInstance.current.addControl(drawInstance.current);
  }, [mapContainer, mapInstance, drawInstance]);
}
