// Файл useMapAdminLogic.js - главный хук для координации всех компонентов карты в админ-панели
// Этот хук объединяет все функции управления картой, зонами и маркерами

// Импорт необходимых хуков из React
import { useRef, useState, useEffect } from "react";
// Импорт библиотеки MapLibre для работы с картой
import maplibregl from "maplibre-gl";
// Импорт хуков для различных функций карты
import { useMapInitialization } from "./mapInitialization"; // Инициализация карты
import { useZoneManagement } from "./zoneLogic/useZoneManagement"; // Управление зонами
import { useDrawingHandlers } from "./zoneLogic/useDrawingHandlers"; // Обработка рисования
import { useDeleteHandlers } from "./zoneLogic/useDeleteHandlers"; // Удаление зон
import { useSaveZones } from "./zoneLogic/useSaveHandlers"; // Сохранение зон
import { useMarkerHandlers } from "./markerLogic/useMarkerHandlers"; // Управление маркерами

// Главный хук для всей логики админской карты
export function useMapAdminLogic() {
  // Ref для DOM-элемента контейнера карты
  const mapContainer = useRef(null);
  // Ref для экземпляра карты MapLibre
  const mapInstance = useRef(null);
  // Ref для инструмента рисования Mapbox Draw
  const drawInstance = useRef(null);
  // Состояние массива всех зон на карте
  const [zones, setZones] = useState([]);
  // Состояние флага активного режима добавления маркеров
  const [isAddingMarkers, setIsAddingMarkers] = useState(false);
  // Состояние массива всех маркеров на карте
  const [markers, setMarkers] = useState([]);
  // Ref для хранения всех маркеров на карте
  const markersRef = useRef([]);

  // Асинхронная функция загрузки маркеров из базы данных
  const loadMarkers = async () => {
    try {
      // Отправляем GET-запрос к API для получения всех маркеров
      const response = await fetch('/admin/api/map/marker/getMarkers');
      // Парсим ответ в формат JSON
      const data = await response.json();
      
      // Проверяем успешность загрузки и наличие маркеров
      if (data.success && data.markers) {
        // Логируем количество загруженных маркеров
        console.log('✅ Загружено маркеров из БД:', data.markers.length);
        
        // Динамически импортируем функции для работы с маркерами
        const { displayMarkers } = await import('./markerLogic/markerDisplayEnhanced.js');
        const { validateMarkers } = await import('./markerLogic/markerDisplayEnhanced.js');
        
        // Валидируем полученные маркеры перед отображением
        const validMarkers = validateMarkers(data.markers);
        // Логируем количество валидных маркеров
        console.log('✅ Валидных маркеров:', validMarkers.length);
        
        // Отображаем валидные маркеры на карте
        if (mapInstance.current) {
          displayMarkers(mapInstance.current, validMarkers, markersRef);
        }
        
        // Обновляем состояние маркеров в React
        setMarkers(validMarkers);
      }
    } catch (error) {
      // Обработка ошибок при загрузке маркеров
      console.error('❌ Ошибка загрузки маркеров:', error);
    }
  };

  // Инициализация карты и всех необходимых компонентов
  useMapInitialization(mapContainer, mapInstance, drawInstance);
  // Управление зонами и их состоянием
  useZoneManagement(drawInstance, zones, setZones);
  // Обработка событий рисования
  useDrawingHandlers(mapInstance, drawInstance, zones, setZones);
  
  // Получение функций для удаления зон
  const { handleDeleteZone, handleDeleteZoneByClick } = useDeleteHandlers(
    mapInstance, // Экземпляр карты
    drawInstance, // Инструмент рисования
    zones, // Массив зон
    setZones // Функция обновления зон
  );
  
  // Получение функций для сохранения зон
  const { handleSaveZones, isSaving } = useSaveZones(
    drawInstance, // Инструмент рисования
    zones, // Массив зон
    setZones // Функция обновления зон
  );

  // Получение маркеров из хука управления маркерами
  const { markers: newMarkers } = useMarkerHandlers(mapInstance, isAddingMarkers, markersRef);

  // Эффект для загрузки маркеров при монтировании компонента
  useEffect(() => {
    // Проверяем наличие инициализированной карты
    if (mapInstance.current) {
      // Загружаем маркеры из базы данных
      loadMarkers();
    }
  }, [mapInstance.current, isAddingMarkers]); // Перезапуск при изменении карты или режима маркеров

  // Возвращаем все необходимые значения и функции для компонента
  return {
    mapContainer, // Ref контейнера карты
    handleSaveZones, // Функция сохранения зон
    isSaving, // Флаг процесса сохранения
    drawInstance, // Ref инструмента рисования
    handleDeleteZoneByClick, // Функция удаления зоны по клику
    isAddingMarkers, // Флаг режима добавления маркеров
    setIsAddingMarkers, // Функция переключения режима маркеров
    markers // Массив всех маркеров
  };
}
