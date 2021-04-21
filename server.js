const express = require("express");
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const crypto = require( 'crypto' );
const fs = require( 'fs' );
const app = express();

const baseJSON = JSON.parse( fs.readFileSync( 'baseData.json', 'utf-8' ) );

app.use( cookieParser() );
app.use( bodyParser() );

function genHash( req ){
  console.log( req.body );
  const nameHex = crypto.createHash('sha256').update( req.body.name, 'utf8').digest('hex');
  const passHex = crypto.createHash('sha256').update( req.body.password, 'utf8').digest('hex');
  return crypto.createHash('sha256').update( nameHex + passHex, 'utf8').digest('hex');
}

app.use( async( req, res, next ) => {
  if( req.url === '/' && req.cookies.SID ) {
    res.sendFile( `${ __dirname }/views/index.html` );
    return;
  }
  if( req.url === '/signup' ){
    const hashHex = genHash( req );
    if( !fs.existsSync(`.data/${hashHex}.json`) ){
      //  ファイルがないなら作成して成功を返す
      const newJson = baseJSON;
      newJson.loginInfo = req.body;
      fs.writeFile( `.data/${hashHex}.json`, JSON.stringify( newJson ), err => {
        if( err ) {
          res.send('error'); return;
        }
      } );
      //  maxAgeはmsで表すらしい
      res.cookie( 'SID', hashHex, { maxAge: 1000 * 3600 * 24 * 365 } );
      res.send( 'login Success' );
      return;
    }else{
      res.send( 'already Exist' );
    }
  }
  
  if( req.url === '/signin' ){
      
    const hashHex = genHash( req );
    
    if( fs.existsSync(`.data/${hashHex}.json`) ){
      res.cookie( 'SID', hashHex, { maxAge: 1000 * 3600 * 24 * 365 } );
      res.send( 'login Success' );  //  ファイルがあるなら成功を返す
    }else{
      res.send( 'not Exist' );
    }
  }
  
  if( req.url === '/getdata' ){
    console.log( req.body.SID );
    fs.readFile( `.data/${req.body.SID}.json`, 'utf-8', ( err, data ) => {
      if( err ) 
      {
        res.status( 404 ).send( 'ファイルが見つかりませんでした' ); 
        return;
      }
      const newJson = JSON.parse( data );
      res.cookie( 'name', newJson.loginInfo.name, { maxAge: 1000 * 3600 * 24 * 365 } );
      delete newJson.loginInfo.password;
      res.send( JSON.stringify( newJson ) );
      console.log( "atta" );
    });  
    return;
      // res.sendFile( `${ __dirname }/.data/${req.body.SID}.txt` );
  }
  
  if( req.url === '/savedata' ){
    if( fs.existsSync(`.data/${req.cookies.SID}.json`) ){
      fs.writeFile( `.data/${req.cookies.SID}.json`, req.body, ( err ) => {
        if( err ){
          res.send( 'error' ); return;
        } 
      } );
      console.log( '成功したかも' );
      res.send( 'success' );
    }
    return;
  }
  
  if( req.url === '/' ){
    res.sendFile( `${ __dirname }/views/login.html` );
    return;
  }
  res.sendFile( `${ __dirname }/${ req.url }` );
} );

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});