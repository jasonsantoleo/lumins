import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import geoRoutes from "./routes/geo.routes";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/geo", geoRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "api-gateway" });
});

import { createServer } from "http";
import { initSocket } from "./socket";
import { startSimulation } from "./simulation";

const httpServer = createServer(app);

initSocket(httpServer);
startSimulation();

httpServer.listen(port, () => {
    console.log(`API Service listening at http://localhost:${port}`);
});
