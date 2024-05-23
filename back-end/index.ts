import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
//TODO: check how this thing is used to make the queries from the documentation 
//it seems like this is  what I am going to be using to make all of the queries
const db = drizzle(sql);

