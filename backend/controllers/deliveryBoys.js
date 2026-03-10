const User = require("../models/user.js");
const Order = require("../models/order.js");
const TryCatch = require("../utils/TryCatch.js");
const axios = require("axios");

module.exports.viewOrderAPI = TryCatch(async (req, res) => {
    const orders = await Order.find({ assignedTo: req.user._id })
        .populate("user", "name email address")
        .populate("items.vegetable")
        .sort({ createdAt: -1 });

    let customerLocations = [];
    const pendingOrders = orders.filter(order => order.status !== "Delivered");

    const locationPromises = pendingOrders.map(async (order) => {
        const address = order.user.address;
        if (!address) return null;

        try {
            const response = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${process.env.MAP_API}`);
            if (response.data && response.data.features.length > 0) {
                const [lng, lat] = response.data.features[0].geometry.coordinates;
                return { name: order.user.name, coords: [lng, lat] };
            }
        } catch (error) {
            console.error(`Error fetching coordinates for ${address}:`, error);
        }
        return null;
    });

    const resolvedLocations = await Promise.all(locationPromises);
    customerLocations = resolvedLocations.filter(loc => loc !== null);

    return res.status(200).json({
        success: true,
        data: {
            orders,
            customerLocations,
            count: orders.length
        }
    });
});

module.exports.updateOrderStatusAPI = TryCatch(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({
            success: false,
            error: { message: "Order not found" }
        });
    }

    if (order.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            error: { message: "You don't have permission to update this order" }
        });
    }

    if (order.status === "Delivered") {
        return res.status(400).json({
            success: false,
            error: { message: "Order already delivered" }
        });
    }

    order.status = "Delivered";
    await order.save();

    await User.findByIdAndUpdate(order.assignedTo, { $inc: { assignedOrders: -1 } });

    return res.status(200).json({
        success: true,
        message: "Order marked as delivered",
        data: { order }
    });
});