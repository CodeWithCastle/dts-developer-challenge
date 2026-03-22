const { init_query, query } = require('.');
const tasks = require('../data/mock-tasks.json');

const SCHEMA_VERSION = process.env.SCHEMA_VERSION;
let versionCheck = 0;

const init = async () => {
    // 1. Create Database if it doesn't exist
    try {
        const res = await init_query(`SELECT 1 FROM pg_database WHERE datname = $1`, [process.env.DB_NAME]);
        if (res.rowCount === 0) {
            await init_query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log('✅ Database Created!');
        }
    } catch (err) {
        console.log('ℹ️ Database check/creation skipped or already exists.');
    }

    // demo test - repair 
    // try {
    //     await query(`DROP TABLE IF EXISTS tasks; DROP TABLE IF EXISTS schema_info;`);
    // } catch (err) {
    //     console.log('ℹ️ Dropping [Schema, Tasks] tables failed.');
    // }
    
    // 2. Create Schema/Version Table and Tasks Table
    try {
        // Version table to track migrations
        await query(`
            CREATE TABLE IF NOT EXISTS schema_info (
                id SERIAL PRIMARY KEY,
                version TEXT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (err) {
        console.error('❌ Error creating schema:', err);
        return;
    }

    try {
        await query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL, 
                description TEXT,
                due_date TIMESTAMP,
                status TEXT NOT NULL DEFAULT 'todo',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tables Verified/Created!');
    } catch (err) {
        console.error('❌ Error creating tables:', err);
        return; // Stop if tables fail
    }
    
    // 3. Version Check & Seeding Logic
    try {
        versionCheck = await query(`SELECT version FROM schema_info WHERE version = $1`, [SCHEMA_VERSION]);

        if (versionCheck.rowCount > 0) {
            console.log(`⏩ Database version ${SCHEMA_VERSION} already exists. Skipping seed.`);
        } else {
            console.log(`🌱 Starting seed with ${tasks.length} tasks for version ${SCHEMA_VERSION}...`);

            // Use a transaction for the seed so it's "all or nothing"
            await query('BEGIN');
            
            for (const task of tasks) {
                await query(`
                    INSERT INTO tasks (title, description, due_date, status)
                    VALUES ($1, $2, $3, $4);
                `, [task.title, task.description, task.due_date, task.status || 'todo']);
            }

            // Mark this version as complete
            await query(`INSERT INTO schema_info (version) VALUES ($1)`, [SCHEMA_VERSION]);
            
            await query('COMMIT');
            console.log('✅ Database Seeded and Versioned Successfully!');
        }
    } catch (err) {
        await query('ROLLBACK');
        console.error('❌ Seeding/Versioning failed:', err);
    }

    console.log('🚀 Database initialization complete.');
};

module.exports = init;