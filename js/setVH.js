const setVH = () => document.documentElement.style.setProperty( '--vh', window.innerHeight / 100 + 'px');
window.addEventListener( 'resize', ( e ) => setVH() );
setVH();