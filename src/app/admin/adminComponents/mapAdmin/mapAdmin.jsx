
"use client";

import { useEffect, useRef } from "react";
import styles from "./mapAdmin.module.css";
import { initMap } from "./mapAdminLogic";

export default function MapAdmin() {
  const mapRef = useRef(null);

  useEffect(() => {
    initMap(mapRef);
  }, []);

  return (
    <div className={styles.mapAdminConainer} >
      <div className={styles.leafletMap} id="mapAdminContainer" ></div>
    </div>
  );
}
