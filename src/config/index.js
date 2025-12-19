require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/eventio',
    dataFile: process.env.DATA_FILE_PATH || './data/events.json'
};
