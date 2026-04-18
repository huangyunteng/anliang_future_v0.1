// pages/data/data.js
const { generateFuturesProducts, generateMacroIndicators } = require('../../utils/mock-data.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏相关
    currentTab: 'recommend',
    statusBarHeight: 20,
    navigationHeight: 44,
    avatarUrl: '',
    
    // 市场数据
    marketData: {
      shIndex: { value: 3200.45, change: 0.85 },
      szIndex: { value: 10800.32, change: -0.23 },
      cybIndex: { value: 2200.67, change: 1.25 },
      hs300: { value: 3800.12, change: 0.42 }
    },
    updateTime: '',
    
    // 期货分类
    futuresCategories: ['全部', '金属', '能源', '农产品', '化工', '金融'],
    activeFuturesCategory: '全部',
    
    // 时间范围
    timeRanges: ['1日', '1周', '1月', '3月', '1年'],
    activeTimeRange: '1月',
    
    // 热门期货
    hotFutures: [],
    
    // 宏观经济指标
    macroIndicators: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    this.loadData();
    this.updateTime();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 系统TabBar会自动管理选中状态
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadData(true).then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '数据已更新',
        icon: 'success'
      });
    });
  },

  /**
   * 计算导航栏高度（使用新的API）
   */
  calculateNavigationBarHeight() {
    const windowInfo = wx.getWindowInfo();
    this.setData({
      statusBarHeight: windowInfo.statusBarHeight,
      navigationHeight: 44 // 标准导航栏高度
    });
  },

  /**
   * 加载用户头像
   */
  loadUserAvatar() {
    const userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.avatarUrl) {
      this.setData({ avatarUrl: userInfo.avatarUrl });
    } else {
      this.setData({ avatarUrl: '/images/default-avatar.png' });
    }
  },

  /**
   * 加载数据
   */
  loadData(isRefresh = false) {
    // 生成模拟数据
    const hotFutures = generateFuturesProducts(6);
    const macroIndicators = generateMacroIndicators();
    
    // 更新市场数据（模拟实时变化）
    this.updateMarketData();
    
    this.setData({
      hotFutures,
      macroIndicators,
      updateTime: this.formatTime(new Date())
    });
    
    return Promise.resolve();
  },

  /**
   * 更新市场数据（模拟实时变化）
   */
  updateMarketData() {
    const { marketData } = this.data;
    
    // 模拟随机波动
    const updatedMarketData = {
      shIndex: {
        value: marketData.shIndex.value * (1 + (Math.random() - 0.5) * 0.01),
        change: marketData.shIndex.change + (Math.random() - 0.5) * 0.1
      },
      szIndex: {
        value: marketData.szIndex.value * (1 + (Math.random() - 0.5) * 0.01),
        change: marketData.szIndex.change + (Math.random() - 0.5) * 0.1
      },
      cybIndex: {
        value: marketData.cybIndex.value * (1 + (Math.random() - 0.5) * 0.01),
        change: marketData.cybIndex.change + (Math.random() - 0.5) * 0.1
      },
      hs300: {
        value: marketData.hs300.value * (1 + (Math.random() - 0.5) * 0.01),
        change: marketData.hs300.change + (Math.random() - 0.5) * 0.1
      }
    };
    
    // 限制涨跌幅在合理范围内
    Object.keys(updatedMarketData).forEach(key => {
      updatedMarketData[key].change = Math.max(-5, Math.min(5, updatedMarketData[key].change));
      updatedMarketData[key].change = parseFloat(updatedMarketData[key].change.toFixed(2));
      updatedMarketData[key].value = parseFloat(updatedMarketData[key].value.toFixed(2));
    });
    
    this.setData({ marketData: updatedMarketData });
  },

  /**
   * 更新时间显示
   */
  updateTime() {
    setInterval(() => {
      this.setData({
        updateTime: this.formatTime(new Date())
      });
    }, 60000); // 每分钟更新一次
    
    // 初始时间
    this.setData({
      updateTime: this.formatTime(new Date())
    });
  },

  /**
   * 格式化时间
   */
  formatTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 自定义导航栏事件处理
   */
  onTabSwitch(e) {
    const tab = e.detail ? e.detail.tab : e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  onAvatarTap() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  onMoreTap() {
    wx.showActionSheet({
      itemList: ['分享', '收藏', '设置'],
      success: (res) => {
        console.log(res.tapIndex);
      }
    });
  },

  onBrowseTap() {
    wx.navigateTo({
      url: '/pages/browse/history'
    });
  },

  /**
   * 期货分类切换
   */
  onFuturesCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ activeFuturesCategory: category });
    
    // 根据分类过滤热门期货
    if (category === '全部') {
      const hotFutures = generateFuturesProducts(6);
      this.setData({ hotFutures });
    } else {
      // 这里可以根据分类过滤，但模拟数据没有分类字段，暂时重新生成
      const hotFutures = generateFuturesProducts(6);
      this.setData({ hotFutures });
    }
  },

  /**
   * 时间范围切换
   */
  onTimeRangeChange(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ activeTimeRange: range });
    
    // 这里可以重新加载对应时间范围的图表数据
    wx.showToast({
      title: `切换到${range}视图`,
      icon: 'none'
    });
  },

  /**
   * 期货点击事件
   */
  onFutureTap(e) {
    const { symbol } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/futures-detail/futures-detail?symbol=${symbol}`
    });
  },

  /**
   * 查看更多期货
   */
  onMoreFutures() {
    wx.navigateTo({
      url: '/pages/futures/list'
    });
  },

  /**
   * 用户分享
   */
  onShareAppMessage() {
    return {
      title: '安粮期货投研智演实验室 - 数据中心',
      path: '/pages/data/data'
    };
  }
});