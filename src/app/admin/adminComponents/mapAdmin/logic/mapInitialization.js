// Импорт хука useEffect из React для выполнения побочных эффектов (инициализация карты) после монтирования компонента
import { useEffect } from "react";

// Импорт библиотеки MapLibre GL JS для работы с векторной картой
import maplibregl from "maplibre-gl";

// Импорт плагина MapLibre-Draw для рисования геометрии (зон, маркеров) на карте
import MapLibreDraw from "maplibre-gl-draw";

// Экспорт кастомного хука useMapInitialization, который будет вызываться из компонента
export function useMapInitialization(mapContainer, mapInstance, drawInstance) {
  // Хук useEffect выполняется один раз после первого рендера компонента
  useEffect(() => {
    // Если карта уже инициализирована (mapInstance.current существует), выходим из эффекта
    if (mapInstance.current) return;

    // Создаём новый экземпляр карты MapLibre и сохраняем его в ref mapInstance.current
    mapInstance.current = new maplibregl.Map({
      // DOM-контейнер, в котором будет отображаться карта
      container: mapContainer.current,
      // Стиль карты: спутниковые тайлы ArcGIS с прозрачностью 70 %
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
      // Начальные координаты центра карты (примерно Россия)
      center: [33.11646223068238, 57.14298050115737],
      // Начальный масштаб
      zoom: 13,
    });

    // Создаём экземпляр MapLibre-Draw для рисования и сохраняем в ref drawInstance.current
    drawInstance.current = new MapLibreDraw({
      // Отключаем стандартные кнопки управления
      displayControlsDefault: false,
      // Пустой объект controls — кнопки будут добавлены позже вручную
      controls: {},
      // Режим по умолчанию — выбор объектов
      defaultMode: "simple_select",
      // Кастомные стили для зон и маркеров
      styles: [
        // Заливка неактивных полигонов зелёным цветом
        {
          id: "gl-draw-polygon-fill-inactive",
          type: "fill",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"]
          ],
          paint: {
            "fill-color": "#00ff00",
            "fill-outline-color": "#00ff00",
            "fill-opacity": 0.15
          }
        },
        // Заливка активных полигонов более ярким зелёным
        {
          id: "gl-draw-polygon-fill-active",
          type: "fill",
          filter: [
            "all",
            ["==", "active", "true"],
            ["==", "$type", "Polygon"]
          ],
          paint: {
            "fill-color": "#66ff66",
            "fill-outline-color": "#66ff66",
            "fill-opacity": 0.3
          }
        },
        // Обводка неактивных полигонов
        {
          id: "gl-draw-polygon-stroke-inactive",
          type: "line",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"]
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round"
          },
          paint: {
            "line-color": "#00aa00",
            "line-width": 2
          }
        },
        // Обводка активных полигонов
        {
          id: "gl-draw-polygon-stroke-active",
          type: "line",
          filter: [
            "all",
            ["==", "active", "true"],
            ["==", "$type", "Polygon"]
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round"
          },
          paint: {
            "line-color": "#00aa00",
            "line-width": 3
          }
        },
        // Круги для неактивных маркеров синего цвета
        {
          id: "gl-draw-point-inactive",
          type: "circle",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Point"],
            ["==", "meta", "feature"],
            ["!=", "mode", "static"]
          ],
          paint: {
            "circle-radius": 3,
            "circle-color": "#0066ff",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
          }
        },
        // Круги для активных маркеров
        {
          id: "gl-draw-point-active",
          type: "circle",
          filter: [
            "all",
            ["==", "active", "true"],
            ["==", "$type", "Point"]
          ],
          paint: {
            "circle-radius": 4,
            "circle-color": "#0066ff",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff"
          }
        },
        // Стили для точек редактирования (вершин полигонов)
        {
          id: "gl-draw-polygon-and-line-vertex-active",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"]
          ],
          paint: {
            "circle-radius": 5,
            "circle-color": "#ff0000",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
          }
        },
        {
          id: "gl-draw-polygon-and-line-vertex-inactive",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["==", "mode", "static"]
          ],
          paint: {
            "circle-radius": 3,
            "circle-color": "#ff0000",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff"
          }
        },
        // Стили для точек вставки (midpoints)
        {
          id: "gl-draw-polygon-and-line-midpoint-active",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "midpoint"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"]
          ],
          paint: {
            "circle-radius": 4,
            "circle-color": "#00ffff",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
          }
        },
        {
          id: "gl-draw-polygon-and-line-midpoint-inactive",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "midpoint"],
            ["==", "$type", "Point"],
            ["==", "mode", "static"]
          ],
          paint: {
            "circle-radius": 2,
            "circle-color": "#00ffff",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff"
          }
        }
      ]
    });

    // Добавляем инструмент рисования на карту
    mapInstance.current.addControl(drawInstance.current);
  // Зависимости: перезапускаем эффект только если изменились ссылки на контейнер, карту или инструмент
  }, [mapContainer, mapInstance, drawInstance]);
}
