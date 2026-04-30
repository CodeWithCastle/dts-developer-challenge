// index.js
require('dotenv').config();
const app = require('./app');
const initDB = require('./db/init');


const PORT = process.env.PORT || 5001;

const startBackend = async () => {
    try {
        await initDB();
        console.log('📦 Database initialized and seeded.');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server confirmed on port ${PORT}`);
            console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/tasks`);
        });
    } catch (err) {
        console.error('⚠️ Database initialization failed. Server not started:', err);
        process.exit(1); // Exit if we can't connect to the DB
    }
};

startBackend();