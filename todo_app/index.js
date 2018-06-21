const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

const AppDAO = require('./dao');
let dao;
const EventModel = require('./EventsModel');
let eventModel;

const PORT = 8080;
let clients = {};

const EVENTS = {
    UNKNOWN: 'UNKNOWN',
    NEW_MESSAGE: 'NEW_MESSAGE',
    USER_JOIN: 'USER_JOIN',
    USER_LEAVE: 'USER_LEAVE'
};

const REACT_APP_ORIGIN = 'http://localhost:3000';
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': REACT_APP_ORIGIN,
    'Access-Control-Expose-Headers': '*',
    'Access-Control-Allow-Credentials': true
};

const LIVE_DB_PATH = './data/live.db';
const BASE_DB_PATH = './data/base.db';

fs.access(LIVE_DB_PATH, err => {
    if (err) {
        copyFile(BASE_DB_PATH, LIVE_DB_PATH)
            .then(connectToDatabase)
            .then(startServer);
    } else {
        connectToDatabase()
            .then(startServer);
    }
});

const connectToDatabase = () => {
    return new Promise( resolve => {
        dao = new AppDAO(LIVE_DB_PATH);
        eventModel = new EventModel(dao);
        resolve();
    });
};

const copyFile = (source, target) => {
    const rd = fs.createReadStream(source);
    const wr = fs.createWriteStream(target);
    return new Promise( (resolve, reject) => {
        rd.on('error', reject);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    }).catch( error => {
        rd.destroy();
        wr.end();
        throw error;
    });
};


const startServer = () => {
    http.createServer((request, response) => {
        const qIndex = request.url.indexOf('?');
        const url = qIndex !== -1 ?
            request.url.slice(0, qIndex) :
            request.url;
        request.queryParams = qIndex !== -1 ?
            parse(request.url.slice(qIndex+1)) :
            {};

        switch (url) {
            case '/stream':
                addClient(request, response);
                break;
            case '/publish':
                parsePostData(request, data => {
                    handleEvent(data, response);
                });
                break;
            default:
                unknownEndpoint(request, response);
                break;
        } 
    }).listen(PORT);
};

function broadcast({
    event = EVENTS.UNKNOWN,
    data,
    id
} = {}) {
    const message = serializeMessage({
        id,
        event,
        data
    });
    Object
        .keys(clients)
        .forEach( clientId => {
            clients[clientId].write(message);
            console.log('sent update to id: ' + clientId);
        });
}

function addClient(request, response) {
    const clientId = request.queryParams.id;
    console.log('opened connection. Assigned id: ' + clientId);

    response.writeHead(200, Object.assign({}, CORS_HEADERS, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    }));

    clients[clientId] = response;
    handleEvent({
        event: EVENTS.USER_JOIN,
        data: {
            name: clientId,
            id: clientId
        }
    });

    request.on('close', () => {
        console.log('closed id: ' + clientId);
        removeClient(clientId);
    });

    request.on('error', err => {
        console.warn('Caught this error: ', err);
        removeClient(clientId);
    });
}

function removeClient(id) {
    clients[id].end();
    delete clients[id];
    broadcast({
        event: EVENTS.USER_LEAVE,
        data: { id }
    });
}

function serializeMessage(messageObj) {
    return Object
        .keys(messageObj)
        .reduce( (message, key) => {
            return `${message}${key}: ${typeof messageObj[key] === 'object' ? JSON.stringify(messageObj[key]) : messageObj[key]}\n`;
        }, '') + '\n';
}

function parsePostData(request, onComplete) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        let data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            data = null;
        } finally {
            onComplete(data);
        }
    });
}

function unknownEndpoint(request, response) {
    response.writeHead(404);
    response.write('Unknown URL: ' + request.url);
}

function handleEvent(data, response) {
    eventModel.create({
        type: data.event,
        data: data.data
    }).then( res => {
        switch (res.event) {
            case EVENTS.USER_JOIN:
                broadcast(res);
                break;
            case EVENTS.START_TYPING:
                break;
            case EVENTS.NEW_MESSAGE:
                broadcast(res);
                response.writeHead(200, Object.assign({}, CORS_HEADERS));
                response.end();
                break;
            default:
        }
    });
}
