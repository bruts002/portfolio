const REACT_APP_ORIGIN = 'http://localhost:3000';

const config = {
    PORT: 8080,
    REACT_APP_ORIGIN,
    LIVE_DB_PATH: './data/live.db',
    BASE_DB_PATH: './data/base.db',
    CORS_HEADERS: {
        'Access-Control-Allow-Origin': REACT_APP_ORIGIN,
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Credentials': true
    },
};

module.exports = config;
