'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, CalendarIcon, LocateFixed, MapPinIcon, MoonIcon } from 'lucide-react';
import SunCalc from 'suncalc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Compass } from '@/components/Compass';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';

interface MoonPosition {
  altitude: number;
  azimuth: number;
  distance: number;
}

export function MoonFinder() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [moonData, setMoonData] = useState<MoonPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');

  const { heading: deviceHeading, permissionState, requestPermission } = useDeviceOrientation();

  // Convert degrees to cardinal direction
  const getCardinalDirection = (degrees: number): string => {
    // Convert negative azimuth to positive (west of north convention)
    let normalized = degrees;
    if (normalized < 0) {
      normalized = 360 + normalized;
    }
    
    // Ensure normalized is in 0-360 range
    normalized = normalized % 360;
    if (normalized < 0) normalized += 360;
    
    // Standard cardinal direction ranges
    if (normalized >= 337.5 || normalized < 22.5) return 'North';
    if (normalized >= 22.5 && normalized < 67.5) return 'Northeast';
    if (normalized >= 67.5 && normalized < 112.5) return 'East';
    if (normalized >= 112.5 && normalized < 157.5) return 'Southeast';
    if (normalized >= 157.5 && normalized < 202.5) return 'South';
    if (normalized >= 202.5 && normalized < 247.5) return 'Southwest';
    if (normalized >= 247.5 && normalized < 292.5) return 'West';
    if (normalized >= 292.5 && normalized < 337.5) return 'Northwest';
    
    return 'North';
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setManualLat(position.coords.latitude.toString());
        setManualLon(position.coords.longitude.toString());
        setLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enter coordinates manually.');
        setLoading(false);
      },
      { timeout: 15000, maximumAge: 60000 }
    );
  };

  const computeMoonPosition = useCallback(() => {
    if (!location) {
      setError('Please set your location first.');
      return;
    }

    setError(null);

    try {
      // Use selected date with current time for real-time accuracy
      const now = new Date();
      const dateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      const pos = SunCalc.getMoonPosition(dateTime, location.lat, location.lon);

      // SunCalc: altitude/azimuth in radians. Azimuth: 0 = South, clockwise.
      // Convert to standard: 0 = North, 90 = East (clockwise).
      const altitudeDeg = (pos.altitude * 180) / Math.PI;
      const azimuthDegSouth = (pos.azimuth * 180) / Math.PI;
      const azimuthDegNorth = ((azimuthDegSouth + 180) % 360 + 360) % 360;

      setMoonData({
        altitude: altitudeDeg,
        azimuth: azimuthDegNorth,
        distance: pos.distance,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compute moon position');
    }
  }, [location, date]);

  const handleManualLocation = () => {
    const lat = manualLat.trim() ? Number(manualLat) : NaN;
    const lon = manualLon.trim() ? Number(manualLon) : NaN;

    if (isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid coordinates.');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90.');
      return;
    }

    if (lon < -180 || lon > 180) {
      setError('Longitude must be between -180 and 180.');
      return;
    }

    setLocation({ lat, lon });
    setError(null);
  };

  useEffect(() => {
    if (location) {
      computeMoonPosition();
    }
  }, [location, computeMoonPosition]);

  // Refresh moon position every minute when viewing today (real-time updates)
  useEffect(() => {
    if (!location) return;
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();
    if (!isToday) return;

    const interval = setInterval(computeMoonPosition, 60000);
    return () => clearInterval(interval);
  }, [location, date, computeMoonPosition]);

  return (
    <div className="finder-grid">
      <section className="finder-controls" aria-labelledby="location-title">
        <div className="panel-heading"><span className="panel-icon"><MapPinIcon size={20} /></span><div><h3 id="location-title">Make it your sky</h3><p>Start with your location.</p></div><span className="panel-number">01</span></div>
        <Button onClick={getCurrentLocation} disabled={loading} className="locate-cta"><LocateFixed size={17} />{loading ? 'Finding your location…' : 'Use my current location'}<ArrowUpRight size={16} /></Button>
        <div className="form-divider"><span />or enter coordinates<span /></div>
        <form onSubmit={(event) => { event.preventDefault(); handleManualLocation(); }}>
          <div className="coordinate-inputs">
            <div><Label htmlFor="latitude">Latitude</Label><Input id="latitude" type="number" step="any" min="-90" max="90" placeholder="e.g. 51.5072" value={manualLat} onChange={(event) => setManualLat(event.target.value)} /></div>
            <div><Label htmlFor="longitude">Longitude</Label><Input id="longitude" type="number" step="any" min="-180" max="180" placeholder="e.g. −0.1276" value={manualLon} onChange={(event) => setManualLon(event.target.value)} /></div>
          </div>
          <Button type="submit" variant="outline" className="manual-cta">Set location<ArrowUpRight size={16} /></Button>
        </form>
        <div className="date-field"><Label htmlFor="observation-date">Your date</Label><Popover><PopoverTrigger asChild><Button id="observation-date" variant="outline" className="date-button"><CalendarIcon size={17} />{format(date, 'MMMM d, yyyy')}<span>Change</span></Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)} initialFocus /></PopoverContent></Popover><p>Position uses the current time on your chosen date.</p></div>
        {error && <p className="finder-error" role="alert">{error}</p>}
        {location && <p className="location-confirmation" role="status"><span className="live-dot" />Location set · {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</p>}
      </section>
      <section className="finder-result" aria-labelledby="position-title" aria-busy={loading}>
        <div className="panel-heading"><span className="panel-icon"><MoonIcon size={20} /></span><div><h3 id="position-title">Your moon’s position</h3><p>{moonData ? 'A little direction for your next look up.' : 'A view of the sky from where you are.'}</p></div><span className="panel-number">02</span></div>
        {loading ? <div className="finder-empty" role="status"><LocateFixed className="locating-icon" size={40} /><h4>Finding your place…</h4><p>Allow location access in your browser,<br />or enter your coordinates on the left.</p></div> : moonData ? <>
          <div className="compass-result"><Compass azimuth={moonData.azimuth} deviceHeading={deviceHeading} /><div className="direction-caption"><span className="eyebrow">LOOK TOWARD</span><h4>{getCardinalDirection(moonData.azimuth)}</h4><p>{moonData.altitude > 0 ? `${moonData.altitude.toFixed(1)}° above the horizon` : 'Currently below your horizon'}</p></div></div>
          {permissionState === 'prompt' && <Button variant="outline" onClick={requestPermission} className="compass-enable">Enable live compass</Button>}
          <dl className="moon-metrics"><div><dt>Direction</dt><dd>{moonData.azimuth.toFixed(1)}<span>°</span></dd></div><div><dt>Altitude</dt><dd>{moonData.altitude.toFixed(1)}<span>°</span></dd></div><div><dt>Distance</dt><dd>{Math.round(moonData.distance).toLocaleString()}<span> km</span></dd></div></dl>
          <p className="result-note"><span className="live-dot" />{moonData.altitude > 0 ? 'Above the horizon · visibility depends on your sky' : 'Below the horizon · try a different date'}</p>
        </> : <div className="finder-empty"><div className="empty-orbit"><MoonIcon size={38} strokeWidth={1} /><span>N</span><i /></div><h4>A whole sky is waiting.</h4><p>Set your location to see the moon’s<br />direction, altitude, and distance.</p><span className="empty-tag"><MapPinIcon size={12} /> WAITING FOR YOUR LOCATION</span></div>}
      </section>
    </div>
  );
}
