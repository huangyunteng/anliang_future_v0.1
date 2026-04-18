// pages/report-detail/report-detail.js
const { generateReports } = require('../../utils/mock-data.js');
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
    
    // 研报详情
    report: {
      title: '',
      author: '',
      date: '',
      pageCount: 0,
      rating: 0,
      coverImage: '',
      summary: '',
      content: '',
      recommendation: '',
      risk: '',
      isFavorited: false
    },
    
    // 页面参数
    reportId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    
    // 获取研报ID
    const { id } = options;
    this.setData({ reportId: id });
    
    // 加载研报详情
    this.loadReportDetail(id);
  },

  /**
   * 计算导航栏高度
   */
  calculateNavigationBarHeight() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
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
   * 加载研报详情
   */
  loadReportDetail(id) {
    wx.showLoading({ title: '加载中...' });
    
    // 模拟网络请求
    setTimeout(() => {
      // 生成模拟研报数据
      const reports = generateReports(1);
      if (reports.length > 0) {
        const report = reports[0];
        
        // 扩展详情内容
        const fullReport = {
          ...report,
          summary: '本报告对当前市场形势进行了深入分析，结合宏观经济数据和行业发展趋势，提出了具有前瞻性的投资建议。',
          content: '一、宏观经济环境分析\n2024年全球经济预计将保持温和增长，主要经济体货币政策分化明显...\n\n二、行业发展趋势\n随着技术进步和消费升级，新兴产业迎来快速发展机遇...\n\n三、投资策略建议\n建议关注高成长性板块，同时注意控制风险...',
          recommendation: '建议增持科技、消费板块，适度配置防御性资产。',
          risk: '市场波动风险、政策变化风险、行业竞争风险等。',
          isFavorited: false
        };
        
        this.setData({ report: fullReport });
      }
      
      wx.hideLoading();
    }, 800);
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
   * 下载PDF
   */
  onDownload() {
    wx.showLoading({ title: '下载中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '下载成功',
        icon: 'success'
      });
    }, 1500);
  },

  /**
   * 收藏/取消收藏
   */
  onFavorite() {
    const { report } = this.data;
    const newFavoriteStatus = !report.isFavorited;
    
    this.setData({
      'report.isFavorited': newFavoriteStatus
    });
    
    wx.showToast({
      title: newFavoriteStatus ? '收藏成功' : '已取消收藏',
      icon: 'success'
    });
  },

  /**
   * 分享
   */
  onShare() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  /**
   * 用户分享
   */
  onShareAppMessage() {
    const { report } = this.data;
    return {
      title: report.title,
      path: `/pages/report-detail/report-detail?id=${this.data.reportId}`
    };
  }
});