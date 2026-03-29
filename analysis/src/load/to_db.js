import pg from 'pg';
import { log } from '../helpers/logger.js';

export async function saveEtlReport(payload) {
  const { mode, startDate, endDate, totalEvents, reportsList } = payload;

  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    await client.query('BEGIN');

    for (const report of reportsList) {
      const query = `
        INSERT INTO etl_reports (mode, report_name, start_date, end_date, total_events, reports)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      const jsonString = JSON.stringify(report.data, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value
      );

      await client.query(query, [mode, report.reportName, startDate, endDate, totalEvents, jsonString]);
    }

    await client.query('COMMIT');
    log.success(`Đã lưu ${reportsList.length} rows report vào Database (PG-Direct)`);

  } catch (error) {
    await client.query('ROLLBACK');
    log.error(`Lỗi khi insert etl_reports (đã rollback): ${error.message}`);
  } finally {
    await client.end().catch(() => { });
  }
}