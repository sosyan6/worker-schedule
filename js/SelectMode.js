export class SelectMode  // 選択モード用class
{
  constructor()
  {
    this.classList = document.querySelector( 'div#settings' ).classList
    this.isSelectMode = false;  // 選択モード
    this.onMoveBind = this.onMove.bind( this );  // ゴミjsのthis参照を解決するためにthisをbindした関数を作る
    // コメント飽きた
    document.querySelectorAll( 'div#this-month div.date' ).forEach( ( date ) => {
      $( date ).longpress( () => {  // ここでコメントが途絶えている・・・
        if( !this.isSelectMode ){
          this.isSelectMode = true;
          this.select( date );
        }
      }, () => {}, 300 );
    } );
  }
  
  set isSelectMode( bool )
  {
    if( bool ){
      this.classList.add( 'clicked' );
    }else{
      this.classList.remove( 'clicked' );
    }
  }
  
  get isSelectMode()
  {
    return this.classList.contains( 'clicked' );
  }
  
  select( date )
  {
    document.querySelector( 'div#calendar' ).style.overflow = 'hidden';
    document.querySelector( 'div#header' ).style.backgroundColor = '#06F';
    document.querySelector( 'div#menu-header' ).style.backgroundColor = '#06F';
    document.querySelector( 'div#header' ).style.color = '#FFF';
    document.querySelector( 'input#date' ).style.color = '#FFF';
    document.querySelectorAll( 'div#header > div > svg' ).forEach( b => b.style.fill = '#FFF' );
    document.querySelectorAll( 'div#header [id$=Month]' ).forEach( b => {
      b.style.opacity = '0';
      b.style.pointerEvents = 'none';
    } );
    
    setTimeout( () => {
      document.querySelector( 'div#select' ).style.opacity = 0;
      document.querySelector( 'input#date' ).style.opacity = 1;
    }, 2000 );
    document.querySelector( 'div#select' ).style.opacity = 1;
    document.querySelector( 'input#date' ).style.opacity = 0;
    
    document.querySelector( 'div#this-month' ).querySelectorAll( 'div.date' ).forEach( ( d ) => {
      const c = d.querySelector( 'div.check-box' );
      c.style.opacity = 1;
      d.addEventListener( 'touchstart', this.onTouch );
    } );
    date.querySelector( 'div.check-box' ).classList.add( 'isselected' );

    document.querySelector( 'div#settings' ).addEventListener( 'click', () => this.cancel(), { once: true } );
    document.querySelector( 'div#settings' ).classList.add( 'cancel' );

    document.addEventListener( 'touchmove', this.onMoveBind );
    document.addEventListener( 'mousemove', this.onMoveBind );
  }

  cancel()
  {
    document.querySelector( 'div#calendar' ).style.overflow = '';
    document.querySelector( 'div#menu-header' ).style.backgroundColor = '';
    document.querySelector( 'div#header' ).style.backgroundColor = '';
    document.querySelector( 'div#header' ).style.color = '';
    document.querySelector( 'input#date' ).style.color = '';
    document.querySelector( 'div#select' ).style.opacity = '';
    document.querySelector( 'input#date' ).style.opacity = '';
    document.querySelectorAll( 'div#header > div > svg' ).forEach( b => b.style.fill = '' );
    document.querySelectorAll( 'div#header [id$=Month]' ).forEach( b => {
      b.style.opacity = '';
      b.style.pointerEvents = '';
    } );

    document.querySelector( 'div#this-month' ).querySelectorAll( 'div.date' ).forEach( ( d ) => {
      const c = d.querySelector( 'div.check-box' );
      c.style.opacity = 0;
      c.classList.remove( 'isselected' );
      d.removeEventListener( 'touchstart', this.onTouch );
    } );
    document.removeEventListener( 'touchmove', this.onMoveBind );
    document.removeEventListener( 'mousemove', this.onMoveBind );
    
    this.isSelectMode = false;
    document.querySelector( 'div#settings' ).classList.remove( 'cancel' );
  }
  
  onTouch( e )
  {
    const c = e.target.querySelector( 'div.check-box' );
    if( c.classList.contains( 'isselected' ) ){
      c.classList.remove( 'isselected' );
    }else{
      c.classList.add( 'isselected' );
    }
  }
  
  onMove( e )
  {
    if( !this.isSelectMode || !e.touches || !e.target.querySelector( 'div.check-box' ) ) return;
    document.querySelectorAll( 'div.date' ).forEach( ( d ) => {
      const rect = d.getBoundingClientRect();
      const { clientX, clientY } = e.touches[0];
      if( clientX > rect.x &&
          clientX < rect.x + rect.width &&
          clientY > rect.y &&
          clientY < rect.y + rect.height ){
        if( e.target.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
          d.querySelector( 'div.check-box' ).classList.add( 'isselected' );
        }else{
          d.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
        }
      }
    } );
  }
}