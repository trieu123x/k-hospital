import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
});

async function fixSchema() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Check if email column exists
    const checkRes = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'email'
    `);
    
    if (checkRes.rows.length === 0) {
      console.log('Adding email column to profiles table...');
      await client.query('ALTER TABLE profiles ADD COLUMN email TEXT UNIQUE');
      console.log('Successfully added email column');
    } else {
      console.log('Email column already exists');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

fixSchema();
