import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import router from './routes/authRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

//connect database 
connectDB();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

const PORT = process.env.PORT || 3030;




app.use('/api/auth', router);

app.listen(PORT, ()=>{
    console.log(`server is running at port http://localhost:${PORT}`);
})