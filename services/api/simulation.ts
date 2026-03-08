import { getIO } from "./socket";

interface Tourist {
    id: string;
    lat: number;
    lng: number;
    name: string;
}

const tourists: Tourist[] = [
    { id: "t1", lat: 20.5937, lng: 78.9629, name: "Alice" }, // Central India
    { id: "t2", lat: 12.9716, lng: 77.5946, name: "Bob" },   // Bangalore
    { id: "t3", lat: 28.7041, lng: 77.1025, name: "Charlie" }, // Delhi
];

export const startSimulation = () => {
    console.log("Starting simulation...");

    setInterval(() => {
        // Move tourists slightly
        tourists.forEach(t => {
            t.lat += (Math.random() - 0.5) * 0.01;
            t.lng += (Math.random() - 0.5) * 0.01;
        });

        try {
            const io = getIO();
            io.emit("location_update", tourists);
            // console.log("Emitted location updates for", tourists.length, "tourists");
        } catch (e) {
            console.error("Socket not ready yet");
        }
    }, 2000); // Update every 2 seconds
};
