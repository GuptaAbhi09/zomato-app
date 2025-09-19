const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const foodPartnerModel = require("../models/food-partner.model");

// Register user
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const isUserAlreadyRegistered = await userModel.findOne({ email });
    if (isUserAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// logout user
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

// register food-partner
const registerFoodPartner = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const isPartnerAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isPartnerAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Food partner already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const partner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        partnerId: partner._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "Food partner registered successfully",
      partner: {
        partnerId: partner._id,
        name: partner.name,
        email: partner.email,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// login food-partner
const loginFoodPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const partner = await foodPartnerModel.findOne({
      email,
    });
    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Food partner not registered",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, partner.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign({ partnerId: partner._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      message: "Food partner logged in successfully",
      partner: {
        partnerId: partner._id,
        name: partner.name,
        email: partner.email,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// logout food-partner
const logoutFoodPartner = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Food partner logged out successfully",
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
