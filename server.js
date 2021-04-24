const express = require("express");
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const crypto = require( 'crypto' );
const fs = require( 'fs' );
const app = express();

const baseJSON = JSON.parse( fs.readFileSync( 'baseData.json', 'utf-8' ) );

app.use( cookieParser() );
app.use( bodyParser() );

function genHash256( hash1, hash2 ){
  const nameHex = crypto.createHash('sha256').update( hash1, 'utf8').digest('hex');
  const passHex = crypto.createHash('sha256').update( hash2, 'utf8').digest('hex');
  return crypto.createHash('sha256').update( nameHex + passHex, 'utf8').digest('hex');
}

app.post( '/signup', ( req, res ) => {
  console.log( 'aaaaa' );
  const hashHex = genHash256( req.body.name, req.body.password );
  if( !fs.existsSync(`.data/user/${hashHex}.json`) ){
    //  ファイルがないなら作成して成功を返す
    const newJson = baseJSON;
    newJson.loginInfo = req.body;
    fs.writeFile( `.data/user/${hashHex}.json`, JSON.stringify( newJson ), err => {
      if( err ) {
        res.send('error'); return;
      }
    } );
    if( !fs.existsSync(`.data/userInfo/${req.body.email}.json`) )
    {
      const userInfo = `{ SID: ${hashHex} }`;
      fs.writeFile( `.data/userInfo/${req.body.email}.json`, JSON.stringify( userInfo ), err => {
        if( err ) {
          console.log( err ); return;
        }
      } );
      fs.writeFile( `.data/userInfo/${hashHex}.json`, JSON.stringify( `{ email: ${req.body.email}, name: ${req.body.name}, password: ${req.body.name} }` ), err => {
        if( err ) {
          console.log( err ); return;
        }
      } );
    }
    //  maxAgeはmsで表すらしい
    res.cookie( 'SID', hashHex, { maxAge: 1000 * 3600 * 24 * 365 } );
    res.send( 'login Success' );
    return;

  }else{
    res.send( 'already Exist' );
  }
} );

app.post( '/signin', ( req, res ) => {
  const hashHex = genHash256( req.body.name, req.body.password );
    
  if( fs.existsSync(`.data/user/${hashHex}.json`) ){
    res.cookie( 'SID', hashHex, { maxAge: 1000 * 3600 * 24 * 365 } );
    res.send( 'login Success' );  //  ファイルがあるなら成功を返す
  }else{
    res.send( 'not Exist' );
  }
  
} );

app.post( '/savedata', ( req, res ) => {
  console.log( req.body );
  if( fs.existsSync(`.data/user/${req.cookies.SID}.json`) ){
    fs.writeFile( `.data/user/${req.cookies.SID}.json`, JSON.stringify( req.body ), ( err ) => {
      if( err ){
        res.send( 'error' ); return;
      } 
    } );
    console.log( 'データを保存しました' );
    res.send( 'success' );
  }
  return;
} );

app.post( '/createGroup', ( req, res ) => {
  const hash = genHash256( req.body.SID, req.body.groupName );
  if( !fs.existsSync( `.data/group/${hash}.json` ) )
  {
    fs.writeFile( `.data/group/${hash}.json`, JSON.stringify( { groupInfo: { groupName: req.body.groupName }, users: [req.body.SID] } ), ( err ) => {
      if( err ){
        console.log( err );
        res.send( 'error' );
        return;
      }
      console.log( 'グループを作りました' );
      res.send( hash );
    } );
    return;
  }
  else res.status( 406 ).send( 'already Exist' );    
    
} );

app.post( /^\/join(\?.*)?$/, ( req, res ) => {
  if( !Object.keys(req.query).length ){
    res.send( '不正なURLです' );
    return;
  }
  if( !req.query.GID ){
    res.send( '不正なクエリです' );
    return;
  }
  if( !req.cookies.SID ){
    res.send( 'ログインしてから再試行してください' );
    return;
  }
  if( req.query && req.query.GID && req.cookies.SID )
  {
    if( fs.existsSync( `.data/user/${req.cookies.SID}.json` ) &&
        fs.existsSync( `.data/group/${req.query.GID}.json` ) )
    {
      fs.readFile( `.data/group/${req.query.GID}.json`, 'utf-8', ( err, data ) => {
        if( err ){
            console.log( err );
            res.send( 'error' );
            return;
          }
       const newJson = JSON.parse( data );
       newJson.users.push( req.cookies.SID );
        fs.writeFile( `.data/group/${req.query.GID}.json`, JSON.stringify( newJson ), ( err ) => {
          if( err ){
            console.log( err );
            res.send( 'error' );
            return;
          }
          console.log( 'グループに参加しました' );
          res.send( 'join group!' );
        } );
      } );
      res.send( 'success!' );
      return;
    }else{
      res.send( 'グループが見つかりませんでした' );
      return;
    }
  }
} );

app.post( /^\/getdata(\?.*)?$/, ( req, res ) => {
  
  console.log( req.body.SID );
  
  fs.readFile( `.data/user/${req.body.SID}.json`, 'utf-8', ( err, data ) => {
    if( err ) 
    {
      res.status( 404 ).send( 'ファイルが見つかりませんでした' ); 
      return;
    }
    res.json( data );
    if( !req.query.getname ) return;
    fs.readFile( `.data/userInfo/${req.body.SID}.json`, 'utf-8', ( err, sData ) => {
      if( err ) 
      {
        res.status( 404 ).send( 'ファイルが見つかりませんでした' ); 
        return;
      }
      const newJson = JSON.parse( sData );
      res.cookie( 'name', newJson.name, { maxAge: 1000 * 3600 * 24 * 365 } );
      console.log( "atta" );
    } );
  } );  
    return;
} );

app.get( /\/.*/, ( req, res ) => {
  console.log( req.url );
  if( req.url === '/' && req.cookies.SID ) res.sendFile( `${ __dirname }/views/index.html` );
  else if( req.url === '/' ) res.sendFile( `${ __dirname }/views/login.html` );
  else res.sendFile( `${ __dirname }/${ req.url }` );
} );

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// 打倒スピカ！