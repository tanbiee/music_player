import axios from "axios";
import User from "../model/userModel.js";

const getSongs = async (req, res)=>{
    try{
        const response = await axios.get("https://api.jamendo.com/v3.0/tracks/?client_id=d2f8f69c&format=jsonpretty&limit=15")
        const data = response.data;
        res.status(200).json(data);

    }catch(err){
        console.error("Error fetching songs:", err.message);
        res.status(500).json({message: "Error fetching songs"});
    }
}

const playlistById = async(req, res)=>{
    try{
        const tag = (req.params.tag || req.query.tag || "").toString().trim();
        if(!tag){
            return res.status(400).json({message: "Tag is required"});
        }
        const limit = parseInt(req.query.limit ?? "10", 10) || 10;
        const clientId = "d2f8f69c";

        const params = {
            client_id: clientId,
            format: "jsonpretty",
            tags: tag,
            limit,
        }
        const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {params});
        const data = response.data;
        res.status(200).json(data);
    }catch(err){
        console.error("Error fetching playlist:", err?.response?.data?? err.message ?? err);
        res.status(500).json({message: "Error fetching playlist"});
    }
}

const toggleFavorite = async(req, res)=>{
    try{
        const user = req.user;
        const song = req.body.song;

        const exists = user.favourites.filter(fav => fav.id === song.id);

        if(exists){
            user.favourites = user.favourites.filter(fav => fav.id !== song.id);

        }else{
            user.favourites.push(song);
        }
        await user.save();
        res.status(200).json({favorites: user.favorites});
    }catch(err){
        console.error("Error toggling favorite:", err.message);
        res.status(500).json({message: "Error toggling favorite"}); 
    }
}


export {getSongs, playlistById, toggleFavorite};