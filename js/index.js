const calendar = import( './Calendar.js' ).then( m => new m.Calendar() );
const drawerMenu = import( './DrawerMenu.js' ).then( m => new m.DrawerMenu() );
const leftMenu = import( './LeftMenu.js' ).then( m => new m.LeftMenu() );
const streamData = import( './StreamData.js' ).then( m => new m.StreamData() );
const setData = import( './SetData.js' ).then( m => new m.SetData() );
const footer = import( './Footer.js' ).then( m => new m.Footer() );
const selectMode = import( './SelectMode.js' ).then( m => new m.SelectMode() );
const buttonRegister = import( './ButtonRegister.js' ).then( m => new m.ButtonRegister() );