import User from "../model/userModel.js";
import imageKit from "../config/imageKit.js";

const signup = async(req, res)=>{
    try{
        //get data from frontend
        const { name, email, password, avatar } = req.body;

        //check the data is correct or not
        if(!name || !email || !password){
            res.status(400).json({message: "Name, emailID and password are required"});
        }

        const existingUser = await User.findOne({email: email})
        if(existingUser){
            return res.status(400).json({message: "email id aready exdst"});

        }
        let avatarUrl = "";
        if(avatar){
            const uploadResponse = await imageKit.upload({
                file: avatar,
                fileName: `avatar_${Date.now()}.jpg`,
                folder: "/mern-music-player",
            });

            avatarUrl = uploadResponse.url;
        }

        const user = await User.create({
            name, 
            email,
            password,
            avatar: avatarUrl,
        });
        res.status(201).json({message: "user created successfullyyy",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
        });

    }catch(err){
        console.error("Signup not successful");
        res.status(500).json({message: "signup Error"});

    }
}
const login = (req,res)=>{
    try{
        const data = req.body;
        res.status(200).json({message: "login successful"})
    }
    catch(err){
        console.error(500).json({message:"login Error"});
    }
}
export {signup, login};