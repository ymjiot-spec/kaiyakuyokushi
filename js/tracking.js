/**
 * 解約抑止ページ イベントトラッキング
 * localStorageにイベントを記録
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'star_tracking_events';

  function getEvents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch(e) {
      return [];
    }
  }

  function saveEvent(type, data) {
    var events = getEvents();
    events.push({
      type: type,
      data: data || {},
      course: detectCourse(),
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }

  function detectCourse() {
    var path = window.location.pathname;
    if (path.indexOf('u.html') !== -1) return 'U';
    if (path.indexOf('dx.html') !== -1) return 'DX';
    if (path.indexOf('dl.html') !== -1) return 'DL';
    if (path.indexOf('dm.html') !== -1) return 'DM';
    if (path.indexOf('ds.html') !== -1) return 'DS';
    if (path.indexOf('s.html') !== -1) return 'S';
    if (path.indexOf('w-3gb.html') !== -1) return 'W-3GB';
    if (path.indexOf('w-50gb.html') !== -1) return 'W-50GB';
    return 'unknown';
  }

  // ページ訪問記録
  saveEvent('page_visit');

  // DOMReady後にイベントリスナー設置
  document.addEventListener('DOMContentLoaded', function() {

    // 理由選択ボタン
    var reasonCards = document.querySelectorAll('.reason-card');
    reasonCards.forEach(function(card) {
      card.addEventListener('click', function() {
        var reason = this.getAttribute('data-reason');
        saveEvent('reason_select', { reason: reason });
      });
    });

    // サポートデスクボタン
    var supportLinks = document.querySelectorAll('a[href*="support.starservice.jp"]');
    supportLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        saveEvent('support_click');
      });
    });

    // 他社比較ボタン
    var comparisonBtns = document.querySelectorAll('a[href="#competitor-title"]');
    comparisonBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        saveEvent('comparison_view');
      });
    });

    // 解約ボタン
    var cancelBtns = document.querySelectorAll('[data-modal-target="cancel-modal"]');
    cancelBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        saveEvent('cancel_click');
      });
    });

    // 解約モーダルのキャンセルボタン
    var modalCancelBtns = document.querySelectorAll('#cancel-modal .btn--outline');
    modalCancelBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        saveEvent('cancel_abort');
      });
    });

    // 解約モーダルの確定ボタン
    var modalConfirmBtns = document.querySelectorAll('#cancel-modal .btn--danger');
    modalConfirmBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        saveEvent('cancel_confirm');
      });
    });
  });

  // グローバルに公開
  window.StarTracking = {
    getEvents: getEvents,
    saveEvent: saveEvent
  };
})();
