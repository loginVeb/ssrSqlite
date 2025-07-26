import { useState, useEffect } from "react";

export async function initMap(mapRef) {
  if (mapRef.current) {
    mapRef.current.remove();
    mapRef.current = null;
  }
  const L = (await import("leaflet")).default;
  await import("leaflet/dist/leaflet.css");
  mapRef.current = L.map("mapAdminContainer", {
    center: [57.14298050115737, 33.11646223068238],
    zoom: 13,
    attributionControl: false,
    zoomControl: false,
  });

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  ).addTo(mapRef.current);
}

export function useMapAdminLogic(mapRef) {
  const [zones, setZones] = useState([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  function addZone(newZone) {
    setZones((prevZones) => [...prevZones, newZone]);
  }

  function deleteZone(zoneId) {
    setZones((prevZones) => prevZones.filter((zone) => zone.id !== zoneId));
  }

  function updateZone(updatedZone) {
    setZones((prevZones) =>
      prevZones.map((zone) => (zone.id === updatedZone.id ? updatedZone : zone))
    );
  }

  function toggleDrawingMode() {
    setIsDrawingMode((prev) => !prev);
  }

  useEffect(() => {
    if (!mapRef.current) return;

    const L = require("leaflet");
    require("leaflet-draw");

    if (mapRef.current.drawControl) {
      mapRef.current.removeControl(mapRef.current.drawControl);
    }

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false,
        rectangle: isDrawingMode,
      },
      edit: {
        featureGroup: mapRef.current.featureGroup || new L.FeatureGroup(),
        edit: isDrawingMode,
        remove: isDrawingMode,
      },
    });

    mapRef.current.drawControl = drawControl;
    mapRef.current.addControl(drawControl);

    if (!mapRef.current.featureGroup) {
      mapRef.current.featureGroup = new L.FeatureGroup();
      mapRef.current.addLayer(mapRef.current.featureGroup);
    }

    mapRef.current.featureGroup.clearLayers();

    zones.forEach((zone) => {
      const bounds = [
        [zone.start.lat, zone.start.lng],
        [zone.end.lat, zone.end.lng],
      ];
      const rect = L.rectangle(bounds, { color: "blue", weight: 2, fillOpacity: 0.3 });
      rect._zoneId = zone.id;
      mapRef.current.featureGroup.addLayer(rect);
    });

    function onCreated(e) {
      const layer = e.layer;
      if (layer instanceof L.Rectangle) {
        const bounds = layer.getBounds();
        const newZone = {
          id: Date.now(),
          start: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
          end: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
        };
        addZone(newZone);
      }
    }

    function onDeleted(e) {
      e.layers.eachLayer((layer) => {
        if (layer._zoneId) {
          deleteZone(layer._zoneId);
        }
      });
    }

    function onEdited(e) {
      e.layers.eachLayer((layer) => {
        if (layer._zoneId) {
          const bounds = layer.getBounds();
          const updatedZone = {
            id: layer._zoneId,
            start: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
            end: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
          };
          updateZone(updatedZone);
        }
      });
    }

    mapRef.current.on(L.Draw.Event.CREATED, onCreated);
    mapRef.current.on(L.Draw.Event.DELETED, onDeleted);
    mapRef.current.on(L.Draw.Event.EDITED, onEdited);

    return () => {
      mapRef.current.off(L.Draw.Event.CREATED, onCreated);
      mapRef.current.off(L.Draw.Event.DELETED, onDeleted);
      mapRef.current.off(L.Draw.Event.EDITED, onEdited);
      if (mapRef.current.drawControl) {
        mapRef.current.removeControl(mapRef.current.drawControl);
        mapRef.current.drawControl = null;
      }
    };
  }, [isDrawingMode, zones, addZone, deleteZone, updateZone, mapRef]);

  return {
    zones,
    addZone,
    deleteZone,
    updateZone,
    isDrawingMode,
    toggleDrawingMode,
  };
}
