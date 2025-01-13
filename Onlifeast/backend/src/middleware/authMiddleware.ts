import passport from "passport";
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import "dotenv/config";
import { Response, Request, NextFunction } from "express";
import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "../drizzle/schema";


const options: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new jwtStrategy(options, async (jwtPayload, done) => {
        try {
            const user = await db.select().from(UserTable).where(eq(UserTable.id, jwtPayload.id));
            if (!user) return done(null, false);
            return done(null, user[0]);
        } catch (err) {
            return done(err, false)
        }
    })
)

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false })(req, res, next);
};