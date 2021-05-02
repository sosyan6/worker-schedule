Date.prototype.format = function( format ){
  return format
	.replace( /dd/, ['日', '月', '火', '水', '木', '金', '土'][this.getDay()] )
	.replace( /YYYY/, this.getFullYear() )
	.replace( /MM/, `${ this.getMonth() + 1 }`.padStart( 2, 0 ) )
	.replace( /DD/, `${ this.getDate() }`.padStart( 2, 0 ) )
	.replace( /HH/, `${ this.getHours() }`.padStart( 2, 0 ) )
	.replace( /mm/, `${ this.getMinutes() }`.padStart( 2, 0 ) )
	.replace( /SS/, `${ this.getSeconds() }`.padStart( 2, 0 ) )
	.replace( /DATE/, this );
};

String.prototype.toRGB = function(){
  if( this.match( /#.{8}/ ) )
    return [ parseInt( this.substring( 1,3 ), 16 ), parseInt( this.substring( 3, 5 ), 16 ), parseInt( this.substring( 5, 7 ), 16 ), parseInt( this.substring( 7, 9 ), 16 ) ];
  if( this.match( /#.{6}/ ) )
    return [ parseInt( this.substring( 1,3 ), 16 ), parseInt( this.substring( 3, 5 ), 16 ), parseInt( this.substring( 5, 7 ), 16 ) ];
};

String.prototype.isBright = function(){
  if( this.match( /#.{6,8}/ ) )
    return this.toRGB().slice( 0, 3 ).reduce( ( s, v ) => s + v ) > 256 * 3 / 2;
}

Array.prototype.toHEX = function(){
  if( this.length !== 3 && this.length !== 4 ) return null;
  return `#${ this.map( v => v < 0 ? 0 : ( v > 255 ? 255 : v ) ).map( v => v.toString( 16 ).padStart( 2, 0 ) ).join( '' ) }`;
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
