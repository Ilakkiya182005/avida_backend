const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("Received Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }

    const decodedObj = jwt.verify(token, "ilak@2005");
    console.log("Decoded JWT:", decodedObj);

    const { userId } = decodedObj;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Store the user object in req for further use
    next();
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
};

// Middleware to restrict access to only volunteer users
const isVolunteerUser = (req, res, next) => {
  if (req.user.userType !== "Volunteer") {
    return res.status(403).json({ message: "Access Denied: Only volunteers can register volunteer details" });
  }
  next();
};

// Middleware to restrict access to only disabled users
const isDisabledUser = (req, res, next) => {
  if (req.user.userType !== "Disabled") {
    return res.status(403).json({ message: "Access Denied: Only disabled users can register exams" });
  }
  next();
};

module.exports = { userAuth, isVolunteerUser, isDisabledUser };



