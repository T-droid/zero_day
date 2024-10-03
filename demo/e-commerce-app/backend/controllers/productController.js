import productModel from "../models/productModel.js";

// Get all products
export const getProducts = async (req, res) => {
    const products = await productModel.find({});
    return res.json(products);
};


// Add a new product (Admin only)
export const addProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({message: 'Unauthorized'});
    const { name, price, description, image, stock } = req.body;

    const product = new productModel({
        name,
        price,
        description,
        image,
        stock,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
}

export const getProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({message: 'Unauthorized'});
    const { id } = req.params;
    if (!id) return res.json({message: 'No product given'});
    const product = await productModel.findById(id);
    return res.status(200).json({product});
}

export const updateProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({message: 'Unauthorized'});
    const { id, name, price, description, image, stock } = req.body;
    if (!id) return res.json({message: 'No product given'});
    const updatedProduct = await productModel.findByIdAndUpdate({ id }, { name, price, description, image, stock });
    return res.status(200).json({updatedProduct});
}

export const deleteProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({message: 'Unauthorized'});
    const { id } = req.params;
    if (!id) return res.json({message: 'No product given'});
    const removedProduct = await productModel.findByIdAndDelete({ id });
    return res.status(200).json({removedProduct});
}

export const getProductsByCategory = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({message: 'Unauthorized'});
    const { category } = req.params;
    if (!category) return res.json({message: 'No category given'});
    const products = await productModel.find({ category });
    return res.status(200).json({products});
}