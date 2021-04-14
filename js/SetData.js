export class SetData {
  
  /**
   *　set〇〇();      // ショートカット関数
   *　create〇〇();   // 値を返す
   */
  
  
  constructor()
  {
    this.waitSetData().then( async() => {
      this.setShiftTypeSelect();
      console.log( await calendar );
      document.querySelector( '#icon-preview' ).appendChild( this.createIconElement( elementsToDict( document.querySelectorAll( '#shift-type-config > .input-form > div > *' ) ) ) );
    } );
  }
  
  loopMonth( monthElement, func )
  {
    console.log( monthElement );
    monthElement.querySelectorAll( '.week' ).forEach( ( week, w ) => {
      week.querySelectorAll( '.date' ).forEach( ( date, d ) => func( { 'week': week, 'w': w, 'date': date, 'd': d } ) );
    });
  }
  
  get isSelectMode()
  {
    return document.querySelector( 'div#settings' ).classList.contains( 'clicked' );
  }
  
  deleteShiftTypeDate()
  {
    const del = async selectDay => 
    {
      const currentMonth = new Date( (await calendar).currentDate );
      currentMonth.setDate( selectDay.innerText.match( /\d*/ )[0] );
      
      this.schedule[currentMonth.format('YYYY/MM')][selectDay.innerText.match( /\d*/ )[0]] = '';
      selectDay.querySelector( '.date-shift-type' )?.remove();
    };
    
    const save = async () => (await streamData).saveData();
    
    if( this.isSelectMode ) [...document.querySelectorAll( '.isselected' )].map( v => { v.classList.remove( 'isselected' ); return v.parentNode } ).forEach( del );
    else{
      del( document.querySelector( '.select-date' ) );
      this.nextFocus();
    }
    save();
  }
  
  nextFocus()
  {
    const next = document.querySelector( '.select-date + .date' );

    if( next && !next.classList.contains( 'not-this-month' ) ){
      next.dispatchEvent( new Event( 'click' ) );
    } 
    else
    {
      const nextWeek = [...document.querySelectorAll( '#this-month > .week' )].next( document.querySelector( '.select-date' ).parentNode );
      if( nextWeek ){
        const next = [...nextWeek.querySelectorAll( '.date' )][0];
        if( !next.classList.contains( 'not-this-month' ) ) next.dispatchEvent( new Event( 'click' ) );
      }
    }
  }
  
  settingDateShiftType()
  {
    document.querySelectorAll( '#shift-type-select > .shift-type:not(.not-disappear-button)' ).forEach( e => {
      
      const setDateIcon = async ( selectDay ) => {
        
        const currentMonth = new Date( (await calendar).currentDate );
        currentMonth.setDate( selectDay.innerText.match( /\d*/ )[0] );
        
        if( !this.schedule.hasOwnProperty( currentMonth.format( 'YYYY/MM' ) ) ) this.schedule[currentMonth.format('YYYY/MM')] = {};
        
        this.schedule[currentMonth.format('YYYY/MM')][selectDay.innerText.match( /\d*/ )[0]] = e.getAttribute('name');
        this.createShiftTypeDate( currentMonth, selectDay ); 
      }
      
      e.addEventListener( 'click' , async () => 
      {
        if( this.isSelectMode ) [...document.querySelectorAll( '.isselected' )].map( v => { v.classList.remove( 'isselected' ); return v.parentNode } ).forEach( setDateIcon );
        else if( document.querySelector( '.select-date' ) )
        {
          setDateIcon( document.querySelector( '.select-date' ) );
          this.nextFocus();
        }
        
        (await streamData).saveData();
      } );
    } );
  }
  
  // waitSetData()
  // {
  //   return new Promise( async resolve => {
  //     this.shiftType = ( await ( await streamData ).ownData ).data.shiftType;
  //     this.schedule = ( await ( await streamData ).ownData ).data.shift;
  //     resolve();
  //   } );
  // }
  
  async waitSetData()
  {
    this.shiftType = ( await ( await streamData ).ownData ).data.shiftType;
    this.schedule = ( await ( await streamData ).ownData ).data.shift;
    return this;
  }
  
  setShiftTypeSelect()
  {
    const shiftTypeSelect = document.querySelector( '#shift-type-select' );
    const shiftKeys = Object.keys( this.shiftType );
    
    shiftTypeSelect.querySelectorAll( '.shift-type:not(.not-disappear-button)' ).forEach( e => e.remove() );
    
    for( let i = len( this.shiftType ) - 1; i >= 0 ; i-- ){
      const icon = this.createIconElement( this.shiftType[shiftKeys[i]], shiftKeys[i] );
      shiftTypeSelect.insertAdjacentElement( 'afterbegin', icon.cloneNode( true ) );
    } 
    this.settingDateShiftType();
  }
  
  createShiftTypeDate( date, dateElement )
  {
    this.waitSetData().then( d => {
      dateElement.querySelector( '.date-shift-type' )?.remove();
      const schedule = d.schedule;
      const shiftType = d.shiftType;
      if( !schedule[date.format( 'YYYY/MM' )] ) return;

      const shiftName = schedule[date.format( 'YYYY/MM' )][date.format( 'DD' )];

      if( schedule.hasOwnProperty( date.format( 'YYYY/MM' ) ) ){
        const dateShiftType = document.createElement( 'div' );
        if( shiftType.hasOwnProperty( shiftName ) ){
          const shiftInfo = shiftType[shiftName];
          dateShiftType.classList.add( 'date-shift-type' );
          dateShiftType.innerText = shiftInfo.initial;
          dateShiftType.style.background =  shiftInfo.color;
          dateElement.appendChild( dateShiftType );
        }
      }
    } )
  }
  
  createIconElement( sData, name = "" )
  {
    const s = document.createElement( 'div' );
    s.classList.add( 'shift-type' );
    if(name) s.setAttribute('name', name);
    s.innerHTML = `<svg viewBox="0 0 200 200" style = "fill: ${sData.color}">${this.selectedSharp(sData.sharp)}</svg>`;  
    const initialText = document.createElement( 'div' );
    initialText.textContent = sData.initial;
    initialText.classList.add( 'shift-type-initial' );
    s.appendChild( initialText );
    return s;
  }
  
  selectedSharp( sharp )
  {
    if( sharp === 'circle' ) return `<circle cx="100" cy="100" r="100"/>`;
    if( sharp === 'rect' ) return `<rect x="0" y="0" width="200" height="200"/>`;
  }
}