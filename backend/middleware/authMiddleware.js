import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const protect = async(req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Unauthorized"});
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = user;
        next();
    }catch(err){
        console.error("Token Authentication failed:", err.message);
        return res.status(401).json({message: "Invalid or expired token"});
    }
}