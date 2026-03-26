import { Database } from 'duckdb-async';
import { log } from '../helpers/logger.js';

export class DuckDB {
  constructor() {
    this.db = null;
  }

  async init() {
    log.info('DuckDB đang khởi tạo (Async Mode)...');
    try {
      this.db = await Database.create(':memory:');
      log.info("DuckDB connection established successfully.");
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
  }
}