// Импорт хука useState из React для управления состоянием процесса сохранения
import { useState } from "react";
// Импорт функции для сохранения зон в базе данных из модуля API
import { saveZonesToDB } from '../api';

// Экспорт пользовательского хука useSaveZones для сохранения зон
// Принимает три параметра: инструмент рисования, массив зон и функцию обновления
export function useSaveZones(drawInstance, zones, setZones) {
  // Состояние для отслеживания процесса сохранения зон
  // isSaving = true во время сохранения, false в остальное время
  const [isSaving, setIsSaving] = useState(false);

  // Асинхронная функция для обработки сохранения зон
  const handleSaveZones = async () => {
    // Устанавливаем флаг сохранения в true для блокировки UI
    setIsSaving(true);
    try {
      // Получаем текущие зоны из инструмента рисования Mapbox Draw
      // getAll() возвращает все геометрии в формате GeoJSON
      const currentZones = drawInstance.current?.getAll().features || [];
      
      // Подготавливаем зоны для сохранения в базу данных
      // Преобразуем каждую зону в нужный формат
      const zonesToSave = currentZones.map(feature => {
        const zone = {
          ...feature,
          properties: {
            ...feature.properties,
            // Удаляем временные ID для новых зон (ID < 0 - временные)
            // Оставляем только существующие ID из базы данных
            id: feature.properties?.id && feature.properties.id > 0 ? feature.properties.id : undefined
          }
        };
        return zone;
      });

      // Отправляем зоны на сервер для сохранения в базе данных
      const result = await saveZonesToDB(zonesToSave);
      
      // Проверяем успешность сохранения и наличие зон в ответе
      if (result.success && result.zones) {
        console.log('Зоны успешно сохранены');
        
        // Обновляем локальное состояние с новыми ID из базы данных
        // result.zones содержит зоны с новыми ID для новых зон
        const updatedZones = result.zones.map(zone => {
          // Парсим GeoJSON из строки в объект
          const parsedGeojson = JSON.parse(zone.geojson);
          // Добавляем ID зоны из базы данных в свойства
          parsedGeojson.properties = {
            ...parsedGeojson.properties,
            id: zone.id // Новый ID из базы данных
          };
          return parsedGeojson;
        });
        
        // Обновляем состояние зон в React через функцию setZones
        setZones(updatedZones);
        
        // Обновляем drawInstance с новыми ID для синхронизации
        if (drawInstance.current && updatedZones.length > 0) {
          // Создаем новый объект GeoJSON с обновленными зонами
          const geojson = {
            type: "FeatureCollection",
            features: updatedZones
          };
          // Устанавливаем новые зоны в инструмент рисования
          // set() полностью заменяет текущие зоны
          drawInstance.current.set(geojson);
        }
      }
    } catch (error) {
      // Обработка ошибок при сохранении зон
      // Логируем ошибку в консоль для отладки
      console.error('Ошибка сохранения зон:', error);
    } finally {
      // Сбрасываем флаг сохранения в любом случае
      // finally выполняется всегда, даже при ошибке
      setIsSaving(false);
    }
  };

  // Возвращаем функцию для сохранения зон и состояние сохранения
  // handleSaveZones - функция для вызова сохранения
  // isSaving - флаг процесса сохранения для UI
  return { handleSaveZones, isSaving };
}
