export class ButtonRegister
{
  constructor()
  {
    this.setting = document.querySelector( 'div#settings' );
    this.addShiftButton = document.querySelector( 'div#add-shift-button' );
    this.createShift = document.querySelector( '.yes-no > .button' );
    // this.stream = streamData;
    
    this.registButton();
  }
  
  registButton()
  {
    this.setting.addEventListener( 'click', ( e ) => {
      if( this.setting.classList.contains( 'cancel' ) || !e.target.isEqualNode( this.setting )  ) return;
      this.setting.querySelector( '.drawer-menu' ).dispatchEvent( new Event( 'open' ) );
    } );

    this.addShiftButton.addEventListener( 'click', ( e ) => {
      if( !e.target.isEqualNode( this.addShiftButton )  ) return;
      this.addShiftButton.querySelector( '.drawer-menu' ).dispatchEvent( new Event( 'open' ) );
    } );

    const configElement = document.querySelectorAll( '#shift-type-config > .input-form > div > *' );
    const shiftIcon = document.querySelector( '#icon-preview' );

    this.createShift.addEventListener( 'click', async() => {
      const shiftInfo = elementsToDict( configElement );
      if( inputCheck( shiftInfo ) ){
        const shiftName = shiftInfo['shiftName'];
        delete shiftInfo.shiftName;
        ( await setData ).shiftType[shiftName] = shiftInfo;
        ( await setData ).setShiftTypeSelect();
        document.querySelector( '#add-shift-button > .drawer-menu' ).dispatchEvent( new Event( 'close' ) );
      } 
      else [...configElement].forEach( v => { if( v.name && !v.value ) v.style.borderBottom = '2px solid red'; } );
    });

    [...configElement].forEach( v => 
    {
      if( !v.name ) return;
      v.addEventListener( 'input', async () => {
        shiftIcon.innerHTML = '';
        const shiftInfo = elementsToDict( configElement );
        delete shiftInfo.shiftName;
        shiftIcon.appendChild( ( await setData ).createIconElement( shiftInfo ) );
      } );
    } );
  }
}