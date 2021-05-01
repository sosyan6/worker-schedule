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
      this.currentGroupNum = parseInt( str.getCookies().groupNum );
      this.setScroll();
      if( data.data.group.length && this.currentGroupNum !== -1 )
        this.setShareCalendar( data.data.group[this.currentGroupNum] );
      else{
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
    } );
    
    
    this.setGroupSelect();
    this.editGroupButton();
  }
  
  editGroupButton()
  {
    const currentGroupName = document.querySelector( 'select#select-group' );
    const drawer = document.querySelector( '#group-operation' );
    
    document.querySelector( '#group-operation .edit' ).addEventListener( 'click', async() => {
      const s = await streamData;
      const groupData = ( await s.ownData ).data.group;
      const GID = groupData[currentGroupName.value];
      
      this.setShareCalendar( GID );
      
      drawer.dispatchEvent( new Event( 'close' ) );
      document.cookie = `groupNum=${currentGroupName.value}; max-age=${60*60*24*365}`;
    } );
    
    document.querySelector( '#group-operation .delete' ).addEventListener( 'click', async() => {
      
      const s = await streamData;
      const number = getCookies().groupNum;
      const names = await this.getGroupNames();
      const groupData = ( await s.ownData ).data;
      
      this.leaveGroup( names[currentGroupName.value].GID );
      groupData.group = groupData.group.filter( v => v !== names[currentGroupName.value].GID );
      
      [...currentGroupName.querySelectorAll( 'option:not( [value="create-group"] )' )].find( v => v.value === currentGroupName.value ).remove();
      [...currentGroupName.querySelectorAll( 'option:not( [value="create-group"] )' )].forEach( ( v, count ) => v.value = count );
      
      currentGroupName.dispatchEvent( new Event( 'change' ) );
      document.cookie = `groupNum=${groupData.group.length ? parseInt(currentGroupName.value) : -1}; max-age=${60*60*24*365}`;
      s.saveData();
    } );
    
    document.querySelector( '.add-member.share-name' ).addEventListener( 'click', async() => {
      const s = await streamData;
      const names = await this.getGroupNames();
      const displayURL = document.querySelector( '#URL-drawer' );
      const groupData = (await s.ownData ).data.group;
      const number = parseInt( s.getCookies().groupNum ) === -1 ? 0 : parseInt( s.getCookies().groupNum );
      
      if( !groupData.length ){
        document.cookie = `groupNum=-1; max-age=${60*60*24*365}`;
        document.querySelector( '#group-operation' ).dispatchEvent( new Event( 'open' ) );
        return;
      }
      displayURL.querySelector( 'input' ).value = `https://worker-schedule.glitch.me/join/${groupData[number]}`;
      navigator.clipboard.writeText(`https://worker-schedule.glitch.me/join/${groupData[number]}`);
      displayURL.dispatchEvent( new Event( 'open' ) );
      $("#qrcode").html( '' );
      $("#qrcode").qrcode( { text: unescape( encodeURIComponent( `https://worker-schedule.glitch.me/join/${ groupData[number] }`) ) } ); 
    } );
  }
    
  setGroupSelect()
  {
    return new Promise( async resolve => {
      
      this.groupNames = await this.getGroupNames();
      if( !this.groupNames ) return;
      
      const groupSelector = document.querySelector( '#select-group' );
      groupSelector.querySelectorAll( 'option:not( [value="create-group"] )' ).forEach( e => e.remove() );
      this.groupNames.reverse().forEach( ( name, i ) => {
        
        const selectItem = document.createElement( 'option' );
        selectItem.value = this.groupNames.length - i - 1;
        selectItem.textContent = name.groupName;
        groupSelector.insertAdjacentElement( 'afterbegin', selectItem );
      } );
      resolve( this.groupNames );
    } );
  }
  
  setShareCalendar( GID )
  {
    this.getGroupData( GID ).then( ( data ) => {
      this.groupData = data;
      this.generateShare();
    } )
  }
  
  setScroll()
  {
    document.querySelector( '#calendar' ).removeEventListener( 'onScroll', this.generateShare );
    document.querySelector( '#calendar' ).addEventListener( 'onScroll', this.generateShare );
  }
  
  async generateShare()
  {
      console.log( this.shareList.querySelectorAll( ':scope > .add-member' ) );
    
    this.shareList.querySelectorAll( ':scope > .add-member' ).forEach( e => e.remove() );
    // this.nameWrapper.querySelectorAll( ':scope > :not( .add-member )' ).forEach( e => e.remove() );
    
    const sdw = document.createElement( 'div' );
    sdw.classList.add( 'share-date-wrapper' );
    sdw.classList.add( 'add-member' );
    console.log( ( await calendar ).currentDate );
    for( let i = 0; i < new Date( ( await calendar ).currentDate.getFullYear(), ( await calendar ).currentDate.getMonth() + 1 , 0 ).getDate(); i++ ){
      console.log( i );
        const shareDate = document.createElement( 'div' );
        shareDate.classList.add( 'share-date' );
        sdw.appendChild( shareDate ); 
    }
    this.shareList.appendChild( sdw );
    
    if( !( await this.groupData ) ){
      return;
    }
    
    [...( await this.groupData )].reverse().forEach( async user => {
      
      this.shareList.querySelectorAll( ':scope > :not( .add-member )' ).forEach( e => e.remove() );
      this.nameWrapper.querySelectorAll( ':scope > :not( .add-member )' ).forEach( e => e.remove() );
      
      const myData = await (await streamData).ownData;
      
      if( user.userName === myData.userName ) return;
      
      const shareName = document.createElement( 'div' );
      const div = document.createElement( 'div' );
      const shareDateWrapper = document.createElement( 'div' );
      shareDateWrapper.classList.add( 'share-date-wrapper' );
      shareName.classList.add( 'share-name' );
      div.textContent = user.userName;
      
      shareName.appendChild( div );
      
      this.nameWrapper.insertAdjacentElement( 'afterbegin', shareName );

      document.querySelectorAll( '#this-month .date:not( .not-this-month )' ).forEach( v => {
        const shift = user.data.shift;
        const currentDate = getDateFromDateElement( v );
        
        const shareDate = document.createElement( 'div' );
        if( v.classList.contains( 'select-date' ) )
          shareDate.classList.add( 'select-date' );
          
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
  
  async leaveGroup( v )
  {
    return ( await streamData ).getData( '/leaveGroup/' + v );
  }
  
  getGroupNames(){
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