const { Pool } = require("pg");
require("dotenv").config();
const connectionString = process.env.DATABASE_URL;
//const pool = new Pool({
	//connectionString: connectionString,
//});
const pool = new Pool({
  user: 'postgres',
  database: 'tempCamera',
  password: '',
  port: 5432,
  host: 'localhost',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
};
