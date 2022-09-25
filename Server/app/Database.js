import mysql from "mysql";

export default class Database {
    static connection = null;

    static connectAsync(settings) {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection(settings);

            this.connection.connect((error) => {
                if(error)
                    return reject(error);

                return resolve();
            });
        });
    };

    static queryAsync(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows) => {
                if(error)
                    return reject(error);

                return resolve(rows);
            });
        });
    };
};
