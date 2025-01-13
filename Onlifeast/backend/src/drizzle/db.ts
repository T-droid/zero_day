import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config"


const connectionString = process.env.DATABASE_URI as string;
if (!connectionString) throw new Error('DATABASE_URI not set');

const pool = postgres(connectionString, { max: 1});
export const db: PostgresJsDatabase = drizzle(pool);

