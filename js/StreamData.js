export class StreamData 
{
  constructor()
  {
    this.getCookies();
    this.loadData().then( json => this.onDownloadSuccessed( json ), this.onDownloadFailed );
  }
  
  onDownloadSuccessed( json )
  {
    console.log( 'successed' );
    this.myData = json;
    this.setShiftType();
  }
  
  onDownloadFailed()
  {
    console.log( 'failed' );
    document.cookie = "SID=;";
    location.reload();
  }
  
  setShiftType()
  {
    this.createShiftTypeSelect();
    
    const shiftTypeSelect = document.querySelector( '#shift-type-select' );
    shiftTypeSelect.querySelectorAll( '.shift-type' ).forEach( e => {
      console.log( e );
    } );
    
  }
  
  createShiftTypeSelect()
  {
    const circle = `<circle cx="100" cy="100" r="100"/>`;
    const rect = `<rect x="0" y="0" width="200" height="200"/>`;
    
    
    const baseShiftType = document.createElement( 'div' );
    baseShiftType.classList.add( 'shift-type' );
    const shiftTypeSelect = document.querySelector( '#shift-type-select' );
    
    const shiftTypeData = this.myData.data.shiftType;
    const shiftKeyArray = Object.keys(shiftTypeData);
    for( let i = len( shiftTypeData ) - 1; i >= 0 ; i-- ){
//  Im Playing Genshin Impact. plz fix 'selectedSharp' of under.
      const selectedSharp = () =>
      {
        if( shiftTypeData[shiftKeyArray[i]].sharp === 'circle' ) return circle;
        if( shiftTypeData[shiftKeyArray[i]].sharp === 'rect' ) return rect;
      }
      
      const s = document.createElement( 'div' );
      s.classList.add( 'shift-type' );
      s.innerHTML = `<svg viewBox="0 0 200 200" style = "fill: ${shiftTypeData[shiftKeyArray[i]].color}">${selectedSharp()}</svg>`;
      
      const initialText = document.createElement( 'div' );
      initialText.innerText = shiftTypeData[shiftKeyArray[i]].initial;
      initialText.classList.add( 'shift-type-initial' );
      s.appendChild( initialText );
      shiftTypeSelect.insertAdjacentElement( 'afterbegin', s.cloneNode( true ) );
    }
  }
  
  getCookies()
  {
    this.cookies = {};
    document.cookie.split( ';' ).forEach( cookie =>
    {
      const data = cookie.split( '=' );
      this.cookies[data[0]] = data[1];
    } );
    //  一応外部からも取得できるようにする
    return this.cookies;
  }
  
  async loadData()
  {
    return new Promise( ( resolve, reject ) => {
      $.post( '/getdata', this.cookies )
      .done( res => {
        resolve( JSON.parse( res ) )
      } )
      .fail( () => { console.log( "oppai" ); reject(); } );
    } );
  }
}