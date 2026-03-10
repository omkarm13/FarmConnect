const Vegetable = require("../models/vegetable.js");

module.exports.indexVegetableAPI = async (req, res, next) => {
    try {
        if (req.query.search && req.query.search.length > 0) {
            let searchQ = req.query.search;
            let searchVegetables = await Vegetable.find({ title: { $regex: searchQ, $options: "i" } })
                .collation({ locale: "en", strength: 2 })
                .populate("owner", "name email")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: {
                    vegetables: searchVegetables,
                    searchQuery: searchQ,
                    count: searchVegetables.length
                }
            });
        } else {
            const allVegetables = await Vegetable.find()
                .populate("owner", "name email")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: {
                    vegetables: allVegetables,
                    count: allVegetables.length
                }
            });
        }
    } catch (err) {
        next(err);
    }
};

module.exports.createVegetableAPI = async (req, res, next) => {
    try {
        const { title, description, price, location, category, quantity } = req.body;

        if (!title || !category || !quantity) {
            return res.status(400).json({
                success: false,
                error: { message: "Title, category, and quantity are required" }
            });
        }

        if (price && price < 0) {
            return res.status(400).json({
                success: false,
                error: { message: "Price cannot be negative" }
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                error: { message: "Quantity must be at least 1" }
            });
        }

        let newVegetable = new Vegetable(req.body);
        newVegetable.owner = req.user._id;

        if (req.file) {
            newVegetable.image = {
                url: req.file.secure_url,
                filename: req.file.public_id
            };
        }

        await newVegetable.save();
        await newVegetable.populate("owner", "name email");

        return res.status(201).json({
            success: true,
            message: "Vegetable created successfully",
            data: { vegetable: newVegetable }
        });
    } catch (err) {
        next(err);
    }
};

module.exports.showVegetableAPI = async (req, res, next) => {
    try {
        let { id } = req.params;
        const vegetable = await Vegetable.findById(id)
            .populate({ path: "reviews", populate: { path: "author", select: "name" } })
            .populate("owner", "name address role");

        if (!vegetable) {
            return res.status(404).json({
                success: false,
                error: { message: "Vegetable not found" }
            });
        }

        return res.status(200).json({
            success: true,
            data: { vegetable }
        });
    } catch (err) {
        next(err);
    }
};

module.exports.updateVegetableAPI = async (req, res, next) => {
    try {
        let { id } = req.params;
        const { price, quantity } = req.body;
        if (price !== undefined && price < 0) {
            return res.status(400).json({
                success: false,
                error: { message: "Price cannot be negative" }
            });
        }

        if (quantity !== undefined && quantity < 0) {
            return res.status(400).json({
                success: false,
                error: { message: "Quantity cannot be negative" }
            });
        }

        let updateData = { ...req.body };
        if (req.file) {
            updateData.image = {
                url: req.file.secure_url || req.file.path,
                filename: req.file.public_id || req.file.filename
            };
        }
        
        const updatedVegetable = await Vegetable.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate("owner", "name email");

        if (!updatedVegetable) {
            return res.status(404).json({
                success: false,
                error: { message: "Vegetable not found" }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vegetable updated successfully",
            data: { vegetable: updatedVegetable }
        });
    } catch (err) {
        next(err);
    }
};

module.exports.deleteVegetableAPI = async (req, res, next) => {
    try {
        let { id } = req.params;
        const deletedVegetable = await Vegetable.findByIdAndDelete(id);

        if (!deletedVegetable) {
            return res.status(404).json({
                success: false,
                error: { message: "Vegetable not found" }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vegetable deleted successfully",
            data: { vegetable: deletedVegetable }
        });
    } catch (err) {
        next(err);
    }
};
