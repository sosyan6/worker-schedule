export class Share
{
  constructor()
  {
    this.shareWrapper = document.querySelector( '#share-wrapper' );
    this.nameWrapper = document.querySelector( '#name-wrapper' );
    this.shareList = document.querySelector( '#share-list' );
    this.groupNames = this.getGroupNames();
    this.registListener();
    
    this.generateShare = this.generateShare.bind( this );
    
    
    this.groupData = streamData.then( async str => {
      const data = await str.ownData;
      this.currentGroupNum = str.getCookies().groupNum ? str.getCookies().groupNum : 0;
      if( data.data.group.length )
        return await this.getGroupData( data.data.group[this.currentGroupNum] );
    } );
    
    this.groupData.then( data => {
      if( data ){
          this.generateShare( data );
          this.setScroll( data );
        }
    } );
    
    this.setGroupSelect();
    this.editGroupButton();
  }
  
  editGroupButton()
  {
    const currentGroupName = document.querySelector( 'select#select-group' );
    const drawer = document.querySelector( '#group-operation' );
    
    document.querySelector( '#group-operation .edit' ).addEventListener( 'click', async() => {
      const strData = await streamData;
      const names = await this.groupNames;
      const GID = names[currentGroupName.value].GID;
      
      this.getGroupData( GID ).then( ( data ) => {
        this.generateShare( data );
        this.setScroll( data );
      } );
      
      drawer.dispatchEvent( new Event( 'close' ) );
      
      document.cookie = `groupNum=${currentGroupName.value}; max-age=${60*60*24*365}`;
      
    } );
    
    document.querySelector( '#group-operation .delete' ).addEventListener( 'click', async() => {
      const number = (await streamData).getCookies().groupNum;
      const names = await this.groupNames;
      const s = await streamData;
      console.log( names );
      await this.leaveGroup( names[currentGroupName.value].GID );
      ( await s.ownData ).data.group = ( await s.ownData ).data.group.filter( v => v !== names[currentGroupName.value].GID );
      [...currentGroupName.querySelectorAll( 'option:not( [value="create-group"] )' )].find( v => v.value === currentGroupName.value ).remove();
      currentGroupName.dispatchEvent( new Event( 'change' ) );
      this.groupNames = names.filter( ( v, i ) => i !== currentGroupName.value );
      if( number > 0 ) document.cookie = `groupNum=${number-1}; max-age=${60*60*24*365}`;
      s.saveData();
    } );
    
    document.querySelector( '.add-member.share-name' ).addEventListener( 'click', async() => {
      const names = (await this.groupNames);
      const displayURL = document.querySelector( '#URL-drawer' );
      const number = (await streamData).getCookies().groupNum;

      if( !(await (await streamData).ownData ).data.group.length ){
        document.cookie = `groupNum=-1; max-age=${60*60*24*365}`;
        document.querySelector( '#group-operation' ).dispatchEvent( new Event( 'open' ) );
        return;
      }
      displayURL.querySelector( 'input' ).value = `https://worker-schedule.glitch.me/join/${names[number].GID}`;
      navigator.clipboard.writeText(`https://worker-schedule.glitch.me/join/${names[number].GID}`);
      displayURL.dispatchEvent( new Event( 'open' ) );
    } );
  }
  
  async leaveGroup( GID )
  {
    return ( await streamData ).getData( '/leaveGroup/' + GID );
  }
    
  setGroupSelect()
  {
    this.getGroupNames().then( names => {
      this.groupNames = names;
      if( !names ) return;
      const groupSelector = document.querySelector( '#select-group' );
      groupSelector.querySelectorAll( 'option:not( [value="create-group"] )' ).forEach( e => e.remove() );
      names.reverse().forEach( ( name, i ) => {
        const selectItem = document.createElement( 'option' );
        selectItem.value = names.length - i - 1;
        selectItem.textContent = name.groupName;
        groupSelector.insertAdjacentElement( 'afterbegin', selectItem );
      } );
    } );
  }
  
  setScroll( data )
  {
    this.groupData = data;
    document.querySelector( '#calendar' ).removeEventListener( 'onScroll', this.generateShare );
    document.querySelector( '#calendar' ).addEventListener( 'onScroll', this.generateShare );
  }
  
  async generateShare()
  {
    if( !( await this.groupData ) ) return;
    
    if( !document.querySelector( '.share-date-wrapper.add-member' ) ){
      const sdw = document.createElement( 'div' );
      sdw.classList.add( 'share-date-wrapper' );
      sdw.classList.add( 'add-member' );
      document.querySelectorAll( '#this-month .date:not( .not-this-month )' ).forEach( () => {
          const shareDate = document.createElement( 'div' );
          shareDate.classList.add( 'share-date' );
          sdw.appendChild( shareDate );
      } );
      this.shareList.appendChild( sdw );
    }
    
    console.log( await this.groupData );
    [...( await this.groupData )].reverse().forEach( async user => {
      
      this.shareList.querySelectorAll( ':scope > :not( .add-member )' ).forEach( e => e.remove() );
      this.nameWrapper.querySelectorAll( ':scope > :not( .add-member )' ).forEach( e => e.remove() );
      
      const myData = await (await streamData).ownData;
      
      if( user.userName === myData.userName ) return;
      
      const shareName = document.createElement( 'div' );
      const shareDateWrapper = document.createElement( 'div' );
      shareDateWrapper.classList.add( 'share-date-wrapper' );
      shareName.classList.add( 'share-name' );
      shareName.textContent = user.userName;
      
      this.nameWrapper.insertAdjacentElement( 'afterbegin', shareName );

      document.querySelectorAll( '#this-month .date:not( .not-this-month )' ).forEach( v => {
        const shift = user.data.shift;
        const currentDate = getDateFromDateElement( v );
        
        const shareDate = document.createElement( 'div' );
        shareDate.classList.add( 'share-date' );
        
        if( shift && shift[currentDate.format('YYYY/MM')] && shift[currentDate.format('YYYY/MM')][currentDate.format('DD')] && shift[currentDate.format('YYYY/MM')][currentDate.format('DD')].shiftName ){
          const dateShift = document.createElement( 'div' );
          dateShift.classList.add( 'date-shift-type' );
          dateShift.textContent = shift[currentDate.format('YYYY/MM')][currentDate.format('DD')].shiftName;
          shareDate.appendChild( dateShift );
        }
        
        shareDateWrapper.appendChild( shareDate );
        } );
      
      this.shareList.insertAdjacentElement( 'afterbegin', shareDateWrapper );
      
    } );
  }
  
  async getGroupData( v )
  {
    return ( await streamData ).getData( '/getGroupData/' + v );
  }
  
  async getGroupName( v )
  {
    return ( await streamData ).getData( '/getGroupName/' + v );
  }
  
  getGroupNames(){
    console.log( 1 );
    return new Promise( async resolve => {
      const str = await streamData;
      const data = await str.ownData;
      const newData = data.data.group.map( async GID => await this.getGroupName( GID ) );
      console.log( newData );
      resolve( Promise.all( newData ) );
    } );
  }
  
  async getGroupDatas()
  {
    const data = await (await streamData).ownData;
    const groupData = data.data.group.map( async v => await this.getGroupData( v ) );
    console.log( groupData );
    return Promise.all(groupData);
  }
  
  registListener()
  {
    const s = document.querySelector( 'div#share-list' );
    const m = document.querySelector( 'div#this-month' );
    const n = document.querySelector( 'div#name-wrapper' );
    s.addEventListener( 'scroll', () => {
      m.scrollTop = s.scrollTop;
      n.scrollLeft = s.scrollLeft;
    } );
    // m.addEventListener( 'scroll', () => s.scrollTop = m.scrollTop );
  }
}