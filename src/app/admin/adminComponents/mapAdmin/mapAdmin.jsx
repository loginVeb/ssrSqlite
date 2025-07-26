"use client";

import React, { useRef, useEffect } from "react";
import styles from "./mapAdmin.module.css";
import { initMap, useMapAdminLogic } from "./mapAdminLogic";

export default function MapAdmin() {
  const mapRef = useRef(null);
  const {
    zones,
    isDrawingMode,
    toggleDrawingMode,
  } = useMapAdminLogic(mapRef);

  useEffect(() => {
    initMap(mapRef);
  }, []);

  return (
    <div className={styles.mapAdminConainer}>
      <button
        id="drawingModeButton"
        onClick={toggleDrawingMode}
        className={styles.rezhim}
      >
        {isDrawingMode ? "Выйти из режима рисования" : "Войти в режим рисования"}
      </button>
      <div className={styles.leafletMap} id="mapAdminContainer"></div>
    </div>
  );
}
