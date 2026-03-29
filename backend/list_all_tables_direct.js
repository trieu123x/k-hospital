import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
});

async function listAllTables() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    `);
    
    console.log('Tables found:');
    res.rows.forEach(row => console.log(`- ${row.table_schema}.${row.table_name}`));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

listAllTables();
