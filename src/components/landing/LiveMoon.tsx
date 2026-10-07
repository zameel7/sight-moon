"use client";

import { useEffect, useId, useState } from "react";
import { ArrowUpRight, LocateFixed } from "lucide-react";
import SunCalc from "suncalc";

type Coordinates = { lat: number; lon: number };
type Snapshot = {
  now: Date;
  phase: number;
  fraction: number;
  nextFull: Date;
  nextNew: Date;
};
const phases = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
];
const directions = [
  "North",
  "Northeast",
  "East",
  "Southeast",
  "South",
  "Southwest",
  "West",
  "Northwest",
];

// Locate the next phase crossings to the nearest hour (at most 32 days).
function upcomingPhases(now: Date): { nextFull: Date; nextNew: Date } {
  let previous = SunCalc.getMoonIllumination(now).phase;
  let nextFull: Date | undefined;
  let nextNew: Date | undefined;
  for (let hour = 1; hour <= 32 * 24; hour++) {
    const date = new Date(now.getTime() + hour * 3_600_000);
    const phase = SunCalc.getMoonIllumination(date).phase;
    if (!nextFull && previous < 0.5 && phase >= 0.5) nextFull = date;
    if (!nextNew && phase < previous) nextNew = date;
    if (nextFull && nextNew) return { nextFull, nextNew };
    previous = phase;
  }
  throw new Error("Could not calculate upcoming lunar phases.");
}

function MoonArt({ phase }: { phase: number }) {
  const id = useId().replace(/:/g, "");
  const waxing = phase <= 0.5;
  const limb: string[] = [];
  const terminator: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const y = -100 + i * 2;
    const x = Math.sqrt(Math.max(0, 10000 - y * y));
    limb.push(`${120 + (waxing ? x : -x)},${120 + y}`);
    terminator.unshift(
      `${120 + (waxing ? 1 : -1) * Math.cos(phase * 2 * Math.PI) * x},${120 + y}`,
    );
  }
  return (
    <div className="moon-art" aria-hidden="true">
      <div className="moon-orbit" />
      <span className="orbit-north">N</span>
      <svg viewBox="0 0 240 240" focusable="false">
        <defs>
          <radialGradient id={`${id}-light`} cx="35%" cy="30%">
            <stop stopColor="#fff6dd" />
            <stop offset=".65" stopColor="#d9d4c4" />
            <stop offset="1" stopColor="#8c9296" />
          </radialGradient>
          <radialGradient id={`${id}-dark`}>
            <stop stopColor="#202a3a" />
            <stop offset="1" stopColor="#111b2c" />
          </radialGradient>
          <clipPath id={`${id}-lit`}>
            <path d={`M${limb.join(" L")} L${terminator.join(" L")} Z`} />
          </clipPath>
        </defs>
        <circle
          cx="120"
          cy="120"
          r="100"
          fill={`url(#${id}-dark)`}
          stroke="#b4c5dc"
          strokeOpacity=".12"
        />
        <g clipPath={`url(#${id}-lit)`}>
          <circle cx="120" cy="120" r="100" fill={`url(#${id}-light)`} />
          <g fill="#626a6c" opacity=".17">
            <ellipse cx="82" cy="81" rx="28" ry="32" />
            <ellipse cx="141" cy="66" rx="21" ry="18" />
            <ellipse cx="158" cy="109" rx="29" ry="23" />
            <ellipse cx="92" cy="136" rx="34" ry="26" />
            <circle cx="138" cy="169" r="14" />
            <circle cx="65" cy="178" r="10" />
            <circle cx="183" cy="150" r="9" />
          </g>
          <g fill="none" stroke="#fff9e6" strokeOpacity=".22">
            <circle cx="67" cy="113" r="9" />
            <circle cx="121" cy="193" r="7" />
            <circle cx="165" cy="76" r="10" />
            <circle cx="148" cy="143" r="5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function LiveMoon() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function refresh() {
      const now = new Date();
      const illumination = SunCalc.getMoonIllumination(now);
      setSnapshot((previous) => ({
        now,
        phase: illumination.phase,
        fraction: illumination.fraction,
        ...(previous && previous.nextFull > now && previous.nextNew > now
          ? { nextFull: previous.nextFull, nextNew: previous.nextNew }
          : upcomingPhases(now)),
      }));
    }
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  function locate() {
    setError("");
    if (!navigator.geolocation) {
      setError(
        "Location is unavailable in this browser. You can enter coordinates in the finder below.",
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocating(false);
      },
      (failure) => {
        setLocating(false);
        setError(
          failure.code === 1
            ? "Location access was declined. You can still explore the phase or enter coordinates in the finder below."
            : "We couldn’t get your location. Try again outdoors, or enter coordinates in the finder below.",
        );
      },
      { timeout: 15_000, maximumAge: 60_000 },
    );
  }

  if (!snapshot)
    return (
      <div
        className="live-moon moon-skeleton"
        role="status"
        aria-label="Loading current moon phase"
      >
        <div className="skeleton-moon" />
        <div className="skeleton-line" />
        <p>Reading the night sky…</p>
      </div>
    );
  const { now, phase, fraction, nextFull, nextNew } = snapshot;
  const position = location
    ? SunCalc.getMoonPosition(now, location.lat, location.lon)
    : null;
  const times = location
    ? SunCalc.getMoonTimes(now, location.lat, location.lon)
    : null;
  const azimuth = position
    ? ((((position.azimuth * 180) / Math.PI + 180) % 360) + 360) % 360
    : 0;
  const altitude = position ? (position.altitude * 180) / Math.PI : 0;
  const eventDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const eventTime = (date: Date | undefined) =>
    date && Number.isFinite(date.getTime())
      ? date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })
      : "No event today";
  return (
    <div className="live-moon">
      <div className="sky-report-label">
        <span className="live-dot" /> YOUR LUNAR FIELD NOTES{" "}
        <span>
          {now.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <MoonArt phase={phase} />
      <div className="phase-caption">
        <span className="eyebrow">THE MOON RIGHT NOW</span>
        <h2>{phases[Math.round(phase * 8) % 8]}</h2>
        <p>
          {Math.round(fraction * 100)}% illuminated <span>·</span>{" "}
          {(phase * 29.53059).toFixed(1)} days old
        </p>
      </div>
      <dl className="lunar-events">
        <div>
          <dt>Next full moon</dt>
          <dd>{eventDate(nextFull)}</dd>
        </div>
        <div>
          <dt>Next new moon</dt>
          <dd>{eventDate(nextNew)}</dd>
        </div>
      </dl>
      <p className="approximation">
        Approximate dates & lunar age · Times in your device’s timezone
      </p>
      {position && times && (
        <div className="local-report">
          <p className="horizon-status">
            <span className="live-dot" />
            {altitude >= 0 ? "Above your horizon" : "Below your horizon"}
          </p>
          <dl className="position-grid">
            <div>
              <dt>Direction / azimuth</dt>
              <dd>
                {directions[Math.round(azimuth / 45) % 8]} ·{" "}
                {azimuth.toFixed(1)}°
              </dd>
            </div>
            <div>
              <dt>Altitude</dt>
              <dd>{altitude.toFixed(1)}°</dd>
            </div>
            <div>
              <dt>Moonrise today</dt>
              <dd>{eventTime(times.rise)}</dd>
            </div>
            <div>
              <dt>Moonset today</dt>
              <dd>{eventTime(times.set)}</dd>
            </div>
          </dl>
          {(times.alwaysUp || times.alwaysDown) && (
            <p className="approximation">
              The moon stays {times.alwaysUp ? "above" : "below"} the horizon
              all day.
            </p>
          )}
        </div>
      )}
      <button className="location-button" onClick={locate} disabled={locating}>
        <LocateFixed size={17} aria-hidden="true" />
        {locating
          ? "Finding your location…"
          : location
            ? "Refresh my location"
            : "Use my location"}
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
      <p className="privacy-note">
        {location
          ? "Location stays on your device. Updated every minute."
          : "Add moonrise, moonset & direction. Location stays on-device."}
      </p>
      <p className="location-error" role="status">
        {error}
      </p>
    </div>
  );
}
