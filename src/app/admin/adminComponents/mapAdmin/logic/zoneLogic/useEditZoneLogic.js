// Хук для управления редактированием зон на карте
// Позволяет активировать режим редактирования и обрабатывать изменения геометрии зон

// Импорт необходимых хуков из React
import { useState, useEffect } from "react";

// Экспорт пользовательского хука useEditZoneLogic для управления редактированием зон
// Принимает параметры:
// - mapInstance: ref на экземпляр карты MapLibre
// - drawInstance: ref на инструмент рисования Mapbox Draw
// - zones: массив текущих зон
// - setZones: функция для обновления состояния зон
export function useEditZoneLogic(mapInstance, drawInstance, zones, setZones) {
  // Состояние для отслеживания активного режима редактирования
  // true - режим редактирования активен, false - неактивен
  const [isEditing, setIsEditing] = useState(false);

  // Эффект для настройки режима редактирования при изменении состояния isEditing
  useEffect(() => {
    // Проверяем наличие инициализированной карты и инструмента рисования
    if (!mapInstance.current || !drawInstance.current) return;

    if (isEditing) {
      // В режиме редактирования переходим в простой режим выбора
      // Пользователь должен сначала выбрать зону для редактирования
      drawInstance.current.changeMode('simple_select');
      
      // Логируем активацию режима редактирования
      console.log('✅ Режим редактирования зон активирован - выберите зону для редактирования');
    } else {
      // Деактивируем режим редактирования, возвращаемся в простой режим
      drawInstance.current.changeMode('simple_select');
      
      // Логируем деактивацию режима редактирования
      console.log('❌ Режим редактирования зон деактивирован');
    }
  }, [isEditing, mapInstance, drawInstance]);

  // Функция для переключения режима редактирования
  // Инвертирует текущее состояние isEditing
  const toggleEditMode = () => {
    setIsEditing(prev => !prev);
  };

  // Эффект для обработки событий выбора и обновления зон при редактировании
  useEffect(() => {
    // Проверяем наличие инициализированной карты и инструмента рисования
    if (!mapInstance.current || !drawInstance.current) return;

    // Обработчик события выбора зоны
    const handleSelection = (e) => {
      if (isEditing && e.features && e.features.length > 0) {
        // Если мы в режиме редактирования и выбрана зона, переходим в режим редактирования
        const featureId = e.features[0].id;
        drawInstance.current.changeMode('direct_select', { featureId });
        console.log('✏️ Режим редактирования активирован для зоны:', featureId);
      }
    };

    // Обработчик события обновления геометрии при редактировании
    const handleUpdate = (e) => {
      // Получаем все текущие зоны из инструмента рисования
      const currentZones = drawInstance.current.getAll().features;
      
      // Обновляем состояние зон в React
      // Это синхронизирует состояние React с текущим состоянием на карте
      setZones(currentZones);
      
      // Логируем обновление зоны
      console.log('🔄 Зона обновлена:', e.features[0]?.properties?.id);
    };

    // Подписываемся на события выбора и обновления
    mapInstance.current.on("draw.selectionchange", handleSelection);
    mapInstance.current.on("draw.update", handleUpdate);

    // Функция очистки: отписываемся от событий при размонтировании компонента
    return () => {
      if (mapInstance.current) {
        mapInstance.current.off("draw.selectionchange", handleSelection);
        mapInstance.current.off("draw.update", handleUpdate);
      }
    };
  }, [mapInstance, drawInstance, setZones, isEditing]);

  // Возвращаем состояние и функции для управления редактированием
  return {
    isEditing, // Текущее состояние режима редактирования
    toggleEditMode, // Функция для переключения режима редактирования
    setIsEditing // Функция для прямого установления состояния редактирования
  };
}
