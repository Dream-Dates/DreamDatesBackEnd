// const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "postgres",
//   password: "damian",
//   host: "localhost",
//   port: 5432,
//   database: "Alvin",
// });

// module.exports = pool;
require("dotenv").config();
const { Pool } = require("pg");

const connectionDevelopment = {
  user:"postgres",
  database: 'dreamdates',
  password: "Alvin",
  host: "localhost",
  port: 5432,
};

const connectionProduction = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(
  process.env.NODE_ENV === "production"
    ? connectionProduction
    : connectionDevelopment
);

module.exports = pool;
