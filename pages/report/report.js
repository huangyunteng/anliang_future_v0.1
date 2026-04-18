// pages/report/report.js
const { getReports } = require('../../utils/mock-data.js');
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
    
    // 研报数据
    reports: [],
    loading: false,
    hasMore: true,
    pageIndex: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    this.loadReports();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时，可以更新数据
    // 系统TabBar会自动管理选中状态，无需手动设置
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({ pageIndex: 1 });
    this.loadReports(true).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.loadMoreReports();
    }
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
   * 加载研报数据
   */
  loadReports(isRefresh = false) {
    this.setData({ loading: true });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = getReports('latest', this.data.pageIndex, this.data.pageSize);
        const reportsList = result.list;
        const hasMoreData = result.hasMore;
        
        if (isRefresh) {
          this.setData({
            reports: reportsList,
            hasMore: hasMoreData
          });
        } else {
          this.setData({
            reports: this.data.reports.concat(reportsList),
            hasMore: hasMoreData
          });
        }
        
        this.setData({ loading: false });
        resolve();
      }, 800); // 模拟网络请求延迟
    });
  },

  /**
   * 加载更多研报
   */
  loadMoreReports() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ pageIndex: this.data.pageIndex + 1 });
    this.loadReports();
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
   * 研报点击事件
   */
  onReportTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/report-detail/report-detail?id=${id}`
    });
  },

  /**
   * 加载更多点击事件
   */
  onLoadMore() {
    this.loadMoreReports();
  }
});