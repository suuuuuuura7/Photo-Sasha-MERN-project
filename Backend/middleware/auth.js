import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    
    const token = req.cookie?.jwt;

    if (!token) return res.status(401).json({ Message: "Not authorized, no session found. " });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Not authorized, user no longer exist" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error on authMiddleware: ", error);
    res.status(401).json("Not autherized, invalid or expired session")
  }
};

export const isAdmin = (req, res, next) => {

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // Reject access with 403 Forbidden
    return res.status(403).json({
      message: "Access denied. Administrative privileges required.",
    });
  }
};