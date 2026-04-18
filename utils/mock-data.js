// utils/mock-data.js - 安粮期货投研智演实验室 Mock数据
// 用于开发和测试阶段，模拟真实数据

// ========== 数据生成工具函数 ==========

/**
 * 生成随机ID
 */
function generateId(prefix = '') {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 生成随机日期（最近n天内）
 */
function randomDate(days = 30) {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime);
}

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute);
}

/**
 * 生成随机价格
 */
function randomPrice(min = 1000, max = 10000) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

/**
 * 生成随机涨跌幅
 */
function randomChange(min = -10, max = 10) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// ========== 1. 首页数据 ==========

// 1.1 Banner数据
const BANNERS = [
  {
    id: 'banner_1',
    title: '2024年期货市场投资策略报告',
    subtitle: '把握大宗商品周期，布局结构性机会',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    link: '/pages/report/detail?id=report_001',
    type: 'report'
  },
  {
    id: 'banner_2',
    title: '智演智能体2.0全新升级',
    subtitle: 'AI投顾助手，7×24小时在线服务',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    link: '/pages/ai-agent/ai-agent',
    type: 'ai'
  },
  {
    id: 'banner_3',
    title: '春季投资策略峰会',
    subtitle: '与顶级分析师面对面，解读市场动向',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
    link: '/pages/activity/detail?id=activity_001',
    type: 'activity'
  }
];

// 1.2 快捷入口（4个）
const QUICK_ENTRIES = [
  {
    id: 'quick_1',
    title: '最新研报',
    icon: '📊',
    color: '#C8102E',
    link: '/pages/report/report?tab=latest'
  },
  {
    id: 'quick_2',
    title: '特色活动',
    icon: '🎤',
    color: '#1890FF',
    link: '/pages/activity/activity?tab=featured'
  },
  {
    id: 'quick_3',
    title: '主题研究',
    icon: '🔍',
    color: '#52C41A',
    link: '/pages/report/report?tab=topic'
  },
  {
    id: 'quick_4',
    title: '专题合集',
    icon: '📚',
    color: '#FAAD14',
    link: '/pages/report/report?tab=collection'
  }
];

// 1.3 大家都在问（热门问答）
const HOT_QUESTIONS = [
  {
    id: 'qa_1',
    question: '如何看待当前黑色系期货的走势？',
    answer: '当前黑色系期货受宏观经济政策、基建投资和环保限产等多重因素影响。随着稳增长政策的持续推进，基建需求有望得到支撑，但也要注意房地产下行带来的需求压力。建议关注政策动向和库存变化，把握结构性机会。',
    isExpanded: false,
    likes: 245,
    author: '张明',
    time: '2小时前'
  },
  {
    id: 'qa_2',
    question: '美联储加息对大宗商品价格有何影响？',
    answer: '美联储加息通常会推高美元指数，对以美元计价的大宗商品价格形成压制。但具体影响需要结合商品的供需基本面进行分析。当前全球通胀压力依然存在，大宗商品整体仍有一定支撑，但品种分化会加剧。',
    isExpanded: false,
    likes: 189,
    author: '李华',
    time: '5小时前'
  },
  {
    id: 'qa_3',
    question: '农产品期货的投资逻辑是什么？',
    answer: '农产品期货的投资逻辑主要围绕供给、需求和库存三个核心要素。供给端关注天气、种植面积和政策因素；需求端关注人口增长、消费升级和国际贸易；库存则反映供需平衡状况。此外，季节性因素也是重要考量。',
    isExpanded: false,
    likes: 156,
    author: '王芳',
    time: '昨天'
  }
];

// 1.4 文章精选（按分类）
const ARTICLE_CATEGORIES = ['全部', '品种分析', '宏观策略', '产业研究', '量化分析', '专题报告'];

const ARTICLES = [
  {
    id: 'article_1',
    title: '螺纹钢供需格局分析与投资建议',
    summary: '本文从供给端、需求端和库存三个方面深入分析当前螺纹钢市场的基本面情况，并结合技术面给出具体的投资建议。',
    content: '螺纹钢作为黑色系的代表品种，其价格走势受到多重因素影响...（此处是完整的文章内容，实际使用中会更长）',
    author: '王刚',
    authorTitle: '黑色金属分析师',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    publishTime: '2024-12-15 14:30',
    readCount: 3245,
    likeCount: 189,
    commentCount: 67,
    category: '品种分析',
    tags: ['螺纹钢', '黑色金属', '供需分析'],
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
  },
  {
    id: 'article_2',
    title: '2024年宏观经济形势展望',
    summary: '基于对国内外经济数据的分析，本文展望2024年宏观经济形势，探讨政策走向和市场机会。',
    content: '2023年全球经济经历了复杂的调整过程...',
    author: '李明',
    authorTitle: '首席经济学家',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    publishTime: '2024-12-14 10:15',
    readCount: 4567,
    likeCount: 245,
    commentCount: 89,
    category: '宏观策略',
    tags: ['宏观经济', '政策分析', '投资策略'],
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop'
  },
  {
    id: 'article_3',
    title: '新能源产业链期货机会挖掘',
    summary: '随着新能源产业的快速发展，相关期货品种的投资价值日益凸显。本文从产业链角度分析投资机会。',
    content: '新能源产业链包括上游的原材料...',
    author: '张伟',
    authorTitle: '新能源分析师',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    publishTime: '2024-12-13 16:45',
    readCount: 2890,
    likeCount: 167,
    commentCount: 45,
    category: '产业研究',
    tags: ['新能源', '产业链', '期货投资'],
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
  }
];

// 1.5 安粮推荐研报
const RECOMMENDED_REPORTS = [
  {
    id: 'report_1',
    title: '铜市场深度研究报告',
    subtitle: '新能源需求驱动下的铜价展望',
    author: '安粮期货有色金属团队',
    publishDate: '2024-12-10',
    pageCount: 42,
    rating: 4.8,
    downloadCount: 1234,
    abstract: '本报告从供需基本面、宏观经济、产业政策等多个维度分析铜市场现状，并对未来价格走势进行预测。',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
    tags: ['铜', '有色金属', '新能源'],
    pdfUrl: 'https://example.com/reports/copper.pdf',
    isFree: true
  },
  {
    id: 'report_2',
    title: '原油期货交易策略',
    subtitle: '地缘政治风险与供需博弈',
    author: '安粮期货能源化工团队',
    publishDate: '2024-12-08',
    pageCount: 38,
    rating: 4.7,
    downloadCount: 987,
    abstract: '本报告分析当前原油市场的供需格局、地缘政治风险以及主要产油国的政策动向，提供相应的交易策略。',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
    tags: ['原油', '能源', '地缘政治'],
    pdfUrl: 'https://example.com/reports/crude-oil.pdf',
    isFree: false
  },
  {
    id: 'report_3',
    title: '农产品季节性分析报告',
    subtitle: '基于历史数据的周期规律挖掘',
    author: '安粮期货农产品团队',
    publishDate: '2024-12-05',
    pageCount: 56,
    rating: 4.9,
    downloadCount: 1567,
    abstract: '本报告通过对历史数据的统计分析，挖掘主要农产品品种的季节性规律，为投资者提供参考。',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
    tags: ['农产品', '季节性', '数据分析'],
    pdfUrl: 'https://example.com/reports/agriculture.pdf',
    isFree: true
  }
];

// 1.6 活动日历
const CALENDAR_DATES = [
  { date: '12/15', day: '周日', hasEvent: true },
  { date: '12/16', day: '周一', hasEvent: true },
  { date: '12/17', day: '周二', hasEvent: false },
  { date: '12/18', day: '周三', hasEvent: true },
  { date: '12/19', day: '周四', hasEvent: true },
  { date: '12/20', day: '周五', hasEvent: true },
  { date: '12/21', day: '周六', hasEvent: false }
];

const CALENDAR_EVENTS = [
  {
    id: 'event_1',
    date: '12/15',
    title: '黑色金属投资沙龙',
    time: '14:00-16:00',
    location: '北京·安粮期货大厦',
    type: '线下',
    status: '进行中'
  },
  {
    id: 'event_2',
    date: '12/16',
    title: '宏观经济线上研讨会',
    time: '10:00-11:30',
    location: '腾讯会议',
    type: '线上',
    status: '报名中'
  },
  {
    id: 'event_3',
    date: '12/18',
    title: '新能源产业调研',
    time: '09:00-17:00',
    location: '上海·特斯拉工厂',
    type: '调研',
    status: '名额有限'
  }
];

// 1.7 特色活动
const FEATURED_EVENTS = [
  {
    id: 'featured_1',
    title: '2024年期货投资年度峰会',
    date: '2024-12-20',
    time: '09:00-17:00',
    location: '上海国际会议中心',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=300&fit=crop',
    status: '报名中',
    speakerCount: 12,
    registeredCount: 345
  },
  {
    id: 'featured_2',
    title: 'AI赋能期货交易实战培训',
    date: '2024-12-25',
    time: '14:00-17:00',
    location: '线上直播',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop',
    status: '预告',
    speakerCount: 5,
    registeredCount: 128
  }
];

// 1.8 研究团队
const RESEARCH_TEAM = [
  {
    id: 'analyst_1',
    name: '王明',
    title: '首席经济学家',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    institution: '安粮期货研究院',
    expertise: ['宏观经济', '政策分析', '投资策略'],
    reportCount: 156,
    followerCount: 2345,
    isFollowed: false,
    isVip: true
  },
  {
    id: 'analyst_2',
    name: '李华',
    title: '黑色金属总监',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    institution: '安粮期货研究院',
    expertise: ['螺纹钢', '铁矿石', '焦煤焦炭'],
    reportCount: 89,
    followerCount: 1876,
    isFollowed: true,
    isVip: true
  },
  {
    id: 'analyst_3',
    name: '张伟',
    title: '有色金属高级分析师',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    institution: '安粮期货研究院',
    expertise: ['铜', '铝', '锌'],
    reportCount: 67,
    followerCount: 1456,
    isFollowed: false,
    isVip: false
  }
];

// 1.9 出版书籍
const PUBLISHED_BOOKS = [
  {
    id: 'book_1',
    title: '期货交易实战手册',
    author: '安粮期货研究院',
    publisher: '中信出版社',
    publishDate: '2023-10-01',
    isbn: '9787508689596',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    description: '本书系统介绍了期货交易的基本原理、技术分析方法和风险管理策略，适合期货投资者和从业人员阅读。',
    price: 68.0,
    discountPrice: 54.4,
    rating: 4.7
  },
  {
    id: 'book_2',
    title: '大宗商品投资逻辑',
    author: '安粮期货研究院',
    publisher: '机械工业出版社',
    publishDate: '2022-08-15',
    isbn: '9787111699596',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    description: '本书从产业链角度分析大宗商品的投资逻辑，涵盖农产品、能源、金属等多个领域，为投资者提供系统性的分析框架。',
    price: 78.0,
    discountPrice: 62.4,
    rating: 4.8
  }
];

// ========== 2. 研报数据 ==========

const REPORT_CATEGORIES = [
  { id: 'latest', name: '最新', count: 156 },
  { id: 'hot', name: '热门', count: 89 },
  { id: 'subscription', name: '订阅', count: 45 },
  { id: 'free', name: '免费', count: 67 }
];

const REPORTS = [
  {
    id: 'report_001',
    title: '2024年黄金市场展望',
    author: '贵金属研究团队',
    institution: '安粮期货研究院',
    publishDate: '2024-12-01',
    pageCount: 38,
    rating: 4.6,
    downloadCount: 876,
    abstract: '本报告分析全球货币政策、通胀预期和地缘政治风险对黄金价格的影响，并对2024年黄金市场进行展望。',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w-600&h=800&fit=crop',
    category: '贵金属',
    tags: ['黄金', '贵金属', '避险资产'],
    isFree: true,
    price: 0,
    pdfSize: '2.4MB'
  },
  {
    id: 'report_002',
    title: '生猪期货套期保值策略',
    author: '农产品研究团队',
    institution: '安粮期货研究院',
    publishDate: '2024-11-28',
    pageCount: 42,
    rating: 4.7,
    downloadCount: 654,
    abstract: '本报告针对生猪养殖企业设计套期保值方案，帮助企业规避价格波动风险。',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w-600&h=800&fit=crop',
    category: '农产品',
    tags: ['生猪', '套期保值', '风险管理'],
    isFree: false,
    price: 199,
    pdfSize: '3.1MB'
  },
  {
    id: 'report_003',
    title: '股指期货量化交易模型',
    author: '量化研究团队',
    institution: '安粮期货研究院',
    publishDate: '2024-11-25',
    pageCount: 56,
    rating: 4.8,
    downloadCount: 987,
    abstract: '本报告介绍基于机器学习的股指期货量化交易模型，包括特征工程、模型训练和回测结果。',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w-600&h=800&fit=crop',
    category: '金融期货',
    tags: ['股指期货', '量化交易', '机器学习'],
    isFree: false,
    price: 299,
    pdfSize: '4.2MB'
  }
];

// ========== 3. 期货品种数据 ==========

const FUTURES_CATEGORIES = [
  {
    id: 'black',
    name: '黑色金属',
    icon: '🛢️',
    color: '#1A1A1A',
    description: '螺纹钢、铁矿石、焦煤、焦炭等'
  },
  {
    id: 'nonferrous',
    name: '有色金属',
    icon: '🥇',
    color: '#FFD700',
    description: '铜、铝、锌、铅、镍等'
  },
  {
    id: 'chemical',
    name: '化工产品',
    icon: '⚗️',
    color: '#00CED1',
    description: 'PTA、甲醇、聚丙烯、PVC等'
  },
  {
    id: 'agriculture',
    name: '农产品',
    icon: '🌾',
    color: '#32CD32',
    description: '大豆、玉米、棉花、白糖等'
  },
  {
    id: 'soft',
    name: '软商品',
    icon: '🍫',
    color: '#FF69B4',
    description: '咖啡、可可、橡胶等'
  },
  {
    id: 'financial',
    name: '金融期货',
    icon: '📈',
    color: '#4169E1',
    description: '股指期货、国债期货等'
  },
  {
    id: 'energy',
    name: '能源',
    icon: '⚡',
    color: '#FF4500',
    description: '原油、燃料油、天然气等'
  }
];

const FUTURES_PRODUCTS = [
  // 黑色金属
  { symbol: 'RB', name: '螺纹钢', category: 'black', exchange: 'SHFE', currentPrice: 3856.50, change: 1.23, volume: 1245678 },
  { symbol: 'I', name: '铁矿石', category: 'black', exchange: 'DCE', currentPrice: 856.20, change: 2.15, volume: 987654 },
  { symbol: 'JM', name: '焦煤', category: 'black', exchange: 'DCE', currentPrice: 1850.00, change: 0.89, volume: 345678 },
  { symbol: 'J', name: '焦炭', category: 'black', exchange: 'DCE', currentPrice: 2450.00, change: 1.45, volume: 234567 },
  
  // 有色金属
  { symbol: 'CU', name: '铜', category: 'nonferrous', exchange: 'SHFE', currentPrice: 68500.00, change: 0.78, volume: 567890 },
  { symbol: 'AL', name: '铝', category: 'nonferrous', exchange: 'SHFE', currentPrice: 18500.00, change: 1.12, volume: 678901 },
  { symbol: 'ZN', name: '锌', category: 'nonferrous', exchange: 'SHFE', currentPrice: 21500.00, change: -0.45, volume: 456789 },
  { symbol: 'NI', name: '镍', category: 'nonferrous', exchange: 'SHFE', currentPrice: 132000.00, change: 2.34, volume: 234567 },
  
  // 化工产品
  { symbol: 'TA', name: 'PTA', category: 'chemical', exchange: 'CZCE', currentPrice: 5850.00, change: 0.67, volume: 1234567 },
  { symbol: 'MA', name: '甲醇', category: 'chemical', exchange: 'CZCE', currentPrice: 2450.00, change: -0.23, volume: 987654 },
  { symbol: 'PP', name: '聚丙烯', category: 'chemical', exchange: 'DCE', currentPrice: 7650.00, change: 0.89, volume: 876543 },
  { symbol: 'V', name: 'PVC', category: 'chemical', exchange: 'DCE', currentPrice: 6150.00, change: 0.56, volume: 765432 },
  
  // 农产品
  { symbol: 'A', name: '大豆', category: 'agriculture', exchange: 'DCE', currentPrice: 4850.00, change: 1.23, volume: 654321 },
  { symbol: 'C', name: '玉米', category: 'agriculture', exchange: 'DCE', currentPrice: 2450.00, change: 0.45, volume: 543210 },
  { symbol: 'CF', name: '棉花', category: 'agriculture', exchange: 'CZCE', currentPrice: 15800.00, change: -0.67, volume: 432109 },
  { symbol: 'SR', name: '白糖', category: 'agriculture', exchange: 'CZCE', currentPrice: 6250.00, change: 0.78, volume: 321098 },
  
  // 金融期货
  { symbol: 'IF', name: '沪深300股指', category: 'financial', exchange: 'CFFEX', currentPrice: 3850.00, change: 0.56, volume: 98765 },
  { symbol: 'IH', name: '上证50股指', category: 'financial', exchange: 'CFFEX', currentPrice: 2650.00, change: 0.45, volume: 87654 },
  { symbol: 'IC', name: '中证500股指', category: 'financial', exchange: 'CFFEX', currentPrice: 5850.00, change: 0.67, volume: 76543 },
  { symbol: 'T', name: '10年期国债', category: 'financial', exchange: 'CFFEX', currentPrice: 101.50, change: 0.12, volume: 65432 }
];

// ========== 4. 宏观经济数据 ==========

const MACRO_ECONOMIC_DATA = [
  {
    id: 'macro_1',
    indicator: 'GDP',
    name: '国内生产总值',
    value: '126.06',
    unit: '万亿元',
    change: 5.2,
    period: '2024年三季度',
    updateTime: '2024-10-18'
  },
  {
    id: 'macro_2',
    indicator: 'CPI',
    name: '居民消费价格指数',
    value: '101.2',
    unit: '同比%',
    change: 2.1,
    period: '2024年11月',
    updateTime: '2024-12-09'
  },
  {
    id: 'macro_3',
    indicator: 'PPI',
    name: '工业生产者出厂价格指数',
    value: '99.5',
    unit: '同比%',
    change: -0.5,
    period: '2024年11月',
    updateTime: '2024-12-09'
  },
  {
    id: 'macro_4',
    indicator: 'PMI',
    name: '制造业采购经理指数',
    value: '50.1',
    unit: '指数',
    change: 0.2,
    period: '2024年11月',
    updateTime: '2024-12-01'
  },
  {
    id: 'macro_5',
    indicator: 'EXPORT',
    name: '出口总额',
    value: '2.10',
    unit: '万亿美元',
    change: 3.8,
    period: '2024年1-11月',
    updateTime: '2024-12-07'
  },
  {
    id: 'macro_6',
    indicator: 'IMPORT',
    name: '进口总额',
    value: '1.85',
    unit: '万亿美元',
    change: -0.5,
    period: '2024年1-11月',
    updateTime: '2024-12-07'
  }
];

// ========== 5. AI对话示例数据 ==========

const AI_CHAT_EXAMPLES = [
  {
    id: 'example_1',
    question: '分析一下当前螺纹钢的供需情况',
    category: '品种分析'
  },
  {
    id: 'example_2',
    question: '美联储加息对大宗商品有什么影响？',
    category: '宏观策略'
  },
  {
    id: 'example_3',
    question: '如何利用期货进行套期保值？',
    category: '投资策略'
  },
  {
    id: 'example_4',
    question: '铜价未来三个月走势如何？',
    category: '行情预测'
  },
  {
    id: 'example_5',
    question: '推荐几个适合新手的期货品种',
    category: '投资建议'
  }
];

const AI_CHAT_HISTORY = [
  {
    id: 'chat_1',
    role: 'user',
    content: '你好，我是一个期货新手，可以给我一些建议吗？',
    timestamp: '2024-12-15 10:30:00'
  },
  {
    id: 'chat_2',
    role: 'assistant',
    content: '你好！欢迎来到安粮期货投研智演实验室。作为期货新手，建议您先了解期货市场的基础知识，比如期货合约、保证金制度、交易规则等。可以从模拟交易开始，积累经验后再进行实盘操作。同时，关注宏观经济和行业新闻，学习技术分析和基本面分析方法。有什么具体问题我可以帮您解答吗？',
    timestamp: '2024-12-15 10:30:15'
  },
  {
    id: 'chat_3',
    role: 'user',
    content: '我想了解螺纹钢期货的基本情况',
    timestamp: '2024-12-15 10:32:00'
  },
  {
    id: 'chat_4',
    role: 'assistant',
    content: '螺纹钢期货是在上海期货交易所交易的品种，交易代码是RB。它是国内交易最活跃的期货品种之一，主要受房地产、基建等固定资产投资需求影响。螺纹钢价格与铁矿石、焦煤焦炭等原材料价格密切相关。当前螺纹钢市场的主要矛盾在于供给端的环保限产和需求端的房地产调控政策。建议您关注库存变化、钢厂开工率和终端需求数据。',
    timestamp: '2024-12-15 10:32:30'
  }
];

// ========== 6. 数据接口模拟函数 ==========

/**
 * 获取首页数据
 */
function getHomeData() {
  return {
    banners: BANNERS,
    quickEntries: QUICK_ENTRIES,
    hotQuestions: HOT_QUESTIONS,
    articleCategories: ARTICLE_CATEGORIES,
    articles: ARTICLES,
    recommendedReports: RECOMMENDED_REPORTS,
    calendarDates: CALENDAR_DATES,
    calendarEvents: CALENDAR_EVENTS,
    featuredEvents: FEATURED_EVENTS,
    researchTeam: RESEARCH_TEAM,
    publishedBooks: PUBLISHED_BOOKS,
    timestamp: new Date().toISOString()
  };
}

/**
 * 获取推荐研报列表
 */
function getRecommendedReports(limit = 10) {
  return RECOMMENDED_REPORTS.slice(0, limit);
}

/**
 * 获取期货品种列表
 * @param {string} category - 分类ID
 */
function getFuturesProducts(category = null) {
  if (!category) return FUTURES_PRODUCTS;
  return FUTURES_PRODUCTS.filter(product => product.category === category);
}

/**
 * 获取宏观经济数据
 */
function getMacroEconomicData() {
  return MACRO_ECONOMIC_DATA;
}

/**
 * 获取研报列表
 * @param {string} category - 分类
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 */
function getReports(category = 'latest', page = 1, pageSize = 10) {
  // 简单的过滤逻辑
  let filteredReports = [...REPORTS];
  
  if (category === 'free') {
    filteredReports = filteredReports.filter(report => report.isFree);
  } else if (category === 'subscription') {
    filteredReports = filteredReports.filter(report => !report.isFree);
  }
  
  // 模拟分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    list: filteredReports.slice(start, end),
    total: filteredReports.length,
    page,
    pageSize,
    hasMore: end < filteredReports.length
  };
}

/**
 * 获取研报详情
 * @param {string} id - 研报ID
 */
function getReportDetail(id) {
  return REPORTS.find(report => report.id === id) || null;
}

/**
 * 获取文章详情
 * @param {string} id - 文章ID
 */
function getArticleDetail(id) {
  return ARTICLES.find(article => article.id === id) || null;
}

/**
 * 获取分析师详情
 * @param {string} id - 分析师ID
 */
function getAnalystDetail(id) {
  return RESEARCH_TEAM.find(analyst => analyst.id === id) || null;
}

/**
 * 获取AI对话示例
 */
function getAIChatExamples() {
  return AI_CHAT_EXAMPLES;
}

/**
 * 获取AI对话历史
 */
function getAIChatHistory() {
  return AI_CHAT_HISTORY;
}

/**
 * 生成研报列表（兼容旧接口）
 */
function generateReports(count = 10) {
  return getReports('latest', 1, count).list;
}

/**
 * 生成活动列表（兼容旧接口）
 */
function generateEvents(count = 10) {
  // 合并日历事件和特色活动
  const allEvents = [...CALENDAR_EVENTS, ...FEATURED_EVENTS];
  // 如果数量不足，重复数据
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({ ...allEvents[i % allEvents.length], id: `event_${i + 1}` });
  }
  return result;
}

/**
 * 生成期货品种列表（兼容旧接口）
 */
function generateFuturesProducts(count = 10) {
  const products = FUTURES_PRODUCTS;
  // 如果数量不足，重复数据
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({ ...products[i % products.length], id: `future_${i + 1}` });
  }
  return result;
}

// ========== 7. 导出所有数据 ==========

module.exports = {
  // 数据生成工具
  utils: {
    generateId,
    randomDate,
    formatDate,
    randomPrice,
    randomChange
  },
  
  // 首页数据
  BANNERS,
  QUICK_ENTRIES,
  HOT_QUESTIONS,
  ARTICLE_CATEGORIES,
  ARTICLES,
  RECOMMENDED_REPORTS,
  CALENDAR_DATES,
  CALENDAR_EVENTS,
  FEATURED_EVENTS,
  RESEARCH_TEAM,
  PUBLISHED_BOOKS,
  
  // 研报数据
  REPORT_CATEGORIES,
  REPORTS,
  
  // 期货品种数据
  FUTURES_CATEGORIES,
  FUTURES_PRODUCTS,
  
  // 宏观经济数据
  MACRO_ECONOMIC_DATA,
  
  // AI对话数据
  AI_CHAT_EXAMPLES,
  AI_CHAT_HISTORY,
  
  // 数据接口函数
  getHomeData,
  getRecommendedReports,
  getFuturesProducts,
  getMacroEconomicData,
  getReports,
  getReportDetail,
  getArticleDetail,
  getAnalystDetail,
  getAIChatExamples,
  getAIChatHistory,
  generateReports,
  generateEvents,
  generateFuturesProducts
};