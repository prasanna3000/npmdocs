const express = require("express");
const User = require('../models/user');
const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      console.log("User already exists");
      return res.status(200).json({
        success: true,
        message: "User already exists",
        data: existingUser,
      });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    const savedUser = await newUser.save();
    console.log("Packages > save is called");
    return res.status(200).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    console.error("Packages > error is called", error);
    return res.status(400).json({
      success: false,
      error,
    });
  }
});

module.exports = router;
