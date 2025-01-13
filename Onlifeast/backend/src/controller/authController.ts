import { Request, Response } from "express";
import { db } from "../drizzle/db";
import { UserTable, StudentTable, DeliveryPersonnelTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword } from "../utils/passwordManager";
import { generateToken } from "../utils/jwt";


const studentRole = "Student";
const deliveryRole = "Delivery personnel";
const adminRole = "Admin"
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, phone_number, role, hostel_name, room_number } = req.body;

    if (!role) return res.status(406).json({error: "Missing role", success: false});
    if (!name) return res.status(406).json({error: "Missing name", success: false});
    if (!email) return res.status(406).json({error: "Missing email", success: false});
    if (!password) return res.status(406).json({error: "Missing password", success: false});
    if (!phone_number) return res.status(406).json({error: "Missing phone_number", success: false});
    
    if (![studentRole, deliveryRole, adminRole].includes(role)) return res.status(400).json({error: `${role} is not a defined role`, success: false});

    if (role === studentRole && !hostel_name) return res.status(406).json({error: "Missing hostel_name", success: false});
    if (role === studentRole && !room_number) return res.status(406).json({error: "Missing room_number", success: false});

    const userExists = await db.select().from(UserTable).where(eq(UserTable.email, email));
    if (userExists.length > 0) return res.status(400).json({error: "User already exists", success: false});

    const hashedPwd: string = await hashPassword(password);
    let user;

    try{
        user = await db.insert(UserTable).values({
            name,
            email,
            password: hashedPwd,
            phone_number,
            role
        }).returning();
        if (user.length === 0) return res.status(500).json({error: "Server failed to register user", success: false});
    } catch(err) {
        return res.status(500).json({error: `Server failure caused by ${err}`});
    }

    if (role === studentRole) {
        try {
            const newStudent = await db.insert(StudentTable).values({
                student_id: user[0].id,
                hostel_name,
                room_number
            }).returning();
            if (newStudent.length === 0) {
                await db.delete(UserTable).where(eq(UserTable.id, user[0].id));
                return res.status(500).json({error: "Server failed to register Student", success: false});
            }
        } catch(err) {
            await db.delete(UserTable).where(eq(UserTable.id, user[0].id));
            return res.status(500).json({error: `Server failure caused by ${err}`});
        }
    } else if (role === deliveryRole) {
        try{
            const newDeliveryPerson = await db.insert(DeliveryPersonnelTable).values({
                delivery_person_id: user[0].id
            }).returning()
            if (newDeliveryPerson.length === 0) {
                await db.delete(UserTable).where(eq(UserTable.id, user[0].id));
                return res.status(500).json({error: "Server failed to register Delivery personnel", success: false});
            }
        } catch(err) {
            await db.delete(UserTable).where(eq(UserTable.id, user[0].id));
            return res.status(500).json({error: `Server failure caused by ${err}`});
        }
    }

    return res.status(201).json({message: "User registered successfully", success: true, user: user[0]});
}


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) return res.status(406).json({error: "Missing email", success: false});
    if (!password) return res.status(406).json({error: "Missing password", success: false});

    const userExists = await db.select().from(UserTable).where(eq(UserTable.email, email));
    if (userExists.length === 0) return res.status(404).json({error: "User with email not found", success: false});
    
    if (await comparePassword(password, userExists[0].password)) {
        const token = generateToken({id: userExists[0].id, role: userExists[0].role as string})
        return res.status(200).json({message: "User succesfully logged in", token, success: true});
    }
    return res.status(401).json({error: "Wrong password", success: false, role: userExists[0].role});

}