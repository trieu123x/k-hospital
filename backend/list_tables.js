import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Trieudh.1',
  database: 'khospital_db',
});

async function listTables() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    const tables = res.rows.map(r => r.table_name);
    console.log('Total tables:', tables.length);
    tables.forEach(t => console.log(' -', t));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

listTables();
