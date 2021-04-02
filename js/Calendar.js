export class Calendar
{
  constructor()
  {
    this.sample = {
      '休み': {
        'color' : '#555',
      },
    };
    
    this.baseDate = new Date();
    this.currentDate = new Date( this.baseDate );
    this.generateCalendar();
    this.initCalendar();
    this.setCurrentDate();
    this.setIndexDate();
    this.initDisplayDate();
  }
  
  generateCalendar()
  {
    const calendar = document.querySelector( 'div#calendar' );
    // カレンダー部分を動的に生成する
    calendar.querySelectorAll( ':scope > div' ).forEach( ( m ) => {
      const week = document.createElement( 'div' );
      week.classList.add( 'week' );

      const date = document.createElement( 'div' );
      date.classList.add( 'date' );

      const checkBox = document.createElement( 'div' );
      checkBox.classList.add( 'check-box' );
      checkBox.innerHTML =
        `<svg x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve">
          <g>
            <polygon class="st0" points="440.469,73.413 218.357,295.525 71.531,148.709 0,220.229 146.826,367.055 218.357,438.587 
              289.878,367.055 512,144.945 	" style="fill: #FFF;"></polygon>
          </g>
        </svg>`;
      const dateShiftType = document.createElement( 'div' );
      dateShiftType.classList.add( 'dateShiftType' );
      dateShiftType.innerText = '休み';

      dateShiftType.style.background = this.sample['休み'].color;

      date.appendChild( checkBox );
      date.appendChild( dateShiftType );

      const weekFragment = new DocumentFragment();

      for( let d = 0; d < 7; d++ ){
        weekFragment.append( date.cloneNode( true ) );
      }

      week.append( weekFragment );

      const monthFragment = new DocumentFragment();
      for( let w = 0; w < 6; w++ ){
        monthFragment.append( week.cloneNode( true ) );
      }
      m.append( monthFragment );
    } );
  }
  
  initCalendar()
  {
    const calendar = document.querySelector( 'div#calendar' );
    
    //カレンダーのスクロールを捕捉
    calendar.addEventListener( 'scroll', () => {
      if( calendar.scrollLeft <= 0 ){  // スクロール位置が左端なら
        this.setCurrentMonth( { direction: -1 } );  // 月を1つ戻す
        calendar.scrollTo( calendar.scrollLeft + calendar.offsetWidth, 0 );  // スクロール位置を中央からの位置に戻す
      }else if( calendar.scrollLeft >= calendar.offsetWidth * 2 ){  // スクロール位置が右端なら
        this.setCurrentMonth( { direction: 1 } );  // 月を1つ進める
        calendar.scrollTo( calendar.scrollLeft - calendar.offsetWidth, 0 );  // スクロール位置を中央からの位置に戻す
      }else if( calendar.scrollLeft < calendar.offsetWidth * 0.5 ){  // スクロール位置が左と中央の境目なら
        // 見かけ上でのみ年月を変更
        document.querySelector( 'input#date' ).value = `${ this.currentDate.getMonth() ? this.currentDate.getFullYear() : this.currentDate.getFullYear() - 1 }-${ String( this.currentDate.getMonth() ? this.currentDate.getMonth() : 12 ).padStart( 2, 0 ) }`
      }else if( calendar.scrollLeft > calendar.offsetWidth * 1.5 ){  // スクロール位置が右と中央の境目なら
        // 見かけ上でのみ年月を変更
        document.querySelector( 'input#date' ).value = `${ this.currentDate.getMonth() === 11 ? this.currentDate.getFullYear() + 1 : this.currentDate.getFullYear() }-${ String( this.currentDate.getMonth() === 11 ? 1 : this.currentDate.getMonth() + 2 ).padStart( 2, 0 ) }`
      }else{  // スクロール位置が中央（デフォルト）なら
        // 見かけ上の年月の変更を戻す
        // document.querySelector( 'div#date' ).innerHTML = `${ this.currentDate.getFullYear() }年${ this.currentDate.getMonth() + 1 }月`
      }
    } );
    
    const thisMonth = document.querySelector( 'div#this-month' );

    // カレンダーを中央にスクロール
    calendar.scrollTo( calendar.scrollWidth * Math.floor( calendar.children.length / 2 ) / calendar.children.length, 0 );

    document.querySelector( 'input#date' ).addEventListener( 'change', ( e ) => {
      const value = e.target.value.split( '-' ).map( v => Number( v ) );
      this.setCurrentMonth( { year: value[0], month: value[1] - 1 } );
    } );

    document.querySelector( 'div#prevMonth' ).addEventListener( 'click', () => {
      calendar.scrollBy( { top: 0, left: -thisMonth.offsetWidth, behavior: 'smooth'  } );
    } );
    document.querySelector( 'div#nextMonth' ).addEventListener( 'click', () => {
      calendar.scrollBy( { top: 0, left: thisMonth.offsetWidth, behavior: 'smooth'  } );
    } );
  }
  
  initDisplayDate()
  {
    const monthNode = document.querySelectorAll( 'div#calendar > div' );
    monthNode.forEach( ( monthElement, m ) => {
      const tempDate = new Date( this.currentDate );
      m -= Math.floor( monthNode.length / 2 );
      tempDate.setMonth( this.currentDate.getMonth() + m );
      this.createMonth( monthElement, tempDate );
    } );
  }
  
  optimizeDate( dateClass )
  {
    dateClass.setDate( 1 );
    dateClass.setDate( -dateClass.getDay() + 1 );
  }
  
  loopMonth( monthElement, func )
  {
    monthElement.querySelectorAll( '.week' ).forEach( ( week, w ) => {
      week.querySelectorAll( '.date' ).forEach( ( date, d ) => func( { 'week': week, 'w': w, 'date': date, 'd': d } ) );
    } );
  }
  
  createMonth( element, creatingDate )
  {
    this.optimizeDate( creatingDate );
    this.loopMonth( element, ( data ) => 
    {
      data.date.innerHTML = data.date.innerHTML.replace( /\d*/, creatingDate.getDate() );
      
       // addEventListener内だとcreatingDateの値がおかしくなるので、ここでその時のループの値を保存しておく。
      const savedDate = new Date( creatingDate );
      
      data.date.addEventListener( 'click', () => {
        document.querySelectorAll( '.select-date' ).forEach( ( e ) => e.classList.remove( 'select-date' ) );
        data.date.classList.add( 'select-date' );
        this.setCurrentDate( savedDate );
      } );
      
      if( this.baseDate.format( 'YYYY/MM/DD' ) === creatingDate.format( 'YYYY/MM/DD' ) ){
        document.querySelectorAll( '.select-date' ).forEach( ( e ) => e.classList.remove( 'select-date' ) );
        data.date.classList.add( 'today' );
        data.date.classList.add( 'select-date' );
      }else if( data.date.classList.contains( 'today' ) ){
        data.date.classList.remove( 'today' );
      }
      creatingDate.setDate( creatingDate.getDate() + 1 );
    } );
  }
  
  setCurrentMonth( yearAndMonth )
  {
    if( yearAndMonth.direction ){
      this.currentDate.setMonth( this.currentDate.getMonth() + yearAndMonth.direction );
    }else{
      this.currentDate.setYear( yearAndMonth.year || this.baseDate.getFullYear() );
      this.currentDate.setMonth( yearAndMonth.month );
    }
    this.setCurrentDate( this.currentDate );
    this.initDisplayDate();
  }
  
  setCurrentDate( date = this.baseDate )
  {
    document.querySelector( 'div#today-view' ).innerText = date.format( 'MM/DD(d)' );
  }
  
  setIndexDate()
  {
    document.querySelector( 'input#date' ).value = `${ this.currentDate.getFullYear() }-${ String( this.currentDate.getMonth() + 1 ).padStart( 2, 0 ) }`;
  }
}