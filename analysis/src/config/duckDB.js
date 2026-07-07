import { Database } from 'duckdb-async';
import { log } from '../helpers/logger.js';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMP_DIR = resolve(__dirname, '../../output/tmp');

export class DuckDB {
  constructor() {
    this.db = null;
  }

  clearDiskGarbage() {
    try {
      if (existsSync(TEMP_DIR)) {
        rmSync(TEMP_DIR, { recursive: true, force: true });
        log.info('Đã quét sạch rác trong thư mục ổ cứng tạm.');
      }
      mkdirSync(TEMP_DIR, { recursive: true });
    } catch (err) {
      log.error('Lỗi khi dọn rác ổ cứng:', err.message);
    }
  }

  async init() {
    log.info('DuckDB đang khởi tạo (Async Mode)...');
    try {
      this.clearDiskGarbage();
      this.db = await Database.create(':memory:');
      log.info("DuckDB connection established successfully.");

      const maxMemory = process.env.DUCKDB_MAX_MEMORY || '128MB';
      await this.exec(`SET max_memory = '${maxMemory}';`);
      log.info(`Đã cấu hình giới hạn RAM cho DuckDB: ${maxMemory}`);

      if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR, { recursive: true });
      }
      const safeTempPath = TEMP_DIR.replace(/\\/g, '/');
      await this.exec(`SET temp_directory = '${safeTempPath}';`);
      log.info(`Đã thiết lập thư mục swap tạm trên đĩa: ${safeTempPath}`);
    } catch (err) {
      log.error("DuckDB init failed: ", err.message);
      throw err;
    }
  }

  async exec(sql) {
    try {
      await this.db.exec(sql);
    } catch (err) {
      throw new Error(`SQL exec failed: ${err.message}\nQuery: ${sql.slice(0, 200)}`);
    }
  }

  async query(sql) {
    try {
      return await this.db.all(sql);
    } catch (err) {
      throw new Error(`SQL query failed: ${err.message}\nQuery: ${sql.slice(0, 200)}`);
    }
  }

  async count(table) {
    const rows = await this.query(`SELECT COUNT(*) AS cnt FROM ${table};`);
    return rows[0].cnt;
  }

  async attachPg(databaseUrl) {
    this._pgUrl = databaseUrl;
    await this.exec('INSTALL postgres;');
    await this.exec('LOAD postgres;');
    await this.exec(`ATTACH '${databaseUrl}' AS pg (TYPE POSTGRES, READ_ONLY);`);
  }

  async reattachWritable() {
    await this.exec('DETACH pg;');
    await this.exec(`ATTACH '${this._pgUrl}' AS pg (TYPE POSTGRES);`);
  }

  async exportParquet(table, filePath) {
    const safePath = filePath.replace(/\\/g, '/');
    await this.exec(`COPY ${table} TO '${safePath}' (FORMAT PARQUET, COMPRESSION ZSTD);`);
  }

  async close() {
    log.info('DuckDB connection closing...');
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}