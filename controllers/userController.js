const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// register 
exports.registerController = async (req, res) => {
    console.log('inside registerController');
    const { username, email, password, profilePhoto } = req.body;
    console.log(username, email, password, profilePhoto);
  
    try {
      const existingUser = await users.findOne({ email });
      console.log(existingUser);
  
      if (existingUser) {
        return res.status(406).json("Account already exists");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const newUser = new users({
          username,
          email,
          password: hashedPassword,
          profilePhoto: profilePhoto || ""
        });
  
        await newUser.save();
        res.status(200).json(newUser);
      }
  
    } catch (err) {
      res.status(401).json(err);
    }
  };

  
//   login

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("Invalid password");
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, { expiresIn: '7d' });

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ user: userData, accessToken, refreshToken });

  } catch (err) {
    res.status(500).json("Login failed", err);
  }
};

// get all users
exports.getAllUsersController = async (req, res) => {
    try {
      const allUsers = await users.find().select("-password"); 
      res.status(200).json(allUsers);
    } catch (err) {
      res.status(500).json({ message: "Fetching users failed", error: err });
    }
  };
  

// Refresh token controller
exports.refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Check if refreshToken exists
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_PASSWORD, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }

      // Create new access token
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_PASSWORD,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m' }
      );

      res.status(200).json({ accessToken });
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};


// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, email, password, profilePhoto } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePhoto) updateData.profilePhoto = profilePhoto;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await users.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err });
  }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.userId;
    await users.findByIdAndDelete(userId);
    res.status(204).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err });
  }
};


