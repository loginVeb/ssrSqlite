import { deleteZoneFromDB } from './useApiCalls';

export function useDeleteHandlers(mapInstance, drawInstance, zones, setZones) {
  // Функция для удаления зоны из базы данных
  const handleDeleteZone = async (zoneId) => {
    if (!zoneId || typeof zoneId !== 'number') {
      console.warn('Invalid zone ID:', zoneId);
      return;
    }

    const confirmed = window.confirm(`Вы уверены, что хотите удалить зону ${zoneId}?`);
    if (!confirmed) return;

    try {
      const result = await deleteZoneFromDB(zoneId);
      
      if (result.success) {
        console.log('✅ Зона удалена из БД:', zoneId);
        
        // Удаляем из локального состояния
        setZones(prev => prev.filter(zone => {
          const zoneDbId = zone.properties?.id || zone.id;
          return zoneDbId !== zoneId;
        }));

        // Удаляем из drawInstance
        if (drawInstance.current) {
          const allFeatures = drawInstance.current.getAll();
          const updatedFeatures = allFeatures.features.filter(feature => {
            const featureDbId = feature.properties?.id || feature.id;
            return featureDbId !== zoneId;
          });
          drawInstance.current.set({
            type: 'FeatureCollection',
            features: updatedFeatures
          });
        }
      } else {
        console.error('❌ Ошибка удаления зоны:', result.error);
      }
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
    }
  };

  // Функция для удаления зоны по клику на карту
  const handleDeleteZoneByClick = () => {
    if (!drawInstance.current || !mapInstance.current) return;

    drawInstance.current.changeMode('simple_select');
    
    const handleClick = (e) => {
      const selectedFeatures = drawInstance.current.getSelected();
      
      if (selectedFeatures.features.length > 0) {
        const feature = selectedFeatures.features[0];
        const zoneId = feature.properties?.id;
        
        if (zoneId && typeof zoneId === 'number') {
          handleDeleteZone(zoneId);
        } else {
          alert('Эта зона еще не сохранена в базе данных. Сначала сохраните зоны.');
        }
      } else {
        alert('Пожалуйста, выберите зону для удаления');
      }
      
      mapInstance.current.off('click', handleClick);
    };
    
    mapInstance.current.once('click', handleClick);
  };

  return { handleDeleteZone, handleDeleteZoneByClick };
}
