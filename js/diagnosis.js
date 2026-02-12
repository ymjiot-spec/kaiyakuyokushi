/**
 * Dシリーズ 2ステップYES/NO診断ツール（DL専用厳密ロジック）
 * STEP1: ギガの確認（速度制限の経験）
 * STEP2: 通話の確認（24時間かけ放題の必要性）
 */
(function () {
  'use strict';

  // Dシリーズコースデータ
  const courses = {
    ds: { id: 'ds', name: 'DSコース', price: 1078, data: '月間3GB', dataGB: 3, call: '30秒22円（従量）', callType: 'pay', esim: true },
    dm: { id: 'dm', name: 'DMコース', price: 3520, data: '月間30GB（1日1GB）', dataGB: 30, call: '5分かけ放題付き', callType: '5min', esim: true },
    dl: { id: 'dl', name: 'DLコース', price: 5720, data: '月間60GB（1日2GB）', dataGB: 60, call: '24時間かけ放題付き', callType: '24h', esim: true },
    dx: { id: 'dx', name: 'DXコース', price: 5720, data: '月間120GB（1日4GB）', dataGB: 120, call: '30秒22円（従量）', callType: 'pay', esim: true }
  };

  let gigaAnswer = null;
  let callAnswer = null;

  // DOM操作
  function initDiagnosis() {
    const form = document.getElementById('diagnosis-form');
    const resultArea = document.getElementById('diagnosis-result');
    if (!form || !resultArea) return;

    const currentCourseId = form.dataset.currentCourse;
    const current = courses[currentCourseId];

    // STEP1: ギガの確認
    const step1 = document.getElementById('step1-giga');
    const step2 = document.getElementById('step2-call');
    
    if (!step1 || !step2) return;

    const gigaButtons = step1.querySelectorAll('[data-giga]');
    gigaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        gigaButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gigaAnswer = btn.dataset.giga;
        
        // STEP2を表示
        step2.style.display = 'block';
        step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    // STEP2: 通話の確認
    const callButtons = step2.querySelectorAll('[data-call]');
    callButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        callButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        callAnswer = btn.dataset.call;
        
        // 診断完了 → 結果表示
        showFinalResult(gigaAnswer, callAnswer, current, currentCourseId);
      });
    });
  }

  // 最終判定ロジック
  function showFinalResult(giga, call, current, currentCourseId) {
    const resultArea = document.getElementById('diagnosis-result');
    
    // 判定ロジック
    // 通話YESなら全回答に関わらず → DLコース（現状維持・最強バランス）
    if (call === 'yes') {
      resultArea.innerHTML = renderKeepDL(current);
    } else {
      // 通話NO
      if (giga === 'yes') {
        // ギガYES + 通話NO → DXコース（ギガ特化）
        resultArea.innerHTML = renderComparison(courses.dx, current, 'dx');
      } else {
        // ギガNO + 通話NO → DM / DSコース（料金特化）
        resultArea.innerHTML = renderMultipleSavings(current);
      }
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

  // DL現状維持推奨（通話YES）
  function renderKeepDL(current) {
    let html = '<div style="max-width:800px;margin:0 auto;">';
    html += '<div style="background:#fff;border:2px solid #10b981;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);margin-bottom:20px;">';
    html += '<div style="background:linear-gradient(90deg,#10b981 0%,#34d399 100%);padding:8px 16px;text-align:center;color:#fff;font-size:13px;font-weight:800;">🏆 あなたへの最適解</div>';

    html += '<div style="padding:24px;">';
    html += '  <div style="background:#d1fae5;border-left:4px solid #10b981;padding:20px;border-radius:12px;margin-bottom:24px;text-align:center;">';
    html += '    <div style="font-size:20px;font-weight:900;color:#065f46;margin-bottom:12px;">✅ DLコース（現状維持）が最適です</div>';
    html += '    <p style="font-size:15px;color:#047857;line-height:1.9;margin:0;">24時間かけ放題が必要なあなたには、<strong>DLコースが最強のバランス</strong>です。<br>このまま安心してご利用ください。</p>';
    html += '  </div>';

    html += '  <div style="background:#eff6ff;border:2px solid #2563eb;border-radius:12px;padding:20px;margin-bottom:20px;">';
    html += '    <div style="text-align:center;margin-bottom:16px;">';
    html += '      <div style="font-size:18px;font-weight:800;color:#1e40af;margin-bottom:8px;">現在のプラン：DLコース</div>';
    html += '      <div style="font-size:2.5rem;font-weight:900;color:#1e40af;">5,720<span style="font-size:1rem;font-weight:600;color:#6b7280;">円/月</span></div>';
    html += '    </div>';
    html += '    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    html += '      <div style="background:#fff;border-radius:8px;padding:14px;">';
    html += '        <div style="font-size:13px;color:#6b7280;margin-bottom:4px;">📶 データ容量</div>';
    html += '        <div style="font-size:16px;font-weight:800;color:#111827;">60GB（1日2GB）</div>';
    html += '      </div>';
    html += '      <div style="background:#fff;border-radius:8px;padding:14px;">';
    html += '        <div style="font-size:13px;color:#6b7280;margin-bottom:4px;">📞 通話</div>';
    html += '        <div style="font-size:16px;font-weight:800;color:#111827;">24時間かけ放題</div>';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:20px;">';
    html += '    <div style="font-size:14px;color:#374151;line-height:1.9;text-align:center;">';
    html += '      <strong>DLコースは、通話もデータも両立できる最強プラン。</strong><br>';
    html += '      他のプランに変更すると、24時間かけ放題が失われます。';
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="text-align:center;">';
    html += '    <p style="font-size:14px;color:#6b7280;margin:0;">このまま安心してご利用ください。</p>';
    html += '  </div>';

    html += '</div></div></div>';
    return html;
  }

  // DX推奨（ギガYES + 通話NO）
  function renderComparison(recommended, current, recommendedId) {
    let html = '<div style="max-width:800px;margin:0 auto;">';
    html += '<div style="background:#fff;border:2px solid #2563eb;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);margin-bottom:20px;">';
    html += '<div style="background:linear-gradient(90deg,#2563eb 0%,#3b82f6 100%);padding:8px 16px;text-align:center;color:#fff;font-size:13px;font-weight:800;">🏆 あなたへの最適解</div>';

    html += '<div style="padding:24px;">';
    html += '  <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin-bottom:20px;">';
    html += '    <div style="font-size:15px;font-weight:800;color:#92400e;margin-bottom:8px;">⚠️ 速度制限の経験があるなら、ギガ不足のサインです</div>';
    html += '    <p style="font-size:14px;color:#78350f;line-height:1.8;margin:0;">24時間かけ放題が不要なら、<strong>DXコースでギガに特化</strong>するのが最適です。</p>';
    html += '  </div>';

    // 横並び比較表（縦3列・完全固定）
    html += '  <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:20px;">';
    html += '    <div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:16px;text-align:center;">📊 プラン比較</div>';
    html += '    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    
    // 現在のプラン（DL）
    html += '      <div style="background:#fff;border:2px solid #e5e7eb;border-radius:12px;padding:16px;">';
    html += '        <div style="text-align:center;margin-bottom:12px;">';
    html += '          <div style="font-size:14px;font-weight:700;color:#6b7280;margin-bottom:4px;">現在</div>';
    html += '          <div style="font-size:18px;font-weight:800;color:#111827;">DLコース</div>';
    html += '          <div style="font-size:24px;font-weight:900;color:#1e40af;margin-top:8px;">5,720<span style="font-size:12px;font-weight:600;color:#6b7280;">円</span></div>';
    html += '        </div>';
    html += '        <div style="border-top:1px solid #e5e7eb;padding-top:12px;">';
    html += '          <div style="margin-bottom:8px;">';
    html += '            <div style="font-size:12px;color:#6b7280;">月額料金</div>';
    html += '            <div style="font-size:14px;font-weight:700;color:#111827;">5,720円</div>';
    html += '          </div>';
    html += '          <div style="margin-bottom:8px;">';
    html += '            <div style="font-size:12px;color:#6b7280;">データ容量</div>';
    html += '            <div style="font-size:14px;font-weight:700;color:#111827;">60GB</div>';
    html += '          </div>';
    html += '          <div>';
    html += '            <div style="font-size:12px;color:#6b7280;">通話条件</div>';
    html += '            <div style="font-size:14px;font-weight:700;color:#111827;">24時間カケホ</div>';
    html += '          </div>';
    html += '        </div>';
    html += '      </div>';
    
    // おすすめプラン（DX）
    html += '      <div style="background:#eff6ff;border:2px solid #2563eb;border-radius:12px;padding:16px;">';
    html += '        <div style="text-align:center;margin-bottom:12px;">';
    html += '          <div style="font-size:14px;font-weight:700;color:#2563eb;margin-bottom:4px;">🏆 おすすめ</div>';
    html += '          <div style="font-size:18px;font-weight:800;color:#111827;">DXコース</div>';
    html += '          <div style="font-size:24px;font-weight:900;color:#1e40af;margin-top:8px;">5,720<span style="font-size:12px;font-weight:600;color:#6b7280;">円</span></div>';
    html += '        </div>';
    html += '        <div style="border-top:1px solid #2563eb;padding-top:12px;">';
    html += '          <div style="margin-bottom:8px;">';
    html += '            <div style="font-size:12px;color:#6b7280;">月額料金</div>';
    html += '            <div style="font-size:14px;font-weight:700;color:#111827;">5,720円</div>';
    html += '          </div>';
    html += '          <div style="margin-bottom:8px;">';
    html += '            <div style="font-size:12px;color:#6b7280;">データ容量</div>';
    html += '            <div style="font-size:14px;font-weight:700;color:#2563eb;">120GB（2倍！）</div>';
    html += '          </div>';
    html += '          <div>';
    html += '            <div style="font-size:12px;color:#6b7280;">通話条件</div>';
    html += '            <div style="font-size:14px;font-weight:700;color:#111827;">カケホなし</div>';
    html += '          </div>';
    html += '        </div>';
    html += '      </div>';
    
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="background:#d1fae5;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;">';
    html += '    <div style="font-size:14px;color:#047857;line-height:1.9;">';
    html += '      <strong>同じ料金で、ギガが2倍（120GB）に！</strong><br>';
    html += '      速度制限の心配から解放されます。';
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="text-align:center;">';
    html += '    <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:14px 32px;font-size:16px;font-weight:700;color:#fff;background:linear-gradient(135deg,#c00 0%,#a00 100%);border-radius:12px;text-decoration:none;box-shadow:0 4px 14px rgba(204,0,0,0.3);">コース変更を申請する</a>';
    html += '    <p style="font-size:12px;color:#6b7280;margin:8px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '  </div>';

    html += '</div></div></div>';
    return html;
  }

  // DM/DS節約プラン提案（ギガNO + 通話NO）
  function renderMultipleSavings(current) {
    let html = '<div style="max-width:800px;margin:0 auto;">';
    html += '<div style="background:#fff;border:2px solid #10b981;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);margin-bottom:20px;">';
    html += '<div style="background:linear-gradient(90deg,#10b981 0%,#34d399 100%);padding:8px 16px;text-align:center;color:#fff;font-size:13px;font-weight:800;">💰 あなたへの最適解</div>';

    html += '<div style="padding:24px;">';
    html += '  <div style="background:#d1fae5;border-left:4px solid #10b981;padding:16px;border-radius:8px;margin-bottom:20px;">';
    html += '    <div style="font-size:15px;font-weight:800;color:#065f46;margin-bottom:8px;">✅ 速度制限の経験がなく、24時間かけ放題も不要なら</div>';
    html += '    <p style="font-size:14px;color:#047857;line-height:1.8;margin:0;"><strong>料金を下げて賢く節約</strong>するのが最適です。</p>';
    html += '  </div>';

    html += '  <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:20px;">';
    html += '    <div style="font-size:16px;font-weight:800;color:#111827;margin-bottom:12px;text-align:center;">💡 おすすめの節約プラン</div>';
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
