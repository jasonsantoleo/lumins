
export interface Zone {
    lat: number;
    lng: number;
    radius: number; // in meters
    risk: string;
    level: 'High' | 'Medium' | 'Low';
}

export const DANGER_ZONES: Zone[] = [
    { lat: 48.8606, lng: 2.3376, radius: 300, risk: "High Pickpocket Activity", level: 'High' },
    { lat: 48.8529, lng: 2.3499, radius: 200, risk: "Crowded Area", level: 'Medium' },
];

export const TOURIST_CLUSTERS = [
    { lat: 48.8584, lng: 2.2945, count: 450 }, // Eiffel
    { lat: 48.8602, lng: 2.3372, count: 800 }, // Louvre
];

export const DISPATCH_SETTINGS = {
    redZoneRadius: 150, // Meters around SOS
    yellowZoneRadius: 400, // Meters around SOS
};
