export class Share
{
  constructor()
  {
    this.registListener();
  }
  
  getShareData()
  {
    
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