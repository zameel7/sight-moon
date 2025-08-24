'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, MoonIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Compass } from '@/components/Compass';

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

  // Convert degrees to cardinal direction
  const getCardinalDirection = (degrees: number): string => {
    // Normalize degrees to 0-360 range
    const normalized = ((degrees % 360) + 360) % 360;
    
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
      (error) => {
        setError('Unable to retrieve your location. Please enter coordinates manually.');
        setLoading(false);
      }
    );
  };

  const fetchMoonPosition = async () => {
    if (!location) {
      setError('Please set your location first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedDate = format(date, 'MM-dd-yyyy');
      const response = await fetch(
        `/api/moon-position?lat=${location.lat}&lon=${location.lon}&date=${formattedDate}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch moon position');
      }

      const data = await response.json();
      
      // Extract moon data from the nested structure
      if (data.status === 'ok' && data.data?.moon) {
        setMoonData(data.data.moon);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch moon position');
    } finally {
      setLoading(false);
    }
  };

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
      fetchMoonPosition();
    }
  }, [location, date]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-6 md:mb-8">
           <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
             <MoonIcon className="w-6 h-6 md:w-8 md:h-8" />
             Sight Moon
           </h1>
           <p className="text-slate-300 text-sm md:text-base">Discover the moon's position in the sky</p>
         </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          {/* Location and Date Controls */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Location & Date</CardTitle>
              <CardDescription className="text-slate-300">
                Set your location and choose a date to see the moon's position
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
                  className="w-full border-white/20 text-white hover:bg-white/10"
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
                      className="w-full justify-start text-left font-normal border-white/20 text-white hover:bg-white/10"
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
                    <Compass azimuth={moonData.azimuth} className="mx-auto" />
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
                      <p className="text-slate-300 text-xs md:text-sm">Direction</p>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {moonData.azimuth !== undefined ? `${moonData.azimuth.toFixed(1)}°` : 'N/A'}
                      </p>
                      <p className="text-gray-300 text-xs">
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
