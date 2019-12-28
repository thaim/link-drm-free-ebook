// ==UserScript==
// @name         Link DRM free ebook
// @namespace    http://github.com/thaim/link-drm-free-ebook
// @version      0.2
// @description  UserScript to add a link to DRM free ebook site from amazon.com
// @author       thaim
// @match        https://www.amazon.co.jp/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // 対象が書籍ページでなければ処理しない
  if (!isBook(document)) {
    return;
  }

  // 対象の書籍情報を取得
  var bookTable = document.getElementById('detail_bullets_id');
  // 現在開いているのが電子書籍のページの場合は紙書籍のページ情報を取得して渡す
  if (document.getElementById('dp').classList.contains('ebooks')) {
    let url = document.getElementById('tmmSwatches').getElementsByTagName('li')[1].getElementsByTagName('a')[0].href;

    let client = new XMLHttpRequest();
    client.open("GET", url, false);
    client.send(null);
    if (client.readyState == 4 && client.status == 200) {
      var domparser = new DOMParser();
      bookTable = domparser.parseFromString(client.responseText, 'text/html').getElementById('detail_bullets_id');
    }
  }

  // var bookDescription = retreiveBook(document.getElementById('productDetailsTable'));
  var bookDescription = retreiveBook(bookTable);

  // 書籍情報からDRMフリー本を探す
  var bookDetail = searchBook(bookDescription)

  // DRMフリー本が見付かったらDOMを更新する

  var ulMediaMatrix = document.getElementById('tmmSwatches').firstElementChild;
  // FIXME: 現在は固定でOreillyの書籍のISBNを付与
  var liEbook = createEBookElement(bookDetail);
  ulMediaMatrix.appendChild(liEbook);
})();

/**
 * 引数で与えたwebページが書籍の商品ページであるかを返す
 * @param page 対象のamazonページ
 */
function isBook(page) {
  var dp = page.getElementById('dp');

  // 商品ページではない
  if (!dp) return false;

  // 電子書籍のページまたは紙書籍のページ
  if (dp.classList.contains('ebooks') || dp.classList.contains('book')) {
    return true;
  }

  return false;
}

/**
 * amazonの書籍種類別のBoxとしてDRMフリーへのリンクを追加する
 */
function createEBookElement(bookDetail) {
  var liEbook = document.createElement('li');
  liEbook.className = 'swatchElement unselected resizedSwatchElement';
  liEbook.setAttribute('data-width', '120');
  liEbook.setAttribute('style', 'width: 120px;');
  liEbook.setAttribute('id', 'drm-free-link');

  var spanItem = document.createElement('span');
  spanItem.className = 'a-list-item';

  var spanButton = document.createElement('span');
  spanButton.className = 'a-button a-spacing-mini a-button-toggle format';

  var spanInner = document.createElement('span');
  spanInner.className = 'a-button-inner';

  var link = createLinkElement(bookDetail);

  spanInner.appendChild(link);
  spanButton.appendChild(spanInner);
  spanItem.appendChild(spanButton);
  liEbook.appendChild(spanItem);

  return liEbook;
}

/**
 * 指定のISBNに対するlink要素を作成する
 * FIXME: 現在は固定でOreillyのサイトへのリンクを作成
 * @param bookDetail リンク対象の書籍情報詳細
 */
function createLinkElement(bookDetail) {
  var link = document.createElement('a');
  link.className = 'a-button-text';
  link.setAttribute('href', 'http://www.oreilly.co.jp/books/' + bookDetail.isbn13 + '/');
  link.setAttribute('role', 'button');
  link.setAttribute('target', '_blank');

  var type = document.createElement('span');
  type.innerHTML = 'DRMフリー書籍'

  var secondary = document.createElement('span');
  secondary.className = 'a-color-secondary';
  var shop = document.createElement('span');
  shop.className = 'a-size-base a-color-secondary';
  shop.innerHTML = 'Oreilly';
  secondary.appendChild(shop);
  type.appendChild(secondary);

  link.appendChild(type);
  link.appendChild(document.createElement('br'));
  link.appendChild(secondary);

  return link;
}

function retreiveBook(table) {
  var detail = [];

  var liList = table.getElementsByTagName('li');
  detail.publisher = liList[1].firstChild.nextSibling.textContent;
  detail.isbn10 = liList[3].firstChild.nextSibling.textContent;
  detail.isbn13 = liList[4].firstChild.nextSibling.textContent.replace(/\s|-/g,'');
  detail.date = liList[5].firstChild.nextSibling.textContent;

  return detail;
}

/**
 * Amazonの書籍情報からDRMフリーな書籍を探す
 */
function searchBook(bookDetail) {
  var bookInfo = [];

  bookInfo.isbn13 = bookDetail.isbn13;

  return bookInfo;
}
