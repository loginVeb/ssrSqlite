// Импорт хука useEffect из React для выполнения побочных эффектов при монтировании компонента
// useEffect используется для загрузки зон из базы данных при первом рендере
import { useEffect } from "react";

// Импорт функции для загрузки зон из базы данных из модуля API
// loadZonesFromDB - асинхронная функция для получения зон с сервера
import { loadZonesFromDB } from '../api';

// Экспорт пользовательского хука useZoneManagement для управления зонами на карте
// Этот хук отвечает за загрузку, отображение и управление географическими зонами
// Принимает три параметра:
// - drawInstance: ref на инструмент рисования Mapbox Draw
// - zones: массив текущих зон
// - setZones: функция для обновления состояния зон
export function useZoneManagement(drawInstance, zones, setZones) {
  // Хук useEffect для загрузки зон из базы данных при инициализации компонента
  // Выполняется только один раз при монтировании компонента
  useEffect(() => {
    // Асинхронная функция для загрузки зон из базы данных
    const loadZones = async () => {
      try {
        // Выполняем запрос к API для получения всех зон из базы данных
        // loadZonesFromDB возвращает объект с полями success и zones
        const result = await loadZonesFromDB();
        
        // Проверяем успешность загрузки и наличие зон в ответе
        if (result.success && result.zones) {
          // Обновляем состояние зон в React через функцию setZones
          // Это вызовет перерендер компонента с новыми зонами
          setZones(result.zones);
          
          // Если есть инструмент рисования и загруженные зоны
          // drawInstance.current - это текущий экземпляр Mapbox Draw
          if (drawInstance.current && result.zones.length > 0) {
            // Создаем объект GeoJSON для добавления зон на карту
            // GeoJSON - стандартный формат для представления географических данных
            const geojson = {
              type: "FeatureCollection",
              features: result.zones
            };
            // Добавляем зоны на карту через инструмент рисования
            // drawInstance.current.add() - метод для добавления геометрии на карту
            drawInstance.current.add(geojson);
          }
        }
      } catch (error) {
        // Обработка ошибок при загрузке зон
        // Логируем ошибку в консоль для отладки и диагностики
        console.error('Ошибка загрузки зон:', error);
      }
    };

    // Вызываем функцию загрузки зон при монтировании компонента
    // Это происходит только один раз при первом рендере
    loadZones();
  }, [drawInstance, setZones]); // Зависимости: перезапуск при изменении drawInstance или setZones
}
