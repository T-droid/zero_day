import express, { Request, Response } from "express";
import { createFood, getAMeal, getAllMeals, updateAMeal, deleteAMeal } from "../controller/foodController";


const foodRouter = express.Router();

foodRouter
    .get('/', (req: Request, res: Response) => {
        // get all food
        getAllMeals(req, res);
    })
    .post('/', (req: Request, res: Response) => {
        // create new meal
        createFood(req, res);
    })
    .put('/:foodId', (req: Request, res: Response) => {
        // update food
        updateAMeal(req, res);
    })
    .delete('/:foodId', (req: Request, res: Response) => {
        // delete meal
        deleteAMeal(req, res);
    })

export default foodRouter;