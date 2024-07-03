const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtp = require("../service/sendOtp");

const createUser = async (req, res) => {
  // 1. Check incoming data
  console.log(req.body);

  // 2. DesStructure the incoming data
  const { firstName, lastName, email, password, phone } = req.body;

  // 3. Validate the data (if empty, stop the process and send response)
  if (!firstName || !lastName || !email || !password || !phone) {
    // res.send("Please enter all fields");
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  // 4. Error Handling(try catch)
  try {
    // 5. Check if the user is already registered
    const existingUser = await userModel.findOne({ email: email });
    // 5.1 if user found: Send response
    // 5.1.1 stop the process
    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hash the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    // 5.2 if user is new
    const newUser = new userModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phone: phone,
    });
    // Save to database
    await newUser.save();

    // Send the response
    res.json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  // 1. Check incoming data
  console.log(req.body);

  // 2. DesStructure the incoming data
  const { email, password } = req.body;

  // 3. Validate the data (if empty, stop the process and send response)
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }
  try {
    // 4. Check if the user is already registered
    const user = await userModel.findOne({ email: email });
    // found data: firstName, lastName, email, password

    // 4.1 if user not found: Send response
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    // 4.2 if user found
    // 5. Check if the password is correct
    const passwordCorrect = await bcrypt.compare(password, user.password);
    // 5.1 if password is wrong: Send response
    if (!passwordCorrect) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    // 5.2 if password is correct
    // Token (generate -user data and key)
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    // Send the response (token, user data)
    res.json({
      success: true,
      message: "User logged in successfully",
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Forgot password by using phone number
// Reset password by using OTP
const forgotPassword = async (req, res) => {
  console.log(req.body);

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Please enter your phone number",
    });
  }
  try {
    const user = await userModel.findOne({ phone: phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Generate OTP
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    console.log(randomOTP);

    user.resetPasswordOTP = randomOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send OTP to user phone number
    const isSent = await sendOtp(phone, randomOTP);

    if (!isSent) {
      return res.status(400).json({
        success: false,
        message: "Error in sending OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your phone number",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  console.log(req.body);

  const { phone, otp, password } = req.body;

  if (!phone || !otp || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  try {
    const user = await userModel.findOne({ phone: phone });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // Otp to integer
    const otpToInteger = parseInt(otp);

    if (user.resetPasswordOTP !== otpToInteger) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Exporting
module.exports = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
