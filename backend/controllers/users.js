const User = require("../models/user.js");
const Vegetable = require("../models/vegetable.js");
const generateToken = require("../utils/generateToken.js");
const TryCatch = require("../utils/TryCatch.js");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail.js");

const otpStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

module.exports.registerUserAPI = TryCatch(async (req, res) => {
    const { name, email, password, role, address } = req.body;

    if (!name || !email || !password || !role || !address) {
        return res.status(400).json({
            success: false,
            error: { message: "All fields are required" }
        });
    }

    let user = await User.findOne({ email });

    if (user) {
        return res.status(409).json({
            success: false,
            error: { message: "User already exists" }
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name,
        email,
        password: hashPassword,
        role: role,
        address,
    });

    generateToken(user, res);

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
    };

    return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: { user: userResponse }
    });
});

module.exports.loginUserAPI = TryCatch(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({
            success: false,
            error: { message: "Email, password, and role are required" }
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            error: { message: "Incorrect email or password" }
        });
    }

    const comparePassword = await bcrypt.compare(password, user.password);


    if (!comparePassword) {
        return res.status(401).json({
            success: false,
            error: { message: "Incorrect email or password" }
        });
    }

    if (user.role !== role) {
        return res.status(401).json({
            success: false,
            error: { message: "Incorrect role selected" }
        });
    }

    generateToken(user, res);

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
    };

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user: userResponse }
    });
});

module.exports.myProfileAPI = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            error: { message: "User not found" }
        });
    }

    return res.status(200).json({
        success: true,
        data: { user }
    });
});

module.exports.userProfileAPI = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            error: { message: "User not found" }
        });
    }

    return res.status(200).json({
        success: true,
        data: { user }
    });
});

module.exports.logOutUserAPI = TryCatch(async (req, res) => {
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

module.exports.updateUserAPI = TryCatch(async (req, res) => {
    const { name, address } = req.body;

    if (!name && !address) {
        return res.status(400).json({
            success: false,
            error: { message: "Please provide name or address to update" }
        });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            error: { message: "User not found" }
        });
    }

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user }
    });
});

module.exports.forgotPasswordAPI = TryCatch(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: {message: "Please provide email address"}
        });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            error: { message: "User not found with this email" }
        });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
        otp: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
    });

    const message = `Your password reset OTP is: ${otpCode}\n\nThis OTP will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "FarmConnect Password Reset OTP",
            message,
        });

        return res.status(200).json({
            success: true,
            message: `OTP sent to ${email}`
        });
    } catch (error) {
        otpStore.delete(email);

        return res.status(500).json({
            success: false,
            error: { message: "Error sending email. Please try again later." }
        });
    }
});

module.exports.resetPasswordAPI = TryCatch(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            error: { message: "Please provide email, OTP, and new password" }
        });
    }

    const otpData = otpStore.get(email);

    if (!otpData || otpData.otp !== otp || otpData.expiresAt < Date.now()) {
        return res.status(400).json({
            success: false,
            error: { message: "Invalid or expired OTP" }
        });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            error: { message: "User not found" }
        });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    
    await User.findByIdAndUpdate(user._id, { password: hashPassword });
    
    otpStore.delete(email);

    return res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
});

module.exports.getUserVegetablesAPI = TryCatch(async (req, res) => {
    const vegetables = await Vegetable.find({ owner: req.user._id })
        .populate("owner", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        data: { 
            vegetables,
            count: vegetables.length
        }
    });
});
