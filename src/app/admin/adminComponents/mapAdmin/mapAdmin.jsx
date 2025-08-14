'use client'

import styles from "./mapAdmin.module.css";
import { useMapAdminLogic } from "./logic/useMapAdminLogic";

export default function MapAdmin() {
  const { 
    mapContainer, 
    handleSaveZones, 
    isSaving, 
    drawInstance, 
    handleDeleteZoneByClick,
    isAddingMarkers,
    setIsAddingMarkers,
    markers
  } = useMapAdminLogic();

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
          onClick={() => setIsAddingMarkers(!isAddingMarkers)}
          className={`${styles.controlButton} ${isAddingMarkers ? styles.active : ''}`}
          title={isAddingMarkers ? 'Отменить добавление маркеров' : 'Добавить маркер'}
        >
          {isAddingMarkers ? '❌ Отмена' : '📍 Добавить маркер'}
        </button>
        
      </div>
      
      <div ref={mapContainer} className={styles.mapInnerContainer}/>
    </div>
  );
}
