import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { log } from '../helpers/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = resolve(__dirname, '../../output');

function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  return OUTPUT_DIR;
}

// Export một DuckDB table ra file .parquet
export async function exportToParquet(db, tableName, reportName, dateStr) {
  ensureOutputDir();
  const filePath = join(OUTPUT_DIR, `${reportName}_${dateStr}.parquet`);
  await db.exportParquet(tableName, filePath);
  return filePath;
}

// Đọc file parquet thành Buffer để upload
export function readParquetBuffer(filePath) {
  return readFileSync(filePath);
}

// Xóa toàn bộ file .parquet tạm trong output/
export function cleanupParquetFiles() {
  if (!existsSync(OUTPUT_DIR)) return;

  const files = readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.parquet'));
  for (const file of files) {
    unlinkSync(join(OUTPUT_DIR, file));
  }

  if (files.length > 0) {
    log.info(`Đã dọn dẹp ${files.length} file parquet tạm`);
  }
}
