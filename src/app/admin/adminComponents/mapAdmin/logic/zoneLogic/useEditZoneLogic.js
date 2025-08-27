// Хук для управления редактированием зон на карте
// Позволяет активировать режим редактирования и обрабатывать изменения геометрии зон
// Включает функциональность растягивания зон за угловые точки

// Импорт необходимых хуков из React
import { useState, useEffect } from "react";
// Импорт функции для сохранения зон в базе данных
import { saveZonesToDB } from "../api";

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
      
      // Настраиваем инструмент рисования для поддержки растягивания угловых точек
      // Включаем возможность перемещения вершин полигонов
      if (drawInstance.current.options) {
        drawInstance.current.options = {
          ...drawInstance.current.options,
          displayControlsDefault: false,
          userProperties: true,
          modes: {
            ...drawInstance.current.options.modes,
            direct_select: {
              ...drawInstance.current.options.modes?.direct_select,
              // Разрешаем перемещение вершин для растягивания угловых точек
              dragVertex: true,
              dragFeature: true
            }
          }
        };
      }
      
      // Логируем активацию режима редактирования
      console.log('✅ Режим редактирования зон активирован - выберите зону для редактирования');
      console.log('📌 Теперь доступно растягивание зон за угловые точки');
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

  // Функция для автоматического сохранения зон после редактирования
  const autoSaveZones = async () => {
    try {
      if (!drawInstance.current) return;
      
      const updatedZones = drawInstance.current.getAll().features;
      console.log('💾 Автоматическое сохранение зон после редактирования:', updatedZones.length);
      
      // Подготавливаем зоны для сохранения (аналогично useSaveHandlers)
      const zonesToSave = updatedZones.map(feature => {
        const zone = {
          ...feature,
          properties: {
            ...feature.properties,
            id: feature.properties?.id && feature.properties.id > 0 ? feature.properties.id : undefined
          }
        };
        return zone;
      });
      
      // Сохраняем зоны в базу данных
      const result = await saveZonesToDB(zonesToSave);
      
      if (result.success && result.zones) {
        console.log('✅ Зоны успешно сохранены после редактирования');
        
        // Обновляем локальное состояние с новыми ID
        const updatedZonesWithIds = result.zones.map(zone => {
          const parsedGeojson = JSON.parse(zone.geojson);
          parsedGeojson.properties = {
            ...parsedGeojson.properties,
            id: zone.id
          };
          return parsedGeojson;
        });
        
        setZones(updatedZonesWithIds);
        
        // Обновляем drawInstance с новыми ID
        if (drawInstance.current && updatedZonesWithIds.length > 0) {
          const geojson = {
            type: "FeatureCollection",
            features: updatedZonesWithIds
          };
          drawInstance.current.set(geojson);
        }
      }
    } catch (error) {
      console.error('❌ Ошибка автоматического сохранения зон:', error);
    }
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
      // Проверяем, является ли обновление результатом растягивания угловой точки
      // При растягивании угловых точек в режиме direct_select создается событие update
      const isCornerDrag = e.features && e.features.length > 0 && 
                          e.features[0].properties && 
                          e.features[0].properties.active === 'true';
      
      // Получаем все текущие зоны из инструмента рисования
      const currentZones = drawInstance.current.getAll().features;
      
      // Обновляем состояние зон в React
      // Это синхронизирует состояние React с текущим состоянием на карте
      setZones(currentZones);
      
      if (isCornerDrag) {
        // Логируем растягивание угловой точки
        console.log('🔲 Растягивание угловой точки зоны:', e.features[0]?.properties?.id);
      } else {
        // Логируем обычное обновление зоны
        console.log('🔄 Зона обновлена:', e.features[0]?.properties?.id);
      }
      
      // Автоматически сохраняем изменения после редактирования
      setTimeout(() => {
        // Проверяем, что инструмент рисования все еще доступен
        if (drawInstance.current) {
          autoSaveZones();
        }
      }, 1000); // Задержка для предотвращения частых сохранений
    };

    // Обработчик события перемещения вершин (растягивания угловых точек)
    const handleVertexDrag = (e) => {
      // Это событие срабатывает при перемещении вершин полигонов
      if (e.features && e.features.length > 0) {
        console.log('📌 Перемещение вершины зоны:', e.features[0]?.properties?.id);
        
        // Получаем все текущие зоны из инструмента рисования
        const currentZones = drawInstance.current.getAll().features;
        
        // Обновляем состояние зон в React
        setZones(currentZones);
      }
    };

    // Обработчик события завершения редактирования (возврат в режим выбора)
    const handleModeChange = (e) => {
      if (e.mode === 'simple_select' && isEditing) {
        console.log('✅ Редактирование завершено, возврат в режим выбора');
        // Автоматически сохраняем изменения при выходе из режима редактирования
        autoSaveZones();
      }
    };

    // Сохраняем ссылки на текущие экземпляры для использования в cleanup функции
    const currentMapInstance = mapInstance.current;
    const currentDrawInstance = drawInstance.current;

    // Подписываемся на события выбора, обновления, перемещения вершин и изменения режима
    currentMapInstance.on("draw.selectionchange", handleSelection);
    currentMapInstance.on("draw.update", handleUpdate);
    currentMapInstance.on("draw.vertex.drag", handleVertexDrag);
    currentMapInstance.on("draw.modechange", handleModeChange);

    // Функция очистки: отписываемся от событий при размонтировании компонента
    return () => {
      if (currentMapInstance) {
        currentMapInstance.off("draw.selectionchange", handleSelection);
        currentMapInstance.off("draw.update", handleUpdate);
        currentMapInstance.off("draw.vertex.drag", handleVertexDrag);
        currentMapInstance.off("draw.modechange", handleModeChange);
      }
    };
  }, [mapInstance, drawInstance, setZones, isEditing, autoSaveZones]);

  // Возвращаем состояние и функции для управления редактированием
  return {
    isEditing, // Текущее состояние режима редактирования
    toggleEditMode, // Функция для переключения режима редактирования
    setIsEditing, // Функция для прямого установления состояния редактирования
    autoSaveZones // Функция для автоматического сохранения зон
  };
}
