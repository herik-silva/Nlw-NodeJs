import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();
    const ambiente_teste = false;
    const db = ambiente_teste ? "./src/database/database.test.sqlite" : defaultOptions.database

    return createConnection(
        Object.assign(defaultOptions, {
            database: db
        })
    );
}