import duckdb from 'duckdb';

export class DuckDB {
  constructor() {
    this.db = null;
    this.conn = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new duckdb.Database(':memory:', (err) => {
        if (err) return reject(new Error(`DuckDB init failed: ${err.message}`));
        this.db.connect((err, connection) => {
          if (err) return reject(new Error(`DuckDB connect failed: ${err.message}`));
          this.conn = connection;
          resolve();
        });
      });
    });
  }

  exec(sql) {
    return new Promise((resolve, reject) => {
      this.conn.run(sql, (err) => {
        if (err) return reject(new Error(`SQL exec failed: ${err.message}\nQuery: ${sql.slice(0, 200)}`));
        resolve();
      });
    });
  }

  query(sql) {
    return new Promise((resolve, reject) => {
      this.conn.all(sql, (err, rows) => {
        if (err) return reject(new Error(`SQL query failed: ${err.message}\nQuery: ${sql.slice(0, 200)}`));
        resolve(rows);
      });
    });
  }

  async count(table) {
    const [row] = await this.query(`SELECT COUNT(*) AS cnt FROM ${table};`);
    return row.cnt;
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
    try {
      await this.exec('DETACH pg;').catch(() => {});
    } catch (_) {}

    return new Promise((resolve) => {
      if (this.db) {
        this.db.close(() => {
          this.db = null;
          this.conn = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
