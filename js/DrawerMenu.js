export class DrawerMenu
{
  constructor( element )
  {
    this.startPos = {};
    this.difference = 0;
    
    document.querySelectorAll( '.drawer-menu' ).forEach( drawer => {
      const handle = document.createElement( 'div' );
      handle.className = 'menu-handle';
      const closeButton = document.createElement( 'div' );
      closeButton.className = 'close-button';
      
      handle.appendChild( closeButton );
      drawer.appendChild( handle );
      
      handle.querySelector( '.close-button' ).addEventListener( 'click', () => this.close( drawer ) );
      handle.addEventListener( 'touchstart', ( e ) => this.onTouch( e, drawer ) );
      handle.addEventListener( 'touchmove', ( e ) => this.onMove( e, drawer ) );
      handle.addEventListener( 'touchend', ( e ) => this.onEnd( e, drawer ) );
      
      drawer.addEventListener( 'open', ( e ) => {
        this.open( drawer );
      } );
      drawer.addEventListener( 'close', ( e ) => {
        this.close( drawer );
      } );
    } );
  }
  
  onTouch( e, drawer )
  {
    if( !e.touches || e.target.isEqualNode( drawer.querySelector( '.menu-handle > .close-button' ) )  ) return;
    this.difference = 0;
    this.startPos.y = e.touches[0].clientY;
    drawer.style.transition = 'transform 0ms';
  }
  
  onMove( e, drawer )
  {
    if( !e.touches || e.target.isEqualNode( drawer.querySelector( '.menu-handle > .close-button' ) )  ) return;
    this.difference = e.touches[0].clientY - this.startPos.y;
    if( this.difference > 0 ){
      drawer.style.transform = `translateY( ${ this.difference }px )`;
    }else{
      drawer.style.transform = `translateY( ${ this.difference / 10 }px )`;
    }
  }
  
  onEnd( e, drawer ){
    if( !e.touches || e.target.isEqualNode( drawer.querySelector( '.menu-handle > .close-button' ) ) ) return;
    const rect = drawer.getBoundingClientRect();
    if( this.difference > 0 ) {
      if( this.difference > 70 ){
        this.close( drawer );
      }else{
        this.open( drawer );
      }
    }else{
      this.open( drawer );
    }
    drawer.style.transition = '';
  }
  
  open( drawer )
  {
    drawer.style.transform = `translateY( 0 )`;
    drawer.dispatchEvent( new Event( 'onopen' ) )
  }
  
  close( drawer )
  {
    drawer.style.transform = ``;
    drawer.dispatchEvent( new Event( 'onclose' ) )
  }
}