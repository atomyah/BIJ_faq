import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as rp from 'request-promise';
// firebase の初期化
admin.initializeApp(functions.config().firebase) 



// 質問フォーラムLINE通知関連
// MEMO: simple が true の場合、 3XX のステータスコードを返却された時でもエラーとなる模様
const request = rp.defaults({simple: false});

const FIRESTORE_COLLECTION = 'commentsfaqs';
const LINE_ACCESS_TOKEN = '';

// functions にデプロイする関数
// とあるコレクションにドキュメントを作成すると、LINEに通知します。
// MEMO: ドキュメントに対し、「作成」「更新」「削除」を取得することができます。詳細は下記参照
//       https://firebase.google.com/docs/functions/firestore-events?hl=ja
// 質問フォーラムLINE通知関数エキスポート
export const lineNotify = functions.firestore
  .document(FIRESTORE_COLLECTION + '/{doc}')
  .onCreate((_snap, _context) => {

  // line へ通知
  request({
    uri : 'https://notify-api.line.me/api/notify',
    method: 'POST',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN
    },
    form: {
      'message': '質問フォーラムに投稿アリ。\r\n' + FIRESTORE_COLLECTION + 'にドキュメントが作成されました。'
    }
  }).then(function(response) { // 成功時 (3XX)
    // LINE Notify からのレスポンスを Functions のログに出力
    console.log('User has %d repos', response.length);
    console.log('response :' + response);
    return null;
  }).catch(function (err) { // 失敗時 (4XX or 5XX)
    Error(err);
   });
  return null;
});


// commentsfaqsコレクションのデータ数カウント
const fireStore = admin.firestore()
exports.countComments = functions.https.onRequest((req, res) => {
  let commentsfaqsRef = fireStore.collection('commentsfaqs');
  commentsfaqsRef.get().then( snap => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.status(200).send({length: snap.size});
  })
  .catch(error => {
      res.send( error() );
  });
});



// algolia関連

const algoliasearch = require('algoliasearch')
const ALGOLIA_ID = 'TOM42XWGQM';
const ALGOLIA_ADMIN_KEY = '';
const algolia = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const index = algolia.initIndex('prod_commentsfaqs');
//const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key


// algolia全文検索API利用関数// commentsfaqsコレクションに新規レコードが追加されると起動
exports.oncommentsfaqsCreated = functions.firestore.document('commentsfaqs/{id}').onCreate((snap, context) => {
  // 新規レコードの情報をIndex用オブジェクトに格納
  const objectID = snap.id
  const data = snap.data();
    // AlgoliaへIndex
  return index.addObject({
    objectID,
    ...data
  })
})

// algolia全文検索API利用関数// commentsfaqsコレクションのレコードが削除されると起動
exports.oncommentsfaqsDeleted = functions.firestore.document('commentsfaqs/{id}').onDelete((snap, context) => {
  // Index用オブジェクトを削除
  index.deleteObject(snap.id)
})

// algolia全文検索API利用関数// commentsfaqsコレクションのレコードが更新されると起動
exports.oncommentsfaqsUpdated = functions.firestore.document('commentsfaqs/{id}').onUpdate((change, context) => {
  // 更新レコードの情報をIndex用オブジェクトに格納
  const objectID = change.after.id
  const newData = change.after.data();
    // AlgoliaへIndex
  return index.saveObject({
    objectID,
    ...newData
  })
})
