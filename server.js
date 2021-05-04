const express = require("express");
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const crypto = require( 'crypto' );
const fs = require( 'fs' );
const nodeMailer = require( 'nodemailer' );
const app = express();
const marked = require( 'marked' );

const baseJSON = JSON.parse( fs.readFileSync( 'baseData.json', 'utf-8' ) );

app.use( cookieParser() );
app.use( bodyParser() );

function genHash256( hash1 ){
  const nameHex = crypto.createHash('sha256').update( hash1, 'utf8').digest('hex');
  return crypto.createHash('sha256').update( nameHex, 'utf8').digest('hex');
}

function randomHash(){
  const random = crypto.randomBytes( 8 ).toString();
  return crypto.createHash('sha256').update( random, 'utf8').digest('hex');
}

function sendMail( option ){
  const address = 'worker.schedule.server@gmail.com';
  const transporter = nodeMailer.createTransport(
  {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: address,
      pass: process.env.GMAIL_PASSWORD
    }
  } );
  
  option.from = `ワーカースケジュール<${address}>`;
  
  transporter.sendMail( option, ( error, info ) => {
    if( error ){
      console.log(error);
    }else{
      console.log( 'Email sent: ' + info.response );
    }
  } );
}

app.use( ( req, res, next ) => {
  res.set( 'Cache-control', 'no-store' );
  next();
} );

app.post( '/signup', ( req, res ) => {
  const hashHex = randomHash();
  
  if( !fs.existsSync( `.data/userInfo/infos.json` ) ){
    fs.writeFile( `.data/userInfo/infos.json`, '{}', err => console.log( err ) );
  }
  
  if( !fs.existsSync(`.data/user/${hashHex}.json`) && !fs.existsSync(`.data/userInfo/${req.body.email}.json`) ){
    
    //  ファイルがないなら作成して成功を返す
    const newJson = baseJSON;
    newJson.userName = req.body.name;
    fs.writeFile( `.data/user/${hashHex}.json`, JSON.stringify( newJson ), err => {
      if( err ) {
        res.send('error');
        res.end();
        return;
      }
    } );

    const userInfo = { name: req.body.name, password : genHash256( req.body.password ) };
    fs.writeFile( `.data/userInfo/${hashHex}.json`, JSON.stringify( userInfo ), err => {
      if( err ) {
        res.send( 'error' );
        res.end();
        return;
      }
    } );
    
    fs.readFile( `.data/userInfo/infos.json`, 'utf-8', ( err, data ) => {
      
      const json = JSON.parse( data );
      const GID = genHash256(req.body.name + genHash256( req.body.password ) );
      json[GID] = { SID: hashHex };
      json[req.body.email] = { SID: hashHex };
      
      fs.writeFile( `.data/userInfo/infos.json`, JSON.stringify( json ), err => {
    } );
      
    const opt = {
      to: req.body.email,
      subject: '認証メール',
      text: 
      `
      メールアドレスを認証しました。
      心当たりのない場合はお手数ですが削除いただけると幸いです。
      `
    }
    //  maxAgeはmsで表すらしい
    res.cookie( 'SID', hashHex, { maxAge: 1000 * 3600 * 24 * 365 } );
    res.send( 'login Success' );
    res.end();
    sendMail( opt );
    return;
  } );
    
  }else{
    res.send( 'Already User Exist or Already Email Exist' );
    res.end();
  }
} );

app.post( '/signin', ( req, res ) => {
  
  fs.readFile( `.data/userInfo/infos.json`, 'utf-8', ( err, data ) => {
    const hashHex = genHash256( req.body.name + genHash256( req.body.password ) );
    const json = JSON.parse( data );
    if( json[req.body.name] )
    {
      res.cookie( 'SID', json[req.body.name].SID, { maxAge: 1000 * 3600 * 24 * 365 } );
      res.send( 'login Success' );  //  ファイルがあるなら成功を返す
    }
    else if( json[hashHex] )
    {
      res.cookie( 'SID', json[hashHex].SID, { maxAge: 1000 * 3600 * 24 * 365 } );
      res.send( 'login Success' );  //  ファイルがあるなら成功を返す
    }else
    {
      res.send( 'not Exist' );
    }
  } );
} );

app.post( '/forget', ( req, res ) => {
  fs.readFile( `.data/userInfo/infos.json`, 'utf-8', ( err, data ) => {
    if( err ) return;
    const userJson = JSON.parse( data );
    if( userJson[req.body.email] ){
      fs.readFile( `.data/userInfo/${userJson[req.body.email].SID}.json`, 'utf-8', ( err, d ) => {
        if( err ){
          console.log( err );
          return;
        } 
        const json = JSON.parse( d );
        const resetHash = randomHash();
        const opt = {
          to: req.body.email,
          subject: 'パスワードの再設定',
          text: 
          `
          あなたの表示名は ${json.name} です。
          パスワードを変更したい場合は本日の24時までに以下のリンクから変更してください。
          https://www.worker-schedule.com/change/${resetHash}

          心当たりのない場合はお手数ですが削除いただけると幸いです。
          `
        }
        sendMail( opt );

        fs.writeFile( `.data/change/${resetHash}.json`, d, err => { if( err ) console.log( err ) } );
        res.send( '登録いただいたメールアドレス宛にメールを送信しました' );
        
      } );
    }else{
      res.send( '入力いただいたメールアドレスは登録されていませんでした' );
    }
  } );
} );

app.get( '/change/:Hash', ( req, res ) => {
  if( !fs.existsSync( `.data/change/${req.params.Hash}.json` ) ){
   res.send( 'urlの期限が切れています!' ); 
  }else{
    res.sendFile( `${__dirname}/views/reset.html` );
  }
} );

app.post( '/reset', ( req, res ) => {
  
  const path = req.headers.referer.split( '/' );
  if( fs.existsSync( `.data/change/${path[path.length -1]}.json` ) ){
  
    fs.readFile( `.data/change/${path[path.length -1]}.json`, 'utf-8', ( err, data ) => {
    
      const newDataJson = JSON.parse( data );
      console.log( newDataJson );
      const UID = genHash256( newDataJson.name + newDataJson.password );
      newDataJson.password = genHash256( req.body.password );
      const newUID = genHash256( newDataJson.name + newDataJson.password );
      
      fs.readFile( `.data/userInfo/infos.json`, 'utf-8', ( err, data ) => {
        const infoJson = JSON.parse( data );
        
        if( infoJson[newUID] ){
          res.send( '別のパスワードをお試しください' );
          return;
        }
        
        console.log( infoJson[UID] );
        
        infoJson[newUID] = infoJson[UID];
        delete infoJson[UID];
        fs.writeFile( `.data/userInfo/infos.json`, JSON.stringify( infoJson ), err => console.log( err ) );
        fs.writeFile( `.data/userInfo/${infoJson[newUID].SID}.json`, JSON.stringify( newDataJson ), err => console.log( err ) );
        fs.unlink( `.data/change/${path[path.length -1]}.json`, (err) => console.log( err ) );
        res.send( '再設定しました' );
      } );
    } );
  }else{
    res.send( 'urlの期限が切れています' );
  }
} );

app.post( '/savedata', ( req, res ) => {
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
  const hash = randomHash();
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

app.post( '/leaveGroup/:GID', ( req, res ) => {
  console.log( 'aaaaaa' );
  fs.readFile( `.data/group/${req.params.GID}.json`, 'utf-8', ( err, data ) => {
    if( err ) res.send( err );
    const newJson = JSON.parse( data );
    newJson.users = newJson.users.filter( v => v !== req.cookies.SID );
    console.log( newJson );
    fs.writeFile( `.data/group/${req.params.GID}.json`, JSON.stringify( newJson ), ( err ) => { if( err ) res.send( err ) } );
  } );
  res.send( 'グループから退出しました' );
} );

app.get( '/join/:GID', ( req, res ) => {
  fs.readFile( 'views/join.html', 'utf-8', ( err, join ) => {
    if( !req.params.GID || !fs.existsSync( `.data/group/${req.params.GID}.json` ) ){
      // 
      res.send( join.replace( /参加 \|/g, '無効な招待 | ' ).replace( /message/, 'グループが見つかりませんでした' ) );
      return;
    }
    if( !req.cookies.SID ){
      res.send( join.replace( /message/, 'ログインしてから再試行してください' ) );
      return;
    }
    if( fs.existsSync( `.data/user/${req.cookies.SID}.json` ) )
    {
      fs.readFile( `.data/group/${req.params.GID}.json`, 'utf-8', ( err, data ) =>
      {
        const newJson = JSON.parse( data );
        console.log( newJson.users );
        if( !newJson.users.includes( req.cookies.SID ) ) newJson.users.push( req.cookies.SID );
        fs.writeFile( `.data/group/${req.params.GID}.json`, JSON.stringify( newJson ), err => {
          if( err ) res.send( 'error' );
        } );
      } );

      fs.readFile( `.data/user/${req.cookies.SID}.json`, 'utf-8', ( err, data ) => {
        const newJson = JSON.parse( data );
        if( !newJson.data.group.includes( req.params.GID ) )newJson.data.group.push( req.params.GID );
        console.log( newJson );
        fs.writeFile( `.data/user/${req.cookies.SID}.json`, JSON.stringify( newJson ), err => {
          if( err ) res.send( 'error' );
        } );
      } );

      console.log( 'グループに参加しました' );
      // res.sendFile( `${ __dirname }/views/index.html` );
      res.writeHead( 301, { Location: '/' } );
      res.end();
      return;
    }
  } );
} );

app.post( /^\/getdata(\?.*)?$/, ( req, res ) => {
  
  fs.readFile( `.data/user/${req.body.SID}.json`, 'utf-8', ( err, data ) => {
    if( err ) 
    {
      res.status( 404 ).send( 'ファイルが見つかりませんでした' ); 
      return;
    }
    if( !req.query.getname ){
      res.json( data );
      return;
    } 
    const newJson = JSON.parse( data );
    res.cookie( 'name', newJson.userName, { maxAge: 1000 * 3600 * 24 * 365 } );
    res.json( data );
  } );  
  return;
} );

app.post( '/getGroupData/:GID', ( req, res ) => {
  if( fs.existsSync( `.data/group/${req.params.GID}.json` ) )
  {
    fs.readFile( `.data/group/${req.params.GID}.json`, 'utf-8', ( err, data ) => {
      if( err )
      {
        console.log( err );
        res.status( 404 ).send( 'error' );
        return;
      }
      const getGroupData = ( ID ) => new Promise( resolve => fs.readFile( `.data/user/${ID}.json`, 'utf-8', ( err, userData ) => { 
        const json = JSON.parse( userData );
        delete json.data.group;
        
        //  最初のループでYYYY/MMのvalueを取る
        Object.values( json.data.shift ).forEach( ( v ) => {
          //  次のループでDDのvalueを取る
          Object.values( v ).forEach( ( value ) => {
            //  DDのvalue内のschedule(予定)を削除する　->  プライバシー保護のため
            delete value.schedule;
            //  もしDDのvalue内にshiftNameがあったら　->
            //  v.shiftNameと同じshiftTypeがあったらinitialに書き換える
            //  違ければカラ文字を代入
            if( value.shiftName ){
              value.shiftName = json.data.shiftType[value.shiftName] ? json.data.shiftType[value.shiftName].initial : "";
            }
          } );
        } );
        delete json.data.shiftType;
        resolve( json );
      } ) );
      Promise.all( JSON.parse( data ).users.filter( v => v !== req.cookies.SID ).map( async v => await getGroupData( v ) ) ).then( j => res.json( j ) );
    } );
  }
} );

app.post( '/getGroupName/:GID', ( req, res ) => {
  if( fs.existsSync( `.data/group/${req.params.GID}.json` ) )
  {
    fs.readFile( `.data/group/${req.params.GID}.json`, 'utf-8', ( err, data ) => {
      if( err )
      {
        console.log( err );
        res.status( 404 ).send( 'error' );
        return;
      }
      const json = JSON.parse( data );
      res.json( { 'groupName': json.groupInfo.groupName, 'GID': req.params.GID } );
  } );
  }
} );

app.get( /\.md$/, ( req, res ) => {
  fs.readFile( `${ __dirname }/views/${ req.url }`, 'utf-8', ( err, data ) => {
    if( err )
    {
      console.log( err );
      res.status( 404 ).send( 'error' );
      return;
    }
    res.send( marked( data ) );
  } );
} );

app.get( /\/.*/, ( req, res ) => {
  if( req.url === '/' && req.cookies.SID ) res.sendFile( `${ __dirname }/views/index.html` );
  else if( req.url === '/' ) res.sendFile( `${ __dirname }/views/login.html` );
  else res.sendFile( `${ __dirname }/${ req.url }` );
} );

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
  
  let preTime = new Date();
  preTime.setHours( preTime.getHours() + 9 );
  
  setInterval( () => {
    const date = new Date();
    date.setHours( date.getHours() + 9 );
    if( preTime.format( 'DD' ) !== date.format( 'DD' ) ){
      
      preTime = date;
      
      fs.readdir( '.data/change', ( err, files ) => {
        if( err ) throw err;
        
        files.forEach( file => {
          fs.unlink( `.data/change/${file}`, ( err ) => {
            if( err ) throw err;
          } );
        } );
        
        console.log( '一時ファイルを削除しました' );
      } );
    }
  }, 1000 );
});

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
	.replace( /MM/, `${ this.getMonth() + 1 }`.padStart( 2, 0 ) )
	.replace( /DD/, `${ this.getDate() }`.padStart( 2, 0 ) )
	.replace( /HH/, `${ this.getHours() }`.padStart( 2, 0 ) )
	.replace( /mm/, `${ this.getMinutes() }`.padStart( 2, 0 ) )
	.replace( /SS/, `${ this.getSeconds() }`.padStart( 2, 0 ) )
	.replace( /DATE/, this );
};
