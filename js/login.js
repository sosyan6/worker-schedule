window.onload = () => {
  const signin = document.querySelector( 'div#sign-in' )
  const signup = document.querySelector( 'div#sign-up' );
  const body = document.querySelector( 'body' );
  
  const signs = [signin, signup];
  signs.forEach( ( target, i ) => {
    const reverse = signs[( i ? 0 : 1 )];
    reverse.addEventListener( 'click', () => {
      if( reverse.classList.contains( 'spread' ) ) return;
      if( target.classList.contains( 'spread' ) ) {
        const loginInfo = {};
        const inputs = [...target.querySelectorAll( 'input' )];
        inputs.map( v => loginInfo[v.name] = v.value );

        if( Object.values( loginInfo ).every( v => v ) ){
          reverse.querySelector( '.button-text' ).classList.add( 'loading' );
          if( i ){  // Signin
            $.post( 'signin', loginInfo )
            .done( res => {
              if( res === "login Success" ) location.reload();
              else{
                reverse.style.animation = 'button-anim .6s ease';
                setTimeout( () => {
                  reverse.style.animation = '';
                },600 );
              }
            } );
          }else{    // Signup
            $.post( 'signup', loginInfo )
            .done( res => {
              if( res === "login Success" ) location.reload();
              else{
                reverse.style.animation = 'button-anim .6s ease';
                setTimeout( () => {
                  reverse.style.animation = '';
                },600 );
              }
            } );
          }
        }else{
          inputs.forEach( v => {
            //  未入力あったとき
            if( !v.value ) v.style.border = '3px double red';
          } );
          reverse.style.animation = 'button-anim .6s ease';
          setTimeout( () => {
            reverse.style.animation = '';
          },600 );
        }
      }else{
        target.classList.add( 'spread' );
        reverse.classList.add( 'login' );
        target.querySelector( 'input' ).focus();
      }
    } );
  } );
  
  body.addEventListener( 'click', ( e ) => {
    if( !e.target.isEqualNode( body ) ) return;
    signup.classList.remove( 'spread' );
    signin.classList.remove( 'spread' );
    signup.classList.remove( 'login' );
    signin.classList.remove( 'login' );
    document.querySelectorAll( 'input' ).forEach( v => v.style.border = '' );
  } );
}