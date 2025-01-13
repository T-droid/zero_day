import jwt from "jsonwebtoken";


export const generateToken = (user: { id: string, role: string }) => {
     return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1h" })
}