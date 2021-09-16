export = DbHelper;
/**
 * Database helper for CodeceptJS
 *
 * @author Thiago Delgado Pinto
 */
declare class DbHelper {
    /**
     * Constructor
     *
     * @param {object} config CodeceptJS configuration
     */
    constructor(config: object);
    options: any;
    connectionMap: {};
    /**
     * Connects to the database described by the given connection string.
     *
     * @param {string|number}    key    Identification for using in other commands.
     * @param {string|object}    conn   JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined} [driver] [OPTIONAL] Driver object, used by `database-js`.
     *
     * @returns {Connection} DatabaseJS' connection
     */
    connect(key: string | number, conn: string | object, driver?: object | undefined): any;
    /**
     * Disconnects from the database identified by the given key.
     *
     * @param {string|number} key Database identification key set in connect().
     *
     * @returns {Promise<boolean>} If it was successful.
     */
    disconnect(key: string | number): Promise<boolean>;
    /**
     * Disconnects and removes the database connection identified by the given key.
     *
     * @param {string|number} key Database identification key set in connect().
     *
     * @returns {boolean} If it was successful.
     */
    removeConnection(key: string | number): boolean;
    /**
     * Performs a query.
     *
     * @param {string|number} key     Database identification key set in connect().
     * @param {string}        command Query to run.
     * @param {any[]}         params  [OPTIONAL] Query parameters.
     *
     * @returns {Promise<any[]>} Query results.
     */
    query(key: string | number, command: string, ...params: any[]): Promise<any[]>;
    /**
     * Executes a command.
     *
     * @param {string|number} key     Database identification key set in connect().
     * @param {string}        command Command to run.
     * @param {any[]}         params  [OPTIONAL] Command parameters.
     *
     * @returns {Promise<any[]>} Command results.
     */
    run(key: string | number, command: string, ...params: any[]): Promise<any[]>;
    /**
     * Creates a database connection.
     *
     * @param {string|object}       conn    JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined}    driver  [OPTIONAL] Driver object, used by `database-js`.
     *
     * @returns {Connection} DatabaseJS' connection.
     */
    createConnection(conn: string | object, driver: object | undefined): any;
    /**
     * Checks if there is a database connection with the given key.
     *
     * @param {string|number} key Database identification key set in connect().
     *
     * @returns {boolean}
     */
    hasConnection(key: string | number): boolean;
    /**
     * Gets the database connection with the given key.
     *
     * @param {string|number} key Database identification key set in connect().
     *
     * @returns {Connection} DatabaseJS' connection.
     */
    getConnection(key: string | number): any;
    /**
     * Creates an error that represents a database not found.
     *
     * @param {string|number} key Database identification key.
     */
    _keyNotFoundError(key: string | number): Error;
}
