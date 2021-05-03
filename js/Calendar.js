export class Calendar
{
  constructor()
  {
    this.baseDate = new Date();
    this.selectDate = new Date( this.baseDate );
    this.currentDate = new Date( this.baseDate );
    
    this.initCalendar();
  }
  
  generateCalendar()
  {
    const calendar = document.querySelector( 'div#calendar' );
    calendar.querySelectorAll( ':scope > div' ).forEach( m => {
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
              289.878,367.055 512,144.945"></polygon>
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
  }
  
  initCalendar()
  {
    this.generateCalendar();
    this.setIndexDate();
    this.createCurrentCalendar();
    // this.setSelectDate( document.querySelector( 'div.date.today' ) );
    
    const calendar = document.querySelector( 'div#calendar' );
    calendar.scrollTo( calendar.scrollWidth * Math.floor( calendar.children.length / 2 ) / calendar.children.length, 0 );
    
    document.querySelector( 'input#date' ).addEventListener( 'change', ( e ) => {
      calendar.dispatchEvent( new Event( 'onScroll' ) );
      document.querySelectorAll( '.date' ).forEach( v => v.classList = ['date'] );
      const value = e.target.value.split( '-' ).map( v => Number( v ) );
      this.setCurrentMonth( { year: value[0], month: value[1] - 1 } );
    } );
    
    calendar.addEventListener( 'scroll', ( e ) => {
      if( calendar.scrollLeft <= 0 ){  // スクロール位置が左端なら
        e.preventDefault();
        calendar.dispatchEvent( new Event( 'onScroll' ) );
        this.setCurrentMonth( { direction: -1 } );  // 月を1つ戻す
      }else if( calendar.scrollLeft >= calendar.offsetWidth * 2 - 1 ){  // スクロール位置が右端なら
        e.preventDefault();
        calendar.dispatchEvent( new Event( 'onScroll' ) );
        this.setCurrentMonth( { direction: 1 } );  // 月を1つ進める
      }else if( calendar.scrollLeft < calendar.offsetWidth * 0.5 ){  // スクロール位置が左と中央の境目なら
        // 見かけ上でのみ年月を変更
        document.querySelector( 'input#date' ).value = ( new Date( this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1 ) ).format( 'YYYY-MM' );
      }else if( calendar.scrollLeft > calendar.offsetWidth * 1.5 ){  // スクロール位置が右と中央の境目なら
        // 見かけ上でのみ年月を変更
        document.querySelector( 'input#date' ).value = ( new Date( this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1 ) ).format( 'YYYY-MM' );
      }else{  // スクロール位置が中央（デフォルト）なら
      }
    } );
    
    calendar.addEventListener( 'onScroll', () => {
      calendar.scrollTo( calendar.offsetWidth, 0 );  // スクロール位置を中央からの位置に戻す
      document.querySelector( 'div#this-month' ).scrollTo( { top: 0, left: 0, behavior: 'smooth' } );
      document.querySelector( 'div#share-list' ).scrollTo( { top: 0, left: 0, behavior: 'smooth' } );
    } );
    
    const thisMonth = document.querySelector( 'div#this-month' );
    document.querySelector( 'div#prev-month-button' ).addEventListener( 'click', () => {
      calendar.scrollBy( { top: 0, left: -thisMonth.offsetWidth, behavior: 'smooth'  } );
      document.querySelectorAll( '.date' ).forEach( v => v.classList = ['date'] );
    } );
    document.querySelector( 'div#next-month-button' ).addEventListener( 'click', () => {
      document.querySelectorAll( '.date' ).forEach( v => v.classList = ['date'] );
      calendar.scrollBy( { top: 0, left: thisMonth.offsetWidth, behavior: 'smooth'  } );
    } );
    
    document.querySelectorAll( 'div.date' ).forEach( date => {
      date.addEventListener( 'click', () => {
        if( document.querySelector( 'div#header' ).classList.contains( 'select-mode' ) || date.classList.contains( 'not-this-month' ) ) return;
        if( date.classList.contains( 'select-date' ) ){
          document.querySelector( 'div#shift-type' ).dispatchEvent( new Event( 'open' ) );
        }else{
          this.setSelectDate( date );
          this.setPlan( getDateFromDateElement( date ) );
        }
      } );
    } );
  }

  createCurrentCalendar()
  {
    const monthNodes = document.querySelectorAll( 'div#calendar > div' );
    monthNodes.forEach( ( month, m ) => {
      const monthDate = new Date( this.currentDate );
      monthDate.setDate( 1 );
      monthDate.setMonth( this.currentDate.getMonth() + m - Math.floor( monthNodes.length / 2 ) );
      this.createMonth( month, monthDate );
    } );
  }
  
  createMonth( element, monthDate )
  {
    const creatingDate = new Date( monthDate );
    creatingDate.setDate( -creatingDate.getDay() + 1 );
    
    element.querySelectorAll( 'div.date' ).forEach( date => {
      date.innerHTML = date.innerHTML.replace( /^\d*(<div class="day">\n.<\/div>)*/, creatingDate.format( `DD<div class = 'day'>\ndd</div>` ) );
      
      if( creatingDate.format( 'YYYY/MM' ) === monthDate.format( 'YYYY/MM' ) ){
        if( creatingDate.format( 'YYYY/MM/DD' ) === this.baseDate.format( 'YYYY/MM/DD' ) ){
          date.classList.add( 'today' );
          if( creatingDate.format( 'YYYY/MM' ) === this.currentDate.format( 'YYYY/MM' ) ){
            this.setSelectDate( date );
            this.setPlan( getDateFromDateElement( date ) );
          }
        }else if( creatingDate.format( 'YYYY/MM/DD' ) === this.currentDate.format( 'YYYY/MM/DD' ) ){
          this.setSelectDate( date );
          this.setPlan( getDateFromDateElement( date ) );
        }
      }else{
        date.classList.add( 'not-this-month' );
      }
      
      const savedDate = new Date( creatingDate );
      setData.then( s => {
        s.createShiftTypeDate( savedDate, date );
      } );
      
      creatingDate.setDate( creatingDate.getDate() + 1 );
    } );
  }
  
  setSelectDate( date )
  {
    document.querySelectorAll( '.select-date' ).forEach( v => v.classList.remove( 'select-date' ) );
    
    document.querySelectorAll( '#share-list .share-date-wrapper:not( .add-member )' ).forEach( v => {
      v.querySelectorAll( '.share-date' )[[...document.querySelectorAll( '#this-month .date:not( .not-this-month )' )].indexOf( date )]?.classList.add( 'select-date' );
    } );
    
    this.selectDate = getDateFromDateElement( date );
    date.classList.add( 'select-date' );
    document.querySelector( 'div#today-view' ).innerText = this.selectDate.format( 'MM/DD(dd)' );
  }
  
  async setPlan( date )
  {
    document.querySelectorAll( '.plans' ).forEach( v => v.remove() );
    
    const planForm = document.querySelector( '#add-plan-form' );
    const dayShift = await ( await setData ).getDayShift( date );
    if( !dayShift?.hasOwnProperty( 'schedule' ) ) return;

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
        
      } ,() => {}, 300 );
      
      document.querySelector( '#plan-list' ).appendChild( planDiv );
    } );
    
  }
  
  setCurrentMonth( option = {} )
  {
    document.querySelectorAll( '.have-plan' ).forEach( v => v.remove() );
    this.currentDate.setDate( 1 );
    if( option.direction ){
      this.currentDate.setMonth( this.currentDate.getMonth() + option.direction );
    }else{
      this.currentDate.setYear( option.year ?? this.baseDate.getFullYear() );
      this.currentDate.setMonth( option.month ?? this.baseDate.getMonth() );
    }
    this.createCurrentCalendar();
    this.setIndexDate();
  }
  
  setIndexDate()
  {
    document.querySelector( 'input#date' ).value = this.currentDate.format( 'YYYY-MM' );
  }
}