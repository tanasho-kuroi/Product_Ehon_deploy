// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC4zb_-tmQ_V9Z0pjSIU-inQczMeRr7F-w',
  authDomain: 'jsehon-1a4e0.firebaseapp.com',
  projectId: 'jsehon-1a4e0',
  storageBucket: 'jsehon-1a4e0.appspot.com',
  messagingSenderId: '132518767095',
  appId: '1:132518767095:web:13bcef879592d7e75926f2',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore().collection('ehonText'); //ehonTextという名前のコレクションがdbという名前で定義された感じ

//
// grobal variable
// set instance
const form = document.querySelector('form');
let imgSample = document.getElementById('page3');
const fileUp = document.getElementById('fileup');
const editAddPage = document.getElementById('edit-menu__addPage');
const storage = firebase.storage(); //Cloud Storage
const flipBook = document.getElementById('flipbook');

let file_name; //画像のファイル名
let blob;
let idName; //写真をUPするHTMLのID名
let nowPage;
let upPage; //写真をアップするページ(数)
let numberOfPages; //本のページ数の最大値。turn.min.jsから情報引っ張ってくる
let numberOfPagesUP; //本のページ数の1/2。アップロードとかの処理に使う
let imgSampleR; //firebase上の画像URL
let uploadRef;
let readMaxPage = 0; //読み込んだページのMax値。これ以下のページは読み込みしない(２重読み込み防止)。

// numberOfPages = $('#flipbook').data().totalPages;
numberOfPages = 30;
numberOfPagesUP = numberOfPages / 2;

// ///////////  最初にPageを生成  /////////////
// function addPageFirst(page, book) {//これ、見直す必要あり。
//   //  First check if the page is already in the book
//   if (!book.turn('hasPage', page)) {
//     //hasPage: Returns true if a page is in memory.
//     // Create an element for this page
//     upPage = Math.floor(page / 2);
//     console.log('upPage=' + upPage);
//     var txtID = 'txt' + upPage;
//     var imgID = 'page' + upPage;
//     var element_txt =
//       `<div class="view__text-contents" id="` +
//       txtID +
//       `">
//       <p class="view__text-contents__p"></p>
//     </div>`;
//     var element_img =
//       `<div class="view__img-contents__main">
//                   <img src="" alt="" id="` +
//       imgID +
//       `" class="pagePic" />
//     </div>`;

//     console.log(element_img);
//     // If not then add the page
//     book.turn('addPage', element_txt, page);
//     book.turn('addPage', element_img, page + 1);

//     // Let's assum that the data is comming from the server and the request takes 1s.
//     // setTimeout(function () {
//     //   element.html('<div class="data">' + page + ' ページ</div>');
//     // }, 1000);
//   }
// }

// //
//
//////////////// turnの設定 ///////////////

$(function () {
  $('#flipbook').turn({
    pages: numberOfPages,
    elevation: 30,
    duration: 1500,
    gradients: true,
    autoCenter: false,
    // when: {
    //   turning: function (e, page, view) {
    //     // Gets the range of pages that the book needs right now
    //     var range = $(this).turn('range', page);
    //     // Check if each page is within the book
    //     for (page = range[0]; page <= range[1]; page++) {
    //       addPage(page, $(this));
    //     }
    //   },

    //   turned: function (e, page) {
    //     $('#page-number').val(page);
    //   },
    // },
  });
});

//
//
//
//

///////////  開いているPageから写真のPath取得  /////////////
const getPicPath = function (upPage) {
  idName = 'page' + upPage; //page数をid名に反映
  // console.log(upPage);
  imgSampleR = document.getElementById(idName);
  console.log(idName);
  console.log(imgSampleR);
  return imgSampleR;
};

///////////  local storageから画像のファイル名取得  /////////////
const getLocalStoragePath = function (idName) {
  if (localStorage.getItem(idName)) {
    jsonData = localStorage.getItem(idName);
    data = JSON.parse(jsonData);
    // console.log(data);
    file_name = data.fileLocal;
  } else {
    file_name = null;
  }
  return file_name;
};

///////////  画像アップロード  /////////////
const imgUploadBook = async function (uploadRef) {
  await uploadRef //時間がかかる処理！！
    .getDownloadURL()
    .then((url) => {
      //HTMLに表示
      console.log(url);
      imgSampleR.src = url;
      // imgSampleR.style.width = 100 + '%';
      // imgSampleR.style.height = 90 + '%';
      //
      // 元の縦横比でやろうとした
      // var orgWidth = imgSampleR.width; // 元の横幅を保存
      // var orgHeight = imgSampleR.height; // 元の高さを保存
      // imgSample.height = orgHeight * (imgSample.width / orgWidth); //縦横比維持
    })
    .catch(function (error) {
      // Handle any errors
      console.log(error);
    });
  return uploadRef;
};

////// pageめくりされた際(flipBookが変更された際)に処理開始 //////
flipBook.addEventListener('click', (e, page) => {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  let pageCount = $('#flipbook').turn('pages') * 1;
  if (nowPage == pageCount) {
    //表紙と最終ページのみ、ページ追加ボタン「有効」
    $('#edit-menu__addPage').prop('disabled', false); //ページ追加ボタン無効
  } else {
    $('#edit-menu__addPage').prop('disabled', false); //ページ追加ボタン有効
  }
  upPage = Math.floor(nowPage / 2) + 1; //1ページ先ということで,+1。２ページ先はturn.jsの使用でまだ認識されないため不可。
  if (numberOfPagesUP >= upPage) {
    if (upPage > readMaxPage) {
      //  開いているPageから写真のPath取得
      getPicPath(upPage);

      //  local storageから画像のファイル名取得
      file_name = getLocalStoragePath(idName);
      console.log(file_name);

      // 画像アップロード
      // await imgUploadBook(upPage, file_nameR);
      uploadRef = storage.ref(`${upPage}`).child(file_name);
      imgUploadBook(uploadRef);

      readMaxPage = upPage; //readMaxPageの更新
    }
  }
});

//
//
//

//////////////// Webページ読み込みの際に画像DL ///////////////

window.onload = async () => {
  $('#edit-menu__addPage').prop('disabled', true); //ページ追加ボタン無効(最初は表紙なので)
  // let numberOfPagesUP = $('#flipbook').turn('pages') * 1;

  //htmlロード完了したらストレージの画像を表示してみる
  for (let i = 0; i <= numberOfPagesUP; i++) {
    upPage = i;
    //  開いているPageから写真のPath取得
    await getPicPath(upPage);
    //console.log(upPage);

    //  local storageから画像のファイル名取得
    let file_nameR = await getLocalStoragePath(idName);

    // 画像アップロード
    // let imgUPfin;
    // await imgUploadBook(upPage, file_nameR);
    if (file_nameR) {
      uploadRef = storage.ref(`${upPage}`).child(file_name);
      await imgUploadBook(uploadRef);
    } else {
      // file_name = null;
    }

    if (upPage > readMaxPage) {
      readMaxPage = upPage;
    } //readMaxPageの更新
  }
};

//
//
//
//
//////////////// 画像アップロード：fileUpが変更された際に処理開始 ///////////////
fileUp.addEventListener('change', (e) => {
  // e.preventDefault(); //ページ遷移をなくす

  // Page数とファイルアップする場所の取得
  nowPage = $('#flipbook').turn('page'); //page数の取得
  upPage = Math.floor(nowPage / 2);
  let imgSampleRead = getPicPath(upPage); //写真アップする場所のHTML情報入手

  // ファイル名取得
  var file = e.target.files;
  file_name = file[0].name; //file name取得
  blob = new Blob(file, { type: 'image/jpeg' }); //blob形式
  console.warn(blob);

  //
  // localstrageにPage数とファイル名を保存(その前に、同じPage数のもの削除)
  const dataPath = {
    pageLocal: upPage,
    fileLocal: file_name,
  };
  const jsonData = JSON.stringify(dataPath); //配列をJSONdata(文字列)変換
  localStorage.removeItem(idName); // localstorageに既に保存済みの、同じPageのPath削除
  localStorage.setItem(idName, jsonData); // localstorageに保存

  //
  // storageのarea_imagesへの参照を定義
  uploadRef = storage.ref(`${upPage}`).child(file_name); // URL取得
  console.log(uploadRef);

  // put() は、JavaScript の File API や Blob API 経由でファイルを取得し、Cloud Storage にアップロードする
  uploadRef.put(blob).then(function (snapshot) {
    //↑この時点でcloud storage にはアップロードしている。
    console.log(uploadRef);
    console.log(snapshot.state);
    //
    // HTML表示
    imgUploadBook(uploadRef);
  });

  //
  // value リセットする
  file_name = '';
  blob = '';
});

///////////  Pageの追加  /////////////
function addPage() {
  // 本の全ページ数取得
  let pageCount = $('#flipbook').turn('pages') * 1;
  // let pageCount_floor = Math.floor(pageCount / 2) + 1;
  console.log(pageCount);

  // let txtID = 'txt' + pageCount_floor;
  // let imgID = 'page' + pageCount_floor;

  // Page数とファイルアップする場所の取得
  // nowPage = $('#flipbook').turn('page'); //page数の取得
  // upPage = Math.floor(pageCount / 2);
  upPage = Math.floor(nowPage / 2);

  //
  // この中に、写真テキストアップロードも組み込めないか？
  // タグの中に入れ込んでしまえば、ページ作成＝写真テキストが入った状態にできるのでは？
  //

  let txtID = 'txt' + upPage;
  let imgID = 'page' + upPage;
  let element_txt =
    `<div class="view__text-contents" id="` +
    txtID +
    `">
      <p class="view__text-contents__p"></p>
    </div>`;
  let element_img =
    `<div class="view__img-contents__main">
                  <img src="" alt="" id="` +
    imgID +
    `" class="pagePic" />
    </div>`;

  console.log(element_img);

  $('#flipbook')
    .turn('addPage', element_txt, upPage * 2)
    .turn('pages', $('#flipbook').turn('pages'));
  $('#flipbook')
    .turn('addPage', element_img, upPage * 2 + 1)
    .turn('pages', $('#flipbook').turn('pages'));
}
//id名どうするか？→変数入れこめばOK`
//追加したい場所で追加(途中挿入)するには？→Page数を取得してその次のページを表示とした。
// 最後のページでは追加させない(最後のページではページ追加を操作不可にする)
// 追加した分、最後のページが押し出されて非表示になる？

//nowPage取得でなんとかなったが。。。全てのページでid名を動的に変更しなくてはならない。

//追加したPageを保存するには？

//////////////// Pageの追加 関数呼び出し ///////////////

editAddPage.addEventListener('click', (e, page) => {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  addPage();
});
// //

//
//
//
//
