import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "api-gateway" });
});

app.listen(port, () => {
    console.log(`API Service listening at http://localhost:${port}`);
});
