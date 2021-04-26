export class StreamData 
{
  constructor()
  {
    this.getCookies();
    this.ownData = this.loadData().then( json => this.onDownloadSuccessed( json ) ,this.onDownloadFailed );
  }
  
  onDownloadSuccessed( json )
  {
    this.getCookies();
    document.querySelector( '#add-shift-button > .drawer-menu' ).addEventListener( 'onclose', () => this.saveData() );
    document.querySelector( '#prev-month-button' ).addEventListener( 'save', () => this.saveData() );
    document.querySelector( '#next-month-button' ).addEventListener( 'save', () => this.saveData() );
    document.querySelector( '#display-name' ).textContent = decodeURI(this.cookies.name) + ' さん';
    return json;
  }
  
  onDownloadFailed()
  {
    console.log( 'failed' );
    // document.cookie = "SID=;";
    // location.reload();
  }
  
  getCookies()
  {
    this.cookies = {};
    document.cookie.split( ';' ).forEach( cookie =>
    {
      cookie = cookie.replace( ' ', '' );
      const data = cookie.split( '=' );
      this.cookies[data[0]] = data[1];
    } );
    //  一応外部からも取得できるようにする
    return this.cookies;
  }
  
  createGroup( data )
  {
    return new Promise( resolve => {
      $.ajax(
        {
          url: `/createGroup`,
          type: 'post',
          data: JSON.stringify( data ),
          datatype: 'json',
          contentType: "application/json; charset=utf-8"
        }
      ).done( res => this.ownData.then( ( d ) => { d.data.group.push( res ); this.saveData(); resolve( res ); } ) );
    } )
  }
  
  getData( url )
  {
    return new Promise( ( resolve ) => {
      $.post( url, {} )
      .done( res => {
        resolve( res );
      } );
    } );
  }
  
  loadData()
  {
    return new Promise( ( resolve, reject ) =>
    {
      $.post( '/getdata?getname=true', this.cookies )
      .done( res => {
        console.log( JSON.parse( res ) );
        resolve( JSON.parse( res ) );
      } )
      .fail( () => reject() );
    } 
    );
  }
  
  saveData()
  {
    this.ownData.then( ( d ) =>
    {
      $.ajax( { url: '/savedata',
               type: 'post',
               data: JSON.stringify(d),
               datatype: 'json',
               contentType: "application/json; charset=utf-8"
      } )
      .done( res => console.log( d ) )
    } );
  }
}

