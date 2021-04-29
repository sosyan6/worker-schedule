const express = require("express");
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const crypto = require( 'crypto' );
const fs = require( 'fs' );
const nodeMailer = require( 'nodemailer' );
const app = express();

const baseJSON = JSON.parse( fs.readFileSync( 'baseData.json', 'utf-8' ) );

app.use( cookieParser() );
app.use( bodyParser() );

function genHash256( hash1, hash2 ){
  const nameHex = crypto.createHash('sha256').update( hash1, 'utf8').digest('hex');
  const passHex = crypto.createHash('sha256').update( hash2, 'utf8').digest('hex');
  return crypto.createHash('sha256').update( nameHex + passHex, 'utf8').digest('hex');
}

function sendMail( sendAddress ){
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
  const mailOptions1 = {
    from: `ワーカースケジュール<${address}>`,
    to: sendAddress,
    subject: '認証メール',
    text: 
    `
    メールアドレスを認証しました。
    心当たりのない場合はお手数ですが削除いただけると幸いです。
    `
  }
  
  transporter.sendMail( mailOptions1, ( error, info ) => {
    if( error ){
      console.log(error);
    }else{
      console.log( 'Email sent: ' + info.response );
    }
  } );
}

app.post( '/signup', ( req, res ) => {
  const hashHex = genHash256( req.body.name, req.body.password );
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

    const userInfo = `{ SID: ${hashHex} }`;
    fs.writeFile( `.data/userInfo/${req.body.email}.json`, JSON.stringify( userInfo ), err => {
      if( err ) {
        res.send( 'error' );
        res.end();
        return;
      }
    } );
    fs.writeFile( `.data/userInfo/${hashHex}.json`, JSON.stringify( `{ email: ${req.body.email}, name: ${req.body.name}, password: ${req.body.password} }` ), err => {
      if( err ) {
        res.send('error');
        res.end();
        return;
      }
      //  maxAgeはmsで表すらしい
      res.cookie( 'SID', hashHex, { maxAge: 1000 * 3600 * 24 * 365 } );
      res.send( 'login Success' );
      res.end();
      // sendMail( req.body.email );
      return;
    } );
    
  }else{
    res.send( 'Already User Exist or Already Email Exist' );
    res.end();
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
  const hash = genHash256( crypto.randomBytes( 8 ).toString(), crypto.randomBytes( 8 ).toString() );
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

app.get( '/join/:GID', ( req, res ) => {
  if( !req.params.GID ){
    res.send( '不正なURLです' );
    return;
  }
  if( !req.cookies.SID ){
    res.send( 'ログインしてから再試行してください' );
    return;
  }
  if( fs.existsSync( `.data/user/${req.cookies.SID}.json` ) &&
      fs.existsSync( `.data/group/${req.params.GID}.json` ) )
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
    
  }else{
    res.send( 'グループが見つかりませんでした' );
    return;
  }
} );

app.post( '/leaveGroup/:GID', ( req, res ) => {
  console.log( 'aaaaaa' );
  fs.readFile( `.data/group/${req.params.GID}.json`, 'utf-8', ( err, data ) => {
    if( err ) res.send( err );
    const newJson = JSON.parse( data );
    console.log( newJson );
  } );
  res.send( 'aaaa' );
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

app.get( /\/.*/, ( req, res ) => {
  if( req.url === '/' && req.cookies.SID ) res.sendFile( `${ __dirname }/views/index.html` );
  else if( req.url === '/' ) res.sendFile( `${ __dirname }/views/login.html` );
  else res.sendFile( `${ __dirname }/${ req.url }` );
} );

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// 打倒スピカ！