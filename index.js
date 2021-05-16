let dbjs = require('database-js');

/**
 * Database helper
 *
 * @author Thiago Delgado Pinto
 */
class DbHelper extends Helper {

    /**
     * Constructor
     *
     * @param {object} config Configuration declared in the CodeceptJS configuration file.
     */
    constructor( config ) {
        super( config );
        const defaultOptions = {};
        // Attributes
        this.options = Object.assign( defaultOptions, config ); // Copy from config
        this.connectionMap = {};
    }

    /**
     * Connects to a database by the given connection data.
     *
     * @param {string|number} key Key used to identify the database
     * @param {string|object} conn JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined} driver Driver object, used by `database-js` (optional).
     */
    connect( key, conn, driver ) {
        return this.connectionMap[ key ] = this.createConnection( conn, driver );
    }

    /**
     * Disconnects from a given database by its key.
     *
     * @param {string|number} key Key used to identify the database
     */
    async disconnect( key ) {
        let conn = this.connectionMap[ key ];
        if ( ! conn ) {
            throw this._keyNotFoundError( key );
        }
        return await conn.close();
    }

    /**
     * Disconnects and removes a database connection by its key.
     *
     * @param {string|number} key Key used to identify the database
     */
    async removeConnection( key ) {
        if ( ! this.connectionMap[ key ] ) {
            return true;
        }
        let couldClose = true;
        try {
            await this.disconnect( key );
        } catch ( e ) {
            couldClose = false;
        }
        this.connectionMap[ key ] = undefined;
        return couldClose;
    }

    /**
     * Queries a database with the given key.
     *
     * @param {string|number} key Key used to identify the database
     * @param {string} command Query
     * @param {any[]} params Parameters of the query
     *
     * @returns {Promise<any[]>} The results of the query.
     */
    async query( key, command, ... params ) {
        let conn = this.connectionMap[ key ];
        if ( ! conn ) {
            throw this._keyNotFoundError( key );
        }
        let stmt = conn.prepareStatement( command );
        if ( ! params ) {
            return await stmt.query();
        }
        return await stmt.query( ... params );
    }

    /**
     * Executes a command to the database with the given key.
     *
     * @param {string|number} key Key used to identify the database
     * @param {string} command Command to execute
     * @param {any[]} params Parameters of the command
     *
     * @returns {Promise<any[]>}
     */
    async run( key, command, ... params ) {
        let conn = this.connectionMap[ key ];
        if ( ! conn ) {
            throw this._keyNotFoundError( key );
        }
        let stmt = conn.prepareStatement( command );
        if ( ! params ) {
            return await stmt.execute();
        }
        return await stmt.execute( ... params );
    }

    /**
     * Creates a database connection.
     *
     * @param {string|object} conn JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined} driver Driver object, used by `database-js` (optional).
     */
    createConnection( conn, driver ) {
        return new dbjs.Connection( conn, driver );
    }

    /**
     * Checks whether there is a database with the given key.
     *
     * @param {string|number} key Key used to identify the database
     */
    hasConnection( key ) {
        return !! this.connectionMap[ key ];
    }

    /**
     * Get the database connection with the given key.
     *
     * @param {string|number} key Key used to identify the database
     */
    getConnection( key ) {
        return this.connectionMap[ key ];
    }

    /**
     * Creates an error related to the case when the given key is not found.
     *
     * @param {string|number} key Key used to identify the database
     */
    _keyNotFoundError( key ) {
        return new Error( 'Database not found with the key ' + key );
    }

}

module.exports = DbHelper;
