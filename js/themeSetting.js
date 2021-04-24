window.addEventListener( 'load', () => {
  const themeSettings = document.querySelector( '#theme-settings-button' );
  if( !document.cookie.match( /theme=(?<theme>.+?)(;|$)/ ) ) document.cookie = 'theme=light';
  
  const theme = document.cookie.match( /theme=(?<theme>.+?)(;|$)/ ).groups.theme;
  
  changeTheme( theme );
  document.querySelector( `div#theme-select > input#${ theme }-theme` ).checked = true;
  
  themeSettings.addEventListener( 'click', ( e ) => {
    if( !e.target.isEqualNode( themeSettings ) ) return;
    document.querySelector( '#menu' ).dispatchEvent( new Event( 'close' ) );
    document.querySelector( '#theme-settings' ).dispatchEvent( new Event( 'open' ) );
  } );
  
  document.querySelector( 'div#theme-select > input#light-theme + label' ).addEventListener( 'click', () => {
    changeTheme( 'light' );
  } );
  document.querySelector( 'div#theme-select > input#dark-theme + label' ).addEventListener( 'click', () => {
    changeTheme( 'dark' );
  } );
} );

function changeTheme( theme )
{
  if( theme === 'light' ){
    document.documentElement.style.setProperty( '--bg-color', '#FFFFFF' );
    document.documentElement.style.setProperty( '--inactive-bg-color', '#EAEAEA' );
    document.documentElement.style.setProperty( '--font-color', '#4B4B4B' );
    document.querySelector( 'meta[name="theme-color"]' ).content = '#FFFFFF';
    document.cookie = 'theme=light';
  }else if( theme === 'dark' ){
    document.documentElement.style.setProperty( '--bg-color', '#3B3B3B' );
    document.documentElement.style.setProperty( '--inactive-bg-color', '#111111' );
    document.documentElement.style.setProperty( '--font-color', '#EEEEEE' );
    document.querySelector( 'meta[name="theme-color"]' ).content = '#3B3B3B';
    document.cookie = 'theme=dark';
  }
}