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

    getEventByTypeData(params) {
        const getSQL = `SELECT * FROM ${tableName} WHERE event_type = ? AND event_data = ?`;
        return this.dao
            .get(getSQL, params)
            .then( ({
                event_type: event,
                event_id: id,
                event_data,
            }) => {
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
            });
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
