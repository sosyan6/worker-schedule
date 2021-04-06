export class StreamData 
{
  constructor()
  {
    this.getCookies();
    this.ownData = this.loadData().then( json => this.onDownloadSuccessed( json ), this.onDownloadFailed );
  }
  
  onDownloadSuccessed( json )
  {
    console.log( 'successed' );
    document.querySelector( '#add-shift-button > .drawer-menu' ).addEventListener( 'onclose', () => this.saveData() );
    return json;
  }
  
  onDownloadFailed()
  {
    console.log( 'failed' );
    document.cookie = "SID=;";
    location.reload();
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
  
  async saveData()
  {
    $.post( '/savedata', ( await this.ownData ).data )
    .done( res => console.log( 'saved!' ) )
  }
}