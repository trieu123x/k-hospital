import { log } from '../helpers/logger.js';

// Xóa events đã được archive khỏi Postgres
export async function purgeEvents(db, dateStr) {
  log.info(`Đang chuyển sang chế độ writable để xóa events...`);
  await db.reattachWritable();

  log.info(`Đang xóa events ngày ${dateStr} khỏi PostgreSQL...`);

  const result = await db.query(`
    DELETE FROM pg.public.user_events
    WHERE created_at >= '${dateStr}'::TIMESTAMP
      AND created_at <  '${dateStr}'::TIMESTAMP + INTERVAL '1 day'
    RETURNING id;
  `);

  const deletedCount = result.length;
  log.success(`Đã xóa ${deletedCount} events khỏi PostgreSQL`);

  return deletedCount;
}
