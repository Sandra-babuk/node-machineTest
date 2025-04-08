const User = require('../models/userModel');

exports.blockUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetUserId } = req.params;

    if (userId === targetUserId) return res.status(400).json("Cannot block yourself");

    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    if (!Array.isArray(user.blockedUsers)) {
      user.blockedUsers = [];
    }

    if (!user.blockedUsers.includes(targetUserId)) {
      user.blockedUsers.push(targetUserId);
      await user.save();
    }

    res.status(200).json("User blocked successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.unblockUser = async (req, res) => {
    try {
      const userId = req.userId;
      const { targetUserId } = req.params;
  
      if (userId === targetUserId) return res.status(400).json("Cannot unblock yourself");
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json("User not found");
  
      // Ensure blockedUsers is an array
      if (!Array.isArray(user.blockedUsers)) {
        user.blockedUsers = [];
      }
  
      user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== targetUserId);
      await user.save();
  
      res.status(200).json("User unblocked successfully");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
