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
  });

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  ).addTo(mapRef.current);
}
