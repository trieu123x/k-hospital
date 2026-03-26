// Lưu toàn bộ raw events nguyên bản vào result table
export async function transformRawEvents(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_raw_events AS
    SELECT
      id,
      user_id,
      event_type,
      entity_id,
      metadata,
      created_at
    FROM daily_events;
  `);

  return db.count('result_raw_events');
}
