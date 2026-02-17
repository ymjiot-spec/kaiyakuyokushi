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

  // 他社比較と代表メッセージ（全診断結果共通）
  function renderCompetitorComparisonAndMessage() {
    let html = '';
    
    // 他社比較セクション
    html += '<div style="background:#f9fafb;padding:40px 16px;margin-top:40px;">';
    html += '  <div style="max-width:800px;margin:0 auto;">';
    html += '    <h2 style="font-size:1.3rem;font-weight:800;color:#111827;margin:0 0 24px;text-align:center;">他社との比較</h2>';
    
    // 比較表
    html += '    <div style="background:#fff;border:2px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:32px;">';
    html += '      <table style="width:100%;border-collapse:collapse;table-layout:fixed;">';
    html += '        <thead>';
    html += '          <tr style="background:#f3f4f6;">';
    html += '            <th style="padding:12px;text-align:left;font-size:13px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;"></th>';
    html += '            <th style="padding:12px;text-align:center;font-size:13px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;">スターサービス</th>';
    html += '            <th style="padding:12px;text-align:center;font-size:13px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;">他社MVNO</th>';
    html += '          </tr>';
    html += '        </thead>';
    html += '        <tbody>';
    html += '          <tr>';
    html += '            <td style="padding:12px;font-size:13px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">月額料金</td>';
    html += '            <td style="padding:12px;text-align:center;font-size:14px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">5,720円</td>';
    html += '            <td style="padding:12px;text-align:center;font-size:14px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">5,000〜6,000円</td>';
    html += '          </tr>';
    html += '          <tr>';
    html += '            <td style="padding:12px;font-size:13px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">回線品質</td>';
    html += '            <td style="padding:12px;text-align:center;font-size:14px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">ドコモ回線</td>';
    html += '            <td style="padding:12px;text-align:center;font-size:14px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">ドコモ/au/SB回線</td>';
    html += '          </tr>';
    html += '          <tr>';
    html += '            <td style="padding:12px;font-size:13px;font-weight:600;color:#374151;">通信方式</td>';
    html += '            <td style="padding:12px;text-align:center;font-size:14px;font-weight:700;color:#4b5563;border-left:1px solid #e5e7eb;">MVNO</td>';
    html += '            <td style="padding:12px;text-align:center;font-size:14px;font-weight:700;color:#4b5563;border-left:1px solid #e5e7eb;">MVNO</td>';
    html += '          </tr>';
    html += '        </tbody>';
    html += '      </table>';
    html += '    </div>';
    
    // 業界構造の説明
    html += '    <div style="background:#fff;border-left:4px solid #3b82f6;padding:20px;border-radius:8px;margin-bottom:32px;">';
    html += '      <h3 style="font-size:1rem;font-weight:700;color:#1e40af;margin:0 0 12px;">MVNO業界の構造について</h3>';
    html += '      <p style="font-size:14px;color:#4b5563;line-height:1.8;margin:0 0 12px;">MVNOは、大手キャリアから通信帯域を借りてサービスを提供しています。そのため、価格帯や通信品質は、どの会社を選んでも大きな差が出にくい構造になっています。</p>';
    html += '      <p style="font-size:14px;color:#4b5563;line-height:1.8;margin:0;">混雑時の速度低下も、帯域を借りている以上、完全に避けることは難しいのが現実です。</p>';
    html += '    </div>';
    
    // 自社の取り組み
    html += '    <div style="background:#fff;border:2px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:32px;">';
    html += '      <h3 style="font-size:1rem;font-weight:700;color:#111827;margin:0 0 16px;">それでも、私たちが続けていること</h3>';
    html += '      <ul style="margin:0;padding:0 0 0 20px;list-style:none;">';
    html += '        <li style="font-size:14px;color:#4b5563;line-height:1.8;margin-bottom:12px;position:relative;padding-left:24px;">✓ <strong>帯域の継続的な増強</strong><br><span style="font-size:13px;color:#6b7280;">混雑時の品質改善のため、利用状況を常時監視し、必要に応じて帯域を追加しています。</span></li>';
    html += '        <li style="font-size:14px;color:#4b5563;line-height:1.8;margin-bottom:12px;position:relative;padding-left:24px;">✓ <strong>お客様の声を反映</strong><br><span style="font-size:13px;color:#6b7280;">サポートに寄せられたご意見は、次の改善に必ず活かしています。</span></li>';
    html += '        <li style="font-size:14px;color:#4b5563;line-height:1.8;position:relative;padding-left:24px;">✓ <strong>誠実な情報開示</strong><br><span style="font-size:13px;color:#6b7280;">できることとできないことを、正直にお伝えすることを大切にしています。</span></li>';
    html += '      </ul>';
    html += '    </div>';
    
    // 選択の自由
    html += '    <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:20px;margin-bottom:32px;text-align:center;">';
    html += '      <p style="font-size:14px;color:#0c4a6e;line-height:1.8;margin:0;font-weight:600;">どの会社を選んでも、間違いではありません。<br>選択は、常にお客様の自由です。</p>';
    html += '    </div>';
    
    // 代表者からの手紙
    html += '    <div style="background:#fff;border:2px solid #e5e7eb;border-radius:12px;padding:32px 24px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">';
    html += '      <div style="text-align:center;margin-bottom:20px;">';
    html += '        <div style="font-size:12px;color:#9ca3af;margin-bottom:8px;">代表より</div>';
    html += '        <h3 style="font-size:1.1rem;font-weight:700;color:#111827;margin:0;">お客様へ</h3>';
    html += '      </div>';
    html += '      <div style="font-size:14px;color:#374151;line-height:2;text-align:left;">';
    html += '        <p style="margin:0 0 16px;">通信業界は、どの会社を選んでも大きな違いが出にくい世界です。価格も、回線も、仕組みも、ある程度は共通しています。</p>';
    html += '        <p style="margin:0 0 16px;">それでも私たちは、「使い続けて後悔しない通信」を目指しています。派手な広告よりも、帯域の増強や品質改善に予算を使うこと。お客様の声を、次の改善に必ず反映させること。</p>';
    html += '        <p style="margin:0 0 16px;">正直に言えば、私たちはまだ完璧ではありません。混雑時の速度低下を完全になくすことも、すべてのご要望にお応えすることも、できていません。</p>';
    html += '        <p style="margin:0 0 16px;">ですが、より良くする努力だけはやめません。お客様が安心して使い続けられるサービスであるために、改善を続けていきます。</p>';
    html += '        <p style="margin:0;">どの会社を選ぶかは、お客様の自由です。その中で、もし私たちを選んでいただけるなら、その選択に誠実であり続けたいと思っています。</p>';
    html += '      </div>';
    html += '      <div style="text-align:right;margin-top:24px;font-size:13px;color:#6b7280;">スターサービス株式会社<br>代表取締役</div>';
    html += '    </div>';
    
    html += '  </div>';
    html += '</div>';
    
    return html;
  }

  // DL現状維持推奨（通話YES）- シンプルデザイン
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
    html += '  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;text-align:center;">';
    html += '    <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">📶 データ容量</div>';
    html += '    <div style="font-size:20px;font-weight:900;color:#1e40af;">60GB（1日2GB）</div>';
    html += '  </div>';
    html += '  <div style="background:#fff;border-radius:12px;padding:20px;text-align:center;">';
    html += '    <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">📞 通話</div>';
    html += '    <div style="font-size:20px;font-weight:900;color:#1e40af;">24時間かけ放題</div>';
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
    html += '  <div style="font-size:16px;font-weight:900;color:#065f46;margin-bottom:8px;">DLコースは進化し続けます</div>';
    html += '  <p style="font-size:14px;color:#047857;line-height:1.9;margin:0;">eSIM対応、独自帯域、5G対応予定。<br>このまま安心してご利用ください。</p>';
    html += '</div>';

    // メッセージ
    html += '<div style="text-align:center;">';
    html += '  <p style="font-size:16px;color:#6b7280;margin:0;font-weight:600;">このまま安心してご利用ください。</p>';
    html += '</div>';

    html += '</div>';
    
    // 他社比較と代表メッセージを追加
    html += renderCompetitorComparisonAndMessage();
    
    return html;
  }

  // DX推奨（ギガYES + 通話NO）- 横並び比較表
  function renderComparison(recommended, current, recommendedId) {
    let html = '<div style="max-width:1000px;margin:0 auto;">';
    
    // 警告メッセージ
    html += '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:20px;border-radius:12px;margin-bottom:32px;text-align:center;">';
    html += '  <div style="font-size:18px;font-weight:900;color:#92400e;margin-bottom:12px;">⚠️ 速度制限の経験があるなら、ギガ不足のサインです</div>';
    html += '  <p style="font-size:15px;color:#78350f;line-height:1.9;margin:0;">24時間かけ放題が不要なら、<strong>DXコースでギガに特化</strong>するのが最適です。</p>';
    html += '</div>';

    // 横並び比較表（スマホ対応）
    html += '<div style="margin-bottom:32px;overflow-x:auto;">';
    html += '  <div style="font-size:20px;font-weight:900;color:#111827;margin-bottom:24px;text-align:center;">📊 プラン比較</div>';
    html += '  <div style="background:#fff;border:3px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);min-width:320px;">';
    html += '    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">';
    html += '      <thead>';
    html += '        <tr style="background:#f9fafb;">';
    html += '          <th style="padding:16px;text-align:left;font-size:14px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;"></th>';
    html += '          <th style="padding:16px;text-align:center;font-size:14px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;">現在のプラン</th>';
    html += '          <th style="padding:16px;text-align:center;font-size:14px;font-weight:700;color:#2563eb;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);">あなたへの最適解 🏆</th>';
    html += '        </tr>';
    html += '      </thead>';
    html += '      <tbody>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">コース名</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">DLコース</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:900;color:#1e40af;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fafbff;">DXコース</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">💰 月額料金</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:18px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">5,720円</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:18px;font-weight:900;color:#1e40af;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fafbff;">5,720円 <span style="font-size:13px;color:#10b981;">（同額！）</span></td>';
    html += '        </tr>';
    html += '        <tr style="background:#fef3c7;">';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">📶 データ容量</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:18px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">60GB</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:20px;font-weight:900;color:#dc2626;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fffbeb;">120GB <span style="font-size:14px;color:#dc2626;">（2倍増量！）</span></td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;">📞 通話</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-left:1px solid #e5e7eb;">24Hカケホ</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#1e40af;border-left:1px solid #e5e7eb;background:#fafbff;">カケホなし</td>';
    html += '        </tr>';
    html += '      </tbody>';
    html += '    </table>';
    html += '  </div>';
    html += '</div>';

    // 次世代への移行メッセージ
    html += '<div style="background:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%);border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.15);">';
    html += '  <div style="font-size:16px;font-weight:900;color:#065f46;margin-bottom:8px;">✨ だから、今アップデートすべき</div>';
    html += '  <p style="font-size:14px;color:#047857;line-height:1.9;margin:0;">同じ料金で、ギガが2倍（120GB）に。速度制限の心配から解放されます。<br>eSIM（即日開通）・5G（Coming Soon）で、さらに進化します。</p>';
    html += '</div>';

    // CTAボタン
    html += '<div style="text-align:center;">';
    html += '  <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:64px;padding:20px 48px;font-size:18px;font-weight:900;color:#fff;background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);border-radius:16px;text-decoration:none;box-shadow:0 8px 24px rgba(37,99,235,0.4);transition:all 0.3s;">コース変更を申請する</a>';
    html += '  <p style="font-size:13px;color:#6b7280;margin:12px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '</div>';

    html += '</div>';
    
    // 他社比較と代表メッセージを追加
    html += renderCompetitorComparisonAndMessage();
    
    return html;
  }

  // DM/DS節約プラン提案（ギガNO + 通話NO）- 横並び比較表
  function renderMultipleSavings(current) {
    let html = '<div style="max-width:1000px;margin:0 auto;">';
    
    // 警告メッセージ
    html += '<div style="background:#d1fae5;border-left:4px solid #10b981;padding:20px;border-radius:12px;margin-bottom:32px;text-align:center;">';
    html += '  <div style="font-size:18px;font-weight:900;color:#065f46;margin-bottom:12px;">✅ 速度制限の経験がなく、24時間かけ放題も不要なら</div>';
    html += '  <p style="font-size:15px;color:#047857;line-height:1.9;margin:0;"><strong>料金を下げて賢く節約</strong>するのが最適です。</p>';
    html += '</div>';

    // DMコース横並び比較表（スマホ対応）
    const dm = courses.dm;
    const dmSaving = current.price - dm.price;
    html += '<div style="margin-bottom:32px;overflow-x:auto;">';
    html += '  <div style="font-size:20px;font-weight:900;color:#111827;margin-bottom:24px;text-align:center;">📊 プラン比較：DMコース</div>';
    html += '  <div style="background:#fff;border:3px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);margin-bottom:20px;min-width:320px;">';
    html += '    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">';
    html += '      <thead>';
    html += '        <tr style="background:#f9fafb;">';
    html += '          <th style="padding:16px;text-align:left;font-size:14px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;"></th>';
    html += '          <th style="padding:16px;text-align:center;font-size:14px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;">現在のプラン</th>';
    html += '          <th style="padding:16px;text-align:center;font-size:14px;font-weight:700;color:#2563eb;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);">おすすめ 🏆</th>';
    html += '        </tr>';
    html += '      </thead>';
    html += '      <tbody>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">コース名</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">DLコース</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:900;color:#1e40af;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fafbff;">DMコース</td>';
    html += '        </tr>';
    html += '        <tr style="background:#fef3c7;">';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">💰 月額料金</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:18px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">5,720円</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:20px;font-weight:900;color:#dc2626;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fffbeb;">3,520円 <span style="font-size:14px;color:#dc2626;">(▼2,200円)</span></td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">📶 データ容量</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">60GB</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#1e40af;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fafbff;">30GB</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;">📞 通話</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-left:1px solid #e5e7eb;">24Hカケホ</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#1e40af;border-left:1px solid #e5e7eb;background:#fafbff;">5分カケホ</td>';
    html += '        </tr>';
    html += '        <tr style="background:#d1fae5;">';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;">年間節約額</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-left:1px solid #e5e7eb;">-</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:20px;font-weight:900;color:#dc2626;border-left:1px solid #e5e7eb;background:#ecfdf5;">▼ ' + (dmSaving * 12).toLocaleString() + '円/年</td>';
    html += '        </tr>';
    html += '      </tbody>';
    html += '    </table>';
    html += '  </div>';
    html += '</div>';

    // DSコース横並び比較表（スマホ対応）
    const ds = courses.ds;
    const dsSaving = current.price - ds.price;
    html += '<div style="margin-bottom:32px;overflow-x:auto;">';
    html += '  <div style="font-size:20px;font-weight:900;color:#111827;margin-bottom:24px;text-align:center;">📊 プラン比較：DSコース</div>';
    html += '  <div style="background:#fff;border:3px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);margin-bottom:20px;min-width:320px;">';
    html += '    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">';
    html += '      <thead>';
    html += '        <tr style="background:#f9fafb;">';
    html += '          <th style="padding:16px;text-align:left;font-size:14px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;"></th>';
    html += '          <th style="padding:16px;text-align:center;font-size:14px;font-weight:700;color:#6b7280;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;">現在のプラン</th>';
    html += '          <th style="padding:16px;text-align:center;font-size:14px;font-weight:700;color:#10b981;border-bottom:2px solid #e5e7eb;border-left:1px solid #e5e7eb;background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);">最安プラン</th>';
    html += '        </tr>';
    html += '      </thead>';
    html += '      <tbody>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">コース名</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">DLコース</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:900;color:#065f46;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fafffe;">DSコース</td>';
    html += '        </tr>';
    html += '        <tr style="background:#fef3c7;">';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">💰 月額料金</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:18px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">5,720円</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:20px;font-weight:900;color:#dc2626;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fffbeb;">1,078円 <span style="font-size:14px;color:#dc2626;">(▼4,642円)</span></td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;">📶 データ容量</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">60GB</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#065f46;border-bottom:1px solid #e5e7eb;border-left:1px solid #e5e7eb;background:#fafffe;">3GB</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;">📞 通話</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-left:1px solid #e5e7eb;">24Hカケホ</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#065f46;border-left:1px solid #e5e7eb;background:#fafffe;">30秒22円</td>';
    html += '        </tr>';
    html += '        <tr style="background:#d1fae5;">';
    html += '          <td style="padding:16px;font-size:14px;font-weight:600;color:#374151;">年間節約額</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:16px;font-weight:700;color:#4b5563;border-left:1px solid #e5e7eb;">-</td>';
    html += '          <td style="padding:16px;text-align:center;font-size:20px;font-weight:900;color:#dc2626;border-left:1px solid #e5e7eb;background:#ecfdf5;">▼ ' + (dsSaving * 12).toLocaleString() + '円/年</td>';
    html += '        </tr>';
    html += '      </tbody>';
    html += '    </table>';
    html += '  </div>';
    html += '</div>';

    // 次世代への移行メッセージ
    html += '<div style="background:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%);border-radius:16px;padding:24px;margin-bottom:32px;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.15);">';
    html += '  <div style="font-size:16px;font-weight:900;color:#065f46;margin-bottom:8px;">✨ だから、今アップデートすべき</div>';
    html += '  <p style="font-size:14px;color:#047857;line-height:1.9;margin:0;">使わないギガに払うのはもったいない。あなたに合ったプランで賢く節約しましょう。<br>eSIM（即日開通）・5G（Coming Soon）で、さらに進化します。</p>';
    html += '</div>';

    // CTAボタン
    html += '<div style="text-align:center;">';
    html += '  <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:64px;padding:20px 48px;font-size:18px;font-weight:900;color:#fff;background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);border-radius:16px;text-decoration:none;box-shadow:0 8px 24px rgba(37,99,235,0.4);transition:all 0.3s;">コース変更を申請する</a>';
    html += '  <p style="font-size:13px;color:#6b7280;margin:12px 0 0;">※eSIMへの切り替えもマイページから同時にお手続きいただけます</p>';
    html += '</div>';

    html += '</div>';
    
    // 他社比較と代表メッセージを追加
    html += renderCompetitorComparisonAndMessage();
    
    return html;
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagnosis);
  } else {
    initDiagnosis();
  }
})();
