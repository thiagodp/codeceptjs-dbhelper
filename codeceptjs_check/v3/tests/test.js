Feature( 'Foo' );

BeforeSuite( async ( { I } ) => {
    I.connect( 'testdb', 'sqlite://../../../__tests__/test.db' );
} );

AfterSuite( async ( { I } ) => {
    await I.disconnect( 'testdb' );
} );

Scenario( 'Bar', async ( { I } ) => {
    const r = await I.query( 'testdb', 'SELECT id, name, username, password FROM user' );
    console.table( r );
} );