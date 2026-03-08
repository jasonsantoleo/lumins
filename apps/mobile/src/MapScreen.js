import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';

import LocationService from './services/LocationService';

export default function MapScreen() {
    const [status, setStatus] = useState('Initializing...');

    // Initial Region (India)
    const [region, setRegion] = useState({
        latitude: 20.5937,
        longitude: 78.9629,
        latitudeDelta: 20,
        longitudeDelta: 20,
    });

    const safeZone = [
        { latitude: 28.6139, longitude: 77.2090 }, // Delhi
        { latitude: 19.0760, longitude: 72.8777 }, // Mumbai
        { latitude: 12.9716, longitude: 77.5946 }, // Bangalore
        { latitude: 28.6139, longitude: 77.2090 }, // Close Loop
    ];

    useEffect(() => {
        const start = async () => {
            const permission = await LocationService.requestPermissions();
            if (permission) {
                setStatus('Live Tracking Active (Foreground & Background)');
                await LocationService.startTracking('user-mobile-1', (geofenceStatus) => {
                    setStatus(`Live: ${geofenceStatus}`);
                });
                // Also start background tracking to keep updates when app is not active
                await LocationService.startBackgroundTracking('user-mobile-1');
            } else {
                setStatus('Permission Denied');
            }
        };

        start();

        return () => {
            LocationService.stopTracking();
        };
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
            >
                {/* Safe Zone Visualization */}
                <Polygon
                    coordinates={safeZone}
                    fillColor="rgba(0, 255, 0, 0.2)"
                    strokeColor="rgba(0, 255, 0, 0.5)"
                />

                <Marker
                    coordinate={{ latitude: 20.5937, longitude: 78.9629 }}
                    title="Lumen HQ"
                    description="Central Station"
                />
            </MapView>

            <View style={styles.overlay}>
                <Text style={styles.overlayText}>Lumen SafeMap</Text>
                <Text style={{ color: 'white', fontSize: 10 }}>{status}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 8,
    },
    overlayText: {
        color: '#00D1FF',
        fontWeight: 'bold',
    },
});
