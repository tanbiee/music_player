import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSongs, playlistById, toggleFavorite } from "../controllers/songController.js";

const songRouter = express.Router();

songRouter.get("/", protect, getSongs);
songRouter.get("/playlistBytag/:tag", protect, playlistById);
songRouter.post("/favorite", protect, toggleFavorite);
songRouter.get('/favorites', protect, (req, res)=>{
    res.json(req.user.favorites);
})

export default songRouter;
