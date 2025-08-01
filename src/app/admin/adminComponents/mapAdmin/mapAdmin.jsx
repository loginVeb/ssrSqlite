'use client'

import styles from "./mapAdmin.module.css";
import { useMapAdminLogic } from "./mapAdminLogic";

export default function MapAdmin() {
  const { mapContainer } = useMapAdminLogic();

  return (
    <div ref={mapContainer} className={styles.mapAdminConainer}/>
  );
}