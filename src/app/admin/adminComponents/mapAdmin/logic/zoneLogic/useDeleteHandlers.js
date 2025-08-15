// Импорт функции для удаления зоны из базы данных из модуля API
import { deleteZoneFromDB } from '../api';

// Экспорт пользовательского хука useDeleteHandlers для обработки удаления зон
// Принимает четыре параметра: экземпляр карты, инструмент рисования, массив зон и функцию обновления
export function useDeleteHandlers(mapInstance, drawInstance, zones, setZones) {
  // Функция для удаления зоны из базы данных по ID
  // Принимает zoneId - идентификатор зоны для удаления
  const handleDeleteZone = async (zoneId) => {
    // Проверяем валидность ID зоны
    // ID должен существовать и быть числом
    if (!zoneId || typeof zoneId !== 'number') {
      console.warn('Неверный ID зоны:', zoneId);
      return;
    }

    // Показываем диалог подтверждения удаления пользователю
    // Предотвращает случайное удаление зон
    const confirmed = window.confirm(`Вы уверены, что хотите удалить зону ${zoneId}?`);
    if (!confirmed) return;

    try {
      // Отправляем запрос на удаление зоны в базу данных
      const result = await deleteZoneFromDB(zoneId);
      
      // Проверяем успешность удаления
      if (result.success) {
        console.log('✅ Зона успешно удалена из базы данных:', zoneId);
        
        // Удаляем зону из локального состояния React
        // Фильтруем массив зон, исключая удаленную зону
        setZones(prev => prev.filter(zone => {
          // Получаем ID зоны из свойств или напрямую из объекта
          const zoneDbId = zone.properties?.id || zone.id;
          // Возвращаем true только для зон, которые не совпадают с удаляемой
          return zoneDbId !== zoneId;
        }));

        // Удаляем зону из инструмента рисования Mapbox Draw
        // Синхронизируем состояние карты с базой данных
        if (drawInstance.current) {
          // Получаем все текущие объекты на карте
          const allFeatures = drawInstance.current.getAll();
          // Фильтруем объекты, исключая удаленную зону
          const updatedFeatures = allFeatures.features.filter(feature => {
            // Получаем ID зоны из свойств объекта
            const featureDbId = feature.properties?.id || feature.id;
            // Возвращаем true только для объектов, которые не совпадают с удаляемой зоной
            return featureDbId !== zoneId;
          });
          // Устанавливаем обновленный набор объектов на карте
          drawInstance.current.set({
            type: 'FeatureCollection',
            features: updatedFeatures
          });
        }
      } else {
        // Обработка ошибки при удалении из базы данных
        console.error('❌ Ошибка удаления зоны из базы данных:', result.error);
      }
    } catch (error) {
      // Обработка сетевых ошибок
      console.error('❌ Ошибка сети при удалении зоны:', error);
    }
  };

  // Функция для удаления зоны по клику на карту
  // Позволяет пользователю выбрать зону для удаления кликом мыши
  const handleDeleteZoneByClick = () => {
    // Проверяем наличие инициализированных инструментов
    if (!drawInstance.current || !mapInstance.current) return;

    // Переключаем режим инструмента рисования на режим выбора
    // Это позволяет пользователю выбрать зону для удаления
    drawInstance.current.changeMode('simple_select');
    
    // Создаем обработчик клика на карту
    const handleClick = (e) => {
      // Получаем выбранные объекты на карте
      const selectedFeatures = drawInstance.current.getSelected();
      
      // Проверяем, что есть выбранные объекты
      if (selectedFeatures.features.length > 0) {
        // Получаем первый выбранный объект
        const feature = selectedFeatures.features[0];
        // Получаем ID зоны из свойств объекта
        const zoneId = feature.properties?.id;
        
        // Проверяем, что ID существует и является числом
        if (zoneId && typeof zoneId === 'number') {
          // Вызываем функцию удаления зоны
          handleDeleteZone(zoneId);
        } else {
          // Показываем сообщение, если зона еще не сохранена
          alert('Эта зона еще не сохранена в базе данных. Сначала сохраните зоны.');
        }
      } else {
        // Показываем сообщение, если зона не выбрана
        alert('Пожалуйста, выберите зону для удаления');
      }
      
      // Удаляем обработчик клика после использования
      // Это предотвращает множественные обработчики
      mapInstance.current.off('click', handleClick);
    };
    
    // Добавляем обработчик клика на карту
    // once используется для однократного выполнения обработчика
    mapInstance.current.once('click', handleClick);
  };

  // Возвращаем объект с функциями для удаления зон
  // handleDeleteZone - функция для удаления по ID
  // handleDeleteZoneByClick - функция для удаления кликом на карту
  return { handleDeleteZone, handleDeleteZoneByClick };
}
