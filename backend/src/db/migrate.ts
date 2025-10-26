
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });
    console.log('Migrations ran successfully');
  } catch (error) {
    console.error('Error running migrations', error);
    process.exit(1);
  }
}

main();
