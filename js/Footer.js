export class Footer
{
  constructor()
  {
    this.footer = document.querySelector( '#footer' );
    this.content = document.querySelector( '#content-wrapper' );
    
    this.footer.querySelector( '#month-calendar' ).addEventListener( 'click', () => this.month() );
    this.footer.querySelector( '#week-calendar' ).addEventListener( 'click', () => this.week() );
    this.footer.querySelector( '#list-calendar' ).addEventListener( 'click', () => this.list() );
    this.footer.querySelector( '#share-calendar' ).addEventListener( 'click', () => this.share() );
  }
  
  async month()
  {
    this.content.classList = [];
    this.content.classList.add( 'month' );
    ( await calendar ).setCurrentMonth();
  }
  
  async week()
  {
    this.content.classList = [];
    this.content.classList.add( 'week' );
    
    document.querySelector( 'div#this-month' ).scrollTo( { top: 0, left: document.querySelector( 'div#this-month .today' )?.offsetLeft || 0, behavior: 'smooth'  } );
    ( await calendar ).setCurrentMonth();
  }
  
  async list()
  {
    this.content.classList = [];
    this.content.classList.add( 'list' );
    
    document.querySelector( 'div#this-month' ).scrollTo( { top: document.querySelector( 'div#this-month .today' )?.offsetTop || 0, left: 0, behavior: 'smooth'  } );
    ( await calendar ).setCurrentMonth();
  }
  
  async share()
  {
    this.content.classList = [];
    this.content.classList.add( 'share' );
    
    document.querySelector( 'div#calendar' ).scrollTo( { top: 0, left: document.querySelector( 'div#calendar' ).offsetWidth } );
    document.querySelector( 'div#this-month' ).scrollTo( { top: document.querySelector( 'div#this-month .today' )?.offsetTop || 0, left: 0, behavior: 'smooth'  } );
    document.querySelector( 'div#share-list' ).scrollTo( { top: document.querySelector( 'div#this-month .today' )?.offsetTop || 0, left: 0, behavior: 'smooth'  } );
    ( await calendar ).setCurrentMonth();
  }
}