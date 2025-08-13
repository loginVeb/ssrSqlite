// API вызовы для работы с зонами
export async function loadZonesFromDB() {
  try {
    const response = await fetch('/admin/api/map/loadZones');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error loading zones from DB:', error);
    throw error;
  }
}

export async function saveZonesToDB(zones) {
  try {
    const response = await fetch('/admin/api/map/saveZones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ zones }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving zones:', error);
    throw error;
  }
}

export async function deleteZoneFromDB(zoneId) {
  try {
    const response = await fetch('/admin/api/map/deleteZone', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: zoneId }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Ошибка сети:', error);
    throw error;
  }
}
