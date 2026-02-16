'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, MoonIcon } from 'lucide-react';
import SunCalc from 'suncalc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function Home() {
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
      }
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
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-6 md:mb-8">
           <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
             <MoonIcon className="w-6 h-6 md:w-8 md:h-8" />
             Sight Moon
           </h1>
           <p className="text-slate-300 text-sm md:text-base">Discover the moon&apos;s position in the sky</p>
         </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          {/* Location and Date Controls */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Location & Date</CardTitle>
              <CardDescription className="text-slate-300">
                Set your location and choose a date to see the moon&apos;s position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {/* Current Location Button */}
              <div>
                <Button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  {loading ? 'Getting Location...' : 'Get Current Location'}
                </Button>
              </div>

              {/* Manual Coordinates */}
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-white">Manual Coordinates</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    id="latitude"
                    type="number"
                    placeholder="Latitude"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                  <Input
                    id="longitude"
                    type="number"
                    placeholder="Longitude"
                    value={manualLon}
                    onChange={(e) => setManualLon(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <Button
                  onClick={handleManualLocation}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-white/5"
                >
                  Set Manual Location
                </Button>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="text-white">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-white/20 text-white hover:bg-white/10 bg-white/5"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Location Display */}
              {location && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-md">
                  <p className="text-green-300 text-sm">
                    Location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Moon Position Display */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Moon Position</CardTitle>
              <CardDescription className="text-slate-300">
                Current moon data for your location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : moonData ? (
                <div className="space-y-3 md:space-y-4">
                  {/* Compass */}
                  {moonData.azimuth !== undefined && (
                    <div className="space-y-2">
                      {permissionState === 'prompt' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={requestPermission}
                          className="w-full border-white/20 text-white hover:bg-white/10 text-xs"
                        >
                          Enable compass (point phone north)
                        </Button>
                      )}
                      <Compass
                        azimuth={moonData.azimuth}
                        deviceHeading={deviceHeading}
                        className="mx-auto"
                      />
                    </div>
                  )}
                  
                  {/* Moon Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div className="bg-white/10 p-2 md:p-3 rounded-lg">
                      <p className="text-slate-300 text-xs md:text-sm">Altitude</p>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {moonData.altitude !== undefined ? `${moonData.altitude.toFixed(1)}°` : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-white/10 p-2 md:p-3 rounded-lg">
                      <p className="text-slate-300 text-xs md:text-sm">Distance</p>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {moonData.distance !== undefined ? `${moonData.distance.toFixed(0)} km` : 'N/A'}
                      </p>
                    </div>
                                        <div className="bg-white/10 p-2 md:p-3 rounded-lg">
                      <p className="text-slate-300 text-xs md:text-sm">Azimuth</p>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {moonData.azimuth !== undefined ? `${moonData.azimuth.toFixed(1)}°` : 'N/A'}
                      </p>
                      <p className="text-white text-xs font-medium">
                        {moonData.azimuth !== undefined ? getCardinalDirection(moonData.azimuth) : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-white/10 p-2 md:p-3 rounded-lg">
                      <p className="text-slate-300 text-xs md:text-sm">Status</p>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {moonData.altitude !== undefined ? (moonData.altitude > 0 ? 'Above Horizon' : 'Below Horizon') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  

                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <MoonIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Set your location to see moon position data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
