const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Alvin",
  host: "localhost",
  port: 5432,
  database: "dreamdates",
});

module.exports = pool;
