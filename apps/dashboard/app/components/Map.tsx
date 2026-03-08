"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useSocket } from "../providers/SocketProvider";

// Fix for default marker icons in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapComponent() {
    const { socket } = useSocket();
    const [tourists, setTourists] = useState<any[]>([]);
    const position: [number, number] = [20.5937, 78.9629]; // India Center

    useEffect(() => {
        if (!socket) return;

        socket.on("location_update", (data: any[]) => {
            setTourists(data);
        });

        return () => {
            socket.off("location_update");
        };
    }, [socket]);

    return (
        <MapContainer center={position} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={icon}>
                <Popup>
                    Lumen HQ <br /> Central Monitoring Station
                </Popup>
            </Marker>
            {tourists.map((t) => (
                <Marker key={t.id} position={[t.lat, t.lng]} icon={icon}>
                    <Popup>{t.name} (Live)</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
