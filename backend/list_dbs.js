import pkg from 'pg';
const { Client } = pkg;
// Note: We'll parse the URL and try connecting to the default 'postgres' db first
const dbUrl = "postgresql://postgres:123456@localhost:5432/postgres";

const client = new Client({
  connectionString: dbUrl,
});

async function checkDb() {
  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database');
    console.log('Available databases:', res.rows.map(r => r.datname));
  } catch (err) {
    console.error('Error connecting to postgres db:', err.message);
  } finally {
    await client.end();
  }
}

checkDb();
