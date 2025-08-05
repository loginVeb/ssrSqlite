
'use client'

import styles from "./mapUser.module.css";
import { useMapUserLogic } from "./mapUserLogic";

export default function MapUser() {
  const { mapContainer } = useMapUserLogic();

  return (
    <div className={styles.mapUserContainer}>
      <div ref={mapContainer} className={styles.mapInnerContainer} />
    </div>
  );
}
