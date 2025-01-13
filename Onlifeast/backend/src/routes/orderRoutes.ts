import express, { Request, Response } from "express";
import { getOrders, createOrder, updateOrder, deleteOrder, assignOrderToDeliveryPerson } from "../controller/orderCOntroller";

const orderRouter = express.Router();

orderRouter
    .get('/', (req: Request, res: Response) => {
        // get all user orders
        getOrders(req, res);
    })
    .post('/', (req: Request, res: Response) => {
        // create new order
        createOrder(req, res);
    })
    .put('/:orderId', (req: Request, res: Response) => {
        // update an order
        updateOrder(req, res);
    })
    .delete('/:orderId', (req: Request, res: Response) => {
        // delete/cancel an order
        deleteOrder(req, res);
    })
    .patch('/assign', (req: Request, res: Response) => {
        // assign the delivery personnel to the order
        assignOrderToDeliveryPerson(req, res);
    })

export default orderRouter;