const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const mongoUri = process.env.MONGO_URI;
const frontendUrl = process.env.FRONTEND_URL;

const app = express();

//Separation of Concerns!
const taskRoutes = require("./routes/taskRoutes");

function normalizeOrigin(url) {
    if (!url) return null;

    try {
        return new URL(url.trim()).origin;
    } catch {
        return null;
    }
}

//Enable CORS
const allowedOrigins = [
    frontendUrl,
    "http://localhost:5173"
].map(normalizeOrigin).filter(Boolean);

const projectPreviewRegex = /^https:\/\/kanban-board-fullstack-[a-z0-9-]+\.vercel\.app$/;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true); //Postman/Server-to-Server
        }

        const normalized = normalizeOrigin(origin);

        const isExplicitlyAllowed = allowedOrigins.includes(normalized);
        const isProjectPreview = projectPreviewRegex.test(normalized);

        if (isExplicitlyAllowed || isProjectPreview) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(null, false);
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

//Middleware
app.use(express.json()); //converts incoming JSON strings from requets into JS objects
app.use(express.static(path.join(__dirname, "../frontend/dist")));

mongoose.connect(mongoUri)
    .then(() => console.log("Connection to MongoDB is up and running!"))
    .catch(err => console.error("Connection error with MongoDB:", err));

app.use("/api", taskRoutes);

//global error middleware (DRY principle)
//is used whenever I write "next(error)"
app.use((err, req, res, next) => {
    console.error("Global error log:", err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Server error";

    res.status(statusCode).json({
        status: "error",
        statusCode: statusCode,
        message: message
    });
});

//Server initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Kanban-Server is up and running under http://localhost:${PORT}`);
});
