export class ButtonRegister
{
  constructor()
  {
    this.setting = document.querySelector( 'div#settings' );
    this.addShiftButton = document.querySelector( 'div#add-shift-button' );
    this.deleteShiftButton = document.querySelector( '#delete-shift-button' );
    this.createShift = document.querySelector( '.submit-button > .button' );
    this.createGroup = document.querySelector( '#group-form-button' );
    this.createPlan = document.querySelector( '#add-plan-button' );
    this.addGroup = document.querySelector( '#add-group-button' );
    this.addPlan = document.querySelector( '#add-plan' );
    // this.stream = streamData;
    
    this.registButton();
  }
  
  registButton()
  {
    const addShift = document.querySelector( '#add-shift-form' );
    this.setting.addEventListener( 'click', ( e ) => {
      if( this.setting.classList.contains( 'cancel' ) || !e.target.isEqualNode( this.setting )  ) return;
      this.setting.querySelector( '.drawer-menu' ).dispatchEvent( new Event( 'open' ) );
    } );

    this.addShiftButton.addEventListener( 'click', ( e ) => {
      if( !e.target.isEqualNode( this.addShiftButton ) ) return;
      document.querySelectorAll( '#add-shift-form > div > *' ).forEach( ( e ) => {
        if( e.name ){
          if( e.name === 'shiftName' ){
            e.removeAttribute( 'readonly' );
            e.value = '';
            e.style.background = '#ffffff';
          }
          else if( e.name === 'color' ) e.value = '#ff0000';
          else if( e.name === 'initial' ) e.value = '';
          else if( e.name === 'sharp' ) e.value = 'rect';
          console.log( e );
        }
      } );
      
      addShift.querySelector( '.submit-button' ).style.display = '';
      addShift.querySelector( '.edit-button' ).style.display = '';
      
      this.addShiftButton.querySelector( '.drawer-menu' ).dispatchEvent( new Event( 'open' ) );
    } );
    
    this.deleteShiftButton.addEventListener( 'click', async () => ( await setData ).deleteShiftTypeDate() );
    
    this.addPlan.addEventListener( 'click', async( e ) => {
      console.log( e );
      if( !e.target.isEqualNode( this.addPlan ) ) return;
      document.querySelectorAll( '#add-plan-form > div > *' ).forEach( ( e ) => {
        if( e.name ){
          if( e.name === 'shiftName' ){
            e.removeAttribute( 'readonly' );
            e.value = '';
            e.style.background = '#ffffff';
          }
          else if( e.name === 'scheduleMemo' ) e.value = '';
          else if( e.name === 'startTime' || e.name === 'endTime' ) e.value = '';
          console.log( e );
        }
      } );
      
      this.addPlan.querySelector( '.submit-button' ).style.display = '';
      this.addPlan.querySelector( '.edit-button' ).style.display = '';
      this.addPlan.querySelector( '.drawer-menu' ).dispatchEvent( new Event( 'open' ) );
    } );
      
    this.createGroup.addEventListener( 'click', ( e ) => {
      if( !e.target.isEqualNode( this.createGroup ) ) return;
      document.querySelectorAll( '#add-shift-form > div > *' ).forEach( ( e ) => {
        if( e.name ){
          if( e.name === 'shiftName' ){
            e.removeAttribute( 'readonly' );
            e.value = '';
            e.style.background = '#ffffff';
          }
          else if( e.name === 'color' ) e.value = '#ff0000';
          else if( e.name === 'initial' ) e.value = '';
          else if( e.name === 'sharp' ) e.value = 'rect';
          console.log( e );
        }
      } );
      document.querySelector( '#menu' ).dispatchEvent( new Event( 'close' ) );
      document.querySelector( '#create-group-form' ).parentElement.dispatchEvent( new Event( 'open' ) );
    } );
    
    const configElement = document.querySelectorAll( '#add-shift-form > div > *' );
    
    this.addGroup.addEventListener( 'click', async() => {
      const groupElement = document.querySelectorAll( '#create-group-form > .input-form > div > *' );
      const displayURL = document.querySelector( '#display-URL' );
      const strData = (await streamData);
      const groupInfo = elementsToDict( groupElement );
      const cookie = strData.getCookies();
      groupInfo.SID = cookie.SID;
      console.log( groupInfo );
      
      strData.createGroup( groupInfo ).then( GID => {
        document.querySelector( '#create-group-form' ).parentElement.dispatchEvent( new Event( 'close' ) );
        this.addGroup.parentElement.dispatchEvent( new Event( 'close' ) );
        displayURL.querySelector( 'input' ).value = `https://worker-schedule.glitch.me/join/${GID}`;
        navigator.clipboard.writeText(`https://worker-schedule.glitch.me/join/${GID}`);
        displayURL.parentElement.dispatchEvent( new Event( 'open' ) );
      } );

    } );
    
    this.createPlan.addEventListener( 'click', async() => {
      
      const planElement = document.querySelectorAll( '#add-plan-form > div > *' );
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
        cal.setPlan( getDateFromDateElement( document.querySelector( '.select-date' ) ) );
        set.setPlanFlag( document.querySelector( '.select-date' ) );
        (await streamData).saveData();
      }
      else [...configElement].forEach( v => { if( v.name && !v.value ) v.style.borderBottom = '2px solid red'; } );
    } );

    this.createShift.addEventListener( 'click', async() => {
      const shiftInfo = elementsToDict( configElement );
      const set = ( await setData );
      if( inputCheck( shiftInfo ) ){
        const shiftName = shiftInfo['shiftName'];
        delete shiftInfo.shiftName;
        set.shiftType[shiftName] = shiftInfo;
        set.setShiftTypeSelect();
        document.querySelector( '#add-shift-button > .drawer-menu' ).dispatchEvent( new Event( 'close' ) );
      } 
      else [...configElement].forEach( v => { 
        if( v.name && !v.value ){
          v.style.borderBottom = '2px solid red';
          setInterval( () => {
            v.style.borderBottom = 'solid 2px #888';
          }, 2000 );
        } 
      } );
    });
    

    [...configElement].forEach( v => 
    {
      const shiftIcon = document.querySelector( '#icon-preview' );
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