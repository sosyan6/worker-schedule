export class SelectMode
{ // 選択モード用class
  constructor()
  {
    calendar.then( () => {
      this.classList = document.querySelector( 'div#header' ).classList;
      this.isSelectMode = false; // 選択モード
      this.onMove = this.onMove.bind( this ); // ゴミjsのthis参照を解決するためにthisをbindした関数を作る
      this.onMouse = this.onMouse.bind( this ); // ゴミjsのthis参照を解決するためにthisをbindした関数を作る
      this.onClick = this.onClick.bind( this ); // ゴミjsのthis参照を解決するためにthisをbindした関数を作る
      this.onTouch = this.onTouch.bind( this ); // ゴミjsのthis参照を解決するためにthisをbindした関数を作る
      // コメント飽きた
      this.thisMonthDates = document.querySelectorAll( 'div#this-month div.date:not( .not-this-month )' );
      this.thisMonthDates.forEach( date => {
        $( date ).longpress( () => {  // ここでコメントが途絶えている・・・
          if( this.isSelectMode || !document.querySelector( 'div#content-wrapper.month' ) ) return;
          this.lastNode = date;
          this.maxNode = date;
          this.select( date );
          date.querySelector( 'div.check-box' ).classList.add( 'isselected' );
        }, () => {}, 300 );
      } );
      document.addEventListener( 'keydown', ( e ) => this.shortcut( e ) );
    } );
  }

  set isSelectMode( bool )
  {
    if( bool ){
      this.classList.add( 'select-mode' );
    }else{
      this.classList.remove( 'select-mode' );
    }
  }

  get isSelectMode()
  {
    return this.classList.contains( 'select-mode' );
  }

  select()
  {
    this.isSelectMode = true;
    document.querySelector( 'div#calendar' ).style.overflow = 'hidden';
    document.querySelector( 'div#header' ).style.backgroundColor = '#4285f4';
    document.querySelector( 'div#menu-header' ).style.backgroundColor = '#4285f4';
    document.querySelector( 'meta[name="theme-color"]' ).content = '#4285f4';
    document.querySelector( 'div#header' ).style.color = '#FFF';
    document.querySelector( 'div#menu-header' ).style.color = '#FFF';
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

    document.querySelector( 'div#this-month' ).querySelectorAll( 'div.date' ).forEach( d => {
      const c = d.querySelector( 'div.check-box' );
      c.style.opacity = 1;
      d.addEventListener( 'touchstart', this.onTouch );
      d.addEventListener( 'mousedown', this.onMouse );
    } );

    document.querySelector( 'div#settings' ).addEventListener( 'click', this.onClick );
    document.querySelector( 'div#settings' ).classList.add( 'cancel' );
    document.querySelector( 'div#settings > .drawer-menu' ).dispatchEvent( new Event( 'open' ) );

    document.addEventListener( 'touchmove', this.onMove );
  }

  cancel()
  {
    document.querySelector( 'div#calendar' ).style.overflow = '';
    document.querySelector( 'div#menu-header' ).style.backgroundColor = '';
    document.querySelector( 'div#header' ).style.backgroundColor = '';
    document.querySelector( 'div#menu-header' ).style.color = '';
    document.querySelector( 'meta[name="theme-color"]' ).content = '';
    document.querySelector( 'div#header' ).style.color = '';
    document.querySelector( 'input#date' ).style.color = '';
    document.querySelector( 'div#select' ).style.opacity = '';
    document.querySelector( 'input#date' ).style.opacity = '';
    document.querySelectorAll( 'div#header > div > svg' ).forEach( b => b.style.fill = '' );
    document.querySelectorAll( 'div#header [id$=Month]' ).forEach( b => {
      b.style.opacity = '';
      b.style.pointerEvents = '';
    } );

    document.querySelector( 'div#this-month' ).querySelectorAll( 'div.date' ).forEach( d => {
      const c = d.querySelector( 'div.check-box' );
      c.style.opacity = 0;
      c.classList.remove( 'isselected' );
      d.removeEventListener( 'touchstart', this.onTouch );
      d.removeEventListener( 'mousedown', this.onMouse );
    } );
    document.removeEventListener( 'touchmove', this.onMove );

    this.isSelectMode = false;

    document.querySelector( 'div#settings' ).removeEventListener( 'click', this.onClick );
    document.querySelector( 'div#settings' ).classList.remove( 'cancel' );
    document.querySelector( 'div#settings > .drawer-menu' ).dispatchEvent( new Event( 'close' ) );
  }
  
  onMouse( e )
  {
    if( navigator.userAgent.match( /iPad|iPhone|Android.+Mobile/ ) ) return;
    this.onTouch( e );
  }

  onTouch( e )
  {
    if( e.target.classList.contains( 'not-this-month' ) ) return;
    if( keyboard.ShiftLeft || keyboard.ShiftRight ){
      const dates = [...this.thisMonthDates];
      dates.slice( ...[dates.indexOf( this.lastNode ), dates.indexOf( e.target )].sort( ( a, b ) => a - b ).map( ( v, i ) => v + i ) ).forEach( ( d ) => {
        if( this.lastNode.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
          d.querySelector( 'div.check-box' ).classList.add( 'isselected' );
        }else{
          d.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
        }
      } );
      if( !this.maxNode.isEqualNode( this.lastNode ) ){
        dates.slice( ...[dates.indexOf( this.maxNode ), dates.indexOf( e.target )].sort( ( a, b ) => a - b ).map( ( v, i ) => v + i ) ).forEach( ( d ) => {
          if( dates.indexOf( e.target ) > dates.indexOf( this.lastNode ) && dates.indexOf( e.target ) < dates.indexOf( this.maxNode ) ||
              dates.indexOf( e.target ) < dates.indexOf( this.lastNode ) && dates.indexOf( e.target ) > dates.indexOf( this.maxNode ) ){
            if( this.lastNode.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
              d.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
            }else{
              d.querySelector( 'div.check-box' ).classList.add( 'isselected' );
            }
          }
          if( dates.indexOf( this.lastNode ) >= dates.indexOf( e.target ) && dates.indexOf( this.lastNode ) < dates.indexOf( this.maxNode ) ||
              dates.indexOf( this.lastNode ) <= dates.indexOf( e.target ) && dates.indexOf( this.lastNode ) > dates.indexOf( this.maxNode ) ){
            if( dates.indexOf( d ) > dates.indexOf( this.lastNode ) && dates.indexOf( d ) < dates.indexOf( this.maxNode ) + 1 ||
                dates.indexOf( d ) < dates.indexOf( this.lastNode ) && dates.indexOf( d ) > dates.indexOf( this.maxNode ) - 1 ){
              if( this.lastNode.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
                d.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
              }else{
                d.querySelector( 'div.check-box' ).classList.add( 'isselected' );
              }
            }
          }
        } );
      }
    }else{
      e.target.querySelector( 'div.check-box' ).classList.toggle( 'isselected' );
      this.lastNode = e.target;
    }
    this.maxNode = e.target;
  }

  onMove( e )
  {
    if( !this.isSelectMode || !e.target.querySelector( 'div.check-box' ) ) return;
    document.querySelectorAll( 'div.date' ).forEach( d => {
      const rect = d.getBoundingClientRect();
      const { clientX, clientY } = e.touches ? e.touches[0] : e;
      if( clientX > rect.x &&
          clientX < rect.x + rect.width &&
          clientY > rect.y &&
          clientY < rect.y + rect.height )
      {
        if( d.classList.contains( 'not-this-month' ) ) return;
        const dates = [...this.thisMonthDates];
        dates.slice( ...[dates.indexOf( e.target ), dates.indexOf( d )].sort( ( a, b ) => a - b ).map( ( v, i ) => v + i ) ).forEach( ( d ) => {
          if( e.target.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
            d.querySelector( 'div.check-box' ).classList.add( 'isselected' );
          }else{
            d.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
          }
        } );
        if( !this.maxNode.isEqualNode( e.target ) ){
          dates.slice( ...[dates.indexOf( this.maxNode ), dates.indexOf( d )].sort( ( a, b ) => a - b ).map( ( v, i ) => v + i ) ).forEach( ( q ) => {
            if( dates.indexOf( d ) > dates.indexOf( e.target ) && dates.indexOf( d ) < dates.indexOf( this.maxNode ) ||
                dates.indexOf( d ) < dates.indexOf( e.target ) && dates.indexOf( d ) > dates.indexOf( this.maxNode ) ){
              if( e.target.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
                q.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
              }else{
                q.querySelector( 'div.check-box' ).classList.add( 'isselected' );
              }
            }
            if( dates.indexOf( e.target ) >= dates.indexOf( d ) && dates.indexOf( e.target ) < dates.indexOf( this.maxNode ) ||
                dates.indexOf( e.target ) <= dates.indexOf( d ) && dates.indexOf( e.target ) > dates.indexOf( this.maxNode ) ){
              if( dates.indexOf( q ) > dates.indexOf( e.target ) && dates.indexOf( q ) < dates.indexOf( this.maxNode ) + 1 ||
                  dates.indexOf( q ) < dates.indexOf( e.target ) && dates.indexOf( q ) > dates.indexOf( this.maxNode ) - 1 ){
                if( e.target.querySelector( 'div.check-box' ).classList.contains( 'isselected' ) ){
                  q.querySelector( 'div.check-box' ).classList.remove( 'isselected' );
                }else{
                  q.querySelector( 'div.check-box' ).classList.add( 'isselected' );
                }
              }
            }
          } );
        }
        this.maxNode = d;
      }
    } );
  }

  onClick( e )
  {
    if( !e.target.isEqualNode( document.querySelector( 'div#settings' ) ) ) return;
    this.cancel();
  }
  
  shortcut( e )
  {
    console.log( e );
    if( e.code === 'Escape' ) this.cancel();
    if( document.querySelector( 'div#content-wrapper.month' ) && e.code === 'KeyA' && e.ctrlKey ){
      if( !this.isSelectMode ){
        this.select();
      }
      this.thisMonthDates.forEach( v => {
        v.querySelector( 'div.check-box' ).classList.add( 'isselected' )
      } );
    }
  }
}
