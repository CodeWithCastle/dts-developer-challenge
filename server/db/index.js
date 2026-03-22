const { Pool } = require('pg');
require('dotenv').config();

// Only used to run 'CREATE DATABASE' scripts
const db_init = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
});

// Used for 99% of tasks
const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionTimeoutMillis: 5000,
});

// Event listener for debugging
db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});


module.exports = {
    init_query: (text, params) => db_init.query(text, params),
    query: (text, params) => db.query(text, params),
    db
};