import express from 'express';
import { getProducts, addProduct } from '../controllers/productController.js';
import { authenticateToken } from '../utils/tokenUtils.js';


const productRouter = express.Router();


productRouter.get('/', authenticateToken, getProducts); // Get all product
productRouter.post('/', authenticateToken, addProduct); // Add new product (admin only)

export default productRouter;