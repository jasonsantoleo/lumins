import express from 'express';

const router = express.Router();

// Mock Alerts Data (GeoJSON)
router.get('/alerts', (req, res) => {
    res.json({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [78.9629, 20.5937]
                },
                properties: {
                    id: "alert-1",
                    type: "SOS",
                    severity: "HIGH",
                    timestamp: new Date().toISOString()
                }
            },
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [77.5946, 12.9716]
                },
                properties: {
                    id: "alert-2",
                    type: "GEOFENCE_BREACH",
                    severity: "MEDIUM",
                    timestamp: new Date().toISOString()
                }
            }
        ]
    });
});

export default router;
