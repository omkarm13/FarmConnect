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

async function main() {
    await mongoose.connect(ATLAS_URL);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "/public")));

//Routes
app.use("/api/user", userRoutes);
app.use("/api/vegetables", vegetableRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/vegetables/:id/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryRoutes);

//error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, `Cannot ${req.method} ${req.path}`));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    
    console.error("Error:", {
        statusCode,
        message,
        path: req.path,
        method: req.method,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    
    return res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            statusCode: statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
});

module.exports = app;

