require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const userRoutes = require("./routes/user.js");
const vegetableRoutes = require("./routes/vegetable.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const reviewRoutes = require("./routes/review.js");
const adminRoutes = require("./routes/admin.js");
const deliveryRoutes = require("./routes/deliveryBoy.js");

const app = express();

mongoose.connect(process.env.ATLAS_DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/vegetables", vegetableRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/vegetables/:id/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryRoutes);

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve index.html for all non-API routes (SPA fallback)
app.get("*", (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong!"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

