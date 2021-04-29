export class ButtonRegister
{
  constructor()
  {
    this.createShift       = document.querySelector( '#add-shift-drawer .submit-button > .button' );
    this.createPlan        = document.querySelector( '#add-plan-button' );
    this.addGroupButton    = document.querySelector( '#add-group-button' );
    this.addShiftButton    = document.querySelector( 'div#add-shift-button' );
    this.addPlan           = document.querySelector( '#add-plan' );
    this.addGroup          = document.querySelector( '#add-group' );
    this.groupOperation    = document.querySelector( '#group-operation' );
    this.openAddGroup      = document.querySelector( '#open-add-group' );
    this.deleteShiftButton = document.querySelector( '#delete-shift-button' );
    this.setting           = document.querySelector( 'div#settings' );
    // this.stream = streamData;
    
    this.registButton();
    this.editPlanButtonRegist();
    this.editShiftButtonRegist();
  }
  
  registButton()
  {
    const addShift = document.querySelector( '#add-shift-form' );
    const configElement = document.querySelectorAll( '#add-shift-form > div > *' );
//-------------------------------------------------------------------------------------------
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

      document.querySelectorAll( '.icon-preview' ).forEach( async icon => {
        icon.querySelectorAll( '*' ).forEach( e => e.remove() );
      } );
      
      addShift.querySelector( '.submit-button' ).style.display = '';
      addShift.querySelector( '.edit-button' ).style.display = '';
      
      document.querySelector( '#add-shift-drawer' ).dispatchEvent( new Event( 'open' ) );
    } );
//---------------------------------------------------------------------------------------------    
    this.addPlan.addEventListener( 'click', async( e ) => {
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
        }
      } );
      
      document.querySelector( '#add-plan-drawer .submit-button' ).style.display = '';
      document.querySelector( '#add-plan-drawer .edit-button' ).style.display = '';
      document.querySelector( '#add-plan-drawer' ).dispatchEvent( new Event( 'open' ) );
    } );
//---------------------------------------------------------------------------------------------  
    this.addGroupButton.addEventListener( 'click', async() => {
      const groupElement = document.querySelectorAll( '#create-group-form > .input-form > div > *' );
      const displayURL = document.querySelector( '#display-URL' );
      const strData = (await streamData);
      const groupInfo = elementsToDict( groupElement );
      if( !inputCheck( groupInfo ) ){
        [...groupElement].forEach( v => {
          if( v.name && !v.value ){
            v.style.borderBottom = '2px solid red';
            setInterval( () => v.style.borderBottom = '', 2000 );
          } 
        
        } );
        const number = (await streamData).getCookies().groupNum;
        document.cookie = `groupNum=${number+1}; max-age=${60*60*24*365}`;
        return;
      }
      const cookie = strData.getCookies();
      groupInfo.SID = cookie.SID;
      
      document.querySelector( '#create-group-drawer' ).dispatchEvent( new Event( 'close' ) );

      strData.createGroup( groupInfo ).then( async GID => {
        this.addGroup.parentElement.dispatchEvent( new Event( 'close' ) );
        displayURL.querySelector( 'input' ).value = `https://worker-schedule.glitch.me/join/${GID}`;
        navigator.clipboard.writeText(`https://worker-schedule.glitch.me/join/${GID}`);
        displayURL.parentElement.dispatchEvent( new Event( 'open' ) );
        (await share).setGroupSelect();
      } );

    } );
//--------------------------------------------------------------------------------------------- 
    this.addGroup.addEventListener( 'click', async( e ) => {
      if( !e.target.isEqualNode( this.addGroup ) ) return;
      document.querySelector( '#group-operation' ).dispatchEvent( new Event( 'open' ) );
    } );
//---------------------------------------------------------------------------------------------
    this.createShift.addEventListener( 'click', async() => {
      const shiftInfo = elementsToDict( configElement );
      const set = ( await setData );
      if( inputCheck( shiftInfo ) ){
        const shiftName = shiftInfo['shiftName'];
        delete shiftInfo.shiftName;
        set.shiftType[shiftName] = shiftInfo;
        set.setShiftTypeSelect();
        document.querySelector( '#add-shift-drawer' ).dispatchEvent( new Event( 'close' ) );
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
//--------------------------------------------------------------------------------------------- 
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
        
        document.querySelector( '#add-plan-drawer' ).dispatchEvent( new Event( 'close' ) );
        cal.setPlan( getDateFromDateElement( document.querySelector( '.select-date' ) ) );
        set.setPlanFlag( info['schedule'], document.querySelector( '.select-date' ) );
        (await streamData).saveData();
      }
      else [...planElement].forEach( v => { 
        if( v.name && !v.value ){
            v.style.borderBottom = '2px solid red';
            setInterval( () => v.style.borderBottom = '', 2000 );
          } 
        } );
    } );
//---------------------------------------------------------------------------------------------
    this.groupOperation.querySelector( 'select' ).addEventListener( 'change', () => {
      const submit = this.groupOperation.querySelector( '.submit-button' );
      const edit = this.groupOperation.querySelector( '.edit-button' );
      if( document.querySelector( '#select-group' ).value === 'create-group' ){
        submit.style.display = '';
        edit.style.display = '';
      }else{
        submit.style.display = 'none';
        edit.style.display = 'flex';
      }
    } );
      
    this.groupOperation.querySelector( '.submit-button' ).addEventListener( 'click', async() => {
      document.querySelector( '#create-group-drawer' ).dispatchEvent( new Event( 'open' ) );
    } );
//---------------------------------------------------------------------------------------------
    this.setting.addEventListener( 'click', ( e ) => {
      if( this.setting.classList.contains( 'cancel' ) || !e.target.isEqualNode( this.setting ) ) return;
      document.querySelector( 'div#shift-type' ).dispatchEvent( new Event( 'open' ) );
    } );
//---------------------------------------------------------------------------------------------
    this.deleteShiftButton.addEventListener( 'click', async () => ( await setData ).deleteShiftTypeDate() );
//---------------------------------------------------------------------------------------------
    [...configElement].forEach( v => {
      const shiftIcons = document.querySelectorAll( '.icon-preview' );
      if( !v.name ) return;
      v.addEventListener( 'input', () => {
        if( v.name === 'shiftName' ){
          document.querySelector( 'input[name="initial"]' ).value = v.value.slice( 0, 2 );
        }
        shiftIcons.forEach( async icon => {
          icon.querySelectorAll( '*' ).forEach( e => e.remove() );
          const shiftInfo = elementsToDict( configElement );
          delete shiftInfo.shiftName;
          icon.appendChild( ( await setData ).createIconElement( shiftInfo ) );
        } );
      } );
    } );
  }
  
  editPlanButtonRegist()
  {
    const planForm = document.querySelector( '#add-plan-form' );
    
    //  フォームを閉じる処理
    const closeEvent = async( array ) => {
      const dateElement = document.querySelector( '.select-date' );
      const date = getDateFromDateElement( dateElement );
      ( await streamData ).saveData();
      ( await setData ).setPlanFlag( array, dateElement );
      await (await calendar).setPlan( date );
      
      document.querySelector( '#add-plan-drawer' ).dispatchEvent( new Event( 'close' ) );
    }
    
    //  editボタンが押されたとき
    planForm.querySelector( '.edit-button > .edit' ).addEventListener( 'click', async() =>
    {
      const date = getDateFromDateElement( document.querySelector( '.select-date' ) );
      const dayShift = ( await setData ).getDayShift( date );
      const currentEdit = document.querySelector( '.current-edit' );
      const data = dayShift.schedule[parseInt( currentEdit.getAttribute( 'count' ) )];
      
      planForm.querySelectorAll( 'div > *' ).forEach( e => { 
        if( data.hasOwnProperty( e.name ) && e.value ) data[e.name] = e.value;
      } );
      
      dayShift.schedule[currentEdit.getAttribute( 'count' )] = data;
      await closeEvent( dayShift.schedule );
    } );
    
    //  deleteボタンが押されたとき
    planForm.querySelector( '.edit-button > .delete' ).addEventListener( 'click', async() => 
    {
      const date = getDateFromDateElement( document.querySelector( '.select-date' ) );
      const currentEdit = document.querySelector( '.current-edit' );
      const dayShift = ( await setData ).getDayShift( date );
      
      dayShift.schedule = dayShift.schedule.filter( ( v, count ) => count !== parseInt( currentEdit.getAttribute( 'count' ) ) );
      
      await closeEvent( dayShift.schedule );
      
    } );
    
    //  ボタンが押されずformが閉じられた場合にクラスを取り除く
    document.querySelector( '#add-plan-drawer' ).addEventListener( 'onclose', () => document.querySelector( '.current-edit' )?.classList.remove( 'current-edit' ) );
  }
  
  editShiftButtonRegist()
  {
    const parentButton = document.querySelector( '#add-shift-form' );
    
    const closeEvent = async() => {
      ( await calendar ).initDisplayDate();
      ( await setData ).setShiftTypeSelect();
      document.querySelector( '#add-shift-drawer' ).dispatchEvent( new Event( 'close' ) );
    }
    
    //  editボタンを押したとき
    parentButton.querySelector( '.edit' ).addEventListener( 'click', async() => 
    {
      const currentEdit = document.querySelector( '.current-edit' );
      const shiftType = ( await ( await streamData ).ownData ).data.shiftType;
      const editData = shiftType[currentEdit.getAttribute('name')];
      
      parentButton.querySelectorAll( 'div > *' ).forEach( e => {
        if( e.name && e.value ) editData[e.name] = e.value;
      } );
      await closeEvent();
    } );
    
    //  deleteボタンを押したとき
    parentButton.querySelector( '.delete' ).addEventListener( 'click', async() => 
    {
      const currentEdit = document.querySelector( '.current-edit' );
      const shiftType = ( await ( await streamData ).ownData ).data.shiftType;
      
      delete shiftType[currentEdit.getAttribute('name')];
      await closeEvent();
    } );
    
    //  ボタンが押されずformが閉じられた場合にクラスを取り除く
    document.querySelector( '#add-shift-drawer' ).addEventListener( 'onclose', () => document.querySelector( '.current-edit' )?.classList.remove( 'current-edit' ) );
    
  }
}