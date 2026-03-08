"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type LatLng = { latitude: number; longitude: number };

// Same polygon as mobile app MapScreen / LocationService
const SAFE_ZONE_POLYGON: LatLng[] = [
  { latitude: 28.6139, longitude: 77.209 }, // Delhi
  { latitude: 19.076, longitude: 72.8777 }, // Mumbai
  { latitude: 12.9716, longitude: 77.5946 }, // Bangalore
  { latitude: 28.6139, longitude: 77.209 }, // Close loop
];

function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  const { latitude: x, longitude: y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;

    const intersect =
      yi > y !== yj > y &&
      x <
        ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) +
          xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function MobilePrototypePage() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<string>("Waiting for location permission…");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isInsideSafeZone, setIsInsideSafeZone] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<{ name: string; phone?: string } | null>(
    null
  );
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    const socketInstance = io("http://localhost:3001");
    socketInstance.on("connect", () => {
      console.log("Mobile prototype connected to socket:", socketInstance.id);
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Load saved profile on first render
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("lumen-web-profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) {
          setProfile({ name: parsed.name, phone: parsed.phone });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation not available in this browser.");
      return;
    }

    setStatus("Requesting location permissions…");

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setPosition(coords);

        const inside = isPointInPolygon(coords, SAFE_ZONE_POLYGON);
        if (inside !== isInsideSafeZone) {
          setIsInsideSafeZone(inside);
          const text = inside ? "Inside Safe Zone" : "Outside Safe Zone";
          console.log("Geofence status changed (web proto):", text);
          setStatus(`Live: ${text}`);
        } else if (inside && !status.startsWith("Live")) {
          setStatus("Live: Inside Safe Zone");
        } else if (!inside && !status.startsWith("Live")) {
          setStatus("Live: Outside Safe Zone");
        }

        if (socket) {
          socket.emit("update_location", [
            {
              id: profile?.name || "web-mobile-proto",
              lat: coords.latitude,
              lng: coords.longitude,
              name: profile?.name || "Web Mobile Prototype",
            },
          ]);
        }
      },
      (err) => {
        // If real geolocation fails, fall back to a demo location so the prototype still works.
        console.warn("Geolocation error, falling back to demo location", err);

        const demoCoords: LatLng = {
          latitude: 20.5937,
          longitude: 78.9629,
        };

        setPosition(demoCoords);

        const inside = isPointInPolygon(demoCoords, SAFE_ZONE_POLYGON);
        setIsInsideSafeZone(inside);
        const text = inside ? "Inside Safe Zone (demo)" : "Outside Safe Zone (demo)";
        setStatus(`Live: ${text}`);

        if (socket) {
          socket.emit("update_location", [
            {
              id: profile?.name || "web-mobile-proto",
              lat: demoCoords.latitude,
              lng: demoCoords.longitude,
              name: profile?.name || "Web Mobile Prototype (Demo)",
            },
          ]);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isInsideSafeZone]);

  // Simple "wallet" / identity creation handler
  const handleCreateProfile = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      alert("Please enter your name to continue.");
      return;
    }
    const p = { name: trimmedName, phone: phoneInput.trim() || undefined };
    setProfile(p);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lumen-web-profile", JSON.stringify(p));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-zinc-50">
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
        {/* App header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Lumen
            </span>
            <span className="text-lg font-semibold text-zinc-100">
              SafeMap Mobile
            </span>
          </div>
          {profile ? (
            <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300">
              Live
            </span>
          ) : (
            <span className="text-[11px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              Setup
            </span>
          )}
        </div>

        {/* Content */}
        {!profile ? (
          <div className="mt-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 flex flex-col gap-4">
            <div className="space-y-1">
              <h1 className="text-base font-semibold text-zinc-50">
                Create your Lumen ID
              </h1>
              <p className="text-[11px] text-zinc-400">
                This acts like a lightweight wallet for this demo. Your name will
                appear on the control-center map.
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Full name</label>
                <input
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-zinc-50 outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="e.g. Rahul Mehta"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">
                  Phone (optional)
                </label>
                <input
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-zinc-50 outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="+91 98765 43210"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleCreateProfile}
              className="h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-xs font-semibold text-black tracking-wide shadow-lg shadow-cyan-500/30 transition-colors mt-2"
            >
              Continue & start live tracking
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
          {/* Status card */}
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-3 text-xs text-zinc-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-cyan-300 text-[12px]">
                  Safety status
                </span>
                <span className="text-[10px] text-zinc-500">
                  Real-time geofence monitoring
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isInsideSafeZone == null
                    ? "bg-zinc-800 text-zinc-300"
                    : isInsideSafeZone
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-red-500/20 text-red-300 border border-red-500/40"
                }`}
              >
                {isInsideSafeZone == null
                  ? "Locating…"
                  : isInsideSafeZone
                  ? "Inside Safe Zone"
                  : "Outside Safe Zone"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">{status}</p>
          </div>

          {/* Live data card */}
          <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                Device
              </span>
              <span className="text-[10px] text-emerald-300">
                Online • Socket linked
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-zinc-300">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500">Latitude</span>
                <p className="font-mono text-[11px]">
                  {position ? position.latitude.toFixed(5) : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500">Longitude</span>
                <p className="font-mono text-[11px]">
                  {position ? position.longitude.toFixed(5) : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500">Client ID</span>
                <p className="font-mono text-[11px] text-cyan-300">
                  {profile?.name || "web-mobile-proto"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500">Channel</span>
                <p className="font-mono text-[11px] text-zinc-200">
                  update_location
                </p>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            className="h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-xs font-semibold text-black tracking-wide shadow-lg shadow-cyan-500/30 transition-colors"
          >
            Tracking active • keep this tab open
          </button>
        </div>
        )}
      </div>
    </main>
  );
}

