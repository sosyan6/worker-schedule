export class SetData {
  
  constructor()
  {
    this.waitSetData().then( async() =>
    {
      this.setShiftTypeSelect();
      // document.querySelector( '.select-date' ).dispatchEvent( new Event( 'click' ) );  //  今日のplanを表示する
      
      ( await calendar ).setSelectDate( new Date(), document.querySelector( '.today' ) );
      document.querySelector( '.icon-preview' ).appendChild( this.createIconElement( elementsToDict( document.querySelectorAll( '#shift-type-config > .input-form > div > *' ) ) ) );
    } );
  }
  
  get isSelectMode()
  {
    return document.querySelector( 'div#settings' ).classList.contains( 'cancel' );
  }
  
  getMonthShift( month ){
    if( this.shift.hasOwnProperty( month.format( 'YYYY/MM' ) ) )
      return this.shift[month.format( 'YYYY/MM' )];
    else
      return null;
  }
  getDayShift( ...args ){
    
    const get = date =>
    {
      if( date && this.shift?.hasOwnProperty( date.format( 'YYYY/MM' ) ) && this.shift[date.format( 'YYYY/MM' )].hasOwnProperty( date.format( 'DD' ) ) )
        return this.shift[date.format( 'YYYY/MM' )][date.format('DD')];
      else
        return null;
    };
    
    switch( args.length )
    {
      case 1:
        return get( args[0] );
        break;
        
      case 2:
        const date = new Date( args[0] );
        date.setDate( args[1] );
        return get( date );
        break;
      
      default:
        return null;
        break;
    }
  }
  
  initMonthShift( month ){
    if( !this.shift.hasOwnProperty( month.format( 'YYYY/MM' ) ) )
      this.shift[month.format( 'YYYY/MM' )] = {};
  }
  initDayShift( ...args ){
    
    const init = date =>
    {
      this.initMonthShift( date );
      if( !this.shift[date.format( 'YYYY/MM' )].hasOwnProperty( date.format( 'DD' ) ) )
        this.shift[date.format( 'YYYY/MM' )][date.format('DD')] = {};
    };
    
    switch( args.length )
    {
      case 1:
        init( args[0] );
        break;
        
      case 2:
        const date = new Date( args[0] );
        date.setDate( args[1] );
        init( date );
        break;
        
      default:
        return null;
        break;
    }
  }
  
  setMonthShift( month, data ){
    if( !this.shift.hasOwnProperty( month.format( 'YYYY/MM' ) ) )
      this.shift[month.format( 'YYYY/MM' )] = data;
  }
  setDayShift( ...args ){
    
    const set = ( date, data ) =>
    {
      this.initMonthShift( date );
      this.initDayShift( date );
      Object.assign( this.shift[date.format( 'YYYY/MM' )][date.format( 'DD' )], data );
    };
    
    switch( args.length )
    {
      case 2:
        set( args[0], args[1] );
        break;
        
      case 3:
        const date = new Date( args[0] );
        date.setDate( args[1] );
        set( date, args[2] );
        break;
        
      default:
        return null;
        break;
    }
  }

  loopMonth( monthElement, func )
  {
    monthElement.querySelectorAll( '.week' ).forEach( ( week, w ) => {
      week.querySelectorAll( '.date' ).forEach( ( date, d ) => func( { 'week': week, 'w': w, 'date': date, 'd': d } ) );
    });
  }
  
  deleteShiftTypeDate()
  {
    // awaitが使いたいのでラムダにします
    const save = async () => (await streamData).saveData();
    // 削除するための関数をローカルに作ります
    const del = async selectDay => 
    {
      const currentMonth = new Date( (await calendar).currentDate );
      const dayNum = getDayNum( selectDay );
      
      currentMonth.setDate( dayNum );
      selectDay.querySelector( '.date-shift-type' )?.remove();
      
      if( this.getMonthShift( currentMonth )[dayNum] )
        this.getMonthShift( currentMonth )[dayNum]['shiftName'] = '';
      console.log( this.getMonthShift( currentMonth ) );
    };
    
    if( this.isSelectMode )
      [...document.querySelectorAll( '.isselected' )].map( v => { v.classList.remove( 'isselected' ); return v.parentNode } ).forEach( del );
    else
    {
      del( document.querySelector( '.select-date' ) );
      this.nextFocus();
    }
    save();
  }
  
  async nextFocus()
  {
    const next = document.querySelector( '.select-date + .date' );
    const c = await calendar;
    if( next && !next.classList.contains( 'not-this-month' ) )
      // next.dispatchEvent( new Event( 'click' ) );
      c.setSelectDate( getDateFromDateElement( next ), next );
    else
    {
      const nextWeek = [...document.querySelectorAll( '#this-month > .week' )].next( document.querySelector( '.select-date' ).parentNode );
      if( nextWeek )
      {
        const next = [...nextWeek.querySelectorAll( '.date' )][0];
        if( !next.classList.contains( 'not-this-month' ) )
          // next.dispatchEvent( new Event( 'click' ) );
          c.setSelectDate( getDateFromDateElement( next ), next );
      }
    }
  }
  
  settingDateShiftType()
  {
    document.querySelectorAll( '#shift-type-select > .shift-type:not(.not-disappear-button)' ).forEach( e => {
      
      const setDateIcon = async ( selectDay ) => {
        const currentMonth = createDate( (await calendar).currentDate, getDayNum( selectDay ) );
        this.setDayShift( currentMonth, { shiftName: e.getAttribute('name') } );
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
  
  async waitSetData()
  {
    this.shiftType = ( await ( await streamData ).ownData ).data.shiftType;
    this.shift = ( await ( await streamData ).ownData ).data.shift;
    return this;
  }
  
  setShiftTypeSelect()
  {
    const shiftTypeSelect = document.querySelector( '#shift-type-select' );
    const shiftKeys = Object.keys( this.shiftType );
    
    shiftTypeSelect.querySelectorAll( '.shift-type:not(.not-disappear-button)' ).forEach( e => e.remove() );
    
    for( let i = len( this.shiftType ) - 1; i >= 0 ; i-- ){
      const icon = this.createIconElement( this.shiftType[shiftKeys[i]], shiftKeys[i] );
      // icon.setAttribute( 'count', i );
      
      $( icon ).longpress( async() => {
        
        const drawer = document.querySelector( '#add-shift-drawer' );
        const addShift = document.querySelector( '#add-shift-form' );
        const data = this.shiftType[shiftKeys[i]];
        const name = shiftKeys[i];
        
        icon.classList.add( 'current-edit' );
        
        addShift.querySelectorAll( 'div > *' ).forEach( e => {
          if( e.name ){
            if( e.name === 'shiftName' ){
              e.value = name;
              e.setAttribute( 'readonly', true );
              e.style.background = '#dddddd';
            }
            else e.value = data[e.name];
          }
        } );
        
        const iconPreview = drawer.querySelector( '.edit-button > .icon-preview' );
        iconPreview.querySelectorAll( '*' ).forEach( e => e.remove() );
        iconPreview.appendChild( ( await setData ).createIconElement( {color: "#ff0000", sharp: "rect", initial: ""} ) );
        
        addShift.querySelector( '.submit-button' ).style.display = 'none';
        addShift.querySelector( '.edit-button' ).style.display = 'flex';
        
        drawer.dispatchEvent( new Event( 'open' ) );
      }, () => {}, 300 );
      shiftTypeSelect.insertAdjacentElement( 'afterbegin', icon );
    } 
    this.settingDateShiftType();
  }
  
  createShiftTypeDate( date, dateElement )
  {
    this.waitSetData().then( d =>
    {  
      const schedule = d.shift;
      const shiftType = d.shiftType;
      const shiftName = this.getDayShift( date );
      
      dateElement.querySelector( '.date-shift-type' )?.remove();
      
      if( !shiftName ){
        this.initMonthShift( date );
        return;
      }
      
      if( shiftName.shiftName )
      {
        const dateShiftType = document.createElement( 'div' );
        const shiftInfo = shiftType[shiftName.shiftName];
        
        if( !shiftInfo ){
          delete shiftName.shiftName;
          return;
        }
        
        dateShiftType.classList.add( 'date-shift-type' );
        dateShiftType.innerText = shiftInfo.initial;
        dateShiftType.style.background = shiftInfo.color;

        if( shiftInfo.color.isBright() )
          dateShiftType.style.color = '#000';
        else
          dateShiftType.style.color = '#FFF';

        dateElement.appendChild( dateShiftType );
      }
        
      if( shiftName.schedule )
      {
        this.setPlanFlag( shiftName.schedule, dateElement );
      }
    } );
  }
  
  
  setPlanFlag( scheduleArray, dateElement )
  {
    if( scheduleArray.length ){
      const planDiv = document.createElement( 'div' );
      planDiv.classList.add( 'have-plan' );
      dateElement.querySelector( '.have-plan' )?.remove();
      dateElement.appendChild( planDiv );
    }
    else dateElement.querySelector( '.have-plan' )?.remove(); 
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
    
    if( sData.color?.isBright() )
      initialText.style.color = '#000';
    else
      initialText.style.color = '#FFF';
    s.appendChild( initialText );
    return s;
  }
  
  selectedSharp( sharp )
  {
    if( sharp === 'circle' ) return `<circle cx="100" cy="100" r="100"/>`;
    if( sharp === 'rect' ) return `<rect x="0" y="0" width="200" height="200"/>`;
  }
}