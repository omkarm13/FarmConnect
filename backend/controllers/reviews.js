const User = require("../models/user.js");
const Vegetable = require("../models/vegetable.js");
const Review = require("../models/review.js");

module.exports.createReviewAPI = async(req, res, next)=>{
    try {
        let vegetable = await Vegetable.findById(req.params.id);
        
        if (!vegetable) {
            return res.status(404).json({
                success: false,
                error: { message: "Vegetable not found" }
            });
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        vegetable.reviews.push(newReview);

        await newReview.save();
        await vegetable.save();
        await newReview.populate("author", "name email");

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: { review: newReview }
        });
    } catch (err) {
        next(err);
    }
};

module.exports.deleteReviewAPI = async(req, res, next)=>{
    try {
        let {id, reviewId} = req.params;

        await Vegetable.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({
                success: false,
                error: { message: "Review not found" }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};