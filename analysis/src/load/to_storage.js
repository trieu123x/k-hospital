import { uploadToStorage } from '../config/supabase.js';
import { readParquetBuffer } from './to_parquet.js';
import { log } from '../helpers/logger.js';
import { STORAGE_BUCKET } from '../helpers/constants.js';

// Upload một file parquet lên Supabase Storage
export async function uploadReport(filePath, reportName, dateStr) {
  const storagePath = `${dateStr}/${reportName}.parquet`;
  const buffer = readParquetBuffer(filePath);

  await uploadToStorage(STORAGE_BUCKET, storagePath, buffer);
  log.result('Uploaded', storagePath);

  return storagePath;
}
