'use client'

import styles from "./mapAdmin.module.css";
import { useMapAdminLogic } from "./mapAdminLogic";

export default function MapAdmin() {
  const { mapContainer, handleSaveZones, isSaving, drawInstance } = useMapAdminLogic();

  return (
    <div className={styles.mapAdminContainer}>
      <div className={styles.controlsPanel}>
        <button 
          onClick={() => drawInstance?.changeMode('draw_polygon')}
          className={styles.controlButton}
          title="Добавить зону (полигон)"
        >
          ➕ Зона
        </button>
        
        <button 
          onClick={() => drawInstance?.changeMode('draw_point')}
          className={styles.controlButton}
          title="Добавить маркер"
        >
          📍 Маркер
        </button>
        
        <button 
          onClick={() => drawInstance?.changeMode('simple_select')}
          className={styles.controlButton}
          title="Выбор и редактирование"
        >
          ✏️ Редактировать
        </button>
        
        <button 
          onClick={() => drawInstance?.changeMode('direct_select')}
          className={styles.controlButton}
          title="Перемещение вершин"
        >
          🔧 Вершины
        </button>
        
        <button 
          onClick={() => drawInstance?.deleteAll()}
          className={styles.controlButton}
          title="Очистить всё"
        >
          🗑️ Очистить
        </button>
      </div>
      
      <div ref={mapContainer} className={styles.mapInnerContainer}/>
      
      <button 
        onClick={handleSaveZones} 
        className={styles.saveButton}
        disabled={isSaving}
      >
        {isSaving ? 'Сохранение...' : 'Сохранить зоны'}
      </button>
    </div>
  );
}
