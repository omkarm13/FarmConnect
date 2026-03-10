const Order = require("../models/order.js");
const Cart = require("../models/cart.js");
const Vegetable = require("../models/vegetable.js");
const TryCatch = require("../utils/TryCatch.js");
const User = require("../models/user.js");

const showOrderAPI = TryCatch(async (req, res) => {
    let orders = await Order.find({ user: req.user._id })
        .populate("items.vegetable")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });

    orders = orders.map(order => {
        const orderObj = order.toObject();
        return orderObj;
    });

    return res.status(200).json({
        success: true,
        data: { orders, count: orders.length }
    });
});

const getOrderByIdAPI = TryCatch(async (req, res) => {
    let order = await Order.findById(req.params.id)
        .populate("items.vegetable")
        .populate("assignedTo", "name email");

    if (!order) {
        return res.status(404).json({
            success: false,
            error: { message: "Order not found" }
        });
    }

    return res.status(200).json({
        success: true,
        data: { order }
    });
});

const placeOrderAPI = TryCatch(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.vegetable");

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            success: false,
            error: { message: "Your cart is empty" }
        });
    }

    let totalPrice = 0;
    let updates = [];

    for (let item of cart.items) {
        let vegetable = await Vegetable.findById(item.vegetable._id);

        if (!vegetable) {
            return res.status(404).json({
                success: false,
                error: { message: `Vegetable ${item.vegetable.title} not found` }
            });
        }

        if (vegetable.quantity < item.quantity) {
            return res.status(400).json({
                success: false,
                error: { message: `Not enough stock for ${vegetable.title}` }
            });
        }

        totalPrice += vegetable.price * item.quantity;

        updates.push({
            updateOne: {
                filter: { _id: vegetable._id },
                update: { $inc: { quantity: -item.quantity } }
            }
        });
    }

    if (updates.length > 0) {
        await Vegetable.bulkWrite(updates);
    }

    let deliveryBoy = await User.findOne({ role: "delivery_boy" })
        .sort({ assignedOrders: 1 })
        .exec();

    if (!deliveryBoy) {
        return res.status(503).json({
            success: false,
            error: { message: "No delivery boys available at the moment" }
        });
    }

    let newOrder = new Order({
        user: req.user._id,
        items: cart.items,
        totalPrice,
        assignedTo: deliveryBoy._id,
        status: "Assigned"
    });

    await newOrder.save();
    await newOrder.populate("items.vegetable");
    await newOrder.populate("assignedTo", "name email");

    await User.findByIdAndUpdate(deliveryBoy._id, { $inc: { assignedOrders: 1 } });

    await Cart.findOneAndDelete({ user: req.user._id });

    return res.status(201).json({
        success: true,
        message: `Order placed successfully and assigned to ${deliveryBoy.name}`,
        data: { order: newOrder }
    });
});

const cancelOrderAPI = TryCatch(async (req, res) => {
    let order = await Order.findById(req.params.id).populate("items.vegetable");

    if (!order) {
        return res.status(404).json({
            success: false,
            error: { message: "Order not found" }
        });
    }

    if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            error: { message: "You don't have permission to cancel this order" }
        });
    }

    if (order.status === "Delivered") {
        return res.status(400).json({
            success: false,
            error: { message: "Cannot cancel a delivered order" }
        });
    }

    let updates = [];

    for (let item of order.items) {
        let vegetable = await Vegetable.findById(item.vegetable._id);
        if (vegetable) {
            updates.push({
                updateOne: {
                    filter: { _id: vegetable._id },
                    update: { $inc: { quantity: item.quantity } }
                }
            });
        }
    }

    if (updates.length > 0) {
        await Vegetable.bulkWrite(updates);
    }

    if (order.assignedTo) {
        await User.findByIdAndUpdate(order.assignedTo, { $inc: { assignedOrders: -1 } });
    }

    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Order canceled successfully"
    });
});

module.exports.placeOrderAPI = placeOrderAPI;
module.exports.showOrderAPI = showOrderAPI;
module.exports.getOrderByIdAPI = getOrderByIdAPI;
module.exports.cancelOrderAPI = cancelOrderAPI;
