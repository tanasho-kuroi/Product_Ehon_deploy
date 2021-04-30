# ルーツを記録する絵本アプリ

## firebase 使用。API key は別途連絡

## プロダクトの紹介

- 写真とテキストをアップし、絵本を作成
- 出生にまつわるエピソードなどを UP することで、親子で楽しく振り返り

## ファイルの説明

### Public フォルダ

- 公開フォルダ。ソースコードはここに。
- 使用言語：javascript + firebase

### HTML ファイル

- 404.html
  Page not found のときの。

- index.html
  メインの絵本ページ。
  写真アップロードも一緒にした。

### Public/css

CSS ファイル

- edit.css: 編集ボタンなどの見た目
- view.css: 絵本の見た目

### Public/js

javascript ファイル

- turn.min.js
  絵本のページめくりのライブラリ

- edit_my-turn.js
  turn.min.js を使うための js

- imgupload_id.js
  写真をアップロード & 読み込みの機能

- jquery-2.1.3.min.js
  jQuery
