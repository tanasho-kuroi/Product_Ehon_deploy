// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: '',
  authDomain: 'jsehon-1a4e0.firebaseapp.com',
  projectId: 'jsehon-1a4e0',
  storageBucket: 'jsehon-1a4e0.appspot.com',
  messagingSenderId: '132518767095',
  appId: '1:132518767095:web:13bcef879592d7e75926f2',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// grobal variable
// set instance
const form = document.querySelector('form');
let imgSample = document.getElementById('page3');
const fileUp = document.getElementById('fileup');
const storage = firebase.storage(); //Cloud Storage
const flipBook = document.getElementById('flipbook');

let file_name; //画像のファイル名
let blob;
let idName; //写真をUPするHTMLのID名
let upPage; //写真をアップするページ(数)
let imgSampleR; //firebase上の画像URL
let uploadRef;
let readMaxPage = 0; //読み込んだページのMax値。これ以下のページは読み込みしない(２重読み込み防止)。
let totalPageValue; //HTMLに登録したページ数の最大値。turn.min.jsから情報引っ張ってくる
totalPageValue = $('#flipbook').data().totalPages / 2;

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
  // totalPageValue = $('#flipbook').data().totalPages / 2;

  upPage = Math.floor(nowPage / 2) + 1; //1ページ先ということで,+1。２ページ先はturn.jsの使用でまだ認識されないため不可。
  if (totalPageValue >= upPage) {
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
  //htmlロード完了したらストレージの画像を表示してみる
  for (let i = 0; i <= 6; i++) {
    upPage = i;
    //  開いているPageから写真のPath取得
    await getPicPath(upPage);
    //console.log(upPage);

    //  local storageから画像のファイル名取得
    let file_nameR = await getLocalStoragePath(idName);

    // 画像アップロード
    // let imgUPfin;
    // await imgUploadBook(upPage, file_nameR);
    uploadRef = storage.ref(`${upPage}`).child(file_name);
    await imgUploadBook(uploadRef);

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
