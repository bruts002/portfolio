const tableName = 'chat_events';

class EventsModel {

    constructor(dao) {
        this.dao = dao;
    }

    getEventsAfter(id) {
        const afterIdSQL = `SELECT * FROM ${tableName} WHERE id > ?`;
        return this.dao.get(afterIdSQL, [id]);
    }

    getAll() {
        return this.dao.all(`SELECT * FROM ${tableName}`);
    }

    getLastMessages() {
        const lastMessagesSQL = `SELECT * FROM ${tableName} WHERE event_type = 'NEW_MESSAGE' ORDER BY event_id DESC LIMIT 10`;
        return this.dao.all(lastMessagesSQL)
            .then( messages => messages.map(EventsModel.serializeEvent) );
    }

    static serializeEvent({
        event_type: event,
        event_id: id,
        event_data
    }) {
        let data;
        try {
            data = JSON.parse(event_data);
        } catch(e) {
            data = event_data;
        }
        return {
            event,
            data,
            id
        };
    }

    getEventByTypeData(params) {
        const getSQL = `SELECT * FROM ${tableName} WHERE event_type = ? AND event_data = ?`;
        return this.dao
            .get(getSQL, params)
            .then(EventsModel.serializeEvent);
    }

    create({
        type,
        data
    }) {
        const createSQL = `INSERT INTO ${tableName} (
            event_type,
            event_data
        ) values (?, ?)`;
        const params = [
            type,
            JSON.stringify(data)
        ];
        return this.dao.run(createSQL, params)
            .then( () => this.getEventByTypeData(params));
    }
}

module.exports = EventsModel;
