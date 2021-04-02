
window.onload = async () => {
  const setting = document.querySelector( 'div#settings' );

  // const addShift = document.querySelector( 'div#add-shift-button' );
  // addShift.addEventListener( 'click', () => console.log( 'aaaaaaaaa' ) );
  
  setting.addEventListener( 'click', () => {
    if( setting.classList.contains( 'cancel' ) ) return;
    setting.classList.add( 'clicked' );
  } );
  
  const selecttype = new ( await import( './MenuMove.js' ) ).MenuMove( document.querySelector( 'div#shift-type-select' ) );
  const leftMenu = new ( await import( './LeftMenu.js' ) ).LeftMenu();
  const footer = new ( await import( './Footer.js' ) ).Footer();
  const calendar = new ( await import( './Calendar.js' ) ).Calendar();
  const selectMode = new ( await import( './SelectMode.js' ) ).SelectMode();
  const loadData = new ( await import( './StreamData.js' ) ).StreamData();
  // ['MenuMove', 'LeftMenu', 'Footer', 'Calendar', 'SelectMode', 'StreamData'].map( async s => {
  //   console.log( ( await import( `./${ s }.js` ) ) );
  // } );
};