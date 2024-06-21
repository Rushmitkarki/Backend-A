const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  //  1.Check incomming data
  console.log(req.body);
  //  2. Destructure the incomming data
  const { firstName, lastName, email, password } = req.body;
  //  3. Validate the data(if empty stop the process)
  if (!firstName || !lastName || !email || !password) {
    // res.send("please enter all the fields")
    return res.json({
      success: false,
      message: "please enter all the field...",
    });
  }

  //  4. Handaling the error (TRY, Catch)
  // 5.check if the user is already registered

  try {
    const existingUser = await userModel.findOne({ email: email });

    // 5.a) if user found: Send response (user already exsit)
    if (existingUser) {
      return res.json({
        success: false,
        message: "user Already Exists....",
      });
    }
    //  Hashing or encyption the password
    const randomsalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomsalt);

    // 5.c) if user is new:
    const newUser = new userModel({
      // Database fields : clients value
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    //  save to database
    await newUser.save();

    //  send respomse
    res.json({
      success: true,
      message: "user created successfully",
    });
    //  Hash the password
    //  save to the database
    // send succesfull response
  } catch (error) {
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

//  Write a logic for login

//  Check incomming data

//  Destructure the incomming data
//  validate the dta
// Error handaling
// find the user

const loginUser = async (req, res) => {
  // 1.Check incomming data
  console.log(req.body);
  // 2. Destructure the incomming data
  const { email, password } = req.body;
  // validation the email and password
  if (!email || !password) {
    return res.json({
      success: false,
      message: "please enter all the fields.",
    });
  }
  // 3. Validate the data(if empty stop the process)(try catch)
  try {
    // find the user on the basis of email
    const user = await userModel.findOne({ email: email });
    // first name , last name, email, password bhetaula

    // not found (error message)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found...",
      });
    }

    // found (check the password)(bcrypt.compare)
    const isValidPassword = await bcrypt.compare(password, user.password);

    // not match (error message)
    if (!isValidPassword) {
      return res.status(300).json({
        success: false,
        message: "Invalid Password...",
      });
    }
    // token (generate with user Data + secret key)
    //  to generate token
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    // response(token, user data )
    res.status(200).json({
      success: true,
      message: "Login Success",
      token: token,
      userData: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id,
        isAdmin: user.isAdmin,
      },
    });

    // password matched (login success)
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal Server error...",
    });
  }
};

// Exporting

module.exports = {
  createUser,
  loginUser,
};
