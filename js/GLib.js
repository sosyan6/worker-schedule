Date.prototype.format = function( format ){
  return format
	.replace( /dd/, this.getDay() )
	.replace( /0/, '日' )
	.replace( /1/, '月' )
	.replace( /2/, '火' )
	.replace( /3/, '水' )
	.replace( /4/, '木' )
	.replace( /5/, '金' )
	.replace( /6/, '土' )
	.replace( /YYYY/, this.getFullYear() )
	.replace( /MM/, String( this.getMonth() + 1 ).padStart( 2, 0 ) )
	.replace( /DD/, String( this.getDate() ).padStart( 2, 0 ) )
	.replace( /HH/, String( this.getHours() ).padStart( 2, 0 ) )
	.replace( /mm/, String( this.getMinutes() ).padStart( 2, 0 ) )
	.replace( /SS/, String( this.getSeconds() ).padStart( 2, 0 ) )
	.replace( /DATE/, this );
};

String.prototype.toRGB = function(){
  if( this.match( /#....../ ) )
    return [ parseInt( this.substring( 1,3 ), 16 ), parseInt( this.substring( 3, 5 ), 16 ), parseInt( this.substring( 5, 7 ), 16 ) ];
};

Array.prototype.last = function(){
  return this.slice(-1)[0];
}

Array.prototype.next = function( value ){
  const indexNum = this.indexOf( value );
  if( indexNum !== -1 ) return this[this.indexOf( value ) + 1];
  else return null;
}

NodeList.prototype.last = function(){
  return [...this].last();
}


function len( obj )
{
  return Object.keys( obj ).length;
}

function elementsToDict( elements ) {
  const dict = {};
  elements.forEach( e => { if( e.name ) dict[e.name] = e.value; }  );
  return dict;
}

function inputCheck( dict ) {
  return Object.values( dict ).every( v => v );
}

function getDateFromDateElement( element )
{
  if( !element.classList.contains( 'date' ) ) return;
  const date = new Date( document.querySelector( 'input#date' ).value );
  switch( element.parentNode.parentNode.id ){
    case 'prev-month':
      date.setMonth( date.getMonth() - 1 );
    return;
    case 'next-month':
      date.setMonth( date.getMonth() + 1 );
    return;
  }
  
  if( element.classList.contains( 'not-this-month' ) ){
    if( [...element.parentNode.parentNode.querySelectorAll( '.date' )].indexOf( element ) < 7 * 6 / 2 ){
      date.setMonth( date.getMonth() - 1 );
    }else{
      date.setMonth( date.getMonth() + 1 );
    }
  }
  
  date.setDate( element.textContent.match( /^\d+/ ) );
  
  return date;
}