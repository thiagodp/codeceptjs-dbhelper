const DbHelper = require( '..' );

describe( 'DbHelper', () => {

    const helper = new DbHelper();

    before( async () => {
        helper.connect( 'testdb', 'sqlite://./__tests__/test.db' );
    } );

    after( async () => {
        helper.disconnect( 'testdb' );
    } );

    it( 'can run query', async () => {
        const r = await helper.query( 'testdb', 'SELECT id, name, username, password FROM user' );
        console.table( r );
    } );

    it( 'can run command', async () => {
        await helper.run( 'testdb', 'UPDATE user SET name = name WHERE id = 1' );
    } );

} );