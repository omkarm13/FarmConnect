const Cart = require("../models/cart.js");
const Vegetable = require("../models/vegetable.js");
const TryCatch = require("../utils/TryCatch.js");

module.exports.addCartAPI = TryCatch(async (req, res) => {
    let { vegId } = req.params;
    let { quantity } = req.body;
    let userId = req.user._id;

    quantity = Math.max(1, parseInt(quantity) || 1);

    const vegetable = await Vegetable.findById(vegId);
    if (!vegetable) {
        return res.status(404).json({
            success: false,
            error: { message: "Vegetable not found" }
        });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    let itemIndex = cart.items.findIndex(item => item.vegetable.toString() === vegId);

    let totalQuantity = quantity;
    if (itemIndex > -1) {
        totalQuantity += cart.items[itemIndex].quantity;
    }

    if (totalQuantity > vegetable.quantity) {
        return res.status(400).json({
            success: false,
            error: { message: `Only ${vegetable.quantity} units available in stock` }
        });
    }

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = totalQuantity;
    } else {
        cart.items.push({ vegetable: vegId, quantity });
    }

    await cart.save();
    await cart.populate("items.vegetable");

    return res.status(200).json({
        success: true,
        message: "Item added to cart",
        data: { cart }
    });
});

module.exports.viewCartAPI = TryCatch(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.vegetable");

    if (!cart) {
        return res.status(200).json({
            success: true,
            data: { cart: { items: [] } }
        });
    }

    return res.status(200).json({
        success: true,
        data: { cart }
    });
});

module.exports.deleteCartAPI = TryCatch(async (req, res) => {
    let { vegId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            error: { message: "Cart not found" }
        });
    }

    cart.items = cart.items.filter(item => item.vegetable.toString() !== vegId);
    await cart.save();

    return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: { cart }
    });
});

module.exports.updateCartAPI = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({
            success: false,
            error: { message: "Quantity must be at least 1" }
        });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            error: { message: "Cart not found" }
        });
    }

    let cartItem = cart.items.find(item => item.vegetable.toString() === id);

    if (!cartItem) {
        return res.status(404).json({
            success: false,
            error: { message: "Item not found in cart" }
        });
    }

    const vegetable = await Vegetable.findById(id);
    if (!vegetable) {
        return res.status(404).json({
            success: false,
            error: { message: "Vegetable not found" }
        });
    }

    if (parseInt(quantity) > vegetable.quantity) {
        return res.status(400).json({
            success: false,
            error: { message: `Only ${vegetable.quantity} units available in stock` }
        });
    }

    cartItem.quantity = parseInt(quantity);
    await cart.save();
    await cart.populate("items.vegetable");

    return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: { cart }
    });
});
