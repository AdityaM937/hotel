const pg = require('pg');

const pgConfig = {
    user : 'postgres',
    host : 'localhost',
    database : 'hotel',
    password : '123456',
    port : 5432,
    max : 10,
    idleTimeout : 30000
};

const pool = new pg.Pool(pgConfig);
module.exports = pool;

