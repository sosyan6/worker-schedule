Date.prototype.format = function( format ){
  return format
	.replace( /d/, this.getDay() )
	.replace( /\(0\)/, '\(日\)' )
	.replace( /\(1\)/, '\(月\)' )
	.replace( /\(2\)/, '\(火\)' )
	.replace( /\(3\)/, '\(水\)' )
	.replace( /\(4\)/, '\(木\)' )
	.replace( /\(5\)/, '\(金\)' )
	.replace( /\(6\)/, '\(土\)' )
	.replace( /YYYY/, this.getFullYear() )
	.replace( /MM/, String( this.getMonth() + 1 ).padStart( 2, 0 ) )
	.replace( /DD/, String( this.getDate() ).padStart( 2, 0 ) )
	.replace( /hh/, String( this.getHours() ).padStart( 2, 0 ) )
	.replace( /mm/, String( this.getMinutes() ).padStart( 2, 0 ) )
	.replace( /ss/, String( this.getSeconds() ).padStart( 2, 0 ) )
	.replace( /DATE/, this );
};

Array.prototype.last = function(){
  return this.slice(-1)[0];
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