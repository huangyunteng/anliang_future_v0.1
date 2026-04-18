// utils/config.js - API接口配置和常量定义

/**
 * 安粮期货智能投研小程序 - 配置中心
 * 步骤1：游客无账户模式接口配置
 */

// ========== 1. 环境配置 ==========
const ENV = {
  // 开发环境
  DEV: {
    API_BASE_URL: 'http://localhost:3000/api',
    DEBUG: true
  },
  // 生产环境
  PROD: {
    API_BASE_URL: 'https://api.anliangfutures.com/api',
    DEBUG: false
  }
};

// 当前环境（开发/生产），默认为开发环境
const CURRENT_ENV = ENV.DEV;
// 切换环境：修改这里为 ENV.PROD 可切换到生产环境
// const CURRENT_ENV = ENV.PROD;

// ========== 2. API接口地址配置 ==========
const API = {
  // ===== 2.1 首页相关接口 =====
  HOME: {
    // 获取首页Banner数据
    GET_BANNERS: '/home/banners',
    // 获取首页快速入口
    GET_QUICK_ENTRIES: '/home/quick-entries',
    // 获取热门品种
    GET_HOT_PRODUCTS: '/home/hot-products',
    // 获取实时资讯
    GET_REALTIME_NEWS: '/home/realtime-news',
    // 获取AI推荐
    GET_AI_RECOMMENDATIONS: '/home/ai-recommendations',
  },

  // ===== 2.2 行情相关接口 =====
  MARKET: {
    // 获取行情分类列表
    GET_CATEGORIES: '/market/categories',
    // 获取品种列表
    GET_PRODUCTS: '/market/products',
    // 获取品种详情
    GET_PRODUCT_DETAIL: '/market/product/:id',
    // 搜索品种
    SEARCH_PRODUCTS: '/market/search',
    // 添加自选
    ADD_FAVORITE: '/market/favorites',
    // 删除自选
    REMOVE_FAVORITE: '/market/favorites/:id',
    // 获取自选列表
    GET_FAVORITES: '/market/favorites',
    // 获取K线数据
    GET_KLINE_DATA: '/market/kline',
  },

  // ===== 2.3 资讯相关接口 =====
  NEWS: {
    // 获取资讯分类
    GET_CATEGORIES: '/news/categories',
    // 获取资讯列表
    GET_LIST: '/news/list',
    // 获取资讯详情
    GET_DETAIL: '/news/detail/:id',
    // 获取相关资讯
    GET_RELATED: '/news/related/:id',
    // 搜索资讯
    SEARCH: '/news/search',
    // 获取热门资讯
    GET_HOT: '/news/hot',
  },

  // ===== 2.4 AI对话相关接口 =====
  AI_CHAT: {
    // 发送消息
    SEND_MESSAGE: '/ai/chat',
    // 获取对话历史
    GET_HISTORY: '/ai/chat/history',
    // 清空对话历史
    CLEAR_HISTORY: '/ai/chat/clear',
    // 获取推荐问题
    GET_SUGGESTIONS: '/ai/suggestions',
  },

  // ===== 2.5 数据附件相关接口 =====
  DATA: {
    // 获取数据附件列表
    GET_ATTACHMENTS: '/data/attachments',
    // 下载数据附件
    DOWNLOAD_ATTACHMENT: '/data/attachment/:id',
    // 获取数据统计
    GET_STATISTICS: '/data/statistics',
  },

  // ===== 2.6 用户相关接口（步骤1暂不使用，为步骤2预留） =====
  USER: {
    // 微信登录
    WECHAT_LOGIN: '/user/wechat/login',
    // 获取用户信息
    GET_PROFILE: '/user/profile',
    // 更新用户信息
    UPDATE_PROFILE: '/user/profile',
  },
};

// ========== 3. 全局常量 ==========
const CONSTANTS = {
  // 分页配置
  PAGINATION: {
    PAGE_SIZE: 10, // 默认每页条数
    PAGE_SIZE_20: 20,
    PAGE_SIZE_30: 30,
  },

  // 请求超时时间（毫秒）
  TIMEOUT: 10000,

  // 缓存时间（秒）
  CACHE_TIME: {
    SHORT: 60, // 1分钟
    MEDIUM: 300, // 5分钟
    LONG: 1800, // 30分钟
    VERY_LONG: 3600, // 1小时
  },

  // 本地存储键名
  STORAGE_KEYS: {
    // 用户相关（步骤1暂不使用）
    USER_TOKEN: 'user_token',
    USER_INFO: 'user_info',
    // 应用配置
    APP_CONFIG: 'app_config',
    // 自选品种
    FAVORITE_PRODUCTS: 'favorite_products',
    // AI对话历史
    AI_CHAT_HISTORY: 'ai_chat_history',
    // 搜索历史
    SEARCH_HISTORY: 'search_history',
  },

  // 错误码
  ERROR_CODES: {
    SUCCESS: 0,
    NETWORK_ERROR: -1,
    TIMEOUT: -2,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },

  // 错误消息
  ERROR_MESSAGES: {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    TIMEOUT: '请求超时，请稍后重试',
    SERVER_ERROR: '服务器错误，请稍后重试',
    UNAUTHORIZED: '未授权访问',
    NOT_FOUND: '资源不存在',
  },

  // 正则表达式
  REGEX: {
    // 手机号
    PHONE: /^1[3-9]\d{9}$/,
    // 邮箱
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // 价格（最多两位小数）
    PRICE: /^\d+(\.\d{1,2})?$/,
    // 百分比（0-100，最多两位小数）
    PERCENTAGE: /^(100(\.0{1,2})?|(\d{1,2}(\.\d{1,2})?))$/,
  },

  // 日期时间格式
  DATE_FORMAT: {
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    SHORT_DATE: 'MM-DD',
    SHORT_TIME: 'HH:mm',
  },

  // 数字格式化
  NUMBER_FORMAT: {
    // 小数位数
    DECIMALS: {
      PRICE: 2, // 价格
      PERCENTAGE: 2, // 百分比
      VOLUME: 0, // 成交量
    },
    // 千分位分隔符
    THOUSANDS_SEPARATOR: ',',
  },
};

// ========== 4. 业务配置 ==========
const BUSINESS_CONFIG = {
  // 首页配置
  HOME: {
    // Banner自动轮播间隔（毫秒）
    BANNER_INTERVAL: 5000,
    // 热门品种显示数量
    HOT_PRODUCTS_COUNT: 6,
    // 实时资讯显示数量
    REALTIME_NEWS_COUNT: 5,
  },

  // 行情页配置
  MARKET: {
    // 刷新间隔（毫秒）
    REFRESH_INTERVAL: 3000,
    // 自选最大数量
    FAVORITE_MAX_COUNT: 50,
    // 涨跌颜色阈值
    CHANGE_THRESHOLD: {
      RISE: 0, // 大于0为涨
      FALL: 0, // 小于0为跌
    },
  },

  // 资讯页配置
  NEWS: {
    // 每页条数
    PAGE_SIZE: 10,
    // 资讯摘要最大长度
    SUMMARY_MAX_LENGTH: 100,
    // 相关资讯显示数量
    RELATED_COUNT: 5,
  },

  // AI对话配置
  AI_CHAT: {
    // 最大历史记录数
    MAX_HISTORY: 50,
    // 输入最大长度
    INPUT_MAX_LENGTH: 500,
    // 响应超时时间（毫秒）
    RESPONSE_TIMEOUT: 30000,
    // 推荐问题数量
    SUGGESTIONS_COUNT: 5,
  },
};

// ========== 5. 主题配置（中金点睛风格）==========
const THEME_CONFIG = {
  // 颜色系统
  COLORS: {
    // 品牌色 - 中金红
    PRIMARY: '#C8102E',
    PRIMARY_DARK: '#A00D25',
    PRIMARY_LIGHT: '#FCE8EB',
    
    // 中性色
    TEXT_PRIMARY: '#1A1A1A',
    TEXT_SECONDARY: '#666666',
    TEXT_TERTIARY: '#999999',
    TEXT_QUATERNARY: '#CCCCCC',
    BORDER: '#E5E5E5',
    BG: '#F5F5F5',
    BG_CARD: '#FFFFFF',
    BG_GRAY: '#FAFAFA',
    BG_DISABLED: '#F0F0F0',
    
    // 功能色
    SUCCESS: '#52C41A',
    WARNING: '#FAAD14',
    ERROR: '#F5222D',
    INFO: '#1890FF',
    
    // 涨跌色
    RISE: '#F56C6C',
    FALL: '#52C41A',
    RISE_BG: 'rgba(245, 108, 108, 0.1)',
    FALL_BG: 'rgba(82, 196, 26, 0.1)'
  },
  
  // 间距系统 (rpx)
  SPACING: {
    XS: '8rpx',
    SM: '16rpx',
    MD: '24rpx',
    LG: '32rpx',
    XL: '48rpx',
    XXL: '64rpx'
  },
  
  // 圆角系统
  BORDER_RADIUS: {
    SM: '8rpx',
    MD: '12rpx',
    LG: '16rpx',
    XL: '24rpx',
    ROUND: '50%'
  },
  
  // 字体系统
  TYPOGRAPHY: {
    // 字体大小
    FONT_SIZE: {
      XS: '20rpx',
      SM: '24rpx',
      MD: '28rpx',
      LG: '32rpx',
      XL: '36rpx',
      XXL: '40rpx',
      XXXL: '48rpx'
    },
    // 字体粗细
    FONT_WEIGHT: {
      REGULAR: '400',
      MEDIUM: '500',
      SEMIBOLD: '600',
      BOLD: '700'
    },
    // 行高
    LINE_HEIGHT: {
      TIGHT: '1.2',
      NORMAL: '1.5',
      LOOSE: '1.8'
    }
  },
  
  // 阴影系统
  SHADOWS: {
    SM: '0 2rpx 8rpx rgba(0, 0, 0, 0.08)',
    MD: '0 4rpx 12rpx rgba(0, 0, 0, 0.12)',
    LG: '0 8rpx 24rpx rgba(0, 0, 0, 0.16)'
  },
  
  // 动画配置
  ANIMATION: {
    DURATION: {
      FAST: '150ms',
      NORMAL: '300ms',
      SLOW: '500ms'
    },
    TIMING_FUNCTION: {
      EASE_IN_OUT: 'ease-in-out',
      EASE_OUT: 'ease-out',
      LINEAR: 'linear'
    }
  },
  
  // 页面配置
  PAGE: {
    PADDING_HORIZONTAL: '30rpx',
    PADDING_VERTICAL: '20rpx'
  },
  
  // 组件配置
  COMPONENTS: {
    // 卡片
    CARD: {
      PADDING: '24rpx',
      BORDER_RADIUS: '16rpx',
      SHADOW: 'SM'
    },
    // 按钮
    BUTTON: {
      HEIGHT: '80rpx',
      PADDING_HORIZONTAL: '32rpx',
      BORDER_RADIUS: '12rpx'
    },
    // 输入框
    INPUT: {
      HEIGHT: '88rpx',
      PADDING_HORIZONTAL: '24rpx',
      BORDER_RADIUS: '8rpx'
    }
  }
};

// ========== 6. 工具函数 ==========

/**
 * 获取完整的API地址
 * @param {string} apiPath - API路径
 * @param {Object} params - 路径参数
 * @returns {string} 完整的URL
 */
function getApiUrl(apiPath, params = {}) {
  let url = `${CURRENT_ENV.API_BASE_URL}${apiPath}`;
  
  // 替换路径参数
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(key => {
      const placeholder = `:${key}`;
      if (url.includes(placeholder)) {
        url = url.replace(placeholder, encodeURIComponent(params[key]));
      }
    });
  }
  
  return url;
}

/**
 * 获取查询字符串
 * @param {Object} params - 查询参数
 * @returns {string} 查询字符串
 */
function getQueryString(params = {}) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key]);
    }
  });
  
  return `?${queryParams.toString()}`;
}

/**
 * 获取完整的请求URL（包含查询参数）
 * @param {string} apiPath - API路径
 * @param {Object} pathParams - 路径参数
 * @param {Object} queryParams - 查询参数
 * @returns {string} 完整的URL
 */
function getFullUrl(apiPath, pathParams = {}, queryParams = {}) {
  const url = getApiUrl(apiPath, pathParams);
  const queryString = getQueryString(queryParams);
  return `${url}${queryString}`;
}

/**
 * 格式化价格
 * @param {number|string} price - 价格
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的价格
 */
function formatPrice(price, decimals = CONSTANTS.NUMBER_FORMAT.DECIMALS.PRICE) {
  const num = parseFloat(price);
  if (isNaN(num)) return '--';
  
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, CONSTANTS.NUMBER_FORMAT.THOUSANDS_SEPARATOR);
}

/**
 * 格式化百分比
 * @param {number|string} percent - 百分比数值（如5.5表示5.5%）
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的百分比
 */
function formatPercent(percent, decimals = CONSTANTS.NUMBER_FORMAT.DECIMALS.PERCENTAGE) {
  const num = parseFloat(percent);
  if (isNaN(num)) return '--';
  
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
}

/**
 * 格式化数字（添加千分位）
 * @param {number|string} num - 数字
 * @returns {string} 格式化后的数字
 */
function formatNumber(num) {
  const n = parseFloat(num);
  if (isNaN(n)) return '--';
  
  // 如果是整数，不显示小数部分
  if (Number.isInteger(n)) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, CONSTANTS.NUMBER_FORMAT.THOUSANDS_SEPARATOR);
  }
  
  // 如果是小数，保留两位小数
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, CONSTANTS.NUMBER_FORMAT.THOUSANDS_SEPARATOR);
}

/**
 * 获取涨跌颜色
 * @param {number} change - 涨跌幅
 * @returns {string} 颜色类名
 */
function getChangeColor(change) {
  if (change > 0) return 'text-rise';
  if (change < 0) return 'text-fall';
  return 'text-tertiary';
}

/**
 * 获取涨跌背景色
 * @param {number} change - 涨跌幅
 * @returns {string} 背景颜色类名
 */
function getChangeBgColor(change) {
  if (change > 0) return 'bg-rise';
  if (change < 0) return 'bg-fall';
  return 'bg-transparent';
}

// ========== 6. 导出配置 ==========
module.exports = {
  // 环境配置
  ENV,
  CURRENT_ENV,
  
  // API接口
  API,
  
  // 常量
  CONSTANTS,
  
  // 业务配置
  BUSINESS_CONFIG,
  
  // 主题配置（中金点睛风格）
  THEME_CONFIG,
  
  // 工具函数
  utils: {
    getApiUrl,
    getQueryString,
    getFullUrl,
    formatPrice,
    formatPercent,
    formatNumber,
    getChangeColor,
    getChangeBgColor,
  },
};