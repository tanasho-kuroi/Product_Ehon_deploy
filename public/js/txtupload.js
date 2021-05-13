// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyC4zb_-tmQ_V9Z0pjSIU-inQczMeRr7F-w',
//   authDomain: 'jsehon-1a4e0.firebaseapp.com',
//   projectId: 'jsehon-1a4e0',
//   storageBucket: 'jsehon-1a4e0.appspot.com',
//   messagingSenderId: '132518767095',
//   appId: '1:132518767095:web:13bcef879592d7e75926f2',
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
var db = firebase.firestore().collection('ehonText'); //ehonTextという名前のコレクションがdbという名前で定義された感じ

// const txtUploadBook = async function () {
const txtUploadFireStore = function () {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  upPage = Math.floor(nowPage / 2); //page数の取得
  var txtStory = $('#textBox').val();

  const data = {
    Page: upPage,
    txt: txtStory, //Box内の値を取得
    // txt: $('#textBox').val(),
  };
  console.log(data);
  db.add(data);

  return;
};
const txtDownloadFireStore = async function (upPage) {
  const dataArray = []; //必要なデータだけが入った配列(リロードしても最初から入っている？)

  //
  // 更新処理にする！！
  // 更新の流れは？
  // IDを持ってきて →IDが一致するものの、どの要素を更新するか →更新
  // そのページのものがあるかどうかの条件分岐は要るかも(いらないかも)
  // もし、ドキュメントに存在しないデータを指定した場合、データが追記されます。
  // addを更新に変えるだけでいけるかも？

  // 改行は優先順位低い
  //
  // txtDownloadFireStore(upPage);
  await db
    .where('Page', '==', upPage)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.docs.forEach(function (doc) {
        //querySnapshot.docsの要素数だけループ
        const data = {
          id: doc.id, //自動で指定しているドキュメントのID
          data: doc.data(), //上記IDのドキュメントの中身
        };

        dataArray.push(data); //dataArrayの末尾にdata追加(dataが一つのドキュメント情報、dataArrayが全てを入れた配列)
        console.log(data);
        console.log(dataArray);
      });
    });

  const tagArray = [];
  var txtIDup = 'txt' + upPage;
  console.log(txtIDup);
  await dataArray.forEach(function (data) {
    //上記で取得した情報をページ上に出力するためにデータを整えるところ
    //dataArrayの要素数だけループ
    console.log(data);

    const tag = `<p>${data.data.txt}</p>`;
    tagArray.push(tag);
  });

  await $(`#${txtIDup}`).html(tagArray);
  console.log(tagArray);

  $('#textBox').val('');
};

// 送信ボタンクリック時にデータを送信する処理
$('#send').on('click', async function () {
  await txtUploadFireStore();
  await txtDownloadFireStore(upPage);
});

//firestore保存まで完了

// window.onload = async () => {
//   $('#edit-menu__addPage').prop('disabled', true); //ページ追加ボタン無効(最初は表紙なので)
//   // let numberOfPagesUP = $('#flipbook').turn('pages') * 1;

//   //htmlロード完了したらストレージの画像を表示してみる
//   for (let i = 0; i <= numberOfPagesUP; i++) {
//     upPage = i;
//     //  開いているPageから写真のPath取得
//     await getPicPath(upPage);
//     //console.log(upPage);

//     //  local storageから画像のファイル名取得
//     let file_nameR = await getLocalStoragePath(idName);

//     // 画像アップロード
//     // let imgUPfin;
//     // await imgUploadBook(upPage, file_nameR);
//     if (file_nameR) {
//       uploadRef = storage.ref(`${upPage}`).child(file_name);
//       await imgUploadBook(uploadRef);
//     } else {
//       // file_name = null;
//     }

//     if (upPage > readMaxPage) {
//       readMaxPage = upPage;
//     } //readMaxPageの更新
//   }
// };
