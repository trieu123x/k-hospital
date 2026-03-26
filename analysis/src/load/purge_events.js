import pg from 'pg';
import { log } from '../helpers/logger.js';

export async function purgeEvents(dateStr) {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  log.info(`[PG-Direct] Đang chuẩn bị xóa events ngày ${dateStr}...`);

  try {
    await client.connect();

    const query = `
      DELETE FROM user_events 
      WHERE created_at >= $1::TIMESTAMP 
        AND created_at < $1::TIMESTAMP + INTERVAL '1 day'
    `;

    const res = await client.query(query, [dateStr]);

    log.success(`[PG-Direct] Đã xóa thành công ${res.rowCount} events.`);
    return res.rowCount;
  } catch (err) {
    log.error(`[PG-Direct] Lỗi khi xóa: ${err.message}`);
    return 0;
  } finally {
    await client.end().catch(() => { });
  }
}