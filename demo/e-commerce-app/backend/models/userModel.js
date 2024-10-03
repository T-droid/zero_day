import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const SALT_WORK_FACTOR = 10

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
});


export default mongoose.model('User', userSchema);