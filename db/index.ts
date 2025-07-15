import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Configure postgres client with better connection handling
const client = postgres(process.env.DATABASE_URL!, { 
  prepare: false,
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

export const db = drizzle({ client }); 