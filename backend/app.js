require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const userRoutes = require("./routes/user.js");
const vegetableRoutes = require("./routes/vegetable.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const reviewRoutes = require("./routes/review.js");
const adminRoutes = require("./routes/admin.js");
const deliveryRoutes = require("./routes/deliveryBoy.js");

const ATLAS_URL = process.env.ATLAS_DB_URL;

mongoose.connect(ATLAS_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB error:", err));

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/user", userRoutes);
app.use("/api/vegetables", vegetableRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/vegetables/:id/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
}

// SPA fallback
app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return next(new ExpressError(404, "Not Found"));
    }
    
    if (process.env.NODE_ENV === "production") {
        res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
    } else {
        res.json({ message: "Use Vite dev server in development" });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).json({
        success: false,
        message: message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

