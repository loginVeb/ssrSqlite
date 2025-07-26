
"use client";

import { useEffect, useRef } from "react";
import styles from "./mapAdmin.module.css";

export default function MapAdmin() {
  const mapRef = useRef(null);

  useEffect(() => {
    let L;
    async function loadLeaflet() {
      if (!mapRef.current) {
        L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");
        mapRef.current = L.map("mapAdminContainer", {
          center: [51.505, -0.09],
          zoom: 13,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
      }
    }
    loadLeaflet();
  }, []);

  return (
    <div className={styles.mapAdminConainer} >
      <div className={styles.leafletMap} id="mapAdminContainer" ></div>
    </div>
  );
}
