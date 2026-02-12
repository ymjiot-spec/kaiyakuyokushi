/**
 * Dシリーズ マルチ診断ツール
 * 複数選択式のお悩み診断 → 最適なDコースを提案
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

  // 診断ロジック: 選択内容 → スコアリング → 最適コース
  function diagnose(selections, currentCourseId) {
    const current = courses[currentCourseId];
    if (!current) return null;

    const scores = {};
    Object.keys(courses).forEach(id => {
      if (id === currentCourseId) return;
      scores[id] = 0;
    });

    const has = (key) => selections.includes(key);

    // 料金を安くしたい
    if (has('cheap')) {
      Object.keys(scores).forEach(id => {
        if (courses[id].price < current.price) {
          scores[id] += 3;
          // 安ければ安いほどボーナス
          scores[id] += Math.floor((current.price - courses[id].price) / 1000);
        }
      });
    }

    // 動画をたっぷり見たい
    if (has('video')) {
      Object.keys(scores).forEach(id => {
        if (courses[id].dataGB > current.dataGB) {
          scores[id] += 3;
        }
        if (courses[id].dataGB >= 120) scores[id] += 2;
        else if (courses[id].dataGB >= 60) scores[id] += 1;
      });
    }

    // 通話を時間気にせず
    if (has('call')) {
      Object.keys(scores).forEach(id => {
        if (courses[id].callType === '24h') scores[id] += 4;
        else if (courses[id].callType === '5min') scores[id] += 2;
      });
    }

    // 他社検討だが手続き面倒
    if (has('hassle')) {
      // コース変更の手軽さを訴求 → 全コースにボーナス
      Object.keys(scores).forEach(id => {
        scores[id] += 2;
        if (courses[id].esim) scores[id] += 1;
      });
    }

    // スコアが最も高いコースを選出
    let bestId = null;
    let bestScore = -1;
    Object.keys(scores).forEach(id => {
      if (scores[id] > bestScore) {
        bestScore = scores[id];
        bestId = id;
      }
    });

    // スコアが0なら現コースのまま（変更不要）
    if (bestScore <= 0) return null;

    return { ...courses[bestId], score: bestScore };
  }

  // DOM操作
  function initDiagnosis() {
    const form = document.getElementById('diagnosis-form');
    const resultArea = document.getElementById('diagnosis-result');
    const submitBtn = document.getElementById('diagnosis-submit');
    if (!form || !resultArea || !submitBtn) return;

    const currentCourseId = form.dataset.currentCourse;

    submitBtn.addEventListener('click', function () {
      const checked = form.querySelectorAll('input[type="checkbox"]:checked');
      const selections = Array.from(checked).map(cb => cb.value);

      if (selections.length === 0) {
        resultArea.innerHTML = '<div style="text-align:center;padding:24px;color:#6b7280;font-size:14px;">1つ以上選択してください。</div>';
        resultArea.hidden = false;
        return;
      }

      const result = diagnose(selections, currentCourseId);

      if (!result) {
        resultArea.innerHTML = renderKeepCurrent(courses[currentCourseId]);
      } else {
        resultArea.innerHTML = renderRecommendation(result, courses[currentCourseId]);
      }
      resultArea.hidden = false;
      resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function renderRecommendation(rec, current) {
    const diff = current.price - rec.price;
    const diffText = diff > 0
      ? '<div style="font-size:12px;color:#1e40af;font-weight:700;margin-top:4px;">▼ 月額 ' + diff.toLocaleString() + '円おトク（年間 ' + (diff * 12).toLocaleString() + '円節約）</div>'
      : diff < 0
        ? '<div style="font-size:12px;color:#6b7280;margin-top:4px;">月額 +' + Math.abs(diff).toLocaleString() + '円</div>'
        : '<div style="font-size:12px;color:#6b7280;margin-top:4px;">同額</div>';

    return ''
      + '<div style="max-width:560px;margin:0 auto;">'
      + '  <div style="text-align:center;margin-bottom:20px;">'
      + '    <div style="font-size:2rem;margin-bottom:4px;">🏆</div>'
      + '    <div style="font-size:18px;font-weight:800;color:#1e3a6e;">あなたへの最適解</div>'
      + '  </div>'
      + '  <div style="background:#fff;border:2px solid #2563eb;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(37,99,235,0.12);">'
      + '    <div style="background:linear-gradient(135deg,#c00 0%,#a00 100%);padding:16px;text-align:center;color:#fff;">'
      + '      <div style="font-size:10px;opacity:0.85;">✦ 診断結果</div>'
      + '      <div style="font-size:22px;font-weight:800;">' + rec.name + '</div>'
      + '      <div style="font-size:12px;opacity:0.8;">ドコモ回線 / eSIM対応</div>'
      + '    </div>'
      + '    <div style="padding:20px;">'
      + '      <div style="text-align:center;margin-bottom:16px;">'
      + '        <div style="font-size:10px;color:#6b7280;">月額</div>'
      + '        <div style="font-size:2rem;font-weight:900;color:#111827;">' + rec.price.toLocaleString() + '<span style="font-size:14px;font-weight:600;color:#6b7280;">円（税込）</span></div>'
      + diffText
      + '      </div>'
      + '      <div style="background:#f9fafb;border-radius:12px;padding:14px;margin-bottom:16px;">'
      + '        <div style="font-size:13px;color:#374151;line-height:1.8;">'
      + '          📶 ' + rec.data + '<br>'
      + '          📞 ' + rec.call + '<br>'
      + '          ' + rec.desc
      + '        </div>'
      + '      </div>'
      + '      <div style="background:linear-gradient(135deg,#dbeafe 0%,#ede9fe 100%);border-radius:12px;padding:14px;text-align:center;">'
      + '        <div style="font-size:12px;color:#1e3a6e;font-weight:700;">📡 独自帯域で常に快適</div>'
      + '        <div style="font-size:11px;color:#4b5563;margin-top:4px;line-height:1.7;">自社でコントロールする専用帯域を確保。<br>お昼や夕方の混雑時でもストレスのない通信。</div>'
      + '      </div>'
      + '      <div style="text-align:center;margin-top:16px;">'
      + '        <p style="font-size:13px;color:#6b7280;margin:0 0 12px;">※コース変更にはサポートデスクへのご連絡が必要です。</p>'
      + '        <a href="https://support.starservice.jp/hc/ja/requests/new" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:14px 32px;font-size:16px;font-weight:700;color:#fff;background:linear-gradient(135deg,#c00 0%,#a00 100%);border-radius:12px;text-decoration:none;box-shadow:0 4px 14px rgba(204,0,0,0.3);">' + rec.name + 'に変更を相談する</a>'
      + '      </div>'
      + '    </div>'
      + '  </div>'
      + '</div>';
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
