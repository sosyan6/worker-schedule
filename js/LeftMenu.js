export class LeftMenu
{
  constructor()
  {
    
    this.startPos = {};
    this.difference = 0;
    this.isOpen = false;
    this.menu = document.querySelector( '#menu' );
    this.hidder = document.querySelector( '#body-wrapper' );
    
    this.addMenuEvent();
    this.addSignOutEvent();
    
    this.menu.addEventListener( 'touchstart', ( e ) => this.onTouch( e ) );
    this.menu.addEventListener( 'touchmove', ( e ) => this.onMove( e ) );
    this.menu.addEventListener( 'touchend', ( e ) => this.onEnd( e ) );
    
    
    this.menu.addEventListener( 'open', ( e ) => {
      this.open( this.menu );
    } );
    this.menu.addEventListener( 'close', ( e ) => {
      this.close( this.menu );
    } );
  }
  
  addMenuEvent()
  {
    const menuButton = document.querySelector( 'div#menu-button' );
    
    menuButton.addEventListener( 'click', ( e ) => {
      if( !e.target.isEqualNode( menuButton )  ) return;
      this.open();
    } );
    this.hidder.addEventListener( 'click', () => this.close() );
  }
  
  addSignOutEvent()
  {
    const signout = document.querySelector( 'div#signout' );
    
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
  
  
  onTouch( e )
  {
    if( !e.touches ) return;
    this.startPos.x = e.touches[0].clientX;
    this.difference = 0;
    this.menu.style.transition = 'transform 0ms';
  }
  
  onMove( e )
  {
    if( !e.touches ) return;
    const rect = this.menu.getBoundingClientRect();
    this.difference = e.touches[0].clientX - this.startPos.x;
    if( this.difference - ( this.isOpen ? 0 : rect.width ) < 0 ){
      this.menu.style.transform = `translateX( ${ this.difference - ( this.isOpen ? 0 : rect.width ) }px )`;
    }else{
      this.menu.style.transform = `translateX( 0px )`;
    }
    this.hidder.style.opacity = 0.7 * ( 1 + rect.left / rect.width );
  }
  
  onEnd( e ){
    if( !e.touches ) return;
    const rect = this.menu.getBoundingClientRect();
    if( this.isOpen ){
      if( this.difference < 0 ) {
        if( this.difference < -rect.width * 0.2 ){
          this.close();
        }else{
          this.open();
        }
      }else{
        this.open();
      }
    }else{
      if( this.difference > 0 ) {
        if( this.difference > rect.width * 0.2 ){
          this.open();
        }else{
          this.close();
        }
      }else{
        this.close();
      }
      
    }
    this.menu.style.transition = '';
  }
  
  open()
  {
    this.menu.style.transform = `translateX( 0 )`;
    this.hidder.style.pointerEvents = `all`;
    this.hidder.style.opacity = `.7`;
    this.menu.dispatchEvent( new Event( 'onopen' ) );
    this.isOpen = true;
  }
  
  close()
  {
    this.menu.style.transform = ``;
    this.hidder.style.pointerEvents = ``;
    this.hidder.style.opacity = ``;
    this.menu.dispatchEvent( new Event( 'onclose' ) );
    this.isOpen = false;
  }
}