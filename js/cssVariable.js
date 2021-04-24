const hoverShade = 16;
const activeShade = hoverShade * 2;
const transparent = 32;

[...[...document.styleSheets].find( v => v.href.match( 'index.css' ) ).cssRules].find( v => v.selectorText === '*' ).cssText.match( /--.+?color: #.{6,8};/g ).forEach( css => {
  const { name, value } = css.match( /--(?<name>.+?): (?<value>.+?);/ ).groups;
  
  document.documentElement.style.setProperty( `--hover-${ name }`, value.toRGB().map( v => v + ( hoverShade * ( value.isBright() ? -1 : 1 ) ) ).toHEX() );
  document.documentElement.style.setProperty( `--clicked-${ name }`, value.toRGB().map( v => v + ( activeShade * ( value.isBright() ? -1 : 1 ) ) ).toHEX() );
  document.documentElement.style.setProperty( `--transparent-${ name }`, value.toRGB().slice( 0, 3 ).concat( transparent ).toHEX() );
} );