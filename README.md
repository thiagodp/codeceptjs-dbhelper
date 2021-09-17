# codeceptjs-dbhelper

[![npm version](https://img.shields.io/npm/v/codeceptjs-dbhelper.svg?color=green&label=NPM&style=for-the-badge)](https://badge.fury.io/js/codeceptjs-dbhelper)
[![Downloads](https://img.shields.io/npm/dt/codeceptjs-dbhelper.svg?style=for-the-badge)](https://npmjs.org/package/codeceptjs-dbhelper)

> Let your CodeceptJS tests talk to databases

This is a [Helper](https://codecept.io/helpers/) for [CodeceptJS](https://codecept.io/) that allows you to execute database queries and commands using [database-js](https://github.com/mlaanderson/database-js).

👉 It works with **CodeceptJS 1, 2, and 3**.

## Install

> You have to install the library and the desired database drivers

Step 1 of 2: **Install the helper**

```bash
npm i -D codeceptjs-dbhelper
```

Step 2 of 2: **Install a database driver**

| Driver (wrapper) | Note | Installation command |
| ---------------- | ---- | -------------------- |
| [ActiveX Data Objects](//github.com/mlaanderson/database-js-adodb) | *Windows only* | `npm i -D database-js-adodb` |
| [CSV files](//github.com/mlaanderson/database-js-csv) | | `npm i -D database-js-csv` |
| [Excel files](//github.com/mlaanderson/database-js-xlsx) | | `npm i -D database-js-xlsx` |
| [Firebase](//github.com/mlaanderson/database-js-firebase) | | `npm i -D database-js-firebase` |
| [INI files](//github.com/mlaanderson/database-js-ini) | | `npm i -D database-js-ini` |
| [JSON files](//github.com/thiagodp/database-js-json) | | `npm i -D database-js-json` |
| [MySQL](//github.com/mlaanderson/database-js-mysql) | | `npm i -D database-js-mysql` |
| [MS SQL Server](https://github.com/thiagodp/database-js-mssql) | | `npm i -D database-js-mssql` |
| [PostgreSQL](//github.com/mlaanderson/database-js-postgres) | | `npm i -D database-js-postgres` |
| [SQLite](//github.com/mlaanderson/database-js-sqlite) | | `npm i -D database-js-sqlite` |

See [database-js](https://github.com/mlaanderson/database-js) for the full list of available drivers.


## Configure

In your CodeceptJS configuration file (e.g., `codecept.conf.js`, `codecept.json`), include **DbHelper** in the property **helpers** :

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

## Usage


### Syntax differences between CodeceptJS 2 and CodeceptJS 3

In CodeceptJS 2, every callback receives `I` as an argument:

```javascript
Scenario('test something', async ( I ) => {   // CodeceptJS 2 notation
   /* ... */
} );
```

In CodeceptJS 3, every callback receives an **object** that contains the property `I` - that is, `{ I }`:

```javascript
Scenario('test something', async ( { I } ) => {   // CodeceptJS 3 notation
   /* ... */
} );
```

See the [CodeceptJS docs](https://github.com/codeceptjs/CodeceptJS/wiki/Upgrading-to-CodeceptJS-3) for more information on how to upgrade your codebase.

### Usage

> The following examples are written with **CodeceptJS 3**.

#### Example 1

```js
BeforeSuite( async( { I } ) => {
    // Connects to a database
    // The first parameter is the key that will hold a reference to the database
    I.connect( "testdb", "mysql://root:mypassword@localhost:3306/testdb" );
} );

AfterSuite( async( { I } ) => {
    // Disconnects and removes the reference to the database
    await I.removeConnection( "testdb" );
} );


Before( async( { I } ) => {

  // Deletes all the records from the table 'user'
  await I.run( "testdb", "DELETE FROM user" );

  // Inserting some users
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

Scenario( 'Bar', async( { I } ) => {

    // Queries a user from the database
    const results = await I.query( "testdb", "SELECT username, password FROM user WHERE username = ?", "bob" );
    const user = results[ 0 ]; // object in the first row

    I.amOnPage( '/login' );
    I.fillField( '#username', user.username ); // bob
    I.fillField( '#password', user.password ); // 654321
    I.click( '#ok' );
    I.see( 'Welcome' );
} );
```

## API

```ts
    /**
     * Connects to the database described by the given connection string.
     *
     * @param {string|number}    key         Identification for using in other commands.
     * @param {string|object}    conn        JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined} [driver]    [OPTIONAL] Driver object, used by `database-js`.
     *
     * @returns {Connection} DatabaseJS' connection
     */
    connect(key: string | number, conn: string | object, driver?: object | undefined): any;
    /**
     * Disconnects and removes the database connection identified by the given key.
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
     * @returns {Promise<boolean>} If it was successful.
     */
    removeConnection(key: string | number): Promise<boolean>;
    /**
     * Performs a query.
     *
     * @param {string|number}      key       Database identification key set in connect().
     * @param {string}             command   Query to run.
     * @param {...any[]|undefined} [params]  [OPTIONAL] Query parameters.
     *
     * @returns {Promise<any[]>} Query results.
     */
    query(key: string | number, command: string, ...params?: (any[] | undefined)[]): Promise<any[]>;
    /**
     * Executes a command.
     *
     * @param {string|number} key       Database identification key set in connect().
     * @param {string}        command   Command to run.
     * @param {any[]}         [params]  [OPTIONAL] Command parameters.
     *
     * @returns {Promise<any[]>} Command results.
     */
    run(key: string | number, command: string, ...params?: any[]): Promise<any[]>;
    /**
     * Creates a database connection.
     *
     * @param {string|object}       conn     JDBC-like connection string or a connection object accepted by `database-js`.
     * @param {object|undefined}    [driver] [OPTIONAL] Driver object, used by `database-js`.
     *
     * @returns {Connection} DatabaseJS' connection
     */
    createConnection(conn: string | object, driver?: object | undefined): any;
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
```

## See also

[codeceptjs-cmdhelper](https://github.com/thiagodp/codeceptjs-cmdhelper) - Execute commands in the console/terminal


## License

MIT © [Thiago Delgado Pinto](https://github.com/thiagodp)
