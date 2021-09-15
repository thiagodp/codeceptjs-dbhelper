const dbjs = require('database-js');
if ( ! Helper ) {
    var Helper = require( 'codeceptjs/lib/helper' );
}

/**
 * Database helper for CodeceptJS
 *
 * @author Thiago Delgado Pinto
 */
class DbHelper extends Helper {

    /**
     * Constructor
     *
     * @param {object} config CodeceptJS configuration
     */
    constructor( config ) {
        super( config );
        const defaultOptions = {};
        // Attributes
        this.options = Object.assign( defaultOptions, config ); // Copy from config
        this.connectionMap = {};
    }

    /**
     * Connects to the database described by the given connection string.
     *
     * @param {string|number}    key    Identification for using in other commands.
     * @param {string|object}    conn   JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined} driver [OPTIONAL] Driver object, used by `database-js`.
	 *
	 * @returns {Connection} DatabaseJS' connection
     */
    connect( key, conn, driver ) {
        return this.connectionMap[ key ] = this.createConnection( conn, driver );
    }

    /**
     * Disconnects from the database identified by the given key.
     *
     * @param {string|number} key Database identification key set in connect().
	 *
	 * @returns {Promise<boolean>} If it was successful.
     */
    async disconnect( key ) {
        let conn = this.connectionMap[ key ];
        if ( ! conn ) {
            throw this._keyNotFoundError( key );
        }
        return conn.close();
    }

    /**
     * Disconnects and removes the database connection identified by the given key.
     *
     * @param {string|number} key Database identification key set in connect().
	 *
	 * @returns {boolean} If it was successful.
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
     * Performs a query.
     *
     * @param {string|number} key     Database identification key set in connect().
     * @param {string}        command Query to run.
     * @param {any[]}         params  [OPTIONAL] Query parameters.
     *
     * @returns {Promise<any[]>} Query results.
     */
    async query( key, command, ... params ) {
        let conn = this.connectionMap[ key ];
        if ( ! conn ) {
            throw this._keyNotFoundError( key );
        }
        let stmt = conn.prepareStatement( command );
        if ( ! params ) {
            return stmt.query();
        }
        return stmt.query( ... params );
    }

    /**
     * Executes a command.
     *
     * @param {string|number} key     Database identification key set in connect().
     * @param {string}        command Command to run.
     * @param {any[]}         params  [OPTIONAL] Command parameters.
     *
     * @returns {Promise<any[]>} Command results.
     */
    async run( key, command, ... params ) {
        let conn = this.connectionMap[ key ];
        if ( ! conn ) {
            throw this._keyNotFoundError( key );
        }
        let stmt = conn.prepareStatement( command );
        if ( ! params ) {
            return stmt.execute();
        }
        return stmt.execute( ... params );
    }

    /**
     * Creates a database connection.
     *
     * @param {string|object}       conn    JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined}    driver  [OPTIONAL] Driver object, used by `database-js`.
	 *
	 * @returns {Connection} DatabaseJS' connection.
     */
    createConnection( conn, driver ) {
        return new dbjs.Connection( conn, driver );
    }

    /**
     * Checks if there is a database connection with the given key.
     *
     * @param {string|number} key Database identification key set in connect().
	 *
	 * @returns {boolean}
     */
    hasConnection( key ) {
        return !! this.connectionMap[ key ];
    }

    /**
     * Gets the database connection with the given key.
     *
     * @param {string|number} key Database identification key set in connect().
	 *
	 * @returns {Connection} DatabaseJS' connection.
     */
    getConnection( key ) {
        return this.connectionMap[ key ];
    }

    /**
     * Creates an error that represents a database not found.
     *
     * @param {string|number} key Database identification key.
     */
    _keyNotFoundError( key ) {
        return new Error( 'Database not found with the key ' + key );
    }

}

module.exports = DbHelper;
