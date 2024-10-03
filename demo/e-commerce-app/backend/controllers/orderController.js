import orderModel from "../models/orderModel.js";

export const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user.id });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}

export const removeOrder = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'No order given' });

    try {
        const removedOrder = await orderModel.findOneAndDelete({ _id: id, user: req.user.id });
        if (!removedOrder) {
            return res.status(404).json({ message: 'Order not found or unauthorized' });
        }
        return res.status(200).json({ removedOrder });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing order', error: error.message });
    }
}

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { count } = req.body;

    if (!count) return res.status(400).json({ message: 'No count given' });

    try {
        const updatedOrder = await orderModel.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { count },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found or unauthorized' });
        }
        return res.status(200).json({ updatedOrder });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order', error: error.message });
    }
}

export const getOrdersByUser = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user.id });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}

export const getOrdersByProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'No product given' });

    try {
        const orders = await orderModel.find({ product: id, user: req.user.id });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}

export const getOrdersByDate = async (req, res) => {
    const { date } = req.params;
    if (!date) return res.status(400).json({ message: 'No date given' });

    try {
        const orders = await orderModel.find({ date, user: req.user.id });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}

export const addOrder = async (req, res) => {
    const { product, count } = req.body;
    if (!product) return res.status(400).json({ message: 'No product given' });
    if (!count) return res.status(400).json({ message: 'No count given' });

    try {
        const newOrder = new orderModel({
            user: req.user.id,
            product,
            count,
        });
        const savedOrder = await newOrder.save();
        return res.status(201).json({ savedOrder });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding order', error: error.message });
    }
}