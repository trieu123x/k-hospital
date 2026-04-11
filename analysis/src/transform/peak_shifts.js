export async function transformPeakShifts(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_peak_shifts AS
    SELECT
      CAST(metadata->>'shift' AS INTEGER) AS shift_number,
      COUNT(*) AS total_events,
      COUNT(DISTINCT user_id) AS unique_users,
      COUNT(*) FILTER (WHERE event_type = 'BOOK_APPOINTMENT') AS bookings,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS percentage
    FROM daily_events
    WHERE metadata->>'shift' IS NOT NULL
    GROUP BY shift_number
    ORDER BY shift_number;
  `);
  return db.count('result_peak_shifts');
}