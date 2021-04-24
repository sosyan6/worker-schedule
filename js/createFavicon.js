{
  const canvas = document.createElement( 'canvas' );
  const date = ( new Date() ).getDate();
  
  if( navigator.userAgent.match( /iPad|iPhone|Android.+Mobile/ ) ){
    canvas.width = 256;
    canvas.height = 256;
  }else{
    canvas.width = 16;
    canvas.height = 16;
  }

  const c = canvas.getContext( '2d' );

  c.lineWidth = canvas.width / 16;
  c.lineJoin = 'round';
  c.textAlign = 'center';
  c.fillStyle = '#FFFFFF';
  c.strokeStyle = '#111111';
  c.textBaseline = 'middle';
  c.fillRect( c.lineWidth, c.lineWidth * 2, canvas.width - c.lineWidth * 2, canvas.width - c.lineWidth * 4 );
  c.strokeRect( c.lineWidth, c.lineWidth * 2, canvas.width - c.lineWidth * 2, canvas.width - c.lineWidth * 4 );

  c.font = `1px sans-serif`;
  for( let i = 1; i < 256; i++ )
  {
    const m = c.measureText( date );
    if( Math.abs( m.actualBoundingBoxLeft ) + Math.abs( m.actualBoundingBoxRight ) >= canvas.width - c.lineWidth * 4 ) break;
    c.font = `${ i }px sans-serif`;
  }
  c.fillStyle = '#111111';
  c.fillText( date, canvas.width / 2, canvas.height / 2 );

  document.querySelector( 'link[rel="shortcut icon"]' ).href = canvas.toDataURL();
}