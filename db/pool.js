require('dotenv').config();
const { Pool } = require('pg');

module.exports = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    password: process.env.PW,
    port: 5432
});