const calendar = import( './Calendar.js' ).then( m => new m.Calendar() );
const drawerMenu = import( './DrawerMenu.js' ).then( m => new m.DrawerMenu() );
const leftMenu = import( './LeftMenu.js' ).then( m => new m.LeftMenu() );
const streamData = import( './StreamData.js' ).then( m => new m.StreamData() );
const setData = import( './SetData.js' ).then( m => new m.SetData() );
const footer = import( './Footer.js' ).then( m => new m.Footer() );
const selectMode = import( './SelectMode.js' ).then( m => new m.SelectMode() );
const buttonRegister = import( './ButtonRegister.js' ).then( m => new m.ButtonRegister() );
const share = import( './Share.js' ).then( m => new m.Share() );

// window.onload = () => {
//   Promise.allSettled( [calendar ,drawerMenu ,leftMenu ,streamData ,setData ,footer ,selectMode ,buttonRegister ,share] ).then( ( result ) => {
//     result.forEach( ( val ) => { if( val.status === 'rejected' ) location.reload(); } );
//   } );
//   document.addEventListener( 'touchstart', ( e ) => {
//     if( e.touches.length >= 2 ) e.preventDefault();
//   }, { passive: false } );
// };

function getSelectDayNum()
{
  return document.querySelector( '.select-date' ).innerText.match( /\d*/ )[0];
}

function getDayNum( element )
{
  return element.innerText.match( /\d*/ )[0];
}

function getSelectDate()
{
  const newDate = new Date( calendar.currentDate );
  newDate.setDate( getSelectDayNum() );
  return newDate;
}

function createDate( date, day )
{
  const newDate = new Date( date );
  newDate.setDate( day );
  return newDate;
}

function getDateFromDateElement( element )
{
  if( !element.classList.contains( 'date' ) ) return;
  const date = new Date( document.querySelector( 'input#date' ).value );
  switch( element.parentNode.parentNode.id ){
    case 'prev-month':
      date.setMonth( date.getMonth() - 1 );
    return;
    case 'next-month':
      date.setMonth( date.getMonth() + 1 );
    return;
  }
  
  if( element.classList.contains( 'not-this-month' ) ){
    if( [...element.parentNode.parentNode.querySelectorAll( '.date' )].indexOf( element ) < 7 * 6 / 2 ){
      date.setMonth( date.getMonth() - 1 );
    }else{
      date.setMonth( date.getMonth() + 1 );
    }
  }
  
  date.setDate( element.textContent.match( /^\d+/ ) );
  
  return date;
}