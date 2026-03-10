const Vegetable = require("./models/vegetable.js");
const Review = require("./models/review.js");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");

module.exports.isAuthAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Please login to continue" }
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (!decodedData) {
      return res.status(401).json({
        success: false,
        error: { message: "Token expired, please login again" }
      });
    }

    const userId = await User.findById(decodedData.id);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: "User not found" }
      });
    }

    req.user = userId;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: "Authentication failed" }
    });
  }
};

module.exports.isOwnerAPI = async (req, res, next) => {
  try {
    let { id } = req.params;
    let vegetable = await Vegetable.findById(id);

    if (!vegetable) {
      return res.status(404).json({
        success: false,
        error: { message: "Vegetable not found" }
      });
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Please login to continue" }
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (!decodedData) {
      return res.status(401).json({
        success: false,
        error: { message: "Token expired, please login again" }
      });
    }

    if (!vegetable.owner._id.equals(decodedData.id)) {
      return res.status(403).json({
        success: false,
        error: { message: "You don't have permission to perform this action" }
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: "Authorization failed" }
    });
  }
};

module.exports.setCurrUserAPI = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SEC);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    req.user = null;
    next();
  }
};

module.exports.isAdminAuthAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized - Please login" }
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (decodedData.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: { message: "Unauthorized - Admin access required" }
      });
    }

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: { message: "Session expired. Please login again" }
      });
    }
    return res.status(500).json({
      success: false,
      error: { message: "Authorization error" }
    });
  }
};

module.exports.isFarmerAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized - Please login" }
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (decodedData.role !== "farmer") {
      return res.status(403).json({
        success: false,
        error: { message: "Unauthorized - Farmer access required" }
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: "Authentication failed" }
    });
  }
};

module.exports.isCustomerAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized - Please login" }
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (decodedData.role !== "customer") {
      return res.status(403).json({
        success: false,
        error: { message: "Unauthorized - Customer access required" }
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: "Authentication failed" }
    });
  }
};

module.exports.isDeliveryBoyAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized - Please login" }
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (decodedData.role !== "delivery_boy") {
      return res.status(403).json({
        success: false,
        error: { message: "Unauthorized - Delivery boy access required" }
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: "Authentication failed" }
    });
  }
};

module.exports.isReviewAuthorAPI = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId).populate('author');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: { message: "Review not found" }
      });
    }

    if (!review.author || !review.author._id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: { message: "You don't have permission to perform this action" }
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: "Authorization failed" }
    });
  }
};