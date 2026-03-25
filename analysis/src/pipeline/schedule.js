import dotenv from 'dotenv';
dotenv.config();

import { DuckDB } from '../config/duckDB.js';
import { log } from '../helpers/logger.js';
import { REPORTS } from '../helpers/constants.js';
import { getTimestamp } from '../helpers/dates.js';
import { extractEvents } from '../extract/pull_events.js';
import { transformRawEvents } from '../transform/raw_events.js';
import { transformTopDoctors } from '../transform/top_doctors.js';
import { transformTopDiseases } from '../transform/top_diseases.js';
import { transformPeakHours } from '../transform/peak_hours.js';
import { transformDailySummary } from '../transform/daily_summary.js';
import { transformChatTopics } from '../transform/chat_topics.js';
import { exportToParquet, cleanupParquetFiles } from '../load/to_parquet.js';
import { uploadReport } from '../load/to_storage.js';
import { purgeEvents } from '../load/purge_events.js';
import { saveEtlReport } from '../load/to_db.js';

const TRANSFORMS = {
  raw_events: transformRawEvents,
  top_doctors: transformTopDoctors,
  top_diseases: transformTopDiseases,
  peak_hours: transformPeakHours,
  daily_summary: transformDailySummary,
  chat_topics: transformChatTopics,
};

export async function runScheduled(mode, startDate, endDate) {
  const startTime = Date.now();
  const dbUrl = process.env.DATABASE_URL;
  const dateStr = startDate === endDate ? startDate : `${startDate}_to_${endDate}`;

  if (!dbUrl) {
    throw new Error('Thiếu DATABASE_URL trong .env');
  }

  log.banner(`MEDICARE ETL PIPELINE (${mode.toUpperCase()})`, [
    `Từ ngày       : ${startDate}`,
    `Đến ngày      : ${endDate}`,
    `Bắt đầu lúc   : ${getTimestamp()}`,
  ]);

  const db = new DuckDB();

  try {
    // ━━━ EXTRACT ━━━
    log.phase('PHASE 1: EXTRACT');
    await db.init();
    await db.attachPg(dbUrl);
    log.success('DuckDB đã kết nối đến PostgreSQL (READ_ONLY)');

    const stats = await extractEvents(db, startDate, endDate);

    if (stats.total === 0) {
      log.warn('Không có dữ liệu cho khoảng thời gian này. Bỏ qua.');
      await db.close();
      return { mode, startDate, endDate, totalEvents: 0, skipped: true };
    }

    // ━━━ TRANSFORM ━━━
    log.phase('PHASE 2: TRANSFORM');

    for (const report of REPORTS) {
      const transform = TRANSFORMS[report.name];
      const rowCount = await transform(db);
      log.result(report.label, `${rowCount} rows`);
    }

    // ━━━ LOAD ━━━
    log.phase('PHASE 3: LOAD');

    const exportedFiles = [];
    for (const report of REPORTS) {
      const filePath = await exportToParquet(db, report.table, report.name, dateStr);
      exportedFiles.push({ filePath, name: report.name });
      log.result('Exported', `${report.name}_${dateStr}.parquet`);
    }

    for (const { filePath, name } of exportedFiles) {
      await uploadReport(filePath, name, dateStr);
    }

    // ━━━ PURGE ━━━
    log.phase('PHASE 4: PURGE');
    log.info('Raw events đã lưu thành công. Bắt đầu xóa dữ liệu cũ trên PostgreSQL...');
    const deletedCount = await purgeEvents(db, dateStr);

    // ━━━ KẾT QUẢ ━━━
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    const resultPayload = {
      mode,
      startDate,
      endDate,
      totalEvents: stats.total,
      purgedEvents: deletedCount,
      reports: REPORTS.map((r) => r.name),
      elapsedSeconds: parseFloat(elapsed),
    };

    // Ghi log execution xuống Supabase
    await saveEtlReport(resultPayload);

    log.banner('ETL PIPELINE HOÀN TẤT', [
      `Khoảng TT   : ${dateStr}`,
      `Tổng events : ${stats.total}`,
      `Reports     : ${REPORTS.length} file parquet`,
      `Purged      : ${deletedCount} events`,
      `Thời gian   : ${elapsed}s`,
    ]);

    return resultPayload;
  } catch (error) {
    log.error('ETL PIPELINE THẤT BẠI');
    log.error(error.message);
    console.error(error.stack);
    await db.close().catch(() => { });
    throw error;
  } finally {
    // ━━━ CLEANUP ━━━
    log.phase('CLEANUP PARQUET FILES');
    cleanupParquetFiles();
    await db.close();
    log.success('DuckDB đã đóng kết nối');
  }
}
