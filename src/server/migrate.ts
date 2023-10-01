import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'


const connectionString = process.env.DATABASE_URL;

if(!connectionString) {
  console.log('Connection string not found, please make sure it is placed in an .env.local');
  process.exit(1);
}

console.log("Starting Migration...");
const client = postgres(connectionString, { ssl: 'require' });
const db = drizzle(client);

migrate(db, { migrationsFolder: './drizzle' })
  .then(() => {
    console.log("Migration successful!");
    process.exit();
  })
  .catch((error) => {
    console.log("Error running migration:", error);
    process.exit(2);
  });