import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import io from 'socket.io-client';
import { Platform } from 'react-native';

// Replace with your machine's local IP if testing on physical device
// For iOS Simulator, localhost works. For Android Emulator, use 10.0.2.2
const SOCKET_URL =
    Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

const BACKGROUND_TASK_NAME = 'lumen-location-tracking';

// Simple safe zone polygon (same as MapScreen)
const SAFE_ZONE_POLYGON = [
    { latitude: 28.6139, longitude: 77.209 }, // Delhi
    { latitude: 19.076, longitude: 72.8777 }, // Mumbai
    { latitude: 12.9716, longitude: 77.5946 }, // Bangalore
    { latitude: 28.6139, longitude: 77.209 }, // Close loop
];

// Ray-casting algorithm for point-in-polygon
function isPointInPolygon(lat, lng, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude;
        const yi = polygon[i].longitude;
        const xj = polygon[j].latitude;
        const yj = polygon[j].longitude;

        const intersect =
            yi > lng !== yj > lng &&
            lat <
                ((xj - xi) * (lng - yi)) / (yj - yi + Number.EPSILON) +
                    xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

class LocationService {
    constructor() {
        this.socket = null;
        this.watchId = null;
        this.isInsideSafeZone = null;
        this.onGeofenceStatusChange = null;
    }

    initSocket() {
        if (!this.socket) {
            this.socket = io(SOCKET_URL);
            this.socket.on('connect', () => {
                console.log('Mobile connected to socket server:', this.socket.id);
            });
        }
    }

    async requestPermissions() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return false;
        }
        return true;
    }

    async requestBackgroundPermissions() {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access background location was denied');
            return false;
        }
        return true;
    }

    async startTracking(userId = 'mobile-user-1', onGeofenceStatusChange) {
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return;

        this.onGeofenceStatusChange = onGeofenceStatusChange || null;
        this.initSocket();

        // Stop existing watch if any
        if (this.watchId) {
            await this.watchId.remove();
        }

        this.watchId = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 3000, // Update every 3 seconds
                distanceInterval: 5, // Update every 5 meters
            },
            (location) => {
                const { latitude, longitude } = location.coords;

                const inside = isPointInPolygon(
                    latitude,
                    longitude,
                    SAFE_ZONE_POLYGON
                );
                if (inside !== this.isInsideSafeZone) {
                    this.isInsideSafeZone = inside;
                    const statusText = inside
                        ? 'Inside Safe Zone'
                        : 'Outside Safe Zone';
                    console.log('Geofence status changed:', statusText);
                    if (this.onGeofenceStatusChange) {
                        this.onGeofenceStatusChange(statusText);
                    }
                }

                if (this.socket) {
                    this.socket.emit('update_location', [
                        {
                            id: userId,
                            lat: latitude,
                            lng: longitude,
                            name: 'Mobile User (You)',
                        },
                    ]);
                }
            }
        );
    }

    async startBackgroundTracking(userId = 'mobile-user-1') {
        const hasBgPermission = await this.requestBackgroundPermissions();
        if (!hasBgPermission) return;

        const isRegistered = await Location.hasStartedLocationUpdatesAsync(
            BACKGROUND_TASK_NAME
        );
        if (!isRegistered) {
            await Location.startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
                accuracy: Location.Accuracy.High,
                timeInterval: 3000,
                distanceInterval: 5,
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: 'Lumen is tracking your location',
                    notificationBody:
                        'Background tracking is active to monitor safe zones.',
                },
            });
            console.log('Background location tracking started');
        }
    }

    stopTracking() {
        if (this.watchId) {
            this.watchId.remove();
            this.watchId = null;
        }
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

// Background task definition
TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.log('Background location task error:', error);
        return;
    }

    const { locations } = data || {};
    if (!locations || !locations.length) return;

    const { latitude, longitude } = locations[0].coords;
    const inside = isPointInPolygon(latitude, longitude, SAFE_ZONE_POLYGON);

    console.log(
        '[Background] Location:',
        latitude,
        longitude,
        inside ? '(inside safe zone)' : '(outside safe zone)'
    );

    // Emit to socket server from background
    try {
        const bgSocket = io(SOCKET_URL);
        bgSocket.emit('update_location', [
            {
                id: 'mobile-user-1',
                lat: latitude,
                lng: longitude,
                name: 'Mobile User (Background)',
            },
        ]);
        // Give socket a moment then disconnect
        setTimeout(() => {
            bgSocket.disconnect();
        }, 1000);
    } catch (e) {
        console.log('Background socket error:', e);
    }
});

export default new LocationService();
