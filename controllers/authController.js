const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    const existingAdmin = await userModel.findOne({ role: "admin" });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
        existingUser,
      });
    } else if (req.body.role === "admin" && existingAdmin) {
      return res.status(200).send({
        success: false,
        message: "Admin already exists",
        existingAdmin,
      });
    }

    //hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

//login call back
const loginController = async (req, res) => {
  try {
    const User = await userModel.findOne({ email: req.body.email });
    if (!User) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentails",
      });
    }
    //check role
    if (User.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "Invalid Role",
      });
    }
    //comparing password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      User.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      success: true,
      message: "Login Successful",
      token,
      User,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to get current user",
      error,
    });
  }
};

module.exports = { registerController, loginController, currentUserController };
