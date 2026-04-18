// pages/search/search.js
const { generateReports, generateArticles, generateEvents } = require('../../utils/mock-data.js');
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
    
    // 搜索相关
    searchKeyword: '',
    searchResult: [],
    searchHistory: [],
    hotSearchTags: [
      '期货投资策略',
      '宏观经济分析',
      '黄金价格走势',
      '原油期货',
      '农产品期货',
      '风险管理',
      '量化交易',
      '期货市场'
    ],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('CODEBUDDY_DEBUG search onLoad - page loading started')
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    this.loadSearchHistory();
    console.log('CODEBUDDY_DEBUG search onLoad - statusBarHeight=', this.data.statusBarHeight)
    console.log('CODEBUDDY_DEBUG search onLoad - navigationHeight=', this.data.navigationHeight)
  },

  onShow() {
    console.log('CODEBUDDY_DEBUG search onShow - page displayed')
    console.log('CODEBUDDY_DEBUG search onShow - statusBarHeight=', this.data.statusBarHeight)
    console.log('CODEBUDDY_DEBUG search onShow - navigationHeight=', this.data.navigationHeight)
  },

  /**
   * 计算导航栏高度
   */
  calculateNavigationBarHeight() {
    const systemInfo = wx.getSystemInfoSync();
    console.log('CODEBUDDY_DEBUG search calculateNavigationBarHeight systemInfo.statusBarHeight=', systemInfo.statusBarHeight)
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navigationHeight: 44 // 标准导航栏高度
    });
    console.log('CODEBUDDY_DEBUG search calculateNavigationBarHeight statusBarHeight set to=', systemInfo.statusBarHeight)
    console.log('CODEBUDDY_DEBUG search calculateNavigationBarHeight navigationHeight set to=44')
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
   * 加载搜索历史
   */
  loadSearchHistory() {
    const history = wx.getStorageSync('search_history') || [];
    this.setData({ searchHistory: history });
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory(keyword) {
    if (!keyword.trim()) return;
    
    let history = this.data.searchHistory;
    // 移除重复项
    history = history.filter(item => item !== keyword);
    // 添加到开头
    history.unshift(keyword);
    // 保留最近10条
    history = history.slice(0, 10);
    
    this.setData({ searchHistory: history });
    wx.setStorageSync('search_history', history);
  },

  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  /**
   * 搜索确认事件
   */
  onSearchConfirm(e) {
    const keyword = e.detail.value || this.data.searchKeyword;
    if (!keyword.trim()) return;
    
    this.performSearch(keyword);
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      searchResult: []
    });
  },

  /**
   * 取消搜索
   */
  onCancelSearch() {
    wx.navigateBack();
  },

  /**
   * 热门搜索点击
   */
  onHotSearchTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.performSearch(keyword);
  },

  /**
   * 历史搜索点击
   */
  onHistorySearchTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.performSearch(keyword);
  },

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    if (!keyword.trim()) return;
    
    this.setData({ loading: true });
    
    // 保存搜索历史
    this.saveSearchHistory(keyword);
    
    // 模拟搜索延迟
    setTimeout(() => {
      // 生成模拟数据
      const reports = generateReports(5).map(item => ({
        ...item,
        type: 'report',
        summary: item.summary || '研报摘要'
      }));
      
      const articles = generateArticles(5).map(item => ({
        ...item,
        type: 'article',
        summary: item.summary || '文章摘要'
      }));
      
      const events = generateEvents(5).map(item => ({
        ...item,
        type: 'event',
        summary: item.description || '活动描述',
        author: item.organizer || '组织方'
      }));
      
      // 合并所有结果
      const allResults = [...reports, ...articles, ...events];
      
      // 简单关键词过滤（模拟）
      const filteredResults = allResults.filter(item => 
        item.title.includes(keyword) || 
        (item.summary && item.summary.includes(keyword)) ||
        (item.author && item.author.includes(keyword))
      );
      
      this.setData({
        searchResult: filteredResults,
        loading: false
      });
    }, 800);
  },

  /**
   * 清除搜索历史
   */
  onClearHistory() {
    wx.showModal({
      title: '提示',
      content: '确认清除所有搜索历史？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ searchHistory: [] });
          wx.removeStorageSync('search_history');
        }
      }
    });
  },

  /**
   * 搜索结果点击
   */
  onResultTap(e) {
    const { id, type } = e.currentTarget.dataset;
    
    switch (type) {
      case 'report':
        wx.navigateTo({
          url: `/pages/report-detail/report-detail?id=${id}`
        });
        break;
      case 'article':
        wx.navigateTo({
          url: `/pages/article-detail/article-detail?id=${id}`
        });
        break;
      case 'event':
        wx.navigateTo({
          url: `/pages/activity-detail/activity-detail?id=${id}`
        });
        break;
    }
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
  }
});