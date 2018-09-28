const http = require('http');
const { parse } = require('querystring');

const CHAT_EVENTS = require('./chatEvents');
const config = require('./config');
const AppDAO = require('./dao');
let dao;
const EventModel = require('./EventsModel');
let eventModel;

const ClientPool = require('./clientPool');
const clientPool = new ClientPool();

const connectToDatabase = () => {
    return new Promise( resolve => {
        dao = new AppDAO(config.DATA_BASE_PATH);
        eventModel = new EventModel(dao);
        resolve();
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
                    response.writeHead(200);
                    response.end();
                });
                break;
            default:
                unknownEndpoint(request, response);
                break;
        } 
    }).listen(config.PORT);
};

const rejectSubscriber = (response, error='Unable to subscribe') => {
    response.writeHead(200);
    response.write(error);
    response.end();
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
    const added = clientPool.addClient(request, response);
    if (added) {
        const clientId = request.queryParams.id;
        shareAllUsers(clientId);
        shareLastMessages(clientId);
    } else {
        rejectSubscriber(response)
    }
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

connectToDatabase()
    .then(startServer);
