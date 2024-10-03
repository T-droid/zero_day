import express from 'express';
import {
    addOrder,
    getOrders,
    removeOrder,
    updateOrder, 
    getOrdersByDate,
    getOrdersByProduct,
    getOrdersByUser 
} from '../controllers/orderController.js';
import { authenticateToken } from '../utils/tokenUtils.js';


const orderRouter = express.Router();

orderRouter.get('/', authenticateToken, getOrders);
orderRouter.delete('/:id', authenticateToken, removeOrder);
orderRouter.put('/:id', authenticateToken, updateOrder);
orderRouter.get('/user/:id', authenticateToken, getOrdersByUser);
orderRouter.get('/product/:id', authenticateToken, getOrdersByProduct);
orderRouter.get('/date/:id', authenticateToken, getOrdersByDate);
orderRouter.post('/', authenticateToken, getOrders);
orderRouter.post('/', authenticateToken, addOrder);



export default orderRouter;