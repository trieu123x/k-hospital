// Giờ cao điểm — phân bổ events theo 24 giờ
export async function transformPeakHours(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_peak_hours AS
    SELECT
      event_hour                                                  AS hour_of_day,
      COUNT(*)                                                    AS total_events,
      COUNT(DISTINCT user_id)                                     AS unique_users,
      COUNT(*) FILTER (WHERE event_type = 'BOOK_APPOINTMENT')     AS bookings,
      COUNT(*) FILTER (WHERE event_type = 'CHAT_AI_TOPIC')        AS ai_chats,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2)          AS percentage
    FROM daily_events
    GROUP BY event_hour
    ORDER BY event_hour;
  `);

  return db.count('result_peak_hours');
}
