import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
const app = express();


// Load environment variables
dotenv.config();
// Connect to database
connectDB();
app.use(express.json());
//cors
app.use(cors()); 



const port = process.env.PORT || 7000;

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});