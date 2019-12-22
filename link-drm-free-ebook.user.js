// ==UserScript==
// @name         Link DRM free ebook
// @namespace    http://github.com/thaim/link-drm-free-ebook
// @version      0.1
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
  var bookDetail = document.getElementById('productDetailsTable');

  // 書籍情報からDRMフリー本を探す

  // DRMフリー本が見付かったらDOMを更新する

  var ulMediaMatrix = document.getElementById('tmmSwatches').firstElementChild;
  // FIXME: 現在は固定でOreillyの書籍のISBNを付与
  var liEbook = createEBookElement('9784873118956');
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
function createEBookElement(isbn) {
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

  var link = createLinkElement(isbn);

  spanInner.appendChild(link);
  spanButton.appendChild(spanInner);
  spanItem.appendChild(spanButton);
  liEbook.appendChild(spanItem);

  return liEbook;
}

/**
 * 指定のISBNに対するlink要素を作成する
 * FIXME: 現在は固定でOreillyのサイトへのリンクを作成
 * @param isbn リンク対象のISBN
 */
function createLinkElement(isbn) {
  var link = document.createElement('a');
  link.className = 'a-button-text';
  link.setAttribute('href', 'http://www.oreilly.co.jp/books/' + isbn + '/');
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
