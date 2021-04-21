export class SelectMode  // 選択モード用class
{
  constructor()
  {
    calendar.then( () => {
      this.classList = document.querySelector( 'div#settings' ).classList;
      this.isSelectMode = false;  // 選択モード
      this.onMoveBind = this.onMove.bind( this );  // ゴミjsのthis参照を解決するためにthisをbindした関数を作る
      this.onClickBind = this.onClick.bind( this );  // ゴミjsのthis参照を解決するためにthisをbindした関数を作る
      // コメント飽きた
      document.querySelectorAll( 'div#this-month div.date' ).forEach( ( date ) => {
        $( date ).longpress( () => {  // ここでコメントが途絶えている・・・
          if( !this.isSelectMode ){
            this.isSelectMode = true;
            this.select( date );
          }
        }, () => {}, 300 );
      } );
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

    document.querySelector( 'div#settings' ).addEventListener( 'click', this.onClickBind );
    document.querySelector( 'div#settings' ).classList.add( 'cancel' );
    document.querySelector( 'div#settings > .drawer-menu' ).dispatchEvent( new Event( 'open' ) );

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
    
    document.querySelector( 'div#settings' ).removeEventListener( 'click', this.onClickBind );
    document.querySelector( 'div#settings' ).classList.remove( 'cancel' );
    document.querySelector( 'div#settings > .drawer-menu' ).dispatchEvent( new Event( 'close' ) );
  }
  
  onTouch( e )
  {
    if( e.target.classList.contains( 'not-this-month' ) ) return;
    e.target.querySelector( 'div.check-box' ).classList.toggle( 'isselected' );
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
        if( d.classList.contains( 'not-this-month' ) ) return;
        if( e.target.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
          d.querySelector( 'div.check-box' ).classList.add( 'isselected' );
        }else{
          d.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
        }
      }
    } );
  }
  
  onClick( e )
  {
    if( !e.target.isEqualNode( document.querySelector( 'div#settings' ) )  ) return;
    this.cancel();
  }
}