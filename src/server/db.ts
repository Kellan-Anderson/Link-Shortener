import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres';
import * as schema from "./schema";

/* ----------------------- Drizzle ----------------------- */
const connectionString = process.env.DATABASE_URL;
if(!connectionString) {
  throw new Error("No connection string found");
}
const client = postgres(connectionString, { ssl: 'require',  });
export const db = drizzle(client, { schema });