import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()
const mongoDb = process.env.MONGO_URI
const connectDB = async()=>{
    try{
        const connection = await mongoose.connect(mongoDb);
        console.log(`mongoDB connected sucessfully`);

    }catch(err){
        console.log(`mongoDB connection error ${err}`);
    }
}
export default connectDB