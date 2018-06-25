const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

const CHAT_EVENTS = require('./chatEvents');
const config = require('./config');
const AppDAO = require('./dao');
let dao;
const EventModel = require('./EventsModel');
let eventModel;

let clients = {};

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': config.REACT_APP_ORIGIN,
    'Access-Control-Expose-Headers': '*',
    'Access-Control-Allow-Credentials': true
};

fs.access(config.LIVE_DB_PATH, err => {
    if (err) {
        copyFile(config.BASE_DB_PATH, config.LIVE_DB_PATH)
            .then(connectToDatabase)
            .then(startServer);
    } else {
        connectToDatabase()
            .then(startServer);
    }
});

const connectToDatabase = () => {
    return new Promise( resolve => {
        dao = new AppDAO(config.LIVE_DB_PATH);
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
    }).listen(config.PORT);
};

function shareAllUsers(response) {
    Object
        .keys(clients)
        .forEach( clientId => {
            response.write(serializeMessage({
                data: {
                    id: clientId,
                    name: clientId,
                },
                event: CHAT_EVENTS.USER_JOIN
            }));
        });
}

function shareLastMessages(response) {
    eventModel.getLastMessages()
        .then( messages => messages
            .sort( (a,b) => a.id - b.id)
            .map(serializeMessage)
            .forEach( message => response.write(message)));
}

function broadcast({
    event = CHAT_EVENTS.UNKNOWN,
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

    shareAllUsers(response);
    shareLastMessages(response);
    clients[clientId] = response;

    handleEvent({
        event: CHAT_EVENTS.USER_JOIN,
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
        event: CHAT_EVENTS.USER_LEAVE,
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
            case CHAT_EVENTS.USER_JOIN:
                broadcast(res);
                break;
            case CHAT_EVENTS.START_TYPING:
                break;
            case CHAT_EVENTS.NEW_MESSAGE:
                broadcast(res);
                response.writeHead(200, Object.assign({}, CORS_HEADERS));
                response.end();
                break;
            default:
        }
    });
}
