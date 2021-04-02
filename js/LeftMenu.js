export class LeftMenu
{
  constructor()
  {
    this.addMenuEvent();
    this.addSignOutEvent();
  }
  
  addMenuEvent()
  {
    const menuButton = document.querySelector( 'div#menu-button' );
    
    menuButton.addEventListener( 'click', () => menuButton.classList.add( 'clicked' ) );
    document.querySelector( 'div#body-wrapper' ).addEventListener( 'click', () => menuButton.classList.remove( 'clicked' ) );
  }
  
  addSignOutEvent()
  {
    const signout = document.querySelector( 'ul#signout' );
    
    signout.addEventListener( 'click', () => {
      if( signout.classList.contains( 'confirm' ) ){
        document.cookie = "SID=;";
        location.reload();
      }else{
        signout.classList.add( 'confirm' );
      }
    } );
    document.addEventListener( 'click', ( e ) => {
      if( e.target.parentNode && !e.target.parentNode.isEqualNode( signout ) ){
        signout.classList.remove( 'confirm' );
      }
    } );
  }
}