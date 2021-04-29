export class Calendar
{
  constructor()
  {
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
    calendar.querySelectorAll( ':scope > div' ).forEach( async ( m ) => {
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
      
      date.appendChild( checkBox );

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
    
    document.querySelectorAll( '.date' ).forEach( date => {
      date.addEventListener( 'click', () => {
        if( document.querySelector( 'div#header' ).classList.contains( 'select-mode' ) || date.classList.contains( 'not-this-month' ) ) return;
        if( date.classList.contains( 'select-date' ) ){
          document.querySelector( 'div#shift-type' ).dispatchEvent( new Event( 'open' ) );
        }else{
          this.setSelectDate( getDateFromDateElement( date ), date );
          this.currentDate = getDateFromDateElement( date );
        }
      } );
    } );
  }
  
  initCalendar()
  {
    const calendar = document.querySelector( 'div#calendar' );
    
    //カレンダーのスクロールを捕捉
    calendar.addEventListener( 'scroll', () => {
      if( calendar.scrollLeft <= 0 ){  // スクロール位置が左端なら
        calendar.dispatchEvent( new Event( 'onScroll' ) );
        document.querySelectorAll( '.date' ).forEach( e => e.removeAttribute( 'style' ) );
        this.setCurrentMonth( { direction: -1 } );  // 月を1つ戻す
        calendar.scrollTo( calendar.scrollLeft + calendar.offsetWidth, 0 );  // スクロール位置を中央からの位置に戻す
        document.querySelector( 'div#this-month' ).scrollTo( { top: 0, left: 0, behavior: 'smooth' } );
        document.querySelector( 'div#share-list' ).scrollTo( { top: 0, left: 0, behavior: 'smooth' } );
      }else if( calendar.scrollLeft >= calendar.offsetWidth * 2 - 1 ){  // スクロール位置が右端なら
        calendar.dispatchEvent( new Event( 'onScroll' ) );
        document.querySelectorAll( '.date' ).forEach( e => e.removeAttribute( 'style' ) );
        this.setCurrentMonth( { direction: 1 } );  // 月を1つ進める
        calendar.scrollTo( calendar.scrollLeft - calendar.offsetWidth, 0 );  // スクロール位置を中央からの位置に戻す
        document.querySelector( 'div#this-month' ).scrollTo( { top: 0, left: 0, behavior: 'smooth' } );
        document.querySelector( 'div#share-list' ).scrollTo( { top: 0, left: 0, behavior: 'smooth' } );
      }else if( calendar.scrollLeft < calendar.offsetWidth * 0.5 ){  // スクロール位置が左と中央の境目なら
        // 見かけ上でのみ年月を変更
        document.querySelector( 'input#date' ).value = ( new Date( this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1 ) ).format( 'YYYY-MM' );
      }else if( calendar.scrollLeft > calendar.offsetWidth * 1.5 ){  // スクロール位置が右と中央の境目なら
        // 見かけ上でのみ年月を変更
        document.querySelector( 'input#date' ).value = ( new Date( this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1 ) ).format( 'YYYY-MM' );
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

    const shareList = document.querySelector( 'div#share-list' );
    
    document.querySelector( 'div#prev-month-button' ).addEventListener( 'click', function(){
      document.querySelectorAll( '.date' ).forEach( e => e.style.background = 'var( --inactive-bg-color )' );
      document.querySelectorAll( '.not-this-month' ).forEach( e => e.style.opacity = '1' );
      calendar.scrollBy( { top: 0, left: -thisMonth.offsetWidth, behavior: 'smooth'  } );
    } );
    document.querySelector( 'div#next-month-button' ).addEventListener( 'click', function(){
      document.querySelectorAll( '.date' ).forEach( e => e.style.background = 'var( --inactive-bg-color )' );
      document.querySelectorAll( '.not-this-month' ).forEach( e => e.style.opacity = '1' );
      calendar.scrollBy( { top: 0, left: thisMonth.offsetWidth, behavior: 'smooth'  } );
    } );
  }
  
  initDisplayDate()
  {
    const monthNode = document.querySelectorAll( 'div#calendar > div' );
    monthNode.forEach( async( monthElement, m ) => {
      const tempDate = new Date( this.currentDate );
      m -= Math.floor( monthNode.length / 2 );
      tempDate.setMonth( this.currentDate.getMonth() + m );
      this.optimizeDate( tempDate );
      this.createMonth( monthElement, new Date( tempDate ) );
      // (await setData).setShiftTypeDate( monthElement, new Date( tempDate ) );
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
      week.querySelectorAll( '.date' ).forEach( ( date, d ) => func( { 'month': monthElement, 'week': week, 'w': w, 'date': date, 'd': d } ) );
    } );
  }
  
  createMonth( element, creatingDate )
  {
    this.loopMonth( element, ( data ) => 
    {
      data.date.innerHTML = data.date.innerHTML.replace( /^\d*(<div class="day">\n.<\/div>)*/, creatingDate.format( `DD<div class = 'day'>\ndd</div>` ) );
      
       // addEventListener内だとcreatingDateの値がおかしくなるので、ここでその時のループの値を保存しておく。
      const savedDate = new Date( creatingDate );
      
      // console.log( data.date );
      if( this.baseDate.format( 'YYYY/MM/DD' ) === creatingDate.format( 'YYYY/MM/DD' ) && !data.date.classList.contains( 'not-this-month' ) ){
        if( data.month.id === 'this-month'  ){
          this.setSelectDate( savedDate, data.date );
        }
        data.date.classList.add( 'today' );
      }else{
        if( data.month.id === 'this-month' && creatingDate.format( 'YYYY/MM/DD' ) === `${ this.currentDate.format( 'YYYY/MM/' ) }01` ){
          this.setSelectDate( savedDate, data.date );
        }
        if( data.date.classList.contains( 'today' ) ){
          data.date.classList.remove( 'today' );
        }
      }
      
      if( this.currentDate.format( 'YYYY/MM' ) === creatingDate.format( 'YYYY/MM' ) ){
        data.date.classList.remove( 'not-this-month' );
      }else{
        data.date.classList.add( 'not-this-month' );
      }
      
      setData.then( s => {
        s.createShiftTypeDate( savedDate, data.date );
      } );
      
      creatingDate.setDate( creatingDate.getDate() + 1 );
    } );
  }
  async setSelectDate( date, element )
  {
    document.querySelectorAll( '.select-date' ).forEach( ( q ) => q.classList.remove( 'select-date' ) );
    element.classList.add( 'select-date' );
    this.setCurrentDate( date );
    console.log( date );
    this.setPlan( date );
  }
  
  async setPlan( date )
  {
    document.querySelectorAll( '.plans' ).forEach( e => e.remove() );
    
    const planForm = document.querySelector( '#add-plan-form' );
    const dayShift = ( await setData ).getDayShift( date );
    if( !dayShift || !dayShift.hasOwnProperty( 'schedule' ) ) return;

    dayShift.schedule.forEach( ( v, count ) =>
    {  
      const planDiv = document.createElement( 'div' );
      const memoDiv = document.createElement( 'div' );
      memoDiv.textContent = v.scheduleMemo;
      planDiv.classList.add( 'plans' );
      planDiv.appendChild( memoDiv );
      planDiv.setAttribute( 'count', count );
      
      $( planDiv ).longpress( () => {
        planDiv.classList.add( 'current-edit' );
        document.querySelector( '#add-plan-drawer' ).dispatchEvent( new Event( 'open' ) );
        planForm.querySelectorAll( 'div > *' ).forEach( e => {
          if( e.name ) e.value = v[e.name];
        } );
        
        planForm.querySelector( '.submit-button' ).style.display = 'none';
        planForm.querySelector( '.edit-button' ).style.display = 'flex';
        
      } , () => {}, 300 );
      
      document.querySelector( '#plan-list' ).appendChild( planDiv );
    } );
    
  }
  
  setCurrentMonth( option = {} )
  {
    document.querySelectorAll( '.have-plan' ).forEach( e => e.remove() );
    // console.log( this.currentDate );
    if( option.direction ){
      this.currentDate.setMonth( this.currentDate.getMonth() + option.direction );
    }else{
      this.currentDate.setYear( option.year || this.baseDate.getFullYear() );
      this.currentDate.setMonth( option.month  || this.baseDate.getMonth() );
      // console.log( this.baseDate );
    }
    this.setCurrentDate( this.currentDate );
    this.initDisplayDate();
    this.setIndexDate();
  }
  
  setCurrentDate( date = this.baseDate )
  {
    document.querySelector( 'div#today-view' ).innerText = date.format( 'MM/DD(dd)' );
  }
  
  setIndexDate()
  {
    document.querySelector( 'input#date' ).value = this.currentDate.format( 'YYYY-MM' );
  }
  
}