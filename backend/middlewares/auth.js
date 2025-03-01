import User from "../db/model.js";
import jwt from "jsonwebtoken";


export const auth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Please Login." });
      }
  
      const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(401).json({ message: "User Not Found." });
      }
  
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Please authenticate." });
    }
  };