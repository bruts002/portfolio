const PORT = process.env.port || 8080;
const DATA_BASE_PATH = process.env.DB_PATH || './data/live.db';
const BASE_DB_PATH = './data/base.db';

const config = {
    PORT,
    DATA_BASE_PATH,
    BASE_DB_PATH
};

module.exports = config;
