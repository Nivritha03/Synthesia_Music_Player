import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "../.env"});


const connectDB = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected Successfully: `);
    } catch (error) {
        console.log("MongoDB connection error: ", error.message);
    }
};
export default connectDB;