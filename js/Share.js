export class Share
{
  constructor()
  {
    this.registListener();
  }
  
  async getShareData()
  {
    const aaaaa = await (await streamData).ownData;
  }
  
  async getGroupData()
  {
    const groupData = ( await streamData ).getData();
    return 
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