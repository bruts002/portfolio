const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

const CHAT_EVENTS = require('./chatEvents');
const config = require('./config');
const AppDAO = require('./dao');
let dao;
const EventModel = require('./EventsModel');
let eventModel;

const ClientPool = require('./clientPool');
const clientPool = new ClientPool();

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
            case '/api/chat/stream':
                addClient(request, response);
                break;
            case '/api/chat/publish':
                parsePostData(request, data => {
                    saveEvent(data);
                    response.writeHead(200, Object.assign({}, config.CORS_HEADERS));
                    response.end();
                });
                break;
            default:
                unknownEndpoint(request, response);
                break;
        } 
    }).listen(config.PORT);
};

const shareAllUsers = clientId => Object
    .keys(clientPool.clients)
    .filter( clientKey => clientKey !== clientId )
    // .map( clientKey => clientPool.publish( clientId, CHAT_EVENTS.USER_JOIN, { clientKey }));
    .map( clientKey => clientPool.publish( clientId, Object.assign({},
        { data: {
            id: clientKey,
            name: clientKey
        }},
        { event: CHAT_EVENTS.USER_JOIN }
    )));

const shareLastMessages = clientId => {
    eventModel.getLastMessages()
        .then( messages => messages
            .sort( (a,b) => a.id - b.id)
            // .map(serializeMessage)
            // .map( message => clientPool.publish( clientId, CHAT_EVENTS.NEW_MESSAGE, message )));
            .map( message => clientPool.publish( clientId, Object.assign({},
                message,
                { event: CHAT_EVENTS.NEW_MESSAGE }
            ))));

};

const addClient = (request, response) => {
    clientPool.addClient(request, response);
    const clientId = request.queryParams.id;
    shareAllUsers(clientId);
    shareLastMessages(clientId);
};

const parsePostData = (request, onComplete) => {
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
};

const unknownEndpoint = (request, response) => {
    response.writeHead(404);
    response.write('Unknown URL: ' + request.url);
};

const saveEvent = data => {
    eventModel.create({
        type: data.event,
        data: data.data
    }).then( res => clientPool.publish(ClientPool.ALL, res));
};
