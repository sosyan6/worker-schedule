export class SetData {
  
  constructor()
  {
    this.createShiftTypeSelect();

    const shiftIcon = document.querySelector( '#icon-preview' );
    shiftIcon.appendChild( this.createIconElement( elementsToDict( document.querySelectorAll( '#shift-type-config > .input-form > div > *' ) ) ) );
    
  }
  
  loopMonth( monthElement, func )
  {
    monthElement.querySelectorAll( '.week' ).forEach( ( week, w ) => {
      week.querySelectorAll( '.date' ).forEach( ( date, d ) => func( { 'week': week, 'w': w, 'date': date, 'd': d } ) );
    });
  }
  
  get isSelectMode()
  {
    return document.querySelector( 'div#settings' ).classList.contains( 'clicked' );
  }
  
  setDateShiftType()
  {
    document.querySelectorAll( '#shift-type-select > .shift-type:not(#add-shift-button)' ).forEach( e => {
      const setDateIcon = ( selectDay ) => {
        selectDay.style.background = this.shiftType[e.getAttribute('name')].color;
        selectDay.textContent = this.shiftType[e.getAttribute('name')].initial;
      }
      e.addEventListener( 'click' , () => 
      {
        if( this.isSelectMode ) [...document.querySelectorAll( '.isselected' )].map( v => { v.classList.remove( 'isselected' ); return v.parentNode.querySelector( '.date-shift-type' ) } ).forEach( setDateIcon );
        else if( document.querySelector( '.select-date' ) )
        {
          const next = document.querySelector( '.select-date + .date' );
          setDateIcon( document.querySelector( '.select-date > .date-shift-type' ) );
          
          if( next ) next.dispatchEvent( new Event( 'click' ) );
          else
          {
            const nextWeek = [...document.querySelectorAll( '#this-month > .week' )].next( document.querySelector( '.select-date' ).parentNode );
            if( nextWeek ) [...nextWeek.querySelectorAll( '.date' )][0].dispatchEvent( new Event( 'click' ) );
          }
        } 
      } );
    } );
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
  
  async createShiftTypeSelect()
  {
    this.shiftType = ( await ( await streamData ).ownData ).data.shiftType;
    const shiftTypeSelect = document.querySelector( '#shift-type-select' );
    const shiftKeys = Object.keys( this.shiftType );
    
    shiftTypeSelect.querySelectorAll( '.shift-type:not(#add-shift-button)' ).forEach( e => e.remove() );
    
    for( let i = len( this.shiftType ) - 1; i >= 0 ; i-- ){
      const icon = this.createIconElement( this.shiftType[shiftKeys[i]], shiftKeys[i] );
      shiftTypeSelect.insertAdjacentElement( 'afterbegin', icon.cloneNode( true ) );
    } 
    this.setDateShiftType();
  }
  
  selectedSharp( sharp )
  {
    if( sharp === 'circle' ) return `<circle cx="100" cy="100" r="100"/>`;
    if( sharp === 'rect' ) return `<rect x="0" y="0" width="200" height="200"/>`;
  }
}