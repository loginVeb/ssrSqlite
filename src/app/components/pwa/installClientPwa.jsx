'use client';
import { useEffect, useState } from 'react';

import styles from './installClientPwa.module.css';

function InstallClientPwa() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(true); // forced true for visibility testing

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (event) => {
      console.log('beforeinstallprompt event fired');
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${result.outcome}`);
        setDeferredPrompt(null);
        setShowInstallButton(false);
      } catch (error) {
        console.error('Error during installation:', error);
      }
    }
  };

  const handleCloseClick = () => {
    setShowInstallButton(false);
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className={styles.clientPwa}>
      <button onClick={handleInstallClick} className={styles.installButton}>
        Установить приложение
      </button>
      <button onClick={handleCloseClick} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
}

export default InstallClientPwa;
