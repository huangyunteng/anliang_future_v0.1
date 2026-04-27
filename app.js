// app.js - 安粮期货投研智演实验室 - 全局配置
App({
  globalData: {
    // 用户信息
    userInfo: null,
    isLoggedIn: false,
    
    // 系统信息
    systemInfo: null,
    statusBarHeight: 0,
    navigationBarHeight: 44,
    capsuleHeight: 0,
    
    // 网络配置 - 根据环境切换
    // 开发环境（本地测试）- 使用ngrok公网地址让老板测试
    // apiBaseUrl: 'http://127.0.0.1:8000',
    
    // cpolar测试环境（老板远程访问）- 填入你的cpolar地址
    apiBaseUrl: 'https://1029f019.r7.cpolar.cn',  // 改为你的实际cpolar地址
    
    // 生产环境（线上部署）- 正式上线时启用
    // apiBaseUrl: 'https://your-domain.com/api',
    
    // AI配置 (硅基流动平台)
    aiConfig: {
      // 千问免费接口 (OpenAI格式兼容)
      qianwen: {
        baseUrl: 'https://api.siliconflow.cn/v1',
        apiKey: '', // 请在此处填入您的API Key
        model: 'Qwen/Qwen2.5-7B-Instruct',
        maxTokens: 2000,
        temperature: 0.7
      },
      // 豆包收费接口
      doubao: {
        baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
        apiKey: '', // 请在此处填入您的API Key
        model: 'doubao-pro',
        maxTokens: 4000,
        temperature: 0.7
      },
      // 当前使用的AI服务 (默认使用千问免费版)
      currentService: 'qianwen'
    },
    
    // 期货品种分类
    futuresCategories: [
      { id: 'black', name: '黑色金属', color: '#1A1A1A', icon: '🛢️' },
      { id: 'nonferrous', name: '有色金属', color: '#FFD700', icon: '🥇' },
      { id: 'chemical', name: '化工产品', color: '#00CED1', icon: '⚗️' },
      { id: 'agriculture', name: '农产品', color: '#32CD32', icon: '🌾' },
      { id: 'soft', name: '软商品', color: '#FF69B4', icon: '🍫' },
      { id: 'financial', name: '金融期货', color: '#4169E1', icon: '📈' },
      { id: 'energy', name: '能源', color: '#FF4500', icon: '⚡' }
    ],
    
    // 全局状态
    currentTab: 'home',
    aiFloatVisible: true, // AI悬浮球是否显示
    hasNewMessage: false, // 是否有新消息
    unreadCount: 0,
    
    // 版本信息
    version: '1.0.0',
    buildDate: '2024-12-01'
  },

  onLaunch() {
    console.log('CODEBUDDY_DEBUG app onLaunch - app starting')
    console.log('CODEBUDDY_DEBUG app onLaunch - apiBaseUrl=', this.globalData.apiBaseUrl)
    console.log('CODEBUDDY_DEBUG app onLaunch - privacy.json check start')

    // 检查 privacy.json 是否存在（通过尝试读取）
    try {
      const privacyInfo = require('./privacy.json');
      console.log('CODEBUDDY_DEBUG app onLaunch - privacy.json loaded successfully')
    } catch (e) {
      console.error('CODEBUDDY_DEBUG app onLaunch - privacy.json NOT FOUND or ERROR:', e)
    }

    // 获取系统信息
    this.getSystemInfo();

    // 检查登录状态 (游客模式)
    console.log('CODEBUDDY_DEBUG app onLaunch - step checkLoginStatus start');
    this.checkLoginStatus();
    console.log('CODEBUDDY_DEBUG app onLaunch - step checkLoginStatus complete');

    // 初始化AI配置
    console.log('CODEBUDDY_DEBUG app onLaunch - step initAIConfig start');
    this.initAIConfig();
    console.log('CODEBUDDY_DEBUG app onLaunch - step initAIConfig complete');

    console.log('CODEBUDDY_DEBUG app onLaunch - initialization complete, no network requests made yet')
  },
  
  onShow() {
    console.log('小程序进入前台');
  },
  
  onHide() {
    console.log('小程序进入后台');
  },

  onError(error) {
    console.log('CODEBUDDY_DEBUG app onError caught global error:', error);
    console.log('CODEBUDDY_DEBUG app onError stack:', error.stack);
  },

  // ========== 系统方法 ==========
  
  /**
   * 获取系统信息（使用新的API替代已废弃的wx.getSystemInfoSync）
   */
  getSystemInfo() {
    console.log('CODEBUDDY_DEBUG getSystemInfo start');
    try {
      console.log('CODEBUDDY_DEBUG getSystemInfo calling wx.getWindowInfo');
      // 使用新的API获取窗口信息
      const windowInfo = wx.getWindowInfo();
      console.log('CODEBUDDY_DEBUG getSystemInfo windowInfo received');

      console.log('CODEBUDDY_DEBUG getSystemInfo calling wx.getDeviceInfo');
      const deviceInfo = wx.getDeviceInfo();
      console.log('CODEBUDDY_DEBUG getSystemInfo deviceInfo received');

      console.log('CODEBUDDY_DEBUG getSystemInfo calling wx.getAppBaseInfo');
      const appBaseInfo = wx.getAppBaseInfo();
      console.log('CODEBUDDY_DEBUG getSystemInfo appBaseInfo received');

      // 合并信息
      const systemInfo = {
        ...windowInfo,
        ...deviceInfo,
        ...appBaseInfo
      };

      this.globalData.systemInfo = systemInfo;
      this.globalData.statusBarHeight = windowInfo.statusBarHeight || 20;

      console.log('CODEBUDDY_DEBUG getSystemInfo calling wx.getMenuButtonBoundingClientRect');
      // 计算胶囊按钮位置信息（用于自定义导航栏）
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
      console.log('CODEBUDDY_DEBUG getSystemInfo menuButtonInfo received', menuButtonInfo);

      if (menuButtonInfo) {
        this.globalData.capsuleHeight = menuButtonInfo.height;
        this.globalData.capsuleTop = menuButtonInfo.top;
        this.globalData.capsuleRight = menuButtonInfo.right;
      }

      console.log('系统信息获取成功:', systemInfo);
      console.log('CODEBUDDY_DEBUG getSystemInfo complete success');
    } catch (err) {
      console.error('获取系统信息失败:', err);
      console.error('CODEBUDDY_DEBUG getSystemInfo catch error:', err);
    }
  },
  
  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    console.log('CODEBUDDY_DEBUG checkLoginStatus start - setting guest mode');
    try {
      // 游客模式，暂时不实现登录
      this.globalData.isLoggedIn = false;
      this.globalData.userInfo = {
        nickname: '游客',
        avatar: '/images/default-avatar.png',
        vipLevel: 0,
        memberExpire: ''
      };
      console.log('CODEBUDDY_DEBUG checkLoginStatus success - userInfo=', this.globalData.userInfo);
    } catch (err) {
      console.error('CODEBUDDY_DEBUG checkLoginStatus error:', err);
    }
  },
  
  /**
   * 初始化AI配置
   */
  initAIConfig() {
    console.log('CODEBUDDY_DEBUG initAIConfig start - reading from storage');
    try {
      const savedConfig = wx.getStorageSync('aiConfig');
      console.log('CODEBUDDY_DEBUG initAIConfig savedConfig=', savedConfig);
      if (savedConfig) {
        Object.assign(this.globalData.aiConfig, savedConfig);
        console.log('CODEBUDDY_DEBUG initAIConfig merged aiConfig=', this.globalData.aiConfig);
      } else {
        console.log('CODEBUDDY_DEBUG initAIConfig no saved config found, using defaults');
      }
      console.log('CODEBUDDY_DEBUG initAIConfig success');
    } catch (err) {
      console.error('CODEBUDDY_DEBUG initAIConfig error:', err);
    }
  },
  
  /**
   * 保存AI配置
   */
  saveAIConfig() {
    try {
      wx.setStorageSync('aiConfig', this.globalData.aiConfig);
    } catch (err) {
      console.error('保存AI配置失败:', err);
    }
  },
  
  /**
   * 切换AI服务
   * @param {string} service - ai服务名称: 'qianwen' 或 'doubao'
   */
  switchAIService(service) {
    if (['qianwen', 'doubao'].includes(service)) {
      this.globalData.aiConfig.currentService = service;
      this.saveAIConfig();
      return true;
    }
    return false;
  },

  // ========== 网络请求方法 ==========
  
  /**
   * 统一的网络请求方法
   * @param {Object} options 请求配置，格式同 wx.request
   * @returns {Promise} 返回Promise对象
   */
  request(options) {
    console.log('CODEBUDDY_DEBUG app.request called - url=', options.url, 'method=', options.method || 'GET')
    console.log('CODEBUDDY_DEBUG app.request start timestamp=', Date.now())
    console.log('CODEBUDDY_DEBUG app.request data=', JSON.stringify(options.data || {}))
    return new Promise((resolve, reject) => {
      // 确保url完整
      let url = options.url;
      if (!url.startsWith('http')) {
        url = `${this.globalData.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
      }

      console.log('CODEBUDDY_DEBUG app.request final url=', url)
      console.log('CODEBUDDY_DEBUG app.request final url is localhost/127.0.0.1=', url.includes('127.0.0.1') || url.includes('localhost'))

      wx.request({
        url: url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        timeout: 960000, // 增加为960秒超时，AI处理和多智能体协调需要更长时间
        success: (res) => {
          console.log('CODEBUDDY_DEBUG app.request success - statusCode=', res.statusCode, 'url=', url, 'duration=', Date.now() - 1572364505000)
          // 统一处理响应状态码
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            console.warn('接口返回401，需要登录');
            reject({
              code: 401,
              message: '访问未授权，请先登录',
              data: res.data
            });
          } else {
            reject({
              code: res.statusCode,
              message: res.data?.message || '请求失败',
              data: res.data
            });
          }
        },
        fail: (err) => {
          console.error('CODEBUDDY_DEBUG app.request fail - url=', url, 'error=', err)
          console.error('CODEBUDDY_DEBUG app.request fail - errMsg=', err.errMsg)
          console.error('CODEBUDDY_DEBUG app.request fail - url is localhost/127.0.0.1=', url.includes('127.0.0.1') || url.includes('localhost'))
          console.error('CODEBUDDY_DEBUG app.request fail - duration=', Date.now() - 1572364505000)
          reject({
            code: -1,
            message: '网络连接失败，请检查网络设置',
            data: err
          });
        }
      });
    });
  },

  /**
   * 简易GET请求
   * @param {string} url 请求地址
   * @param {Object} data 请求参数
   * @param {Object} header 请求头
   * @returns {Promise}
   */
  get(url, data = {}, header = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      header
    });
  },

  /**
   * 简易POST请求
   * @param {string} url 请求地址
   * @param {Object} data 请求数据
   * @param {Object} header 请求头
   * @returns {Promise}
   */
  post(url, data = {}, header = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      header
    });
  },
  
  /**
   * AI对话请求
   * @param {string} message - 用户消息
   * @param {Array} history - 对话历史
   * @param {string} service - 指定AI服务，可选 'qianwen' 或 'doubao'，默认使用当前配置
   * @returns {Promise} AI回复
   */
  aiChat(message, history = [], service = null) {
    return new Promise((resolve, reject) => {
      const aiService = service || this.globalData.aiConfig.currentService;
      const config = this.globalData.aiConfig[aiService];
      
      if (!config || !config.apiKey) {
        reject({
          code: -2,
          message: 'AI服务未配置API Key，请在配置中填写'
        });
        return;
      }
      
      // 构建请求数据 (OpenAI格式)
      const requestData = {
        model: config.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的期货投研分析师助手，请用严谨、专业的态度回答用户问题，专注于期货市场、大宗商品、宏观经济、投资策略等相关领域。'
          },
          ...history,
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: false
      };
      
      wx.request({
        url: `${config.baseUrl}/chat/completions`,
        method: 'POST',
        data: requestData,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.choices && res.data.choices.length > 0) {
            resolve({
              service: aiService,
              model: config.model,
              content: res.data.choices[0].message.content,
              usage: res.data.usage,
              timestamp: Date.now()
            });
          } else {
            reject({
              code: res.statusCode,
              message: 'AI服务返回异常',
              data: res.data
            });
          }
        },
        fail: (err) => {
          console.error('AI请求失败:', err);
          reject({
            code: -1,
            message: 'AI服务请求失败，请检查网络和API配置',
            data: err
          });
        }
      });
    });
  },

  // ========== UI工具方法 ==========
  
  /**
   * 显示加载提示
   * @param {string} title 提示文字
   */
  showLoading(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    });
  },

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading();
  },

  /**
   * 显示消息提示
   * @param {string} title 提示文字
   * @param {string} icon 图标类型
   * @param {number} duration 显示时长(ms)
   */
  showToast(title, icon = 'none', duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    });
  },

  /**
   * 显示错误提示
   * @param {string} message 错误信息
   */
  showError(message) {
    this.showToast(message || '操作失败，请稍后重试', 'error');
  },

  /**
   * 显示成功提示
   * @param {string} message 成功信息
   */
  showSuccess(message) {
    this.showToast(message || '操作成功', 'success');
  },
  
  /**
   * 显示模态对话框
   * @param {Object} options 对话框配置
   */
  showModal(options) {
    return new Promise((resolve) => {
      wx.showModal({
        title: options.title || '提示',
        content: options.content || '',
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        cancelColor: options.cancelColor || '#999999',
        confirmText: options.confirmText || '确定',
        confirmColor: options.confirmColor || '#C8102E',
        success: (res) => {
          resolve(res.confirm);
        },
        fail: () => {
          resolve(false);
        }
      });
    });
  },
  
  /**
   * 底部操作菜单
   * @param {Array} itemList 菜单项列表
   */
  showActionSheet(itemList) {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: itemList,
        success: (res) => {
          resolve(res.tapIndex);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  // ========== 工具方法 ==========
  
  /**
   * 格式化日期
   * @param {Date|string|number} date 日期
   * @param {string} format 格式，默认 'YYYY-MM-DD HH:mm'
   */
  formatDate(date, format = 'YYYY-MM-DD HH:mm') {
    const d = date ? new Date(date) : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second);
  },
  
  /**
   * 格式化数字
   * @param {number} num 数字
   * @param {number} decimals 小数位数
   */
  formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Number(num).toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },
  
  /**
   * 格式化涨跌幅
   * @param {number} change 涨跌幅
   */
  formatChange(change) {
    if (change === null || change === undefined || isNaN(change)) return '-';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  },
  
  /**
   * 深拷贝对象
   * @param {Object} obj 对象
   */
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  
  /**
   * 防抖函数
   * @param {Function} func 函数
   * @param {number} wait 等待时间(ms)
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * 节流函数
   * @param {Function} func 函数
   * @param {number} limit 限制时间(ms)
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // ========== 导航相关 ==========
  
  /**
   * 页面跳转
   * @param {string} url 页面路径
   * @param {Object} params 参数对象
   */
  navigateTo(url, params = {}) {
    if (Object.keys(params).length > 0) {
      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      url = `${url}?${queryString}`;
    }
    wx.navigateTo({ url });
  },
  
  /**
   * 返回上一页
   * @param {number} delta 返回层数
   */
  navigateBack(delta = 1) {
    wx.navigateBack({ delta });
  },
  
  /**
   * 跳转到tab页面
   * @param {string} url 页面路径
   */
  switchTab(url) {
    wx.switchTab({ url });
  },
  
  /**
   * 重定向到页面
   * @param {string} url 页面路径
   * @param {Object} params 参数对象
   */
  redirectTo(url, params = {}) {
    if (Object.keys(params).length > 0) {
      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      url = `${url}?${queryString}`;
    }
    wx.redirectTo({ url });
  }
});