const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const vegetableSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
       url: String,
       filename: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: String,
    category: {
      type: String,
      enum: ['roots', 'leaves', 'pods', 'flowers','fruits'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    reviews: [
      { type: Schema.Types.ObjectId, ref: "Review" }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
}, {
    timestamps: true
});

vegetableSchema.post("findOneAndDelete", async(vegetable) => {
  if (vegetable) {
    await Review.deleteMany({ _id: { $in: vegetable.reviews } });
  }
});

const Vegetable = mongoose.model("Vegetable", vegetableSchema);
module.exports = Vegetable;
