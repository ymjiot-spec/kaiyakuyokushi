/**
 * Dシリーズ 2ステップ診断ツール
 * GB選択 → 通話選択 → 最適プラン提案
 */
(function () {
  'use strict';

  // Dシリーズコースデータ
  const courses = {
    ds: { id: 'ds', name: 'DSコース', price: 1078, data: '月間3GB', dataGB: 3, call: '30秒22円（従量）', callType: 'pay', esim: true, desc: 'データをあまり使わないライトユーザー向け。月額1,078円の最安プラン。' },
    dm: { id: 'dm', name: 'DMコース', price: 3520, data: '月間30GB（1日1GB）', dataGB: 30, call: '5分かけ放題付き', callType: '5min', esim: true, desc: '5分かけ放題が標準付帯。バランスの取れた中間プラン。' },
    dl: { id: 'dl', name: 'DLコース', price: 5720, data: '月間60GB（1日2GB）', dataGB: 60, call: '24時間かけ放題付き', callType: '24h', esim: true, desc: '24時間かけ放題が標準付帯。通話をよくする方に最適。' },
    dx: { id: 'dx', name: 'DXコース', price: 5720, data: '月間120GB（1日4GB）', dataGB: 120, call: '30秒22円（従量）', callType: 'pay', esim: true, desc: '1日4GBの圧倒的容量。動画三昧でもギガが余る自由を。' }
  };

  // GB選択とcallTypeの組み合わせから最適コースを決定
  function findBestCourse(dataLevel, callType) {
    // dataLevel: 'light' (3GB), 'normal' (30GB), 'heavy' (60GB), 'ultra' (120GB)
    // callType: 'pay' (従量), '5min' (5分), '24h' (24時間)
    
    if (dataLevel === 'light' && callType === 'pay') return 'ds';
    if (dataLevel === 'light' && callType === '5min') return 'dm'; // DSに5分追加 → DM相当
    if (dataLevel === 'light' && callType === '24h') return 'dl'; // DSに24h追加 → DL相当
    
    if (dataLevel === 'normal' && callType === 'pay') return 'ds'; // 30GBで従量 → DS相当（実際はDMだが近似）
    if (dataLevel === 'normal' && callType === '5min') return 'dm';
    if (dataLevel === 'normal' && callType === '24h') return 'dl';
    
    if (dataLevel === 'heavy' && callType === 'pay') return 'dx'; // 60GBで従量 → DX相当
    if (dataLevel === 'heavy' && callType === '5min') return 'dm'; // 60GBで5分 → DM相当
    if (dataLevel === 'heavy' && callType === '24h') return 'dl';
    
    if (dataLevel === 'ultra' && callType === 'pay') return 'dx';
    if (dataLevel === 'ultra' && callType === '5min') return 'dx'; // DXに5分追加 → DX相当
    if (dataLevel === 'ultra' && callType === '24h') return 'dl'; // 120GBで24h → DL相当
    
    return 'dm'; // デフォルト
  }

  // DOM操作
  function initDiagnosis() {
    const form = document.getElementById('diagnosis-form');
    const resultArea = document.getElementById('diagnosis-result');
    if (!form || !resultArea) return;

    const currentCourseId = form.dataset.currentCourse;
    const current = courses[currentCourseId];

    let selectedData = null;
    let selectedCall = null;

    const dataButtons = form.querySelectorAll('[data-data-level]');
    const callButtons = form.querySelectorAll('[data-call-type]');

    function updateResults() {
      if (!selectedData || !selectedCall) {
        resultArea.hidden = true;
        return;
      }

      const recommendedId = findBestCourse(selectedData, selectedCall);
      
      if (recommendedId === currentCourseId) {
        resultArea.innerHTML = renderKeepCurrent(current);
      } else {
        const recommended = courses[recommendedId];
        resultArea.innerHTML = renderComparison(recommended, current);
      }
      resultArea.hidden = false;
      
      // 診断完了時に提案コンテンツを表示
      revealProposalContent();
      
      resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 提案コンテンツを表示する関数
    function revealProposalContent() {
      const hiddenSections = document.querySelectorAll('.hidden-until-diagnosis');
      hiddenSections.forEach(section => {
        section.classList.remove('hidden-until-diagnosis');
        section.classList.add('revealed');
      });
    }

    dataButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dataButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedData = btn.dataset.dataLevel;
        updateResults();
      });
    });

    callButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        callButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedCall = btn.dataset.callType;
        updateResults();
      });
    });
  }

  function renderComparison(recommended, current) {
    const diff = current.price - recommended.price;
    const diffText = diff > 0
      ? '<div style="font-size:12px;color:#1e40af;font-weight:700;margin-top:4px;">▼ 月額 ' + diff.toLocaleString() + '円おトク（年間 ' + (diff * 12).toLocaleString() + '円節約）</div>'
      : diff < 0
        ? '<div style="font-size:12px;color:#6b7280;margin-top:4px;">月額 +' + Math.abs(diff).toLocaleString() + '円</div>'
        : '<div style="font-size:12px;color:#6b7280;margin-top:4px;">同額</div>';

    let html = '<div style="max-width:800px;margin:0 auto;">';
    html += '<div style="background:#fff;border:2px solid #2563eb;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);margin-bottom:20px;">';
    html += '<div style="background:linear-gradient(90deg,#2563eb 0%,#3b82f6 100%);padding:8px 16px;text-align:center;color:#fff;font-size:13px;font-weight:800;">🏆 あなたへの最適解</div>';

    // 横並び比較
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:2px solid #e5e7eb;">';
    html += '  <div style="padding:14px 12px;text-align:center;background:#f9fafb;border-right:1px solid #e5e7eb;">';
    html += '    <div style="font-size:10px;color:#6b7280;">現在</div>';
    html += '    <div style="font-size:15px;font-weight:800;color:#111827;">' + current.name + '</div>';
    html += '  </div>';
    html += '  <div style="padding:14px 12px;text-align:center;background:#eff6ff;">';
    html += '    <div style="font-size:10px;color:#2563eb;">提案</div>';
    html += '    <div style="font-size:15px;font-weight:800;color:#1e40af;">' + recommended.name + '</div>';
    html += '  </div>';
    html += '</div>';

    // 月額料金
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #f3f4f6;">';
    html += '  <div style="padding:12px;text-align:center;background:#f9fafb;border-right:1px solid #e5e7eb;">';
    html += '    <div style="font-size:10px;color:#6b7280;">💰 月額</div>';
    html += '    <div style="font-size:1.5rem;font-weight:900;color:#111827;">' + current.price.toLocaleString() + '<span style="font-size:12px;font-weight:600;color:#6b7280;">円</span></div>';
    html += '  </div>';
    html += '  <div style="padding:12px;text-align:center;background:#eff6ff;">';
    html += '    <div style="font-size:10px;color:#6b7280;">💰 月額</div>';
    html += '    <div style="font-size:1.5rem;font-weight:900;color:#1e40af;">' + recommended.price.toLocaleString() + '<span style="font-size:12px;font-weight:600;color:#6b7280;">円</span></div>';
    html += diffText;
    html += '  </div>';
    html += '</div>';

    // データ容量
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #f3f4f6;">';
    html += '  <div style="padding:12px;text-align:center;background:#f9fafb;border-right:1px solid #e5e7eb;">';
    html += '    <div style="font-size:10px;color:#6b7280;">📶 データ</div>';
    html += '    <div style="font-size:14px;font-weight:800;color:#111827;">' + current.data + '</div>';
    html += '  </div>';
    html += '  <div style="padding:12px;text-align:center;background:#eff6ff;">';
    html += '    <div style="font-size:10px;color:#6b7280;">📶 データ</div>';
    html += '    <div style="font-size:14px;font-weight:800;color:#1e40af;">' + recommended.data + '</div>';
    html += '  </div>';
    html += '</div>';

    // 通話
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;">';
    html += '  <div style="padding:12px;text-align:center;background:#f9fafb;border-right:1px solid #e5e7eb;">';
    html += '    <div style="font-size:10px;color:#6b7280;">📞 通話</div>';
    html += '    <div style="font-size:13px;font-weight:800;color:#111827;">' + current.call + '</div>';
    html += '  </div>';
    html += '  <div style="padding:12px;text-align:center;background:#eff6ff;">';
    html += '    <div style="font-size:10px;color:#6b7280;">📞 通話</div>';
    html += '    <div style="font-size:13px;font-weight:800;color:#1e40af;">' + recommended.call + '</div>';
    html += '  </div>';
    html += '</div>';

    html += '<div style="padding:20px;">';
    html += '  <div style="background:#f9fafb;border-radius:12px;padding:14px;margin-bottom:16px;text-align:center;">';
    html += '    <div style="font-size:13px;color:#374151;line-height:1.8;">' + recommended.desc + '</div>';
    html += '  </div>';
    html += '  <div style="text-align:center;">';
    html += '    <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:14px 32px;font-size:16px;font-weight:700;color:#fff;background:linear-gradient(135deg,#c00 0%,#a00 100%);border-radius:12px;text-decoration:none;box-shadow:0 4px 14px rgba(204,0,0,0.3);">コース変更を申請する</a>';
    html += '    <p style="font-size:12px;color:#6b7280;margin:8px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '  </div>';
    html += '</div>';

    html += '</div></div>';
    return html;
  }

  function renderKeepCurrent(current) {
    return ''
      + '<div style="max-width:560px;margin:0 auto;text-align:center;">'
      + '  <div style="font-size:2rem;margin-bottom:8px;">✨</div>'
      + '  <div style="font-size:16px;font-weight:800;color:#1e3a6e;margin-bottom:8px;">今のプランがベストです</div>'
      + '  <p style="font-size:14px;color:#6b7280;line-height:1.8;">診断の結果、現在の' + current.name + 'があなたに最適です。<br>引き続きスターサービスをお楽しみください。</p>'
      + '</div>';
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagnosis);
  } else {
    initDiagnosis();
  }
})();
