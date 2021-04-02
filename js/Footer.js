export class Footer
{
  constructor()
  {
    this.footer = document.querySelector( '#footer' );
    this.content = document.querySelector( '#content-wrapper' );
    
    this.footer.querySelector( '#month-calendar' ).addEventListener( 'click', () => this.month() );
    this.footer.querySelector( '#week-calendar' ).addEventListener( 'click', () => this.week() );
    this.footer.querySelector( '#list-calendar' ).addEventListener( 'click', () => this.list() );
  }
  
  month()
  {
    this.content.classList = [];
    this.content.classList.add( 'month' );
  }
  
  week()
  {
    this.content.classList = [];
    this.content.classList.add( 'week' );
  }
  
  list()
  {
    this.content.classList = [];
    this.content.classList.add( 'list' );
  }
}