const pg = require('pg');

const pgConfig = {
  host : "localhost",
  user: "postgres",
  database: "hotel",
  password: "123456",
  port: process.env.PGPORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};
const pool = new pg.Pool(pgConfig);

module.exports = pool;