
window.onload = async () => {
  import( './MenuMove.js'   ).then( m => new m.MenuMove() );
  import( './LeftMenu.js'   ).then( m => new m.LeftMenu() );
  import( './Footer.js'     ).then( m => new m.Footer() );
  import( './Calendar.js'   ).then( m => new m.Calendar() );
  import( './SelectMode.js' ).then( m => new m.SelectMode() );
  import( './StreamData.js' ).then( m => new m.StreamData() );
  
  const setting = document.querySelector( 'div#settings' );
  setting.addEventListener( 'click', ( e ) => {
    if( setting.classList.contains( 'cancel' ) || e.target.isEqualNode( setting.querySelector( '.menu-handle > .close-button' ) )  ) return;
    setting.querySelector( '.drawer-menu' ).style.transform = 'translateY( 0 )';
  } );

  const addShift = document.querySelector( 'div#add-shift-button' );
  addShift.addEventListener( 'click', ( e ) => {
  if( e.target.isEqualNode( setting.querySelector( '.menu-handle > .close-button' ) )  ) return;
    document.querySelector( 'div#add-shift-button > .drawer-menu' ).style.transform = 'translateY( 0 )';
  } );
  
  const createShift = document.querySelector( '.yes-no > .button' );
  createShift.addEventListener( 'click', () => {
    const configElement = document.querySelectorAll( '#shift-type-config > .input-form > div > *' );
    const shiftInfo = elementsToDict( configElement );
    if( inputCheck( shiftInfo ) ) console.log( shiftInfo );
    else [...configElement].forEach( v => { if( v.name && !v.value ) v.style.border = '3px double red'; } );
  });
  
  // ['MenuMove', 'LeftMenu', 'Footer', 'Calendar', 'SelectMode', 'StreamData'].map( async s => {
  //   console.log( ( await import( `./${ s }.js` ) ) );
  // } );
};