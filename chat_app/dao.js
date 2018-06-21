const sqlite3 = require('sqlite3');

class AppDAO {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, err => {
            const successMessage = 'Connected to database';
            const failureMessage = 'Could not connect to database';
            if (err) {
                console.log(failureMessage + ' ' + err);
            } else {
                console.log(successMessage);
            }
        });
    }

    run(sqlStatement, params = []) {
        return new Promise( (resolve, reject) => {
            this.db.run(sqlStatement, params, err => {
                if (err) {
                    const failureMessage = `Error running sql: ${sqlStatement}`;
                    console.log(failureMessage);
                    console.log(err);
                    reject(err);
                } else {
                    // TODO: what is lastId
                    resolve({ id: this.lastId });
                }
            });
        });
    }

    get(sqlStatement, params = []) {
        return new Promise( (resolve, reject) => {
            this.db.get(sqlStatement, params, (err, result) => {
                if (err) {
                    const failureMessage = `Error running sql: ${sqlStatement}`;
                    console.log(failureMessage);
                    console.log(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    all(sqlStatement, params = []) {
        return new Promise( (resolve, reject) => {
            this.db.all(sqlStatement, params, (err, rows) => {
                if (err) {
                    const failureMessage = `Error running sql: ${sqlStatement}`;
                    console.log(failureMessage);
                    console.log(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = AppDAO;

