'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Returns device compass heading in degrees (0-360, North=0).
 * Uses webkitCompassHeading on iOS, alpha on Android.
 * Returns null when unavailable (desktop, permission denied, or not yet calibrated).
 */
export function useDeviceOrientation() {
  const [heading, setHeading] = useState<number | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // iOS/Safari: webkitCompassHeading is 0-360, North=0
    const compassHeading =
      (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ??
      event.alpha;

    if (typeof compassHeading === 'number' && !isNaN(compassHeading)) {
      setHeading(compassHeading);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setPermissionState('unsupported');
      return;
    }

    if (!('requestPermission' in DeviceOrientationEvent)) {
      setPermissionState('granted');
      return;
    }

    try {
      const permission = await (
        DeviceOrientationEvent as unknown as { requestPermission: () => Promise<PermissionState> }
      ).requestPermission();

      setPermissionState(permission === 'granted' ? 'granted' : 'denied');
    } catch {
      setPermissionState('denied');
    }
  }, []);

  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setPermissionState('unsupported');
      return;
    }

    if ('requestPermission' in DeviceOrientationEvent) {
      setPermissionState('prompt');
      return;
    }

    setPermissionState('granted');
  }, []);

  useEffect(() => {
    if (permissionState !== 'granted') return;

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionState, handleOrientation]);

  return { heading, permissionState, requestPermission };
}
