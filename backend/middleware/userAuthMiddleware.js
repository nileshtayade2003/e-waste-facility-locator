const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import user model


const userAuthMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Exclude password
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = userAuthMiddleware;
