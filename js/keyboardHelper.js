const keyboard = {};

document.addEventListener( 'keydown', ( e ) => {
  keyboard[e.code] = e;
} );

document.addEventListener( 'keyup', ( e ) => {
  keyboard[e.code] = null;
} );