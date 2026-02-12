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

    const speedLimitButtons = form.querySelectorAll('[data-speed-limit]');

    speedLimitButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        speedLimitButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const answer = btn.dataset.speedLimit;
        showResult(answer, current, currentCourseId);
      });
    });
  }

  function showResult(answer, current, currentCourseId) {
    const resultArea = document.getElementById('diagnosis-result');
    
    if (answer === 'yes') {
      // YES: 上位プラン（DX）を提案
      const recommended = courses.dx;
      resultArea.innerHTML = renderSpeedLimitYes(recommended, current, currentCourseId);
    } else {
      // NO: 現状維持または節約プランを提案
      resultArea.innerHTML = renderSpeedLimitNo(current, currentCourseId);
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

  function renderSpeedLimitYes(recommended, current, currentCourseId) {
    let html = '<div style="max-width:800px;margin:0 auto;">';
    html += '<div style="background:#fff;border:2px solid #2563eb;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);margin-bottom:20px;">';
    html += '<div style="background:linear-gradient(90deg,#2563eb 0%,#3b82f6 100%);padding:8px 16px;text-align:center;color:#fff;font-size:13px;font-weight:800;">📊 診断結果</div>';

    html += '<div style="padding:24px;">';
    html += '  <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin-bottom:20px;">';
    html += '    <div style="font-size:15px;font-weight:800;color:#92400e;margin-bottom:8px;">⚠️ 今の' + current.dataGB + 'GBでは足りない可能性があります</div>';
    html += '    <p style="font-size:14px;color:#78350f;line-height:1.8;margin:0;">速度制限の経験があるということは、データ容量が不足しているサインです。</p>';
    html += '  </div>';

    html += '  <div style="background:#eff6ff;border:2px solid #2563eb;border-radius:12px;padding:20px;margin-bottom:20px;">';
    html += '    <div style="text-align:center;margin-bottom:16px;">';
    html += '      <div style="font-size:18px;font-weight:800;color:#1e40af;margin-bottom:8px;">🏆 おすすめ：' + recommended.name + '</div>';
    html += '      <div style="font-size:2.5rem;font-weight:900;color:#1e40af;">' + recommended.price.toLocaleString() + '<span style="font-size:1rem;font-weight:600;color:#6b7280;">円/月</span></div>';
    html += '    </div>';
    html += '    <div style="background:#fff;border-radius:8px;padding:14px;margin-bottom:12px;">';
    html += '      <div style="font-size:13px;color:#6b7280;margin-bottom:4px;">📶 データ容量</div>';
    html += '      <div style="font-size:16px;font-weight:800;color:#111827;">' + recommended.data + '</div>';
    html += '    </div>';
    html += '    <div style="background:#fff;border-radius:8px;padding:14px;">';
    html += '      <div style="font-size:13px;color:#6b7280;margin-bottom:4px;">📞 通話</div>';
    html += '      <div style="font-size:16px;font-weight:800;color:#111827;">' + recommended.call + '</div>';
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:20px;">';
    html += '    <div style="font-size:14px;color:#374151;line-height:1.9;text-align:center;">';
    html += '      <strong>120GBのDXコースなら、ギガを気にせず動画を楽しめます。</strong><br>';
    html += '      1日4GBの大容量で、速度制限の心配から解放されます。';
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="text-align:center;">';
    html += '    <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:14px 32px;font-size:16px;font-weight:700;color:#fff;background:linear-gradient(135deg,#c00 0%,#a00 100%);border-radius:12px;text-decoration:none;box-shadow:0 4px 14px rgba(204,0,0,0.3);">コース変更を申請する</a>';
    html += '    <p style="font-size:12px;color:#6b7280;margin:8px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '  </div>';

    html += '</div></div></div>';
    return html;
  }

  function renderSpeedLimitNo(current, currentCourseId) {
    let html = '<div style="max-width:800px;margin:0 auto;">';
    html += '<div style="background:#fff;border:2px solid #10b981;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);margin-bottom:20px;">';
    html += '<div style="background:linear-gradient(90deg,#10b981 0%,#34d399 100%);padding:8px 16px;text-align:center;color:#fff;font-size:13px;font-weight:800;">✨ 診断結果</div>';

    html += '<div style="padding:24px;">';
    html += '  <div style="background:#d1fae5;border-left:4px solid #10b981;padding:16px;border-radius:8px;margin-bottom:20px;">';
    html += '    <div style="font-size:15px;font-weight:800;color:#065f46;margin-bottom:8px;">✅ 今の' + current.dataGB + 'GBで十分足りています</div>';
    html += '    <p style="font-size:14px;color:#047857;line-height:1.8;margin:0;">速度制限の経験がないということは、現在のデータ容量で問題ありません。</p>';
    html += '  </div>';

    html += '  <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:20px;">';
    html += '    <div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:12px;text-align:center;">💡 もし料金を下げたいなら</div>';
    html += '    <p style="font-size:14px;color:#374151;line-height:1.9;text-align:center;margin:0 0 16px;">DMやDSコースへの『お着替え』で賢く節約できます。</p>';
    
    // 節約プラン提案
    html += '    <div style="display:grid;gap:12px;">';
    
    // DMコース
    const dm = courses.dm;
    const dmSaving = current.price - dm.price;
    html += '      <div style="background:#fff;border:2px solid #e5e7eb;border-radius:12px;padding:16px;">';
    html += '        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    html += '          <div style="font-size:16px;font-weight:800;color:#111827;">' + dm.name + '</div>';
    html += '          <div style="font-size:20px;font-weight:900;color:#1e40af;">' + dm.price.toLocaleString() + '<span style="font-size:12px;font-weight:600;color:#6b7280;">円</span></div>';
    html += '        </div>';
    html += '        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">📶 ' + dm.data + ' / 📞 ' + dm.call + '</div>';
    html += '        <div style="font-size:13px;color:#10b981;font-weight:700;">▼ 月額 ' + dmSaving.toLocaleString() + '円おトク（年間 ' + (dmSaving * 12).toLocaleString() + '円節約）</div>';
    html += '      </div>';
    
    // DSコース
    const ds = courses.ds;
    const dsSaving = current.price - ds.price;
    html += '      <div style="background:#fff;border:2px solid #e5e7eb;border-radius:12px;padding:16px;">';
    html += '        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    html += '          <div style="font-size:16px;font-weight:800;color:#111827;">' + ds.name + '</div>';
    html += '          <div style="font-size:20px;font-weight:900;color:#1e40af;">' + ds.price.toLocaleString() + '<span style="font-size:12px;font-weight:600;color:#6b7280;">円</span></div>';
    html += '        </div>';
    html += '        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">📶 ' + ds.data + ' / 📞 ' + ds.call + '</div>';
    html += '        <div style="font-size:13px;color:#10b981;font-weight:700;">▼ 月額 ' + dsSaving.toLocaleString() + '円おトク（年間 ' + (dsSaving * 12).toLocaleString() + '円節約）</div>';
    html += '      </div>';
    
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="text-align:center;">';
    html += '    <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:14px 32px;font-size:16px;font-weight:700;color:#fff;background:linear-gradient(135deg,#c00 0%,#a00 100%);border-radius:12px;text-decoration:none;box-shadow:0 4px 14px rgba(204,0,0,0.3);">コース変更を申請する</a>';
    html += '    <p style="font-size:12px;color:#6b7280;margin:8px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '  </div>';

    html += '</div></div></div>';
    return html;
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagnosis);
  } else {
    initDiagnosis();
  }
})();
