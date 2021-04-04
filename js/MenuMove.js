export class MenuMove
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
      
      handle.querySelector( '.close-button' ).addEventListener( 'click', () => drawer.style.transform = `` );
      handle.addEventListener( 'touchstart', ( e ) => this.onTouch( e, drawer ) );
      handle.addEventListener( 'touchmove', ( e ) => this.onMove( e, drawer ) );
      handle.addEventListener( 'touchend', ( e ) => this.onEnd( e, drawer ) );
    } );
    
  }
  
  onTouch( e, drawer )
  {
    if( !e.touches || e.target.isEqualNode( drawer.querySelector( '.menu-handle > .close-button' ) )  ) return;
    this.startPos.y = e.touches[0].clientY;
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
      if( this.difference > rect.height * 0.3 ){
        drawer.style.transform = ``;
      }else{
        drawer.style.transform = `translateY( 0 )`;
      }
    }else{
      drawer.style.transform = `translateY( 0 )`;
    }
  }
}