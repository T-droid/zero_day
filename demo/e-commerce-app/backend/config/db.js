import mongoose from "mongoose";
import 'dotenv/config';

const uri = process.env.MONGO_URI;

/**
 * Connects to the MongoDB database using the provided MongoDB URI.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} - Resolves when the connection is established, or rejects with an error.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Mongodb connected');
    } catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
}

export default connectDB;