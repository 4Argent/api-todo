const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'desarrollo',
  password: 'Argento4$',
  port: 5432,
});

module.exports = pool;