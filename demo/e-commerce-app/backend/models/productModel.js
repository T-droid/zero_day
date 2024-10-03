import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, require: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true }
});

export default mongoose.model('Product', productSchema);