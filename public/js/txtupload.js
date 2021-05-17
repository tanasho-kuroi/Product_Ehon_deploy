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
var db = firebase.firestore().collection('EhonProduct'); //EhonProductという名前のコレクションがdbという名前で定義された感じ
// var thisEhonRef = db.doc('Mehon'); //絵本の指定(いずれ動的にする)
// var thisPage;
// var thisPageDoc;//imguploadにて定義済み
var colPage;
var col_docPage;
// var messageRef = db.collection('rooms').doc('roomA').collection('messages').doc('message1');

// const txtUploadBook = async function () {

//データ追加処理
const txtMakeFireStore = async function () {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  upPage = Math.floor(nowPage / 2); //page数の取得
  var txtStory = $('#textBox').val();

  colPage = 'Page' + upPage;
  col_docPage = 'docPage' + upPage;
  thisPage = thisEhonRef.collection(colPage).doc(col_docPage);

  const data = {
    txt: txtStory, //Box内の値を取得
    // txt: $('#textBox').val(),
  };
  console.log(data);
  await thisPage.set(data);
  // await thisPage.add(data);

  return;
};

//
//
// txtの更新 or 追加
const txtUpdateFireStore = async function () {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  upPage = Math.floor(nowPage / 2); //page数の取得
  var txtStory = $('#textBox').val();
  // コレクション、ドキュメント名の指定を動的に。
  colPage = 'Page' + upPage;
  col_docPage = 'docPage' + upPage;
  thisPageDoc = thisEhonRef.collection(colPage).doc(col_docPage);
  const data = {
    txt: txtStory, //Box内の値を取得
    // txt: $('#textBox').val(),
  };
  //
  //
  await thisPageDoc.get().then(async (doc) => {
    if (doc.exists) {
      console.log(data);
      await thisPageDoc
        .update(data)
        .then(() => {
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error('Error updating document: ', error);
        });
    } else {
      await txtMakeFireStore(); //Pageのデータがない時は、追加Funcrtionへ
      // doc.data() will be undefined in this case
    }
  });

  return;
};

// 改行は優先順位低い
//
//
//
// firestoreからデータ引き出し
const txtDownloadFireStore = async function (upPage) {
  const dataArray = []; //必要なデータだけが入った配列(リロードしても最初から入っている？)
  // thisPage = thisEhonRef.collection('Page1');
  colPage = 'Page' + upPage;
  col_docPage = 'docPage' + upPage;

  thisPageDoc = thisEhonRef.collection(colPage).doc(col_docPage);

  await thisPageDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());

        const data = {
          id: doc.id, //自動で指定しているドキュメントのID
          data: doc.data(), //上記IDのドキュメントの中身
          // id: thisPage.doc('docPage1').id, //自動で指定しているドキュメントのID
          // data: thisPage.doc('docPage1').data(), //上記IDのドキュメントの中身
        };

        dataArray.push(data); //dataArrayの末尾にdata追加(dataが一つのドキュメント情報、dataArrayが全てを入れた配列)
        console.log(data);
        console.log(dataArray);
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });

  // firestoreから引き出したデータをHTML表示
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
  // await txtMakeFireStore();
  await txtUpdateFireStore(upPage);
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
