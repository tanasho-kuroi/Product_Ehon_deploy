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
let db = firebase.firestore().collection('EhonProduct'); //EhonProductという名前のコレクションがdbという名前で定義された感じ
// db.docs.forEach((element) => {
//   console.log(element);
// });

let EhonTitle;
let EhonTotal;
let EhonDoc;
//
//
const EhonNameDLFireStore = async function () {
  await db
    .doc('EhonInfo')
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());

        const data = {
          data: doc.data(), //上記IDのドキュメントの中身
        };
        // EhonTitle = data.data.LastEhonName;
        EhonTotal = data.data.EhonTotal;
        EhonDoc = data.data.LastEhonName;
        thisEhonRef = db.doc(EhonDoc); //絵本の指定(動的)

        console.log('EhonTitle =' + EhonTitle);
        console.log('EhonTotal =' + EhonTotal);
      }
    });
};

// let thisEhonRef = db.doc(EhonDoc); //絵本の指定(動的)

//
// grobal variable
// set instance
const form = document.querySelector('form');
let imgSample = document.getElementById('page3');
const fileUp = document.getElementById('fileup');
const editAddPage = document.getElementById('edit-menu__addPageButton');
const editresetPage = document.getElementById('edit-menu__resetPage');
const ehonChoiceBottun = document.getElementsByClassName('ehonChoiceClass');
const ehonAddBottun = document.getElementById('edit-menu__ehon_add');
const MakeEhonTitle = document.getElementById('MakeEhonTitle');
const EhonSelect = document.getElementById('ehon-select');
MakeEhonTitle.style.display = 'none';

// const ehonChoiceBottun = document.getElementById('ehonChoiceClass');
const storage = firebase.storage(); //Cloud Storage
const flipBook = document.getElementById('flipbook');

let file_name; //画像のファイル名
let txtStory;
let blob;
let idName; //写真をUPするHTMLのID名
let nowPage;
let upPage; //写真をアップするページ(数)
let numberOfPages; //本のページ数の最大値。turn.min.jsから情報引っ張ってくる
let numberOfPagesUP; //本のページ数の1/2。アップロードとかの処理に使う
let imgSampleRead; //firebase上の画像URL
let uploadRef;
let readMaxPage = 0; //読み込んだページのMax値。これ以下のページは読み込みしない(２重読み込み防止)。
let thisPageDoc;

// ///////////  最初にPageを生成  /////////////
// function addPageFirst(page, book) {
//   //これ、見直す必要あり。
//   //  First check if the page is already in the book
//   if (!book.turn('hasPage', page)) {
//     //hasPage: Returns true if a page is in memory.
//     // Create an element for this page
//     upPage = Math.floor(page / 2);
//     console.log('upPage=' + upPage);
//     let txtID = 'txt' + upPage;
//     let imgID = 'page' + upPage;
//     let element_txt =
//       `<div class="view__text-contents" id="` +
//       txtID +
//       `">
//       <p class="view__text-contents__p"></p>
//     </div>`;
//     let element_img =
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
    pages: 100,
    elevation: 30,
    duration: 1500,
    gradients: true,
    autoCenter: false,
  });
});

//
//
//
//
//
// location.reload();

// EhonSelect.onchange = EhonSelectEvent();

///////////  開いているPageから写真のPath取得  /////////////
const getPicPath = function (upPage) {
  idName = 'page' + upPage; //page数をid名に反映
  // console.log(upPage);
  imgSampleRead = document.getElementById(idName);
  // console.log(imgSampleRead);

  return imgSampleRead;
};

///////////  firestoreから画像のファイル名&txt取得  /////////////
// firestoreからデータ引き出し
const URLDownloadFireStore = async function (upPage) {
  const dataArray = []; //必要なデータだけが入った配列(リロードしても最初から入っている？)
  colPage = 'Page' + upPage;
  col_docPage = 'docPage' + upPage;

  thisPageDoc = thisEhonRef.collection(colPage).doc(col_docPage);

  await thisPageDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        // console.log('Document data:', doc.data());

        const data = {
          id: doc.id, //自動で指定しているドキュメントのID
          data: doc.data(), //上記IDのドキュメントの中身
        };

        dataArray.push(data); //dataArrayの末尾にdata追加(dataが一つのドキュメント情報、dataArrayが全てを入れた配列)

        file_name = data.data.imgURL;
        txtStory = data.data.txt;
      } else {
        // doc.data() will be undefined in this case
        const data = {
          txt: '',
          imgURL: '',
        };
        console.log('No such document!');
        thisPageDoc.set(data); // doc.data() will be undefined in this case
      }
      console.log(file_name);

      return file_name;
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
};
//
//

//
//
//
//
///////////  画像ダウンロード＆表示  /////////////
const imgUploadBook = async function (uploadRef) {
  console.log(imgSampleRead);
  await uploadRef //時間がかかる処理！！
    .getDownloadURL()
    .then((url) => {
      //HTMLに表示
      console.log(url);
      imgSampleRead.src = url;

      // imgSampleRead.style.width = 100 + '%';
      // imgSampleRead.style.height = 90 + '%';
      //
      // 元の縦横比でやろうとした
      // let orgWidth = imgSampleRead.width; // 元の横幅を保存
      // let orgHeight = imgSampleRead.height; // 元の高さを保存
      // imgSample.height = orgHeight * (imgSample.width / orgWidth); //縦横比維持
    })
    .catch(function (error) {
      // Handle any errors
      console.log(error);
    });
  return uploadRef;
};

//
//
////// pageめくりされた際(flipBookが変更された際)に処理開始 //////
flipBook.addEventListener('click', (e, page) => {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  // let pageCount = $('#flipbook').turn('pages');
  console.log(nowPage);
  if (nowPage == numberOfPages + 2) {
    //表紙と最終ページのみ、ページ追加ボタン「有効」
    $(editAddPage).prop('disabled', false); //ページ追加ボタン無効
  } else {
    $(editAddPage).prop('disabled', true); //ページ追加ボタン無効
  }
  // upPage = Math.floor(nowPage / 2) + 1; //1ページ先ということで,+1。２ページ先はturn.jsの使用でまだ認識されないため不可。
  // if (numberOfPagesUP >= upPage) {
  //   if (upPage > readMaxPage) {
  //     //  開いているPageから写真のPath取得
  //     getPicPath(upPage);

  //     // firestoreからファイル名取得
  //     URLDownloadFireStore(upPage); //この中でfile_name 定義
  //     // 画像アップロード
  //     // await imgUploadBook(upPage, file_name);
  //     uploadRef = storage.ref(`${upPage}`).child(file_name);
  //     imgUploadBook(uploadRef);

  //     readMaxPage = upPage; //readMaxPageの更新
  //   }
  // }
});

//
//

// //////////////// 現在のTotalPage読み込み ///////////////

// window.ready = async () => {
const ReadTotalPage = async function () {
  // 現在のTotalPageを読み込む
  await thisEhonRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        numberOfPages = doc.data().TotalPage;
        console.log(numberOfPages);
        // const data = {
        //   id: doc.id, //自動で指定しているドキュメントのID
        //   data: doc.data(), //上記IDのドキュメントの中身
        //   // id: thisPage.doc('docPage1').id, //自動で指定しているドキュメントのID
        //   // data: thisPage.doc('docPage1').data(), //上記IDのドキュメントの中身
        // };
        // dataArray.push(data); //dataArrayの末尾にdata追加(dataが一つのドキュメント情報、dataArrayが全てを入れた配列)
        // console.log(data);
        // console.log(dataArray);
        // numberOfPages = doc.data.TotalPage;
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
  return numberOfPages;
};

///////////  Pageの追加(HTML記述を追加するのみ)  /////////////
async function addPage(nowPage) {
  // 本の全ページ数取得
  // let pageCount = $('#flipbook').turn('pages');

  // Page数とファイルアップする場所の取得
  // nowPage = $('#flipbook').turn('page'); //page数の取得
  // upPage = Math.floor(pageCount / 2);
  upPage = Math.floor(nowPage / 2);

  // firestoreの値抽出
  colPage = 'Page' + upPage;
  col_docPage = 'docPage' + upPage;
  console.log(colPage);
  thisPageDoc = thisEhonRef.collection(colPage).doc(col_docPage);
  // await thisPageDoc.get().then(async (doc) => {
  const data = {
    txt: '',
    imgURL: '',
  };
  thisPageDoc.get().then(async (doc) => {
    // const data_add = {
    //   id: doc.id,
    //   data: doc.data(),
    // };

    if (doc.exists) {
      // let img_add = data_add.data.imgURL;
      // let txt_add = data_add.data.txt;
    } else {
      thisPageDoc.set(data); // doc.data() will be undefined in this case
      console.log('addNULL');
    }
  });
  //
  // この中に、写真テキストアップロードも組み込めないか？
  // タグの中に入れ込んでしまえば、ページ作成＝写真テキストが入った状態にできるのでは？
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

  // console.log(element_img);

  await $('#flipbook').turn('addPage', element_txt, upPage * 2);
  // .turn('pages', $('#flipbook').turn('pages'));
  await $('#flipbook').turn('addPage', element_img, upPage * 2 + 1);
  // .turn('pages', $('#flipbook').turn('pages'));
}

//////////////// 絵本の名前取得(使っていない？？？) ///////////////

const EhonNameFireStore = async function (upPage) {
  const dataArray = []; //必要なデータだけが入った配列(リロードしても最初から入っている？)
  // let thisEhonRef = db.doc(EhonName); //絵本の指定(動的)

  // thisPageDoc = thisEhonRef.collection(colPage).doc(col_docPage);

  await thisEhonRef
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
        EhonTitle = data.data.EhonName;
        dataArray.push(data); //dataArrayの末尾にdata追加(dataが一つのドキュメント情報、dataArrayが全てを入れた配列)
        console.log(data);
        console.log(EhonName);
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
  return EhonTitle;
};
//
//
//
//////////////// Webページ読み込みの際に画像&txtDL ///////////////

window.onload = async () => {
  // const EhonNameRead = await EhonNameFireStore();

  await EhonNameDLFireStore();
  MakeEhonTitle.style.display = 'none';
  console.log('EhonDoc =' + EhonDoc);

  // $('#edit-menu__addPage').prop('disabled', true); //ページ追加ボタン無効(最初は表紙なので)
  $(editAddPage).prop('disabled', true); //ページ追加ボタン無効(最初は表紙なので)

  // 現在のTotalPageを読み込む
  numberOfPages = await ReadTotalPage();
  console.log(numberOfPages);
  numberOfPagesUP = numberOfPages / 2;

  let lastPageClass = 'p' + numberOfPages;
  await $('lastPage').addClass();
  // 表紙も背表紙も、ループの中で追加したい(HTMLで書いているのではなく)
  // 背表紙は、Total+1に追加するイメージで。
  //
  //
  //htmlロード完了したらストレージの画像を表示してみる
  for (let i = 0; i <= numberOfPagesUP; i++) {
    nowPage = i * 2; //page数の取得

    if (i == 0) {
      upPage = i;
    } else {
      console.log(i);
      await addPage(nowPage); //Page0以外の時。このとき、upPageも更新される
    }

    //  開いているPageから写真のPath取得
    getPicPath(upPage);

    // firestoreからファイル名取得
    await URLDownloadFireStore(upPage); //file_name定義
    let file_nameRead = file_name;
    let txtStoryRead = txtStory;
    console.log(file_nameRead);
    //
    //
    // 画像ダウンロード
    // if (file_nameRead) {
    if (file_nameRead) {
      uploadRef = storage.ref(`${upPage}`).child(file_nameRead);
      await imgUploadBook(uploadRef);
    } else {
      // file_name = null;
    }

    // txtアップロード
    let tagArray = [];
    let txtIDup = 'txt' + upPage;
    let tag = `<p>${txtStoryRead}</p>`;
    tagArray.push(tag);

    await $(`#${txtIDup}`).html(tagArray);
    console.log(tagArray);
    //
    if (upPage > readMaxPage) {
      readMaxPage = upPage;
    } //readMaxPageの更新
  }

  // セレクタを作成する
  db.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      console.log(doc.id, ' => ', doc.data());
      EhonDoc = doc.id;
      EhonTitle = doc.data().EhonName;
      // optionを増やす動作
      $option = $('<option>', { value: EhonDoc, text: EhonTitle });
      // // $option = $('<option>', { value: op_value, text: op_ehonName, selected: isSelected });
      $('#ehon-select').append($option);
      // EhonSelect.append($option);
      // EhonDoc = EhonSelect.value;
    });
  });

  // forEach は配列に対して
  // Document名の配列を作れるか
  // querySnapshot 配列になって、
  // 絵本の名前を引っ張ってくる一文を追加。
};

//
//
//
//
//////////////// 画像アップロード：fileUpが変更された際に処理開始 ///////////////
fileUp.addEventListener('change', async (e) => {
  // e.preventDefault(); //ページ遷移をなくす

  // Page数とファイルアップする場所の取得
  nowPage = $('#flipbook').turn('page'); //page数の取得
  upPage = Math.floor(nowPage / 2);
  console.log('upPage:' + upPage);

  // ファイル名取得
  let file = e.target.files;
  console.log(file[0].name);
  file_name = file[0].name; //file name取得
  blob = new Blob(file, { type: 'image/jpeg' }); //blob形式
  console.warn(blob);

  // firestoreにPage数とファイル名を保存(既にdataがある場合は更新update,ない場合は追加(set))
  colPage = 'Page' + upPage;
  col_docPage = 'docPage' + upPage;
  thisPageDoc = thisEhonRef.collection(colPage).doc(col_docPage);
  const data = {
    imgURL: file_name,
  };
  thisPageDoc.get().then(async (doc) => {
    if (doc.exists) {
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
      //Pageのデータがない時は、追加
      await thisPageDoc
        .set(data)
        .then(() => {
          console.log('Document successfully added!');
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error('Error updating document: ', error);
        });
      // await txtMakeFireStore();
      // console.error('Page is not exist');
    }
  });

  //
  let file_nameRead = file_name;

  imgSampleRead = getPicPath(upPage); //写真アップする場所のHTML情報入手
  // firebase storageのarea_imagesへの参照を定義(Local Storage)
  uploadRef = storage.ref(`${upPage}`).child(file_nameRead); // URL取得
  console.log(uploadRef);

  // put() は、JavaScript の File API や Blob API 経由でファイルを取得し、Cloud Storage にアップロードする
  await uploadRef.put(blob).then(async function (snapshot) {
    //↑この時点でcloud storage にはアップロードしている。

    //  開いているPageから写真のPath取得
    // HTML表示
    console.log('uploadRef:' + uploadRef);

    await imgUploadBook(uploadRef);

    URLDownloadFireStore(upPage);
    // console.log('upPage:' + upPage);
  });

  //
  //
  // value リセットする
  file_name = '';
  blob = '';
});

//////////////// Pageの追加 ボタン押し 関数呼び出し ///////////////

editAddPage.addEventListener('click', (e, page) => {
  nowPage = $('#flipbook').turn('page'); //page数の取得
  numberOfPages = numberOfPages + 2;
  numberOfPagesUP = numberOfPages / 2;
  console.log(numberOfPages);

  const dataTotalPage = {
    TotalPage: numberOfPages,
  };
  thisEhonRef.set(dataTotalPage);

  addPage(nowPage);
});
// //

//
//
//////////////// Pageのリセット ///////////////
editresetPage.addEventListener('click', (e, page) => {
  numberOfPages = 8;
  numberOfPagesUP = numberOfPages / 2;

  console.log('Page reset:' + numberOfPages);

  const dataTotalPage = {
    TotalPage: numberOfPages,
  };
  //
  thisEhonRef.update(dataTotalPage);
});
// //
//

//

//
/////////////////////////////////////////////////////
//////////////// 本(Document)の新規作成 ///////////////
/////////////////////////////////////////////////////

//////////////// Title Box を出現させる ///////////////
ehonAddBottun.addEventListener('click', async (e, page) => {
  MakeEhonTitle.style.display = 'block';

  //
});

//
/////// Title Box に本の題名を書いて、本(Document)の新規作成() /////////
$('#MakeSend').on('click', async function () {
  let EhonTitle = $('#titleBox').val();
  console.log('title:' + EhonTitle);

  EhonTotal = EhonTotal + 1;
  EhonDoc = 'Dehon' + EhonTotal;
  // EhonDoc = 'Dehon9';
  let EhonTotalPage = 8;
  let data = {
    EhonName: EhonTitle,
    TotalPage: EhonTotalPage,
  };

  let AddEhon_SubColl = db.doc(EhonDoc);
  await AddEhon_SubColl.set(data);

  for (let i = 0; i < EhonTotalPage; i++) {
    let AddEhonColl = 'Page' + i;
    let AddEhonPage = 'docPage' + i;
    let dataSub = {
      imgURL: '',
      txt: i,
    };

    await AddEhon_SubColl.collection(AddEhonColl).doc(AddEhonPage).set(dataSub);
  }
  //

  // EhonInfo
  let EhonDocUP = {
    LastEhonName: EhonDoc,
    EhonTotal: EhonTotal,
    // [EhonTotal]: EhonName,
  };

  await db.doc('EhonInfo').update(EhonDocUP);
  //
  //
  // selectタグに新規絵本分のoptionを追加する
  $option = $('<option>', { value: EhonTitle, text: EhonTitle });
  // $option = $('<option>', { value: op_value, text: op_ehonName, selected: isSelected });
  $('#ehon-select').append($option);

  console.log('絵本追加:' + EhonTitle);
  location.reload();
});

/////////////////////////////////////////////////////
//////////// 本(Document)の選択(select) //////////////
/////////////////////////////////////////////////////

async function EhonSelectEvent() {
  EhonDoc = EhonSelect.value;
  console.log('絵本選択 : ' + EhonDoc);

  // EhonInfo
  let EhonDocUP = {
    LastEhonName: EhonDoc,
    // EhonTotal: EhonTotal,//EhonTotalをいじると、新規作成の際におかしくなるので、そのままにする。
  };
  await db.doc('EhonInfo').update(EhonDocUP);

  location.reload();
}
