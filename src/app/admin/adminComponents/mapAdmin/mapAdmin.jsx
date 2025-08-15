'use client' // Директива Next.js - компонент использует клиентские хуки

// Импорт стилей для компонента из CSS-модуля
import styles from "./mapAdmin.module.css";
// Импорт кастомного хука для управления всей логикой карты
import { useMapAdminLogic } from "./logic/useMapAdminLogic";

// Главный компонент админской карты для управления зонами и маркерами
export default function MapAdmin() {
  // Деструктуризация всех необходимых значений из кастомного хука
  const { 
    mapContainer, // Ref для DOM-элемента контейнера карты
    handleSaveZones, // Функция для сохранения зон в базу данных
    isSaving, // Флаг процесса сохранения (true во время сохранения)
    drawInstance, // Ref для инструмента рисования Mapbox Draw
    handleDeleteZoneByClick, // Функция для удаления зоны по клику
    isAddingMarkers, // Флаг активного режима добавления маркеров
    setIsAddingMarkers, // Функция переключения режима добавления маркеров
    markers // Массив всех маркеров на карте
  } = useMapAdminLogic();

  return (
    // Основной контейнер всей админской карты
    <div className={styles.mapAdminContainer}>
      {/* Панель управления с кнопками действий */}
      <div className={styles.controlsPanel}>
        
        {/* Кнопка для переключения в режим рисования полигонов */}
        <button 
          onClick={() => drawInstance?.current?.changeMode('draw_polygon')} // Переключаем режим рисования на 'draw_polygon'
          className={styles.controlButton} // Применяем стили кнопки
          title="Рисовать полигон" // Всплывающая подсказка при наведении
        >
          🔺 Полигон {/* Иконка и текст кнопки */}
        </button>
      
        {/* Кнопка сохранения всех зон в базу данных */}
        <button 
          onClick={handleSaveZones} // Вызываем функцию сохранения при клике
          className={styles.controlButton} // Применяем стили кнопки
          disabled={isSaving} // Отключаем кнопку во время сохранения
          title="Сохранить все зоны" // Всплывающая подсказка
        >
          {isSaving ? '💾 Сохранение...' : '💾 Сохранить зоны'} {/* Динамический текст кнопки */}
        </button>

        {/* Кнопка для удаления зоны по клику */}
        <button 
          onClick={handleDeleteZoneByClick} // Вызываем функцию удаления при клике
          className={styles.controlButton} // Применяем стили кнопки
          title="Удалить зону" // Всплывающая подсказка
        >
          🗑️ Удалить зону {/* Иконка и текст кнопки */}
        </button>
        
        {/* Кнопка переключения режима добавления маркеров */}
        <button 
          onClick={() => setIsAddingMarkers(!isAddingMarkers)} // Инвертируем значение флага
          className={`${styles.controlButton} ${isAddingMarkers ? styles.active : ''}`} // Добавляем класс 'active' при активном режиме
          title={isAddingMarkers ? 'Отменить добавление маркеров' : 'Добавить маркер'} // Динамическая подсказка
        >
          {isAddingMarkers ? '❌ Отмена' : '📍 Добавить маркер'} {/* Динамический текст кнопки */}
        </button>
        
      </div>
      
      {/* Контейнер для самой карты - сюда будет встроен MapLibre */}
      <div ref={mapContainer} className={styles.mapInnerContainer}/>
    </div>
  );
}
