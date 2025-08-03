'use client'

import styles from "./mapAdmin.module.css";
import { useMapAdminLogic } from "./mapAdminLogic";

export default function MapAdmin() {
  const { mapContainer, handleSaveZones, isSaving } = useMapAdminLogic();

  return (
    <div className={styles.mapAdminContainer}>
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
