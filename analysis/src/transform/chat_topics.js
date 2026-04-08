// Top chủ đề AI Chat — bệnh/triệu chứng được hỏi nhiều nhất
export async function transformChatTopics(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_chat_topics AS
    SELECT
      chat_topic                AS topic,
      COUNT(*)                  AS mention_count,
      COUNT(DISTINCT user_id)   AS unique_users,
      COUNT(DISTINCT session_id) AS total_sessions
    FROM chat_events
    WHERE chat_topic IS NOT NULL
      AND chat_topic != ''
    GROUP BY chat_topic
    ORDER BY mention_count DESC
  `);

  return db.count('result_chat_topics');
}
