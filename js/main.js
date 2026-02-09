/**
 * スターサービス 解約抑止ページ 共通JavaScript
 * 
 * 解約検討理由の選択と提案表示、MNP/解約モーダルの制御を行う
 * 
 * 要件: 2.1-2.6, 5.1-5.3
 */

(function() {
  'use strict';

  // ============================================
  // 初期化
  // ============================================
  
  document.addEventListener('DOMContentLoaded', function() {
    initReasonSelector();
    initModal();
    initComparisonTable();
    initSmoothScroll();
    initSavingsSimulator();
    initScrollAnimation();
  });

  // ============================================
  // 理由選択機能
  // 要件2.1-2.6: 解約検討理由の選択と提案表示
  // ============================================
  
  /**
   * 理由選択機能を初期化
   */
  function initReasonSelector() {
    const reasonCards = document.querySelectorAll('.reason-card');
    const proposals = document.querySelectorAll('.proposal');
    
    if (reasonCards.length === 0) return;
    
    reasonCards.forEach(function(card) {
      card.addEventListener('click', function() {
        const reason = this.getAttribute('data-reason');
        
        // すべてのカードから active クラスを削除
        reasonCards.forEach(function(c) {
          c.classList.remove('reason-card--active');
          c.setAttribute('aria-pressed', 'false');
        });
        
        // クリックされたカードに active クラスを追加
        this.classList.add('reason-card--active');
        this.setAttribute('aria-pressed', 'true');
        
        // 対応する提案セクションを表示
        showProposal(reason, proposals);
        
        // 節約シミュレーターを再初期化（提案表示後）
        setTimeout(function() {
          initSavingsSimulator();
        }, 50);
        
        // 提案セクションまでスクロール
        const targetProposal = document.getElementById('proposal-' + reason);
        if (targetProposal) {
          setTimeout(function() {
            targetProposal.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      });
      
      // キーボード操作対応
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }
  
  /**
   * 指定された理由に対応する提案セクションを表示
   * @param {string} reason - 選択された理由ID
   * @param {NodeList} proposals - 提案セクションのNodeList
   */
  function showProposal(reason, proposals) {
    proposals.forEach(function(proposal) {
      const proposalId = proposal.id.replace('proposal-', '');
      
      if (proposalId === reason) {
        proposal.hidden = false;
        proposal.setAttribute('aria-hidden', 'false');
      } else {
        proposal.hidden = true;
        proposal.setAttribute('aria-hidden', 'true');
      }
    });

    // 「料金が高い」以外は解約セクションを表示
    // 「料金が高い」は「他社との料金比較を見る」ボタンで表示
    var cancellationSection = document.getElementById('cancellation-section');
    var belowReason = document.getElementById('below-reason');
    var competitorSection = document.getElementById('competitor-section');
    
    if (reason === 'price') {
      if (cancellationSection) cancellationSection.hidden = true;
      if (belowReason) belowReason.hidden = true;
      if (competitorSection) competitorSection.hidden = true;
    } else if (reason === 'switch') {
      // 他社乗り換えはメリット・比較表・解約を全部表示
      if (belowReason) belowReason.hidden = false;
      if (competitorSection) competitorSection.hidden = false;
      if (cancellationSection) cancellationSection.hidden = false;
    } else {
      if (cancellationSection) cancellationSection.hidden = false;
      if (belowReason) belowReason.hidden = true;
      if (competitorSection) competitorSection.hidden = true;
    }
  }

  // ============================================
  // MNP/解約選択モーダル
  // 要件5.1-5.3: 解約手続きへの導線
  // ============================================
  
  /**
   * モーダル機能を初期化
   */
  function initModal() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal');
    
    // モーダルを開くトリガー
    modalTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal-target');
        const modal = document.getElementById(modalId);
        if (modal) {
          openModal(modal);
        }
      });
    });
    
    // モーダルを閉じる処理
    modals.forEach(function(modal) {
      // 閉じるボタン
      const closeBtn = modal.querySelector('.modal__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          closeModal(modal);
        });
      }
      
      // 背景クリックで閉じる
      const backdrop = modal.querySelector('.modal__backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', function() {
          closeModal(modal);
        });
      }
      
      // Escキーで閉じる
      modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeModal(modal);
        }
      });
    });
  }
  
  /**
   * モーダルを開く
   * @param {HTMLElement} modal - モーダル要素
   */
  function openModal(modal) {
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // フォーカスをモーダル内に移動
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    // フォーカストラップを設定
    trapFocus(modal);
  }
  
  /**
   * モーダルを閉じる
   * @param {HTMLElement} modal - モーダル要素
   */
  function closeModal(modal) {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // トリガー要素にフォーカスを戻す
    const trigger = document.querySelector('[data-modal-target="' + modal.id + '"]');
    if (trigger) {
      trigger.focus();
    }
  }
  
  /**
   * モーダル内にフォーカスを閉じ込める
   * @param {HTMLElement} modal - モーダル要素
   */
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // ============================================
  // 比較表機能
  // 要件3.8: コース比較表の表示
  // ============================================
  
  /**
   * 比較表を初期化
   */
  function initComparisonTable() {
    const tables = document.querySelectorAll('.comparison__table');
    
    tables.forEach(function(table) {
      // 現在のコースをハイライト
      const currentCourseId = table.getAttribute('data-current-course');
      if (currentCourseId) {
        const currentRow = table.querySelector('[data-course-id="' + currentCourseId + '"]');
        if (currentRow) {
          currentRow.classList.add('current');
        }
      }
    });
  }
  
  /**
   * 比較表を動的に生成
   * @param {string} containerId - 比較表を挿入するコンテナのID
   * @param {string} currentCourseId - 現在のコースID
   * @param {Array} coursesToCompare - 比較するコースIDの配列
   */
  function generateComparisonTable(containerId, currentCourseId, coursesToCompare) {
    const container = document.getElementById(containerId);
    if (!container || typeof courseData === 'undefined') return;
    
    const allCourses = [currentCourseId].concat(coursesToCompare);
    
    let html = '<div class="comparison__table-wrapper">';
    html += '<table class="comparison__table" data-current-course="' + currentCourseId + '">';
    html += '<thead><tr>';
    html += '<th>コース名</th>';
    html += '<th>月額料金</th>';
    html += '<th>データ量</th>';
    html += '<th>通話</th>';
    html += '<th></th>';
    html += '</tr></thead>';
    html += '<tbody>';
    
    allCourses.forEach(function(courseId) {
      const course = courseData[courseId];
      if (!course) return;
      
      const isCurrent = courseId === currentCourseId;
      const rowClass = isCurrent ? 'current' : '';
      
      html += '<tr class="' + rowClass + '" data-course-id="' + courseId + '">';
      html += '<td><strong>' + course.name + '</strong><br><small>' + course.carrierName + '</small></td>';
      html += '<td class="' + (isCurrent ? '' : 'highlight') + '">' + course.price.taxIncluded.toLocaleString() + '円</td>';
      html += '<td>' + course.data.description + '</td>';
      html += '<td>' + (course.call.included || course.call.rate) + '</td>';
      html += '<td>';
      if (isCurrent) {
        html += '<span class="text-muted">現在のコース</span>';
      } else {
        html += '<a href="#" class="btn btn--sm btn--secondary">変更する</a>';
      }
      html += '</td>';
      html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    
    container.innerHTML = html;
  }

  // ============================================
  // スムーズスクロール
  // ============================================
  
  /**
   * スムーズスクロールを初期化
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // ユーティリティ関数
  // ============================================
  
  /**
   * 数値を3桁区切りでフォーマット
   * @param {number} num - フォーマットする数値
   * @returns {string} フォーマットされた文字列
   */
  function formatNumber(num) {
    return num.toLocaleString('ja-JP');
  }
  
  /**
   * コースIDからコースデータを取得
   * @param {string} courseId - コースID
   * @returns {Object|null} コースデータ
   */
  function getCourse(courseId) {
    if (typeof courseData !== 'undefined' && courseData[courseId]) {
      return courseData[courseId];
    }
    return null;
  }

  // グローバルに公開（必要に応じて）
  window.StarService = {
    showProposal: showProposal,
    openModal: openModal,
    closeModal: closeModal,
    generateComparisonTable: generateComparisonTable,
    formatNumber: formatNumber,
    getCourse: getCourse,
    initSavingsSimulator: initSavingsSimulator
  };

  // ============================================
  // 節約シミュレーター
  // コース変更時の節約額と使い道を表示
  // ============================================
  
  /**
   * 節約シミュレーターを初期化
   */
  function initSavingsSimulator() {
    // 現在のコースIDを取得（URLまたはdata属性から）
    const currentCourseId = getCurrentCourseId();
    if (!currentCourseId || typeof courseData === 'undefined') return;
    
    const currentCourse = courseData[currentCourseId];
    if (!currentCourse) return;
    
    // コースカードに節約バッジと詳細を追加
    var courseCards = document.querySelectorAll('.course-card');
    var maxSavings = 0;
    var maxCard = null;
    
    courseCards.forEach(function(card) {
      // 既に処理済みならスキップ
      if (card.querySelector('.savings-badge')) return;
      
      // かけ放題オプションカードなどはスキップ
      var nameEl = card.querySelector('.course-card__name');
      if (!nameEl) return;
      
      var cardCourseId = getCardCourseId(card);
      if (!cardCourseId || cardCourseId === currentCourseId) return;
      
      var targetCourse = courseData[cardCourseId];
      if (!targetCourse) return;
      
      var monthlySavings = currentCourse.price.taxIncluded - targetCourse.price.taxIncluded;
      
      // 節約になる場合のみ表示
      if (monthlySavings > 0) {
        addSavingsBadge(card, monthlySavings);
        addSavingsDetail(card, monthlySavings);
        setupCardInteraction(card);
        
        if (monthlySavings > maxSavings) {
          maxSavings = monthlySavings;
          maxCard = card;
        }
      }
    });
    
    // 最大節約カードにラベル追加
    if (maxCard) {
      var badge = maxCard.querySelector('.savings-badge');
      if (badge) badge.classList.add('savings-badge--max');
    }
  }
  
  /**
   * 現在のコースIDを取得
   */
  function getCurrentCourseId() {
    // URLから取得（例: dx.html → dx）
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    
    // ハイフン付きのコースID対応（w-3gb, w-50gb）
    if (filename && typeof courseData !== 'undefined' && courseData[filename]) {
      return filename;
    }
    
    // data属性から取得
    const table = document.querySelector('.comparison__table[data-current-course]');
    if (table) {
      return table.getAttribute('data-current-course');
    }
    
    return null;
  }
  
  /**
   * カードからコースIDを取得
   */
  function getCardCourseId(card) {
    // カード内のコース名から推測
    const nameEl = card.querySelector('.course-card__name');
    if (!nameEl) return null;
    
    const name = nameEl.textContent.trim();
    
    // コース名からIDをマッピング
    const nameToId = {
      'DSコース': 'ds',
      'DMコース': 'dm',
      'DLコース': 'dl',
      'DXコース': 'dx',
      'Sコース': 's',
      'Uコース': 'u',
      'Wコース（月間50GB）': 'w-50gb',
      'Wコース（1日3GB）': 'w-3gb',
      'Wコース50GB': 'w-50gb',
      'Wコース1日3GB': 'w-3gb'
    };
    
    return nameToId[name] || null;
  }
  
  /**
   * 節約バッジを追加
   */
  function addSavingsBadge(card, monthlySavings) {
    const yearlySavings = monthlySavings * 12;
    
    // 既存のバッジがあれば削除
    const existingBadge = card.querySelector('.savings-badge');
    if (existingBadge) existingBadge.remove();
    
    // バッジを作成
    const badge = document.createElement('div');
    badge.className = 'savings-badge';
    
    // 最大節約額かどうかチェック（年間5万円以上）
    if (yearlySavings >= 50000) {
      badge.classList.add('savings-badge--max');
    }
    
    badge.innerHTML = '<span class="savings-badge__icon">💰</span>年間' + formatNumber(yearlySavings) + '円お得！';
    
    // カードにクラスを追加
    card.classList.add('course-card--has-savings');
    
    // バッジを挿入
    card.insertBefore(badge, card.firstChild);
  }
  
  /**
   * 節約詳細パネルを追加
   */
  function addSavingsDetail(card, monthlySavings) {
    const yearlySavings = monthlySavings * 12;
    
    // 既存の詳細があれば削除
    const existingDetail = card.querySelector('.savings-detail');
    if (existingDetail) existingDetail.remove();
    
    // 使い道のアイデアを生成
    const ideas = getSavingsIdeas(yearlySavings);
    
    // 詳細パネルを作成
    const detail = document.createElement('div');
    detail.className = 'savings-detail';
    
    let ideasHtml = '';
    ideas.forEach(function(idea) {
      ideasHtml += '<div class="savings-detail__idea">';
      ideasHtml += '<span class="savings-detail__idea-icon">' + idea.icon + '</span>';
      ideasHtml += '<div class="savings-detail__idea-text">';
      ideasHtml += '<div class="savings-detail__idea-title">' + idea.title + '</div>';
      ideasHtml += '<div class="savings-detail__idea-price">' + idea.price + '</div>';
      ideasHtml += '</div></div>';
    });
    
    detail.innerHTML = 
      '<div class="savings-detail__header">' +
        '<div class="savings-detail__yearly">' + formatNumber(yearlySavings) + '円</div>' +
        '<div class="savings-detail__yearly-label">年間でこれだけお得に！</div>' +
      '</div>' +
      '<div class="savings-detail__ideas">' + ideasHtml + '</div>';
    
    // フッターの前に挿入
    const footer = card.querySelector('.course-card__footer');
    if (footer) {
      card.insertBefore(detail, footer);
    } else {
      card.appendChild(detail);
    }
  }
  
  /**
   * 節約額に応じた使い道アイデアを取得
   */
  function getSavingsIdeas(yearlySavings) {
    const allIdeas = [
      { icon: '✈️', title: '国内旅行 1泊2日', price: '約30,000円〜', threshold: 30000 },
      { icon: '🏨', title: '温泉旅行 1泊2日', price: '約25,000円〜', threshold: 25000 },
      { icon: '🎬', title: 'Netflix + Spotify 1年分', price: '約24,000円', threshold: 24000 },
      { icon: '🛡️', title: 'がん保険 1年分', price: '約20,000円〜', threshold: 20000 },
      { icon: '📱', title: '最新ワイヤレスイヤホン', price: '約30,000円', threshold: 30000 },
      { icon: '🍽️', title: '高級ディナー 2回分', price: '約20,000円', threshold: 20000 },
      { icon: '👕', title: '新しい服 数着', price: '約15,000円〜', threshold: 15000 },
      { icon: '📚', title: 'ビジネス書 10冊', price: '約15,000円', threshold: 15000 },
      { icon: '☕', title: 'カフェ代 1年分', price: '約12,000円', threshold: 12000 },
      { icon: '🎮', title: '新作ゲームソフト 3本', price: '約20,000円', threshold: 20000 }
    ];
    
    // 節約額以下のアイデアをフィルタリングして3つ選ぶ
    const applicableIdeas = allIdeas.filter(function(idea) {
      return idea.threshold <= yearlySavings;
    });
    
    // ランダムに3つ選ぶ（または全部）
    const shuffled = applicableIdeas.sort(function() { return 0.5 - Math.random(); });
    return shuffled.slice(0, 3);
  }
  
  /**
   * カードのインタラクションを設定
   */
  function setupCardInteraction(card) {
    const detail = card.querySelector('.savings-detail');
    if (!detail) return;
    
    // クリックで詳細を表示/非表示
    card.addEventListener('click', function(e) {
      // ボタンやリンクのクリックは除外
      if (e.target.closest('a, button')) return;
      
      detail.classList.toggle('savings-detail--visible');
    });
    
    // ホバーでも表示（デスクトップ）
    if (window.matchMedia('(hover: hover)').matches) {
      card.addEventListener('mouseenter', function() {
        detail.classList.add('savings-detail--visible');
      });
      
      card.addEventListener('mouseleave', function() {
        detail.classList.remove('savings-detail--visible');
      });
    }
  }

  // ============================================
  // スマホ用スクロールアニメーション
  // ============================================
  function initScrollAnimation() {
    if (window.innerWidth >= 768) return;

    // スクロールでフワッと出るアニメーション（コースカード）
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.course-card').forEach(function(card) {
      observer.observe(card);
    });

    // 提案セクションが表示されたときに新しいカードも監視する
    var mutationObserver = new MutationObserver(function() {
      document.querySelectorAll('.course-card:not(.is-visible)').forEach(function(card) {
        observer.observe(card);
      });
    });
    mutationObserver.observe(document.querySelector('main'), { childList: true, subtree: true, attributes: true });
  }

})();
