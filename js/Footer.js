export class Footer
{
  constructor()
  {
    this.footer = document.querySelector( '#footer' );
    this.content = document.querySelector( '#content-wrapper' );
    
    this.footer.querySelector( '#month-calendar' ).addEventListener( 'click', () => this.month() );
    this.footer.querySelector( '#week-calendar' ).addEventListener( 'click', () => this.week() );
    this.footer.querySelector( '#list-calendar' ).addEventListener( 'click', () => this.list() );
    this.footer.querySelector( '#share-calendar' ).addEventListener( 'click', () => this.share() );
  }
  
  async month()
  {
    this.content.classList = [];
    this.content.classList.add( 'month' );
    ( await calendar ).setCurrentMonth();
  }
  
  async week()
  {
    this.content.classList = [];
    this.content.classList.add( 'week' );
    
    document.querySelector( 'div#this-month' ).scrollTo( { top: 0, left: document.querySelector( 'div#this-month .today' )?.offsetLeft || 0, behavior: 'smooth'  } );
    ( await calendar ).setCurrentMonth();
  }
  
  async list()
  {
    this.content.classList = [];
    this.content.classList.add( 'list' );
    
    document.querySelector( 'div#this-month' ).scrollTo( { top: document.querySelector( 'div#this-month .today' )?.offsetTop || 0, left: 0, behavior: 'smooth'  } );
    ( await calendar ).setCurrentMonth();
  }
  
  async share()
  {
    this.content.classList = [];
    this.content.classList.add( 'share' );
    
    document.querySelector( 'div#this-month' ).scrollTo( { top: document.querySelector( 'div#this-month .today' )?.offsetTop || 0, left: 0, behavior: 'smooth'  } );
    document.querySelector( 'div#share-list' ).scrollTo( { top: document.querySelector( 'div#this-month .today' )?.offsetTop || 0, left: 0, behavior: 'smooth'  } );
    ( await calendar ).setCurrentMonth();
    
  }
}

/*
サイバーエージェント/
  Cygames/
  京セラコミュニケーションシステムグループ/
  レオパレス21/
  ジェイアール総研/情報システム/
  JTBグローバルアシスタンス/三陸鉄道
/
  ノイズ/
  ＡＤＣＥＥ/
  アプトサイン/
  テレトニー/
  コアエッジ/ＡＳＵ　ＢＲＡＮＤ
/
  ＶＡＲＣＨＡＲ/
  ラフ/
  ナレッジソフトウェア/
  ジョイワークス/介護老人保健施設いずみ/
  アイムシステムサービス/
  アイ・シー・ネットワークス/
  エグゼコンサルティング/
  ユビーネット/三共テック
/Ａｂａｌａｎｃｅ
/
  システムライン/
  パーソンリンク/
  ファイルテック/
  アーバンシステム/
  ＳＡＬＴＯ/
  ビッグツリーテクノロジー＆コンサルティング/
  エンファシス/
  アイティフォー/ブレインハーツ
/
  トランジット/エスコ・ジャパン
/
  Ｓ．Ｒ．Ｓクラフト/誠信システムズ
/
  ＬＯＮＧ/
  エキサイト/三豊
/
  タイム/
  セイビ・ホテルサービス/
  ＦＦＳ/協同組合岡山ビジネス交流センター/
  Ｓｅｖｅｎｔｈ－ｌａｎｄ/
  松田商工/エイム
/
  ワイエスシーインターナショナル/Ｂｉｓｏｎ　ｅｎｅｒｇｙ
/陽光
/
  クリエイト・レストランツ・ヒールディングス/
  スパイスワークス/日本ホーム
/
  グリーン設備/
  ヤマヲ/
  Ｍ・Ｐ・Ｔ/
  広栄社/
  アリックス/地球人．ｊｐ
/
  ベジコープ/
  ゼットン/
  ナユタ/オークニ商事
/
  ベルダイニング/
  カルネヴァーレ/
  プラスコーポレーション/
  ドン・キホーテ/NTT建設総合研究所/
  トヨタレンタリース/
  HELPFUL33/ITC/ネットワーク
/ゼネラルソフトウェア
/
  マッドボックス/スタジオ・ハードデラックス
/
  インフォマート/
  デジプラネット/
  ヴィオ/
  ファイルテック/
  日本サンテック/
  セラク/
  エグゼ・コンサルティング/
  CRドットアイ／エムティプランニング
キンセイインテリジェンスシステム/
  アイ・シー・ネットワークス/
  ウィラム/
  MSK/
  夢テクノロジー/
  パートナー/
  ハンドネット/
  トップグローパル/
  パーソンリンク/
  アルプスビジネスサービス/
  Golden Group/シンクシステム
/
    イーストブリッジ/フェニックスソリューション
/
    ナインテック/共同精版印刷
/
    UNOテック/
    アリックス/
    イヴィエール/
    システムサポート/
    ナレッジソフトウィア/Panda Graphics 
    /
      システムリンク/ＩＩＭヒューマンソリューション
/
      花正/KCCSキャリアテック
/メディア22世紀/スタイラス
/
      フォーラムエンジニアリング/
      バンケットプランニング/
      テクニカルヒューマンリソース/
      中央ホールディングス/東成ソフトウィア/渋川商事
/
      中和情報センター/
      アール・オー・シー・/
      イーソフト/中央システム
/
      Office井上/イーソフト
/
      Office井上/イーソフト
/
      ソフトウィアパートナーエイワロジステックス
/
      ピーアールオー/JCNネットワークシステム
サイバープイン
アルファエンタープライズ
/日本コンテンツ
日本システム開発
/
  知識情報技術研究所/
  システムハウス/
  ネオ・ユニバース/
  スタジオポイントピクチャーズ/シェラトンホテル/
  レイメイソリューション/総合システム開発
フジテクノサービス
/
  ワールドシステムコンサルタント／アルファテクノロジー
/システムテクノロジーアイ
/他多数
*/