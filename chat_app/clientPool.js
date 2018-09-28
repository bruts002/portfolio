const CHAT_EVENTS = require('./chatEvents');

const serializeMessage = messageObj => Object
    .keys(messageObj)
    .reduce( (message, key) => {
        return `${message}${key}: ${typeof messageObj[key] === 'object' ? JSON.stringify(messageObj[key]) : messageObj[key]}\n`;
    }, '') + '\n';

class ClientPool {

    constructor() {
        this.clients = {};
    }

    getListenersFor(topic) {
        if (topic === ClientPool.ALL) {
            return Object.keys(this.clients);
        } else if (topic in this.clients) {
            return [topic];
        } else {
            return [];
        }
    }

    publish(topic, data) {
        const clients = this.getListenersFor(topic);
        switch (data.event) {
            case CHAT_EVENTS.USER_JOIN:
            case CHAT_EVENTS.USER_LEAVE:
            case CHAT_EVENTS.START_TYPING:
            case CHAT_EVENTS.NEW_MESSAGE:
                const message = serializeMessage(data);
                clients
                    .forEach( clientId => {
                        this.clients[clientId].write(message);
                        console.log('sent update to id: ' + clientId);
                    }, this);
                break;
            default:
                console.warn(`Unknown event ${event} published to topic ${topic}`);
                break;
        }
    }

    addClient(request, response) {
        const clientId = request.queryParams.id;
        if (this.clients[clientId]) {
            return false;
        }
        console.log('opened connection. Assigned id: ' + clientId);

        request.socket.setTimeout(Number.MAX_VALUE);
        response.writeHead(200, Object.assign({}, {
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        }));

        this.clients[clientId] = response;

        this.publish(ClientPool.ALL, {
            event: CHAT_EVENTS.USER_JOIN,
            data: {
                name: clientId,
                id: clientId
            }
        });

        const _this = this;
        request.on('close', () => {
            console.log('closed id: ' + clientId);
            _this.removeClient(clientId);
        });

        request.on('error', err => {
            console.warn('Caught this error: ', err);
            _this.removeClient(clientId);
        });
        return true;
    }

    removeClient(clientId) {
        if (this.clients[clientId]) {
            this.clients[clientId].end();
            delete this.clients[clientId];
        }
        this.publish(ClientPool.ALL, {
            event: CHAT_EVENTS.USER_LEAVE,
            data: { id: clientId }
        });
    }
}

ClientPool.ALL = '*';

module.exports = ClientPool;
