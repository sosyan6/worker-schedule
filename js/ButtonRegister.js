export class ButtonRegister
{
  constructor()
  {
    this.setting = document.querySelector( 'div#settings' );
    this.addShiftButton = document.querySelector( 'div#add-shift-button' );
    this.deleteShiftButton = document.querySelector( '#delete-shift-button' );
    this.createShift = document.querySelector( '.ok-button > .button' );
    this.createPlan = document.querySelector( '#add-plan-button' );
    this.addPlan = document.querySelector( '#add-plan' );
    this.createGroup = document.querySelector( '#create-group-button' );
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
      if( !e.target.isEqualNode( this.addShiftButton ) ) return;
      this.addShiftButton.querySelector( '.drawer-menu' ).dispatchEvent( new Event( 'open' ) );
    } );
    
    this.deleteShiftButton.addEventListener( 'click', async () => ( await setData ).deleteShiftTypeDate() );
    
    this.addPlan.addEventListener( 'click', async( e ) => {
      if( !e.target.isEqualNode( this.addPlan ) ) return;
      this.addPlan.querySelector( '.drawer-menu' ).dispatchEvent( new Event( 'open' ) );
    } );
    
    this.createGroup.addEventListener( 'click', function() {
      this.querySelector( '.full-screen-form' ).style.transform = 'translateX( 0 )';
    } );
    
    const planElement = document.querySelectorAll( '#add-plan-form > div > *' );
    
    this.createPlan.addEventListener( 'click', async() => {
      
      const shiftInfo = elementsToDict( planElement );
      const set = ( await setData );
      const cal = ( await calendar );
      const date = createDate( cal.currentDate, getSelectDayNum() );
      
      if( inputCheck( shiftInfo ) )
      {        
        set.initDayShift( date );
        const info = set.shift[date.format( 'YYYY/MM' )][date.format('DD')];
        if( !info.schedule )
          info['schedule'] = [shiftInfo];
        else
          info['schedule'].push( shiftInfo );
        
        document.querySelector( '#add-plan > .drawer-menu' ).dispatchEvent( new Event( 'close' ) );
        cal.setPlan();
        set.setPlanFlag( document.querySelector( '.select-date' ) );
        (await streamData).saveData();
      }
      else [...configElement].forEach( v => { if( v.name && !v.value ) v.style.borderBottom = '2px solid red'; } );
    } );

    const configElement = document.querySelectorAll( '#add-shift-form > div > *' );
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