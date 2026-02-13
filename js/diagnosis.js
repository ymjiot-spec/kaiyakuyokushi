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

    // STEP1のスタイル改善（中央配置・大きなカード）
    const step1Title = step1.querySelector('h3');
    if (step1Title) {
      step1Title.style.fontSize = '18px';
      step1Title.style.fontWeight = '800';
      step1Title.style.color = '#111827';
      step1Title.style.marginBottom = '28px';
      step1Title.style.textAlign = 'center';
      step1Title.style.lineHeight = '1.7';
      step1Title.innerHTML = '📊 STEP 1: ギガの確認<br><br>過去にスマホの速度制限がかかって<br>困ったことはありますか？';
    }

    // STEP2のスタイル改善
    const step2Title = step2.querySelector('h3');
    if (step2Title) {
      step2Title.style.fontSize = '18px';
      step2Title.style.fontWeight = '800';
      step2Title.style.color = '#111827';
      step2Title.style.marginBottom = '28px';
      step2Title.style.textAlign = 'center';
      step2Title.style.lineHeight = '1.7';
      step2Title.innerHTML = '📞 STEP 2: 通話の確認<br><br>『24時間いつでも、何分でも』<br>無料通話ができる機能は、<br>今後も絶対に必要ですか？';
    }

    const gigaButtons = step1.querySelectorAll('[data-giga]');
    gigaButtons.forEach(btn => {
      // ボタンスタイルの改善
      btn.style.padding = '24px';
      btn.style.fontSize = '16px';
      btn.style.fontWeight = '700';
      btn.style.borderRadius = '16px';
      btn.style.border = '3px solid #e5e7eb';
      btn.style.transition = 'all 0.3s';
      btn.style.cursor = 'pointer';
      
      // 絵文字を削除してアイコンに変更
      const emoji = btn.querySelector('span:first-child');
      if (emoji) {
        const gigaValue = btn.dataset.giga;
        if (gigaValue === 'yes') {
          emoji.textContent = '⚠️';
          emoji.style.fontSize = '2.5rem';
        } else {
          emoji.textContent = '✅';
          emoji.style.fontSize = '2.5rem';
        }
      }
      
      // テキストを日本語に変更
      const textDiv = btn.querySelector('div');
      if (textDiv) {
        const titleDiv = textDiv.querySelector('div:first-child');
        const descDiv = textDiv.querySelector('div:last-child');
        if (titleDiv && descDiv) {
          const gigaValue = btn.dataset.giga;
          if (gigaValue === 'yes') {
            titleDiv.textContent = 'はい（経験がある）';
            descDiv.textContent = '速度制限で困ったことがある';
          } else {
            titleDiv.textContent = 'いいえ（一度もない）';
            descDiv.textContent = '速度制限の経験なし';
          }
          titleDiv.style.fontSize = '18px';
          titleDiv.style.fontWeight = '800';
          descDiv.style.fontSize = '14px';
          descDiv.style.color = '#6b7280';
        }
      }
      
      btn.addEventListener('click', () => {
        gigaButtons.forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = '#e5e7eb';
          b.style.background = '#fff';
          b.style.boxShadow = 'none';
        });
        btn.classList.add('selected');
        btn.style.borderColor = '#2563eb';
        btn.style.background = '#eff6ff';
        btn.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.25)';
        gigaAnswer = btn.dataset.giga;
        
        // STEP2を表示
        step2.style.display = 'block';
        step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    // STEP2: 通話の確認
    const callButtons = step2.querySelectorAll('[data-call]');
    callButtons.forEach(btn => {
      // ボタンスタイルの改善
      btn.style.padding = '24px';
      btn.style.fontSize = '16px';
      btn.style.fontWeight = '700';
      btn.style.borderRadius = '16px';
      btn.style.border = '3px solid #e5e7eb';
      btn.style.transition = 'all 0.3s';
      btn.style.cursor = 'pointer';
      
      // 絵文字を調整
      const emoji = btn.querySelector('span:first-child');
      if (emoji) {
        emoji.style.fontSize = '2.5rem';
      }
      
      // テキストを日本語に変更
      const textDiv = btn.querySelector('div');
      if (textDiv) {
        const titleDiv = textDiv.querySelector('div:first-child');
        const descDiv = textDiv.querySelector('div:last-child');
        if (titleDiv && descDiv) {
          const callValue = btn.dataset.call;
          if (callValue === 'yes') {
            titleDiv.textContent = 'はい（絶対に必要）';
            descDiv.textContent = '24時間かけ放題は必須';
          } else {
            titleDiv.textContent = 'いいえ（なくても大丈夫）';
            descDiv.textContent = '通話はあまり使わない';
          }
          titleDiv.style.fontSize = '18px';
          titleDiv.style.fontWeight = '800';
          descDiv.style.fontSize = '14px';
          descDiv.style.color = '#6b7280';
        }
      }
      
      btn.addEventListener('click', () => {
        callButtons.forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = '#e5e7eb';
          b.style.background = '#fff';
          b.style.boxShadow = 'none';
        });
        btn.classList.add('selected');
        btn.style.borderColor = '#2563eb';
        btn.style.background = '#eff6ff';
        btn.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.25)';
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

  // DL現状維持推奨（通話YES）- プレミアムデザイン
  function renderKeepDL(current) {
    let html = '<div style="max-width:800px;margin:0 auto;">';
    
    // 最適解メッセージ
    html += '<div style="background:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%);border:4px solid #10b981;border-radius:20px;padding:32px;margin-bottom:32px;text-align:center;box-shadow:0 8px 24px rgba(16,185,129,0.25);position:relative;">';
    html += '  <div style="position:absolute;top:16px;right:16px;background:linear-gradient(135deg,#d4a853 0%,#f0d48a 100%);color:#78350f;font-size:11px;font-weight:800;padding:6px 14px;border-radius:16px;box-shadow:0 2px 8px rgba(212,168,83,0.4);">🏆 最強バランス</div>';
    html += '  <div style="font-size:24px;font-weight:900;color:#065f46;margin-bottom:16px;">✅ DLコース（現状維持）が最適です</div>';
    html += '  <p style="font-size:16px;color:#047857;line-height:1.9;margin:0;">24時間かけ放題が必要なあなたには、<strong>DLコースが最強のバランス</strong>です。<br>このまま安心してご利用ください。</p>';
    html += '</div>';

    // 現在のプラン詳細
    html += '<div style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:3px solid #2563eb;border-radius:16px;padding:28px;margin-bottom:32px;box-shadow:0 6px 20px rgba(37,99,235,0.2);">';
    html += '  <div style="text-align:center;margin-bottom:20px;">';
    html += '    <div style="font-size:18px;font-weight:800;color:#1e40af;margin-bottom:12px;">現在のプラン：DLコース</div>';
    html += '    <div style="font-size:40px;font-weight:900;color:#1e40af;">5,720<span style="font-size:18px;font-weight:600;color:#3b82f6;">円/月</span></div>';
    html += '  </div>';
    html += '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">';
    html += '    <div style="background:#fff;border-radius:12px;padding:20px;text-align:center;">';
    html += '      <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">📶 データ容量</div>';
    html += '      <div style="font-size:20px;font-weight:900;color:#1e40af;">60GB</div>';
    html += '      <div style="font-size:12px;color:#6b7280;margin-top:4px;">（1日2GB）</div>';
    html += '    </div>';
    html += '    <div style="background:#fff;border-radius:12px;padding:20px;text-align:center;">';
    html += '      <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">📞 通話</div>';
    html += '      <div style="font-size:20px;font-weight:900;color:#1e40af;">24時間</div>';
    html += '      <div style="font-size:12px;color:#6b7280;margin-top:4px;">かけ放題</div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    // 警告メッセージ
    html += '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:20px;border-radius:12px;margin-bottom:32px;text-align:center;">';
    html += '  <div style="font-size:15px;color:#78350f;line-height:1.9;margin:0;">';
    html += '    <strong>DLコースは、通話もデータも両立できる最強プラン。</strong><br>';
    html += '    他のプランに変更すると、24時間かけ放題が失われます。';
    html += '  </div>';
    html += '</div>';

    // 次世代への移行メッセージ
    html += '<div style="background:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%);border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.15);">';
    html += '  <div style="font-size:16px;font-weight:900;color:#065f46;margin-bottom:8px;">✨ 古い通信スタイルから、次世代のDコースへ。</div>';
    html += '  <p style="font-size:14px;color:#047857;line-height:1.9;margin:0;">eSIM対応、独自帯域、5G対応予定。DLコースは進化し続けます。</p>';
    html += '</div>';

    // メッセージ
    html += '<div style="text-align:center;">';
    html += '  <p style="font-size:16px;color:#6b7280;margin:0;font-weight:600;">このまま安心してご利用ください。</p>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  // DX推奨（ギガYES + 通話NO）- 新旧コントラスト比較UI
  function renderComparison(recommended, current, recommendedId) {
    let html = '<div style="max-width:1000px;margin:0 auto;">';
    
    // 警告メッセージ
    html += '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:20px;border-radius:12px;margin-bottom:32px;text-align:center;">';
    html += '  <div style="font-size:18px;font-weight:900;color:#92400e;margin-bottom:12px;">⚠️ 速度制限の経験があるなら、ギガ不足のサインです</div>';
    html += '  <p style="font-size:15px;color:#78350f;line-height:1.9;margin:0;">24時間かけ放題が不要なら、<strong>DXコースでギガに特化</strong>するのが最適です。</p>';
    html += '</div>';

    // 新旧対比：左右横並び比較表
    html += '<div style="margin-bottom:32px;">';
    html += '  <div style="font-size:20px;font-weight:900;color:#111827;margin-bottom:24px;text-align:center;">📊 プラン比較</div>';
    html += '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">';
    
    // 左側：現在のプラン（旧世代デザイン）
    html += '    <div style="background:#f5f5f5;border:3px dashed #9ca3af;border-radius:16px;padding:24px;position:relative;opacity:0.85;">';
    html += '      <div style="position:absolute;top:12px;right:12px;background:#6b7280;color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:12px;">旧世代プラン</div>';
    html += '      <div style="text-align:center;margin-bottom:20px;">';
    html += '        <div style="font-size:13px;font-weight:600;color:#6b7280;margin-bottom:8px;">現在</div>';
    html += '        <div style="font-size:22px;font-weight:800;color:#4b5563;">DLコース</div>';
    html += '        <div style="font-size:32px;font-weight:900;color:#6b7280;margin-top:12px;">5,720<span style="font-size:14px;font-weight:600;color:#9ca3af;">円/月</span></div>';
    html += '      </div>';
    html += '      <div style="border-top:2px dashed #d1d5db;padding-top:16px;">';
    html += '        <div style="margin-bottom:16px;">';
    html += '          <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">💰 月額料金</div>';
    html += '          <div style="font-size:16px;font-weight:700;color:#4b5563;">5,720円</div>';
    html += '        </div>';
    html += '        <div style="margin-bottom:16px;">';
    html += '          <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">📶 データ容量</div>';
    html += '          <div style="font-size:16px;font-weight:700;color:#4b5563;">60GB</div>';
    html += '        </div>';
    html += '        <div>';
    html += '          <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">📞 通話条件</div>';
    html += '          <div style="font-size:16px;font-weight:700;color:#4b5563;">24時間カケホ</div>';
    html += '        </div>';
    html += '      </div>';
    html += '    </div>';
    
    // 右側：提案プラン（最新デザイン）
    html += '    <div style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:4px solid #2563eb;border-radius:16px;padding:24px;position:relative;box-shadow:0 8px 24px rgba(37,99,235,0.25);">';
    html += '      <div style="position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#d4a853 0%,#f0d48a 100%);color:#78350f;font-size:11px;font-weight:800;padding:6px 14px;border-radius:16px;box-shadow:0 2px 8px rgba(212,168,83,0.4);">🏆 人気No.1</div>';
    html += '      <div style="text-align:center;margin-bottom:20px;">';
    html += '        <div style="font-size:13px;font-weight:700;color:#2563eb;margin-bottom:8px;">あなたへの最適解</div>';
    html += '        <div style="font-size:22px;font-weight:900;color:#1e40af;">DXコース</div>';
    html += '        <div style="font-size:32px;font-weight:900;color:#1e40af;margin-top:12px;">5,720<span style="font-size:14px;font-weight:600;color:#3b82f6;">円/月</span></div>';
    html += '      </div>';
    html += '      <div style="border-top:2px solid #2563eb;padding-top:16px;">';
    html += '        <div style="margin-bottom:16px;">';
    html += '          <div style="font-size:12px;color:#3b82f6;margin-bottom:6px;">💰 月額料金</div>';
    html += '          <div style="font-size:16px;font-weight:700;color:#1e40af;">5,720円 <span style="font-size:13px;color:#10b981;">（同額）</span></div>';
    html += '        </div>';
    html += '        <div style="margin-bottom:16px;">';
    html += '          <div style="font-size:12px;color:#3b82f6;margin-bottom:6px;">📶 データ容量</div>';
    html += '          <div style="font-size:18px;font-weight:900;color:#dc2626;">120GB <span style="font-size:14px;color:#dc2626;">（2倍！）</span></div>';
    html += '        </div>';
    html += '        <div>';
    html += '          <div style="font-size:12px;color:#3b82f6;margin-bottom:6px;">📞 通話条件</div>';
    html += '          <div style="font-size:16px;font-weight:700;color:#1e40af;">カケホなし</div>';
    html += '        </div>';
    html += '      </div>';
    html += '    </div>';
    
    html += '  </div>';
    html += '</div>';

    // 次世代への移行メッセージ
    html += '<div style="background:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%);border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.15);">';
    html += '  <div style="font-size:16px;font-weight:900;color:#065f46;margin-bottom:8px;">✨ 古い通信スタイルから、次世代のDコースへ。</div>';
    html += '  <p style="font-size:14px;color:#047857;line-height:1.9;margin:0;">同じ料金で、ギガが2倍（120GB）に。速度制限の心配から解放されます。</p>';
    html += '</div>';

    // CTAボタン
    html += '<div style="text-align:center;">';
    html += '  <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:64px;padding:20px 48px;font-size:18px;font-weight:900;color:#fff;background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);border-radius:16px;text-decoration:none;box-shadow:0 8px 24px rgba(37,99,235,0.4);transition:all 0.3s;">コース変更を申請する</a>';
    html += '  <p style="font-size:13px;color:#6b7280;margin:12px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  // DM/DS節約プラン提案（ギガNO + 通話NO）- 新旧コントラスト比較UI
  function renderMultipleSavings(current) {
    let html = '<div style="max-width:1000px;margin:0 auto;">';
    
    // 警告メッセージ
    html += '<div style="background:#d1fae5;border-left:4px solid #10b981;padding:20px;border-radius:12px;margin-bottom:32px;text-align:center;">';
    html += '  <div style="font-size:18px;font-weight:900;color:#065f46;margin-bottom:12px;">✅ 速度制限の経験がなく、24時間かけ放題も不要なら</div>';
    html += '  <p style="font-size:15px;color:#047857;line-height:1.9;margin:0;"><strong>料金を下げて賢く節約</strong>するのが最適です。</p>';
    html += '</div>';

    // 節約プラン提案
    html += '<div style="margin-bottom:32px;">';
    html += '  <div style="font-size:20px;font-weight:900;color:#111827;margin-bottom:24px;text-align:center;">💡 おすすめの節約プラン</div>';
    html += '  <div style="display:grid;gap:20px;">';
    
    // DMコース
    const dm = courses.dm;
    const dmSaving = current.price - dm.price;
    html += '    <div style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:4px solid #2563eb;border-radius:16px;padding:24px;box-shadow:0 8px 24px rgba(37,99,235,0.25);position:relative;">';
    html += '      <div style="position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#d4a853 0%,#f0d48a 100%);color:#78350f;font-size:11px;font-weight:800;padding:6px 14px;border-radius:16px;box-shadow:0 2px 8px rgba(212,168,83,0.4);">🏆 おすすめ</div>';
    html += '      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">';
    html += '        <div style="font-size:22px;font-weight:900;color:#1e40af;">' + dm.name + '</div>';
    html += '        <div style="font-size:32px;font-weight:900;color:#1e40af;">' + dm.price.toLocaleString() + '<span style="font-size:14px;font-weight:600;color:#3b82f6;">円/月</span></div>';
    html += '      </div>';
    html += '      <div style="font-size:14px;color:#1e40af;margin-bottom:12px;font-weight:600;">📶 ' + dm.data + ' / 📞 ' + dm.call + '</div>';
    html += '      <div style="background:#d1fae5;border-radius:12px;padding:16px;text-align:center;">';
    html += '        <div style="font-size:18px;color:#dc2626;font-weight:900;">▼ 月額 ' + dmSaving.toLocaleString() + '円おトク</div>';
    html += '        <div style="font-size:14px;color:#047857;font-weight:700;margin-top:4px;">年間 ' + (dmSaving * 12).toLocaleString() + '円節約</div>';
    html += '      </div>';
    html += '    </div>';
    
    // DSコース
    const ds = courses.ds;
    const dsSaving = current.price - ds.price;
    html += '    <div style="background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border:3px solid #10b981;border-radius:16px;padding:24px;box-shadow:0 6px 20px rgba(16,185,129,0.2);">';
    html += '      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">';
    html += '        <div style="font-size:22px;font-weight:900;color:#065f46;">' + ds.name + '</div>';
    html += '        <div style="font-size:32px;font-weight:900;color:#065f46;">' + ds.price.toLocaleString() + '<span style="font-size:14px;font-weight:600;color:#10b981;">円/月</span></div>';
    html += '      </div>';
    html += '      <div style="font-size:14px;color:#065f46;margin-bottom:12px;font-weight:600;">📶 ' + ds.data + ' / 📞 ' + ds.call + '</div>';
    html += '      <div style="background:#fef3c7;border-radius:12px;padding:16px;text-align:center;">';
    html += '        <div style="font-size:18px;color:#dc2626;font-weight:900;">▼ 月額 ' + dsSaving.toLocaleString() + '円おトク</div>';
    html += '        <div style="font-size:14px;color:#92400e;font-weight:700;margin-top:4px;">年間 ' + (dsSaving * 12).toLocaleString() + '円節約</div>';
    html += '      </div>';
    html += '    </div>';
    
    html += '  </div>';
    html += '</div>';

    // 次世代への移行メッセージ
    html += '<div style="background:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%);border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.15);">';
    html += '  <div style="font-size:16px;font-weight:900;color:#065f46;margin-bottom:8px;">✨ 古い通信スタイルから、次世代のDコースへ。</div>';
    html += '  <p style="font-size:14px;color:#047857;line-height:1.9;margin:0;">使わないギガに払うのはもったいない。あなたに合ったプランで賢く節約しましょう。</p>';
    html += '</div>';

    // CTAボタン
    html += '<div style="text-align:center;">';
    html += '  <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:64px;padding:20px 48px;font-size:18px;font-weight:900;color:#fff;background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);border-radius:16px;text-decoration:none;box-shadow:0 8px 24px rgba(37,99,235,0.4);transition:all 0.3s;">コース変更を申請する</a>';
    html += '  <p style="font-size:13px;color:#6b7280;margin:12px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagnosis);
  } else {
    initDiagnosis();
  }
})();
