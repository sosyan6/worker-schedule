export class MenuMove
{
  constructor( element )
  {
    this.startPos = {};  
    this.element = element;
    this.difference = 0;
    
    this.menuHandle = this.element.querySelector( '.menu-handle' );
    
    this.menuHandle.addEventListener( 'touchstart', ( e ) => this.onTouch( e ) );
    this.menuHandle.addEventListener( 'touchmove', ( e ) => this.onMove( e ) );
    this.menuHandle.addEventListener( 'touchend', ( e ) => this.onEnd( e ) );
  }
  
  onTouch( e )
  {
    if( !e.touches ) return;
    this.startPos.y = e.touches[0].clientY;
  }
  
  onMove( e )
  {
    if( !e.touches ) return;
    this.difference = e.touches[0].clientY - this.startPos.y;
    if( this.difference > 0 ){
      this.element.style.transform = `translateY( ${ this.difference }px )`;
    }else{
      this.element.style.transform = `translateY( ${ this.difference / 10 }px )`;
    }
  }
  
  onEnd( e ){
    if( !e.touches ) return;
    const rect = this.element.getBoundingClientRect();
    if( this.difference > 0 ) {
      if( this.difference > rect.height * 0.3 ){
        this.element.style.transform = ``;
        document.querySelector( 'div#settings' ).classList.remove( 'clicked' );
      }else{
        this.element.style.transform = `translateY( 0 )`;
      }
    }else{
      this.element.style.transform = `translateY( 0 )`;
    }
  }
}