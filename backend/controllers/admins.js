const User = require("../models/user.js");
const generateAdminToken = require("../utils/generateAdminToken.js");
const TryCatch = require("../utils/TryCatch.js");
const Order = require("../models/order.js");

module.exports.adminLoginAPI = TryCatch(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: { message: "Username and password are required" }
        });
    }

    if (username === process.env.ADMIN_UNAME && password === process.env.ADMIN_PASSWD) {
        generateAdminToken(res);

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: { role: "admin" }
        });
    } else {
        return res.status(401).json({
            success: false,
            error: { message: "Incorrect username or password" }
        });
    }
});

module.exports.viewOrdersAPI = TryCatch(async (req, res) => {
    const orders = await Order.find()
        .populate("user", "name email address")
        .populate("assignedTo", "name email")
        .populate("items.vegetable")
        .sort({ createdAt: -1 });
    
    const deliveryBoys = await User.find({ role: "delivery_boy" }).select("name email assignedOrders");

    return res.status(200).json({
        success: true,
        data: {
            orders,
            deliveryBoys,
            count: orders.length
        }
    });
});

module.exports.assignOrdersAPI = TryCatch(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({
            success: false,
            error: { message: "Order not found" }
        });
    }

    if (order.status === "Delivered") {
        return res.status(400).json({
            success: false,
            error: { message: "Cannot reassign a delivered order" }
        });
    }

    const deliveryBoy = await User.findOne({ role: "delivery_boy" })
        .sort({ assignedOrders: 1 })
        .exec();

    if (!deliveryBoy) {
        return res.status(503).json({
            success: false,
            error: { message: "No delivery boys available" }
        });
    }

    if (order.assignedTo) {
        await User.findByIdAndUpdate(order.assignedTo, { $inc: { assignedOrders: -1 } });
    }

    order.assignedTo = deliveryBoy._id;
    order.status = "Assigned";
    await order.save();
    await order.populate("assignedTo", "name email");
    await order.populate("user", "name email address");

    await User.findByIdAndUpdate(deliveryBoy._id, { $inc: { assignedOrders: 1 } });

    return res.status(200).json({
        success: true,
        message: `Order reassigned to ${deliveryBoy.name}`,
        data: { order }
    });
});

module.exports.logoutAdminAPI = TryCatch(async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("token", "", { 
        maxAge: 0, 
        httpOnly: true, 
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});
