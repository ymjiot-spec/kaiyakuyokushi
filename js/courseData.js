/**
 * スターサービス コースデータモデル
 * 
 * MVNO事業者として、各キャリア回線（ドコモ/ソフトバンク/au）の
 * 特性を活かしたコース設計データを管理する。
 * 
 * 要件: 3.1-3.8, 4.1-4.8
 */

const courseData = {
  // ============================================
  // ドコモ回線コース（約15,000回線）
  // MVNOとしてドコモの広いエリアカバーを活用
  // ============================================
  
  ds: {
    id: 'ds',
    name: 'DSコース',
    carrier: 'docomo',
    carrierName: 'ドコモ回線',
    carrierColor: '#c00', // ドコモレッド
    priority: '高',
    
    // 料金体系
    price: {
      taxIncluded: 1078,
      taxExcluded: 980
    },
    
    // データ通信
    data: {
      monthly: 3,
      daily: null,
      unit: 'GB',
      description: '月間3GB',
      // 速度制限時の挙動
      throttled: {
        speed: '128kbps',
        description: '月間データ量超過後は128kbpsに制限'
      }
    },
    
    // 通話サービス
    call: {
      rate: '30秒22円（税込）',
      included: null,
      description: '従量課金制'
    },
    
    // オプションサービス（MVNO標準のかけ放題オプション）
    options: [
      { name: 'かけ放題24時間', price: 1870, description: '国内通話24時間かけ放題' },
      { name: 'かけ放題10分', price: 935, description: '10分以内の国内通話が無料' },
      { name: 'かけ放題5分', price: 715, description: '5分以内の国内通話が無料' }
    ],
    
    // SIM種別
    sim: ['物理SIM', 'eSIM'],
    simType: ['音声', 'データ'],
    
    // 契約条件
    contractPeriod: 36, // 36ヶ月
    changeFee: 1100, // コース変更手数料（税込）
    
    // 開始解除期間
    cancellationPeriod: {
      start: '2025年10月',
      duration: '9ヶ月'
    },
    
    // コースのメリット（解約抑止訴求ポイント）
    merits: [
      'ドコモ回線を利用した広いエリアカバー',
      '月額1,078円からの低価格プラン',
      'DX・DL・DM・DSコース間で柔軟にコース変更可能',
      'eSIM対応で即日開通可能',
      'データをあまり使わないライトユーザー向け'
    ],
    
    // デメリット（正直に伝えることで信頼獲得）
    demerits: [
      'コース変更時に手数料1,100円が発生',
      'データ追加購入不可'
    ],
    
    // 推奨コース（同一回線内での変更を促進）
    recommendedCourses: ['dm', 'dl', 'dx'],
    
    // キャリア回線のメリット（MNO品質訴求）
    carrierMerits: [
      'NTTドコモの高品質ネットワークを利用',
      '広いエリアで安定した通信',
      '5G対応エリア順次拡大中',
      '地下鉄・建物内でも安定した通信'
    ]
  },

  dm: {
    id: 'dm',
    name: 'DMコース',
    carrier: 'docomo',
    carrierName: 'ドコモ回線',
    carrierColor: '#c00',
    priority: '高',
    
    price: {
      taxIncluded: 3520,
      taxExcluded: 3200
    },
    
    data: {
      monthly: 30,
      daily: 1,
      unit: 'GB',
      description: '月間30GB（1日1GB）',
      throttled: {
        speed: '128kbps',
        description: '1日のデータ量超過後は翌日まで128kbpsに制限'
      }
    },
    
    call: {
      rate: '5分超過分30秒22円（税込）',
      included: '5分通話かけ放題',
      description: '5分以内の国内通話が無料、超過分は従量課金'
    },
    
    options: [
      { name: '留守番電話', price: 330, description: '留守番電話サービス' },
      { name: '割り込み通話', price: 330, description: '通話中の着信に応答可能' },
      { name: '国際電話', price: null, description: '国際電話サービス（従量課金）' }
    ],
    
    sim: ['物理SIM', 'eSIM'],
    simType: ['音声', 'データ'],
    contractPeriod: 36,
    changeFee: 1100,
    
    cancellationPeriod: {
      start: '2025年10月',
      duration: '9ヶ月'
    },
    
    merits: [
      'ドコモ回線を利用した広いエリアカバー',
      '5分通話かけ放題が標準付帯',
      '月間30GBの大容量',
      'DX・DL・DS・DMコース間で柔軟にコース変更可能',
      'eSIM対応で即日開通可能'
    ],
    
    demerits: [
      '1日1GBを超えると翌日まで速度制限',
      'コース変更時に手数料1,100円が発生',
      'データ追加購入不可'
    ],
    
    recommendedCourses: ['ds', 'dl', 'dx'],
    
    carrierMerits: [
      'NTTドコモの高品質ネットワークを利用',
      '広いエリアで安定した通信',
      '5G対応エリア順次拡大中',
      '地下鉄・建物内でも安定した通信'
    ]
  },

  dl: {
    id: 'dl',
    name: 'DLコース',
    carrier: 'docomo',
    carrierName: 'ドコモ回線',
    carrierColor: '#c00',
    priority: '高',
    
    price: {
      taxIncluded: 5720,
      taxExcluded: 5200
    },
    
    data: {
      monthly: 60,
      daily: 2,
      unit: 'GB',
      description: '月間60GB（1日2GB）',
      throttled: {
        speed: '128kbps',
        description: '1日のデータ量超過後は翌日まで128kbpsに制限'
      }
    },
    
    call: {
      rate: null,
      included: '24時間通話かけ放題',
      description: '国内通話24時間かけ放題'
    },
    
    options: [
      { name: '留守番電話', price: 330, description: '留守番電話サービス' },
      { name: '割り込み通話', price: 330, description: '通話中の着信に応答可能' },
      { name: '国際電話', price: null, description: '国際電話サービス（従量課金）' }
    ],
    
    sim: ['物理SIM', 'eSIM'],
    simType: ['音声', 'データ'],
    contractPeriod: 36,
    changeFee: 1100,
    
    cancellationPeriod: {
      start: '2025年10月',
      duration: '9ヶ月'
    },
    
    merits: [
      'ドコモ回線を利用した広いエリアカバー',
      '24時間通話かけ放題が標準付帯',
      '月間60GBの大容量',
      '通話をよくする方に最適',
      'DX・DM・DS・DLコース間で柔軟にコース変更可能'
    ],
    
    demerits: [
      'GB追加購入ができない',
      '1日2GBを超えると翌日まで速度制限',
      'コース変更時に手数料1,100円が発生'
    ],
    
    recommendedCourses: ['ds', 'dm', 'dx'],
    
    carrierMerits: [
      'NTTドコモの高品質ネットワークを利用',
      '広いエリアで安定した通信',
      '5G対応エリア順次拡大中',
      '地下鉄・建物内でも安定した通信'
    ]
  },

  dx: {
    id: 'dx',
    name: 'DXコース',
    carrier: 'docomo',
    carrierName: 'ドコモ回線',
    carrierColor: '#c00',
    priority: '高',
    
    price: {
      taxIncluded: 5720,
      taxExcluded: 5200
    },
    
    data: {
      monthly: 120,
      daily: 4,
      unit: 'GB',
      description: '月間120GB相当（1日4GB）',
      throttled: {
        speed: '128kbps',
        description: '1日のデータ量超過後は翌日まで128kbpsに制限'
      }
    },
    
    call: {
      rate: '30秒22円（税込）',
      included: null,
      description: '従量課金制'
    },
    
    options: [
      { name: 'かけ放題24時間', price: 1870, description: '国内通話24時間かけ放題' },
      { name: 'かけ放題10分', price: 935, description: '10分以内の国内通話が無料' },
      { name: 'かけ放題5分', price: 715, description: '5分以内の国内通話が無料' }
    ],
    
    sim: ['物理SIM', 'eSIM'],
    simType: ['音声', 'データ'],
    contractPeriod: 36,
    changeFee: 1100,
    
    cancellationPeriod: {
      start: '2024年8月17日',
      duration: '自動更新'
    },
    
    merits: [
      'ドコモ回線を利用した広いエリアカバー',
      '月間120GB相当の超大容量',
      'データをたくさん使うヘビーユーザー向け',
      'DL・DM・DS・DXコース間で柔軟にコース変更可能',
      'eSIM対応で即日開通可能'
    ],
    
    demerits: [
      'GB追加購入ができない',
      '1日4GBを超えると翌日まで速度制限',
      'コース変更時に手数料1,100円が発生'
    ],
    
    recommendedCourses: ['ds', 'dm', 'dl'],
    
    carrierMerits: [
      'NTTドコモの高品質ネットワークを利用',
      '広いエリアで安定した通信',
      '5G対応エリア順次拡大中',
      '地下鉄・建物内でも安定した通信'
    ]
  },


  // ============================================
  // ソフトバンク回線コース（約8,000回線）
  // プラチナバンド（900MHz帯）対応で建物内・地下でも強い
  // ============================================
  
  'w-50gb': {
    id: 'w-50gb',
    name: 'Wコース（月間50GB）',
    carrier: 'softbank',
    carrierName: 'ソフトバンク回線',
    carrierColor: '#868686', // ソフトバンクシルバー
    priority: '高',
    
    price: {
      taxIncluded: 5346,
      taxExcluded: 4860
    },
    
    data: {
      monthly: 50,
      daily: null,
      unit: 'GB',
      description: '月間50GB',
      throttled: {
        speed: '128kbps',
        description: '月間データ量超過後は128kbpsに制限'
      }
    },
    
    call: {
      rate: null,
      included: null,
      description: 'データ専用SIM（通話不可）'
    },
    
    options: [],
    
    sim: ['物理SIM（FS030W専用）'],
    simType: ['データ専用'],
    device: 'FS030W',
    contractPeriod: 36,
    changeFee: null,
    
    merits: [
      'ソフトバンクのプラチナバンド（900MHz帯）対応',
      '建物内・地下でも繋がりやすい',
      'ソフトバンク品質の高速通信',
      'FS030Wモバイルルーター専用で安定動作',
      '月間50GBの大容量'
    ],
    
    demerits: [
      'FS030W専用SIMのため他端末で使用不可',
      'テザリングにOS制限あり',
      '音声通話非対応'
    ],
    
    recommendedCourses: [],
    
    carrierMerits: [
      'ソフトバンクのプラチナバンド（900MHz帯）対応',
      '建物の奥や地下でも電波が届きやすい',
      '都市部での高速通信に強い',
      'ソフトバンクショップでのサポート対応'
    ]
  },

  'w-3gb': {
    id: 'w-3gb',
    name: 'Wコース（1日3GB）',
    carrier: 'softbank',
    carrierName: 'ソフトバンク回線',
    carrierColor: '#868686',
    priority: '高',
    
    price: {
      taxIncluded: 5346,
      taxExcluded: 4860
    },
    
    data: {
      monthly: null,
      daily: 3,
      unit: 'GB',
      description: '1日3GB',
      throttled: {
        speed: '1Mbps',
        description: '1日のデータ量超過後は翌日まで1Mbpsに制限'
      }
    },
    
    call: {
      rate: null,
      included: null,
      description: 'データ専用SIM（通話不可）'
    },
    
    options: [],
    
    sim: ['物理SIM（FS030W専用）'],
    simType: ['データ専用'],
    device: 'FS030W',
    contractPeriod: 36,
    changeFee: null,
    
    merits: [
      'ソフトバンクのプラチナバンド（900MHz帯）対応',
      '建物内・地下でも繋がりやすい',
      'ソフトバンク品質の高速通信',
      '制限時も1Mbpsで使用可能'
    ],
    
    demerits: [
      'FS030W専用SIMのため他端末で使用不可',
      '1日3GB超過で速度制限（1Mbps）',
      'テザリングにOS制限あり',
      '音声通話非対応'
    ],
    
    recommendedCourses: [],
    
    carrierMerits: [
      'ソフトバンクのプラチナバンド（900MHz帯）対応',
      '建物の奥や地下でも電波が届きやすい',
      '都市部での高速通信に強い',
      'ソフトバンクショップでのサポート対応'
    ]
  },

  s: {
    id: 's',
    name: 'Sコース',
    carrier: 'softbank',
    carrierName: 'ソフトバンク回線',
    carrierColor: '#868686',
    priority: '中',
    
    price: {
      taxIncluded: 5346,
      taxExcluded: 4860
    },
    
    data: {
      monthly: 20,
      daily: null,
      unit: 'GB',
      description: '月間20GB',
      throttled: {
        speed: '128kbps',
        description: '月間データ量超過後は128kbpsに制限'
      },
      // Sコースの特徴：GB追加可能
      addable: true,
      addPrice: 1000,
      addUnit: '1GB'
    },
    
    call: {
      rate: null,
      included: '24時間かけ放題 + 留守番電話サービス',
      description: '国内通話24時間かけ放題、留守番電話サービス付き'
    },
    
    options: [
      { name: '追加GB', price: 1000, unit: '1GB', description: 'データ容量を1GB単位で追加購入可能' },
      { name: '留守番電話', price: 330, description: '留守番電話サービス（標準付帯）' },
      { name: '割り込み通話', price: 330, description: '通話中の着信に応答可能' },
      { name: '国際電話', price: null, description: '国際電話サービス（従量課金）' }
    ],
    
    sim: ['物理SIM'],
    simType: ['音声', 'データ'],
    contractPeriod: 36,
    changeFee: null,
    
    merits: [
      'ソフトバンク回線で大手キャリアと同等品質',
      '24時間かけ放題が標準付帯',
      '留守番電話サービスが標準付帯',
      'GB追加購入ができる唯一のプラン',
      'データが足りなくなっても安心'
    ],
    
    demerits: [
      '割り込み通話は利用不可',
      'eSIM非対応'
    ],
    
    recommendedCourses: [],
    
    carrierMerits: [
      'ソフトバンクのプラチナバンド（900MHz帯）対応',
      '大手キャリアと同等の通信品質',
      '建物の奥や地下でも電波が届きやすい',
      '都市部での高速通信に強い'
    ]
  },

  // ============================================
  // au回線コース（約80回線）
  // KDDIの広いエリアカバーと安定した通信品質
  // ============================================
  
  u: {
    id: 'u',
    name: 'Uコース',
    carrier: 'au',
    carrierName: 'au回線',
    carrierColor: '#ff5722', // auオレンジ
    priority: '低',
    
    price: {
      taxIncluded: 5346,
      taxExcluded: 4860
    },
    
    data: {
      monthly: 30,
      daily: null,
      unit: 'GB',
      description: '月間30GB',
      throttled: {
        speed: '128kbps',
        description: '月間データ量超過後は128kbpsに制限'
      }
    },
    
    call: {
      rate: '30秒10円（非課税）',
      included: null,
      description: '従量課金制（業界最安水準の通話料）'
    },
    
    options: [
      { name: '留守番電話', price: 330, description: '留守番電話サービス' },
      { name: '割り込み通話', price: 330, description: '通話中の着信に応答可能' },
      { name: '国際電話', price: null, description: '国際電話サービス（従量課金）' }
    ],
    
    sim: ['物理SIM'],
    simType: ['音声', 'データ'],
    contractPeriod: 36,
    changeFee: null,
    
    merits: [
      'au回線で広いエリアカバー',
      '通話料が30秒10円と業界最安水準',
      '月間30GBの大容量',
      'KDDIの安定した通信品質'
    ],
    
    demerits: [
      'eSIM非対応',
      'コース変更先が限られる'
    ],
    
    recommendedCourses: [],
    
    carrierMerits: [
      'KDDIのau回線を利用',
      '広いエリアで安定した通信',
      '山間部や郊外でも繋がりやすい',
      '安定した通信品質'
    ]
  }
};

/**
 * 解約理由と提案のマッピング
 * 
 * MVNOの解約抑止において重要なのは、
 * ユーザーの不満を正確に把握し、適切な代替案を提示すること
 */
const reasonProposals = {
  price: {
    id: 'price',
    title: '料金でお悩みのあなたへ',
    icon: '💰',
    description: 'より安価なコースへの変更で、月々の料金を抑えられます。',
    // 料金が安いコースを推奨
    getRecommendations: (currentCourseId) => {
      const current = courseData[currentCourseId];
      if (!current) return [];
      
      return current.recommendedCourses
        .map(id => courseData[id])
        .filter(course => course && course.price.taxIncluded < current.price.taxIncluded)
        .sort((a, b) => a.price.taxIncluded - b.price.taxIncluded);
    }
  },
  
  'data-shortage': {
    id: 'data-shortage',
    title: 'データ量が足りないあなたへ',
    icon: '📶',
    description: 'より大容量のコースへの変更で、データ不足を解消できます。',
    // データ量が多いコースを推奨
    getRecommendations: (currentCourseId) => {
      const current = courseData[currentCourseId];
      if (!current) return [];
      
      const currentData = current.data.monthly || (current.data.daily * 30);
      
      return current.recommendedCourses
        .map(id => courseData[id])
        .filter(course => {
          if (!course) return false;
          const courseData = course.data.monthly || (course.data.daily * 30);
          return courseData > currentData;
        })
        .sort((a, b) => {
          const aData = a.data.monthly || (a.data.daily * 30);
          const bData = b.data.monthly || (b.data.daily * 30);
          return bData - aData;
        });
    }
  },
  
  'data-excess': {
    id: 'data-excess',
    title: 'データ量が余っているあなたへ',
    icon: '📉',
    description: 'より小容量のコースへの変更で、無駄なく使えます。',
    // データ量が少なく安いコースを推奨
    getRecommendations: (currentCourseId) => {
      const current = courseData[currentCourseId];
      if (!current) return [];
      
      const currentData = current.data.monthly || (current.data.daily * 30);
      
      return current.recommendedCourses
        .map(id => courseData[id])
        .filter(course => {
          if (!course) return false;
          const courseData = course.data.monthly || (course.data.daily * 30);
          return courseData < currentData;
        })
        .sort((a, b) => a.price.taxIncluded - b.price.taxIncluded);
    }
  },
  
  'call-option': {
    id: 'call-option',
    title: '通話オプションを変更したいあなたへ',
    icon: '📞',
    description: '通話オプション付きのコースへの変更がおすすめです。',
    // かけ放題付きコースを推奨
    getRecommendations: (currentCourseId) => {
      const current = courseData[currentCourseId];
      if (!current) return [];
      
      return current.recommendedCourses
        .map(id => courseData[id])
        .filter(course => course && course.call.included)
        .sort((a, b) => a.price.taxIncluded - b.price.taxIncluded);
    }
  },
  
  switch: {
    id: 'switch',
    title: '他社への乗り換えをご検討中のあなたへ',
    icon: '🔄',
    description: 'スターサービスならではのメリットをご確認ください。乗り換え前に、今一度ご検討いただけますと幸いです。',
    // 現在のコースのメリットを強調（推奨コースは返さない）
    getRecommendations: (currentCourseId) => {
      return [];
    }
  },
  
  other: {
    id: 'other',
    title: 'お困りごとがございましたら',
    icon: '❓',
    description: 'お気軽にお問い合わせください。お客様のご要望に合わせたご提案をさせていただきます。',
    getRecommendations: (currentCourseId) => {
      return [];
    }
  }
};

/**
 * キャリア別のメリット情報
 * 
 * MVNOとして各MNOの回線特性を正確に伝えることが重要
 */
const carrierInfo = {
  docomo: {
    name: 'NTTドコモ',
    color: '#c00',
    logo: 'images/carriers/docomo.svg',
    merits: [
      '広いエリアで安定した通信',
      '5G対応エリア順次拡大中',
      '地下鉄・建物内でも安定した通信',
      '災害時の復旧対応が迅速'
    ],
    description: 'NTTドコモの高品質ネットワークを利用したMVNOサービスです。'
  },
  
  softbank: {
    name: 'ソフトバンク',
    color: '#868686',
    logo: 'images/carriers/softbank.svg',
    merits: [
      'プラチナバンド（900MHz帯）対応',
      '建物の奥や地下でも電波が届きやすい',
      '都市部での高速通信に強い',
      'PayPayなどのサービス連携'
    ],
    description: 'ソフトバンクのプラチナバンド対応ネットワークを利用したMVNOサービスです。'
  },
  
  au: {
    name: 'KDDI（au）',
    color: '#ff5722',
    logo: 'images/carriers/au.svg',
    merits: [
      '広いエリアで安定した通信',
      '山間部や郊外でも繋がりやすい',
      '安定した通信品質',
      'UQモバイルと同等の回線品質'
    ],
    description: 'KDDIのau回線を利用したMVNOサービスです。'
  }
};

/**
 * コースIDからコースデータを取得
 * @param {string} courseId - コースID
 * @returns {Object|null} コースデータ
 */
function getCourseById(courseId) {
  return courseData[courseId] || null;
}

/**
 * キャリアでコースをフィルタリング
 * @param {string} carrier - キャリア名（docomo, softbank, au）
 * @returns {Array} コースの配列
 */
function getCoursesByCarrier(carrier) {
  return Object.values(courseData).filter(course => course.carrier === carrier);
}

/**
 * 推奨コースを取得
 * @param {string} courseId - 現在のコースID
 * @returns {Array} 推奨コースの配列
 */
function getRecommendedCourses(courseId) {
  const course = courseData[courseId];
  if (!course || !course.recommendedCourses) return [];
  
  return course.recommendedCourses.map(id => courseData[id]).filter(Boolean);
}

/**
 * 解約理由に基づく推奨コースを取得
 * @param {string} courseId - 現在のコースID
 * @param {string} reasonId - 解約理由ID
 * @returns {Array} 推奨コースの配列
 */
function getRecommendationsByReason(courseId, reasonId) {
  const proposal = reasonProposals[reasonId];
  if (!proposal) return [];
  
  return proposal.getRecommendations(courseId);
}

// エクスポート（ブラウザ環境とNode.js環境の両方に対応）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    courseData,
    reasonProposals,
    carrierInfo,
    getCourseById,
    getCoursesByCarrier,
    getRecommendedCourses,
    getRecommendationsByReason
  };
}
