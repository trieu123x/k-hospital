import { log } from '../helpers/logger.js';

export async function extractEvents(db, startDate, endDate) {
  log.info(`Đang hút events từ ${startDate} đến ${endDate} từ PostgreSQL...`);

  // Copy toàn bộ events trong khoảng thời gian vào DuckDB in-memory
  await db.exec(`
    CREATE OR REPLACE TABLE daily_events AS
    SELECT
      id,
      user_id,
      event_type,
      entity_id,
      metadata,
      created_at,
      EXTRACT(HOUR FROM created_at) AS event_hour
    FROM pg.public.user_events
    WHERE created_at >= '${startDate}'::TIMESTAMP
      AND created_at <  '${endDate}'::TIMESTAMP + INTERVAL '1 day';
  `);

  const total = await db.count('daily_events');
  log.success(`Đã extract ${total} events vào DuckDB in-memory`);

  if (total === 0) return { total: 0, doctor: 0, disease: 0, chat: 0 };

  // Tách sub-tables theo nhóm
  log.info('Đang tách events theo nhóm...');

  await db.exec(`
    CREATE OR REPLACE TABLE doctor_events AS
    SELECT * FROM daily_events
    WHERE event_type IN ('VIEW_DOCTOR', 'BOOK_APPOINTMENT', 'CANCEL_APPOINTMENT');
  `);

  await db.exec(`
    CREATE OR REPLACE TABLE disease_events AS
    SELECT * FROM daily_events
    WHERE event_type IN ('VIEW_DISEASE');
  `);

  await db.exec(`
    CREATE OR REPLACE TABLE chat_events AS
    SELECT
      *,
      CASE
        WHEN metadata IS NOT NULL
        THEN json_extract_string(metadata::JSON, '$.topic')
        ELSE NULL
      END AS chat_topic
    FROM daily_events
    WHERE event_type = 'CHAT_AI_TOPIC';
  `);

  const doctor = await db.count('doctor_events');
  const disease = await db.count('disease_events');
  const chat = await db.count('chat_events');

  log.result('Doctor events', doctor);
  log.result('Disease events', disease);
  log.result('Chat events', chat);

  return { total, doctor, disease, chat };
}
