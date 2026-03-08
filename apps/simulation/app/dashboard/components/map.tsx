"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { ShieldAlert, User } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { DANGER_ZONES, TOURIST_CLUSTERS, DISPATCH_SETTINGS } from "../../lib/constants";

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to center map
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// Mock Data
// Zones now imported from constants


export default function DashboardMap({
    userLocation,
    isSosActive
}: {
    userLocation: { lat: number, lng: number } | null,
    isSosActive: boolean
}) {
    const defaultCenter: [number, number] = [48.8566, 2.3522]; // Paris
    const center = userLocation ? [userLocation.lat, userLocation.lng] as [number, number] : defaultCenter;
    const zoom = isSosActive ? 16 : 13;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            className="w-full h-full z-0 bg-transparent"
        >
            {/* Dark Mode Map Tiles (inverted in CSS) */}
            <div className="dark-tiles">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </div>

            <MapUpdater center={center} zoom={zoom} />

            {/* Danger Zones */}
            {DANGER_ZONES.map((zone, i) => (
                <Circle
                    key={i}
                    center={[zone.lat, zone.lng]}
                    radius={zone.radius}
                    pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
                >
                    <Popup className="glass-popup">
                        <div className="text-red-500 font-bold">⚠️ {zone.risk}</div>
                    </Popup>
                </Circle>
            ))}

            {/* Heatmap Clusters (Green circles for safety/density) */}
            {TOURIST_CLUSTERS.map((cluster, i) => (
                <Circle
                    key={i}
                    center={[cluster.lat, cluster.lng]}
                    radius={cluster.count / 2}
                    pathOptions={{ color: 'transparent', fillColor: '#3b82f6', fillOpacity: 0.2 }}
                />
            ))}

            {/* Dispatch Suggestion Zones (Only on SOS) */}
            {isSosActive && userLocation && (
                <>
                    {/* Red Zone - Immediate Dispatch */}
                    <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={DISPATCH_SETTINGS.redZoneRadius}
                        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
                    >
                        <Popup>
                            <div className="font-bold text-red-600">IMMEDIATE DISPATCH ZONE</div>
                            <div className="text-xs">High priority response required.</div>
                        </Popup>
                    </Circle>

                    {/* Yellow Zone - Secondary Perimeter */}
                    <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={DISPATCH_SETTINGS.yellowZoneRadius}
                        pathOptions={{ color: 'yellow', fillColor: 'yellow', fillOpacity: 0.1, dashArray: '10, 10' }}
                    >
                        <Popup>
                            <div className="font-bold text-yellow-600">PERIMETER CONTROL</div>
                            <div className="text-xs">Establish containment and surveillance.</div>
                        </Popup>
                    </Circle>
                </>
            )}

            {/* Active User Marker (Only show specific marker if SOS is active, otherwise anonymous) */}
            {userLocation && isSosActive && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.divIcon({
                        className: 'bg-transparent',
                        html: `
              <div class="relative w-8 h-8">
                <div class="pulse-ring"></div>
                <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center bg-red-500 text-white animate-bounce">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="w-4 h-4" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                     <circle cx="12" cy="7" r="4"></circle>
                   </svg>
                </div>
              </div>
            `,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                    })}
                >
                    <Popup>
                        <div className="font-bold text-red-600">SOS TRIGGERED!</div>
                        <div className="text-xs">Police Dispatching...</div>
                    </Popup>
                </Marker>
            )}

        </MapContainer>
    );
}
