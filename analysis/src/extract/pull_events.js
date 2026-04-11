import { log } from '../helpers/logger.js';

export async function extractEvents(db, startDate, endDate) {
  log.info(`Đang hút events từ ${startDate} đến ${endDate} từ PostgreSQL...`);

  // 1. Ép ngày truyền vào thành chuẩn ISO String UTC tuyệt đối
  // startDate/endDate đang là 'YYYY-MM-DD', khi tạo new Date() nó sẽ là 00:00:00 UTC
  const startUTC = new Date(startDate).toISOString();

  // Lấy endDate + 1 ngày để làm mốc kết thúc
  const endObj = new Date(endDate);
  endObj.setDate(endObj.getDate() + 1);
  const endUTC = endObj.toISOString();

  // 2. Query DuckDB để nhận chuẩn ISO TIMESTAMPTZ (Có múi giờ)
  await db.exec(`
    CREATE OR REPLACE TABLE daily_events AS
    SELECT
      id,
      user_id,
      event_type,
      metadata,
      created_at
    FROM pg.public.user_events
    WHERE created_at >= '${startUTC}'::TIMESTAMPTZ
      AND created_at <  '${endUTC}'::TIMESTAMPTZ;
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
      metadata->>'topic' AS chat_topic,
      metadata->>'sessionId' AS session_id
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
