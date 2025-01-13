import { Request, Response } from "express";
import { FoodTable } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";



export const createFood = async (req: Request, res: Response) => {
    // create new meal
    const {name, price, quantity_available, image_url, description} = req.body;

    const userRole = (req.user as { role: string})?.role;
    if (!userRole) return res.status(403).json({error: "Unauthorised user or expired token", success: false});
    if (userRole !== "Admin") return res.status(403).json({error: "User not allowed to perform operation", success: false})

    if (!name) return res.status(400).json({success: false, error: "Missing name"});
    if (!price) return res.status(400).json({success: false, error: "Missing price"});
    if (!quantity_available) return res.status(400).json({success: false, error: "Missing quantity"});
    if (!image_url) return res.status(400).json({success: false, error: "Missing image_url"});
    if (!description) return res.status(400).json({success: false, error: "Missing description"});

    try {
        const newFood = await db.insert(FoodTable).values({
            name,
            price,
            quantity_available,
            image_url,
            description
        }).returning();
        if (newFood.length === 0) return res.status(500).json({error: "Failed to create food", success: false});
        return res.status(201).json({message: "Food created succesfully", success: true, food: newFood[0]});
    } catch(err) {
        return res.status(500).json({error: `Server error due to ${err}`, success: false});
    }


}

export const getAllMeals = async (req: Request, res: Response) => {
    // get all meals
    const userId = (req.user as {id: string})?.id;
    if (!userId) return res.status(403).json({error: "Unauthorised user or expired token", success: false});

    try {
        const food = await db.select().from(FoodTable);
        return res.status(200).json({success: true, food: food})
    } catch(err) {
        return res.status(500).json({error: `Server failure due to ${err}`, success: false});
    }
}

export const getAMeal = async (req: Request, res: Response) => {
    // get a specific meal details

    const { foodId } = req.params;
    const userId = (req.user as {id: string})?.id;
    if (!userId) return res.status(403).json({error: "Unauthorised user or expired token", success: false});

    if (!foodId) return res.status(400).json({error: "Missing food id", success: false});

    try {
        const food = await db.select().from(FoodTable).where(eq(FoodTable.id, foodId));
        if (food.length === 0) return res.status(404).json({error: "Food not found", success: false});
        return res.status(200).json({success: true, food: food[0]});
    } catch(err) {
        return res.status(500).json({error: `Server failure due to ${err}`, success: false});
    }
}

export const updateAMeal = async (req: Request, res: Response) => {
    // update a single meal
    const { foodId } = req.params;
    const {name, price, quantity_available, image_url, description} = req.body;

    const userRole = (req.user as { role: string})?.role;
    if (!userRole) return res.status(403).json({error: "Unauthorised user or expired token", success: false});
    if (userRole !== "Admin") return res.status(403).json({error: "User not allowed to perform operation", success: false});

    if (!foodId) return res.status(400).json({error: "Missing food id", success: false});

    try {
        const updateData: Partial<typeof FoodTable.$inferInsert> = {};
        if (name) updateData.name = name;
        if (price) updateData.price = price;
        if (quantity_available) updateData.quantity_available = quantity_available;
        if (image_url) updateData.image_url = image_url;
        if (description) updateData.description = description;
    
        const updatedMeal = await db.update(FoodTable)
            .set(updateData)
            .where(eq(FoodTable.id, foodId))
            .returning()

        if (updatedMeal.length === 0) return res.status(404).json({error: "Food not found", success: false});
        return res.status(200).json({message: "Food updated succesfully", success: true, food: updatedMeal[0]});
    } catch(err) {
        return res.status(500).json({error: `Server failure due to ${err}`});
    }
}

export const deleteAMeal = async (req: Request, res: Response) => {
    // delete a meal
    const { foodId } = req.params;

    const userRole = (req.user as { role: string})?.role;
    if (!userRole) return res.status(403).json({error: "Unauthorised user or expired token", success: false});
    if (userRole !== "Admin") return res.status(403).json({error: "User not allowed to perform operation", success: false});

    if (!foodId) return res.status(400).json({error: "Missing food id", success: false});

    try {
        const deletedMeal = await db.delete(FoodTable).where(eq(FoodTable.id, foodId)).returning();
        if (deletedMeal.length === 0) return res.status(404).json({error: "Food not found", success: false});
        return res.status(201).json({message: `${deletedMeal[0].name} with id ${deletedMeal[0].id} deleted successfuly`, success: true})
    } catch(err) {
        return res.status(500).json({error: `Server failure due to ${err}`});
    }
}