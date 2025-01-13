import { Request, Response } from "express";
import { db } from "../drizzle/db";
import { and, eq, or } from "drizzle-orm";
import { OrdersTable, FoodTable } from "../drizzle/schema";
import Decimal from "decimal.js";


export const getOrders = async (req: Request, res: Response) => {
    // get all orders
    const {id, role} = (req.user as {id: string, role: string});
    if (!id) return res.status(403).json({error: "Unauthorised user or token expired", success: false});

    if (role !== "Admin") {
        try {
            const userOrders = await db.select().from(OrdersTable).where(or(eq(OrdersTable.student_id, id), eq(OrdersTable.delivery_person_id, id)));
            if (userOrders.length === 0) return res.status(200).json({message: "User has no orders", orders: userOrders, success: true});
            return res.status(200).json({message: `${role} orders`, orders: userOrders, success: false});
        } catch(err) {
            return res.status(500).json({error: `Server failure due to ${err}`});
        }
    }
    try {
        const allOrders = await db.select().from(OrdersTable);
        return res.status(200).json({message: "Got all orders", success: true, orders: allOrders});
    } catch(err) {
        return res.status(500).json({error: `Server error due to ${err}`});
    }

}

export const createOrder = async (req: Request, res: Response) => {
    // create a new order
    const { foodId, quantity, price } = req.body;

    const {id, role} = (req.user as {id: string, role: string});
    if (!id) return res.status(403).json({error: "Unauthorised user or token expired", success: false});
    if (role !== "Student") return res.status(403).json({error: "User not allowed to perform operation"});

    try {
        const food = await db.select({ quantity: FoodTable.quantity_available }).from(FoodTable).where(eq(FoodTable.id, foodId));
        if (food.length === 0) return res.status(404).json({error: "Meal not Found", success: false});
        if (food[0].quantity < quantity) return res.status(400).json({error: "Insufficient quantity available.", success: false});

        const total_price = parseFloat((price * quantity).toFixed(2));

        // payment gateway
        const paymentSuccess = true;
        if (!paymentSuccess) return res.status(400).json({ error: "Payment failed." });

        await db.update(FoodTable).set({quantity_available: food[0].quantity - quantity}).where(eq(FoodTable.id, foodId));

        const [order] = await db.insert(OrdersTable).values({
            student_id: id,
            food_id: foodId,
            quantity,
            total_price: total_price.toString()
        });

        return res.status(201).json({ message: "Order created successfully", order, success: true });
    } catch(err) {
        return res.status(500).json({error: `Server failure due to ${err}`});
    }
}
export const updateOrder = async (req: Request, res: Response) => {
    // update an order if it is not in transit
    const { orderId } = req.params;
    const { quantity, foodId } = req.body;

    const {id, role} = (req.user as {id: string, role: string});
    if (!id) return res.status(403).json({error: "Unauthorised user or token expired", success: false});
    if (role !== "Student") return res.status(403).json({error: "User not allowed to perform operation"});

    if (!quantity) return res.status(400).json({error: "Missing quantity"});
    if (!foodId) return res.status(400).json({error: "Missing food id"});

    try {
        const food = await db.select({ foodQuantity: FoodTable.quantity_available }).from(FoodTable).where(eq(FoodTable.id, foodId));
        const order = await db.select().from(OrdersTable).where(eq(OrdersTable.id, orderId));

        if (food.length === 0) return res.status(404).json({error: "Food not found", success: false});
        if (order.length === 0) return res.status(404).json({error: "Order not found", success: false});
        
        if (order[0].order_status === 'In transit') {
            return res.status(400).json({error: "Cannot update order in transit", success: false});
        }

        if (food[0].foodQuantity < quantity) {
            return res.status(400).json({error: "Insufficient quantity available", success: false});
        }

        const newQuantityDifference = parseInt(quantity) - order[0].quantity;
        await db.update(FoodTable)
            .set({quantity_available: food[0].foodQuantity - newQuantityDifference})
            .where(eq(FoodTable.id, foodId));

            const [updatedOrder] = await db.update(OrdersTable)
            .set({
                quantity: quantity,
                food_id: foodId,
                total_price: (parseInt(quantity) * parseInt(order[0].total_price) / order[0].quantity).toString()
            })
            .where(eq(OrdersTable.id, orderId))
            .returning();

        return res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder,
            success: true
        });
    } catch(err) {
        return res.status(500).json({error: `Server failure to update order due to ${err}`})
    }

}

export const deleteOrder = async (req: Request, res: Response) => {
    // cancel order
    const { orderId } = req.params;

    const {id, role} = (req.user as {id: string, role: string});
    if (!id) return res.status(403).json({error: "Unauthorised user or token expired", success: false});
    if (role !== "Student") return res.status(403).json({error: "User not allowed to perform operation"});


    try {
        // check if the order exists and its stataus
        const order = await db.select().from(OrdersTable).where(eq(OrdersTable.id, orderId));
        if (order.length === 0) return res.status(404).json({error: "Order not found"});

        if (order[0].order_status === 'In transit') {
            return res.status(400).json({error: "Cannot delete order that is in transit"})
        }

        const deletedOrder = await db.delete(OrdersTable).where(eq(OrdersTable.id, orderId)).returning();
        
        return res.status(200).json({message: `Order with id ${deletedOrder[0].id} deleted succesfully`});
    } catch(err) {
        return res.status(500).json({error: `Server failed to delete due to ${err}`});
    }
}


export const assignOrderToDeliveryPerson = async (req: Request, res: Response) => {
    // assign delivery person
    const { orderId, deliveryPersonId } = req.body;

    if (!orderId) return res.status(400).json({error: "Missing order id"});
    if (!deliveryPersonId) return res.status(400).json({error: "Missing delivery person id"});

    const userRole = (req.user as { role: string })?.role;
    if (userRole !== "Admin") return res.status(403).json({error: "User unauthorised to perform this operation"});

    try {
        const isPendingOrder = await db.select().from(OrdersTable).where(and(eq(OrdersTable.id, orderId), eq(OrdersTable.order_status, "Pending")));
        if (isPendingOrder.length === 0) return res.status(400).json({error: "Order already assigned delivery personnel"});
        await db.update(OrdersTable).set({
            order_status: "In transit",
            delivery_person_id: deliveryPersonId,
        }).where(eq(OrdersTable.id, orderId));
        return res.status(200).json({message: "Order assigned to delivery peron"});
    } catch(err) {
        return res.status(500).json({error: `Server failed to assign order due to ${err}`});
    }
}