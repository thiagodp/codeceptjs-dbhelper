# codeceptjs-dbhelper

[![npm version](https://badge.fury.io/js/codeceptjs-dbhelper.svg)](https://badge.fury.io/js/codeceptjs-dbhelper)
[![Downloads](https://img.shields.io/npm/dt/codeceptjs-dbhelper.svg)](https://npmjs.org/package/codeceptjs-dbhelper)

> Let your CodeceptJS tests talk to databases

This is a [Helper](https://codecept.io/helpers/) for [CodeceptJS](https://codecept.io/) that allows you to execute queries or commands to databases using [database-js](https://github.com/mlaanderson/database-js). That is, your tests written for CodeceptJS now will be able to access databases easily. **It is especially useful for preparing databases before/after executing test cases.**

## Install

**_Step 1 of 2_: Install the helper**

```bash
npm install --save codeceptjs-dbhelper
```

**_Step 2 of 2_: Install the driver for the database you need to use**

| Driver (wrapper) | Note | Installation command |
| ---------------- | ---- | -------------------- |
| [ActiveX Data Objects](//github.com/mlaanderson/database-js-adodb) | *Windows only* | `npm i database-js-adodb` |
| [CSV files](//github.com/mlaanderson/database-js-csv) | | `npm i database-js-csv` |
| [Excel files](//github.com/mlaanderson/database-js-xlsx) | | `npm i database-js-xlsx` |
| [Firebase](//github.com/mlaanderson/database-js-firebase) | | `npm i database-js-firebase` |
| [INI files](//github.com/mlaanderson/database-js-ini) | | `npm i database-js-ini` |
| [JSON files](//github.com/thiagodp/database-js-json) | | `npm i database-js-json` |
| [MySQL](//github.com/mlaanderson/database-js-mysql) | | `npm i database-js-mysql` |
| [MS SQL Server](https://github.com/thiagodp/database-js-mssql) | | `npm i database-js-mssql` |
| [PostgreSQL](//github.com/mlaanderson/database-js-postgres) | | `npm i database-js-postgres` |
| [SQLite](//github.com/mlaanderson/database-js-sqlite) | | `npm i database-js-sqlite` |

See [database-js](https://github.com/mlaanderson/database-js) for the full list of available drivers.


## Usage

### Configuration in CodeceptJS

In your `codecept.json`, include **DbHelper** in the property **helpers** :

```js
  ...
  "helpers": {
    ...
    "DbHelper": {
      "require": "./node_modules/codeceptjs-dbhelper"
    }
  },
  ...
```
### Examples

The object `I` of your tests and events will have access to new methods. [See the API](#api).

#### Example 1

```js
BeforeSuite( async( I ) => {
    // The first parameter is the key that will hold a reference to the db
    I.connect( "testdb", "mysql://root:mypassword@localhost:3306/testdb" );
} );

AfterSuite( async( I ) => {
    await I.removeConnection( "testdb" ); // also disconnects
} );


Before( async( I ) => {

    // Delete all the records of the table user
    await I.run( "testdb", "DELETE FROM user" );

    // Insert some users
    await I.run( "testdb", "INSERT INTO user ( username, password ) VALUES ( ?, ? )", "admin", "123456" );
    await I.run( "testdb", "INSERT INTO user ( username, password ) VALUES ( ?, ? )", "bob", "654321" );
await I.run( "testdb", "INSERT INTO user ( username, password ) VALUES ( ?, ? )", "alice", "4lic3p4s$" );

} );


// ... your feature ...

// ... your scenarios ...
```

#### Example 2

```js
Feature( 'Foo' );

Scenario( 'Bar', async( I ) => {

    // Query a user from the database
    const results = await I.query( "testdb", "SELECT * FROM user WHERE username = ?", "bob" );
    const bob = results[ 0 ];

    I.amOnPage( '/login' );
    I.fillField( '#username', bob.username );
    I.fillField( '#password', bob.password );
    I.click( '#ok' );
    I.see( 'Welcome' );
} );
```

## API


```js
/**
 * Connects to a database by the given connection data.
 *
 * @param {string|number} key Key used to identify the database
 * @param {string|object} conn JDBC-like connection string or a connection object accepted by `database-js`.
 * @param {object|undefined} driver Driver object, used by `database-js` (optional).
 */
connect( key, conn, driver );

/**
 * Disconnects from a given database by its key.
 *
 * @param {string|number} key Key used to identify the database
 */
async disconnect( key );

/**
 * Disconnects and removes a database connection by its key.
 *
 * @param {string|number} key Key used to identify the database
 */
async removeConnection( key );

/**
 * Queries a database with the given key.
 *
 * @param {string|number} key Key used to identify the database
 * @param {string} command Query
 * @param {any[]} params Parameters of the query
 *
 * @returns {Promise<any[]>} The results of the query.
 */
async query( key, command, ... params );

/**
 * Executes a command to the database with the given key.
 *
 * @param {string|number} key Key used to identify the database
 * @param {string} command Command to execute
 * @param {any[]} params Parameters of the command
 *
 * @returns {Promise<any[]>}
 */
async run( key, command, ... params );
```

## See also

[codeceptjs-cmdhelper](https://github.com/thiagodp/codeceptjs-cmdhelper) - Execute commands in the console/terminal


## License

MIT © [Thiago Delgado Pinto](https://github.com/thiagodp)
