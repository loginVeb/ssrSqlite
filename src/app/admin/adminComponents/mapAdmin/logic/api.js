// API вызовы для работы с зонами

// Асинхронная функция для загрузки всех зон из базы данных
export async function loadZonesFromDB() {
  try {
    // Отправляем GET-запрос на сервер для получения списка зон
    const response = await fetch('/admin/api/map/zone/loadZones');
    // Преобразуем ответ в формат JSON
    const result = await response.json();
    // Возвращаем результат с зонами
    return result;
  } catch (error) {
    // Логируем ошибку в консоль, если запрос не удался
    console.error('Error loading zones from DB:', error);
    // Пробрасываем ошибку дальше для обработки в вызывающем коде
    throw error;
  }
}

// Асинхронная функция для сохранения зон в базу данных
export async function saveZonesToDB(zones) {
  try {
    // Отправляем POST-запрос на сервер с массивом зон
    const response = await fetch('/admin/api/map/zone/saveZones', {
      method: 'POST', // Указываем метод POST для отправки данных
      headers: {
        'Content-Type': 'application/json', // Устанавливаем заголовок для JSON
      },
      // Преобразуем массив зон в JSON-строку и отправляем в теле запроса
      body: JSON.stringify({ zones }),
    });
    // Преобразуем ответ сервера в формат JSON
    const result = await response.json();
    // Возвращаем результат сохранения
    return result;
  } catch (error) {
    // Логируем ошибку в консоль, если запрос не удался
    console.error('Error saving zones:', error);
    // Пробрасываем ошибку дальше для обработки в вызывающем коде
    throw error;
  }
}

// Асинхронная функция для удаления зоны из базы данных по ID
export async function deleteZoneFromDB(zoneId) {
  try {
    // Отправляем DELETE-запрос на сервер с ID зоны для удаления
    const response = await fetch('/admin/api/map/zone/deleteZone', {
      method: 'DELETE', // Указываем метод DELETE для удаления
      headers: {
        'Content-Type': 'application/json', // Устанавливаем заголовок для JSON
      },
      // Отправляем ID зоны в теле запроса
      body: JSON.stringify({ id: zoneId }),
    });
    // Преобразуем ответ сервера в формат JSON
    const result = await response.json();
    // Возвращаем результат удаления
    return result;
  } catch (error) {
    // Логируем ошибку на русском языке, если запрос не удался
    console.error('❌ Ошибка сети:', error);
    // Пробрасываем ошибку дальше для обработки в вызывающем коде
    throw error;
  }
}
