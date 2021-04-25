export class Share
{
  constructor()
  {
    this.shareWrapper = document.querySelector( '#share-wrapper' );
    this.nameWrapper = document.querySelector( '#name-wrapper' );
    this.shareList = document.querySelector( '#share-list' );
    this.registListener();
    this.setGroup();
    this.getGroupDatas().then( data => { 
      const d = data.map( v => v.map( l => l ) );
      if( d.length ) this.generateShare( d[0] );
    } );
  }
  
  generateShare( data )
  {
    data.forEach( async user => {
      const myData = await (await streamData).ownData;
      user = JSON.parse( user );
      
      if( user.userName === myData.userName ) return;
      
      const shareName = document.createElement( 'div' );
      const shareDateWrapper = document.createElement( 'div' );
      shareDateWrapper.classList.add( 'share-date-wrapper' );
      shareName.classList.add( 'share-name' );
      shareName.textContent = user.userName;
      
      this.nameWrapper.appendChild( shareName );

      document.querySelectorAll( '#this-month .date' ).forEach( v => {
        
        if( v.classList.contains( 'not-this-month' ) ) return;
        
        const shift = user.data.shift;
        const currentDate = getDateFromDateElement( v );
        
        const shareDate = document.createElement( 'div' );
        shareDate.classList.add( 'share-date' );
        
        if( shift && shift[currentDate.format('YYYY/MM')] && shift[currentDate.format('YYYY/MM')][currentDate.format('DD')] && shift[currentDate.format('YYYY/MM')][currentDate.format('DD')].shiftName ){
          const dateShift = document.createElement( 'div' );
          dateShift.classList.add( 'date-shift-type' );
          dateShift.textContent = user.data.shiftType[shift[currentDate.format('YYYY/MM')][currentDate.format('DD')].shiftName].initial;
          shareDate.appendChild( dateShift );
        }
        
        shareDateWrapper.appendChild( shareDate );
        } );
      
      this.shareList.appendChild( shareDateWrapper );
      
    } );
  }
  
  async getGroupData( v )
  {
    return ( await streamData ).getData( '/getGroupData/' + v );
  }
  
  async getGroupDatas()
  {
    const data = await (await streamData).ownData;
    const groupData = data.data.group.map( async v => await this.getGroupData( v ) );
    console.log( groupData );
    return Promise.all(groupData);
  }
  
  setGroup()
  {
    const shareDiv = document.createElement( 'div' );
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