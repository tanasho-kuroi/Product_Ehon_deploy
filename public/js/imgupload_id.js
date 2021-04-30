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
let readMaxPage = 0; //読み込んだページのMax値。これ以下のページは読み込みしない(２重読み込み防止)。
let totalPageValue; //HTMLに登録したページ数の最大値。turn.min.jsから情報引っ張ってくる

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
const imgUploadBook = async function (upPage, file_name) {
  uploadRef = storage.ref(`${upPage}`).child(file_name);
  await uploadRef //時間がかかる処理！！
    .getDownloadURL()
    .then((url) => {
      //HTMLに表示
      console.log(url);
      imgSampleR.src = url;
      // var orgWidth = imgSampleR.width; // 元の横幅を保存
      // var orgHeight = imgSampleR.height; // 元の高さを保存

      imgSampleR.style.width = 420 + 'px';
      // imgSample.height = orgHeight * (imgSample.width / orgWidth); //縦横比維持
      // 元の縦横比でやろうとした
    })
    .catch(function (error) {
      // Handle any errors
      console.log(error);
    });
  return uploadRef;
};

////// flipBookが変更された際に処理開始 //////
flipBook.addEventListener('click', (e, page) => {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  totalPageValue = $('#flipbook').data().totalPages / 2;

  upPage = Math.floor(nowPage / 2) + 1; //1ページ先ということで,+1。２ページ先はturn.jsの使用でまだ認識されないため不可。
  if (totalPageValue >= upPage) {
    if (upPage > readMaxPage) {
      //  開いているPageから写真のPath取得
      getPicPath(upPage);

      //  local storageから画像のファイル名取得
      file_name = getLocalStoragePath(idName);
      console.log(file_name);

      // 画像アップロード
      imgUploadBook(upPage, file_name);

      readMaxPage = upPage; //readMaxPageの更新
    }
  }
});

//
//

//////////////// ページ読み込みの際に画像DL ///////////////

window.onload = async () => {
  //htmlロード完了したらストレージの画像を表示してみる
  for (let i = 0; i <= 1; i++) {
    upPage = i;
    //  開いているPageから写真のPath取得
    await getPicPath(upPage);
    //console.log(upPage);

    //  local storageから画像のファイル名取得
    let file_nameR = await getLocalStoragePath(idName);

    // 画像アップロード
    // let imgUPfin;
    await imgUploadBook(upPage, file_nameR);

    if (upPage > readMaxPage) {
      readMaxPage = upPage;
    } //readMaxPageの更新
  }
};

//
//
//////////////// fileUpが変更された際に処理開始 ///////////////
fileUp.addEventListener('change', (e) => {
  // e.preventDefault(); //ページ遷移をなくす
  nowPage = $('#flipbook').turn('page'); //page数の取得

  upPage = Math.floor(nowPage / 2);
  idName = 'page' + upPage; //page数をid名に反映
  console.log(idName);
  imgSampleR = document.getElementById(idName);
  var file = e.target.files;
  file_name = file[0].name; //file name取得
  blob = new Blob(file, { type: 'image/jpeg' }); //blob形式
  console.warn(blob);

  // localstrageにPage数とファイル名を保存(その前に、同じPage数のもの削除)
  const dataPath = {
    pageLocal: upPage,
    fileLocal: file_name,
  };
  const jsonData = JSON.stringify(dataPath); //配列をJSONdata(文字列)変換
  localStorage.removeItem(idName); // localstorageに既に保存済みの、同じPage数のPath削除
  localStorage.setItem(idName, jsonData); // localstorageに保存

  // storageのarea_imagesへの参照を定義
  let uploadRef = storage.ref(`${upPage}`).child(file_name);
  uploadRef.put(blob).then((snapshot) => {
    console.log(snapshot.state);
    // URL取得
    uploadRef
      .getDownloadURL()
      .then((url) => {
        //HTMLに表示
        imgSampleR.src = url;
        // var orgWidth = imgSample.width; // 元の横幅を保存
        // var orgHeight = imgSample.height; // 元の高さを保存

        imgSampleR.style.width = 520 + 'px';
        // imgSample.height = orgHeight * (imgSample.width / orgWidth); //縦横比維持
        // 元の縦横比でやろうとしたけど、、、逆におかしくなる？
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // value リセットする
  file_name = '';
  blob = '';
});
