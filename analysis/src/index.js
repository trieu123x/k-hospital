import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { getDailyRange } from './helpers/dates.js';
import { runScheduled } from './pipeline/schedule.js';
import { log } from './helpers/logger.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { isSchedule: false, mode: 'daily', date: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--schedule') {
      result.isSchedule = true;
    } else if (args[i] === '--test' && args[i + 1]) {
      result.mode = args[i + 1];
      if (args[i + 2] && !args[i + 2].startsWith('--')) {
        result.date = args[i + 2];
        i++;
      }
      i++;
    }
  }

  return result;
}

// Hàm Test thủ công theo mode (daily) và tuỳ chọn ngày
async function runTest(mode, dateStr) {
  let range;
  if (dateStr) {
    range = { startDate: dateStr, endDate: dateStr };
  } else {
    range = getDailyRange();
  }

  log.info(`\n[MANUAL TEST] Bắt đầu ETL chế độ ${mode} từ ${range.startDate} đến ${range.endDate}...`);

  try {
    const result = await runScheduled(mode, range.startDate, range.endDate);
    log.info(`[MANUAL TEST] Hoàn tất! ${result.totalEvents} events processed.`);
    process.exit(0);
  } catch (error) {
    log.error(`[MANUAL TEST] Pipeline thất bại: ${error.message}`);
    process.exit(1);
  }
}

// Hàm khởi tạo cron jobs
function runScheduledJobs() {
  // 1. Chạy hằng ngày (2h sáng)
  cron.schedule('0 2 * * *', async () => {
    const { startDate, endDate } = getDailyRange();
    log.info(`\n[CRON DAILY] Bắt đầu ETL từ ${startDate} đến ${endDate}...`);
    try {
      const result = await runScheduled('daily', startDate, endDate);
      log.info(`[CRON DAILY] Hoàn tất! ${result.totalEvents} events processed.`);
    } catch (error) {
      log.error(`[CRON DAILY] Pipeline thất bại: ${error.message}`);
    }
  }, { timezone: 'Asia/Ho_Chi_Minh' })
}

const { isSchedule, mode, date } = parseArgs();

if (isSchedule) {
  runScheduledJobs();
} else {
  runTest(mode, date);
}

// node src/index.js --schedule
// node src/index.js --test daily (lấy hôm qua)
// node src/index.js --test daily 2026-03-24 (lấy ngày tĩnh thủ công)