require('dotenv').config();
const app = require('./app');
const initDB = require('./db/init');


const PORT = process.env.PORT || 8080;

initDB().then(() => {
    console.log('📦 Database initialized and seeded.');
}).catch(err => {
    console.error('⚠️ Database initialization failed:', err);
});


app.listen(PORT, () => {
    console.log(`🚀 Server confirmed on port ${PORT}`);
    console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/tasks`);
});