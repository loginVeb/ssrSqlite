'use client'

import styles from "./mapAdmin.module.css";
import { useMapAdminLogic } from "./mapAdminLogic";

export default function MapAdmin() {
  const { mapContainer, handleSaveZones, isSaving, drawInstance, handleDeleteZoneByClick } = useMapAdminLogic();

  return (
    <div className={styles.mapAdminContainer}>
      <div className={styles.controlsPanel}>
        
        <button 
          onClick={() => drawInstance?.current?.changeMode('draw_polygon')}
          className={styles.controlButton}
          title="Рисовать полигон"
        >
          🔺 Полигон
        </button>
      
        <button 
          onClick={handleSaveZones} 
          className={styles.controlButton}
          disabled={isSaving}
          title="Сохранить все зоны"
        >
          {isSaving ? '💾 Сохранение...' : '💾 Сохранить зоны'}
        </button>

         <button 
          onClick={handleDeleteZoneByClick}
          className={styles.controlButton}
          title="Удалить зону"
        >
          🗑️ Удалить зону
        </button>
        
        <button 
          onClick={() => drawInstance?.current?.changeMode('draw_point')}
          className={styles.controlButton}
          title="Добавить маркер"
        >
          📍 Маркер
        </button>
        
        <button 
          onClick={() => drawInstance?.current?.changeMode('simple_select')}
          className={styles.controlButton}
          title="Выбор и редактирование"
        >
          ✏️ Редактировать
        </button>
        
        <button 
          onClick={() => drawInstance?.current?.changeMode('direct_select')}
          className={styles.controlButton}
          title="Перемещение вершин"
        >
          🔧 Вершины
        </button>
      </div>
      
      <div ref={mapContainer} className={styles.mapInnerContainer}/>
    </div>
  );
}
