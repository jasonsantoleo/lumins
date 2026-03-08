import mongoose from 'mongoose';

const GeoLogSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    timestamp: { type: Date, default: Date.now },
    accuracy: Number,
    speed: Number,
    altitude: Number,
    heading: Number,
    activity: String, // e.g. "still", "walking", "in_vehicle"
    batteryLevel: Number
});

// Create 2dsphere index for spatial queries
GeoLogSchema.index({ location: '2dsphere' });

export const GeoLog = mongoose.model('GeoLog', GeoLogSchema);
