export async function transformRawEvents(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_raw_events AS
    SELECT
      id,
      user_id,
      event_type,
      metadata,
      created_at
    FROM daily_events;
  `);
  return db.count('result_raw_events');
}