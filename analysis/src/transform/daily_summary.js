// Tổng kết ngày — đếm số lượng theo từng loại event
export async function transformDailySummary(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_daily_summary AS
    SELECT
      event_type,
      COUNT(*)                AS total_count,
      COUNT(DISTINCT user_id) AS unique_users,
      MIN(created_at)         AS first_event,
      MAX(created_at)         AS last_event
    FROM daily_events
    GROUP BY event_type
    ORDER BY total_count DESC;
  `);

  return db.count('result_daily_summary');
}
