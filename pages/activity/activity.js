// pages/activity/activity.js
const { generateEvents } = require('../../utils/mock-data.js');
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
    
    // 活动筛选
    filterTabs: [
      { label: '全部', value: 'all' },
      { label: '线上活动', value: 'online' },
      { label: '线下活动', value: 'offline' },
      { label: '即将开始', value: 'upcoming' },
      { label: '热门活动', value: 'hot' }
    ],
    activeFilter: 'all',
    
    // 活动数据
    activities: [],
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
    this.loadActivities();
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
    this.setData({ pageIndex: 1 });
    this.loadActivities(true).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.loadMoreActivities();
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
   * 加载活动数据
   */
  loadActivities(isRefresh = false) {
    this.setData({ loading: true });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // 生成模拟数据
        const allActivities = generateEvents(this.data.pageSize * 2); // 生成足够数据
        
        // 根据筛选条件过滤
        let filteredActivities = this.filterActivities(allActivities, this.data.activeFilter);
        
        // 分页
        const startIndex = (this.data.pageIndex - 1) * this.data.pageSize;
        const endIndex = startIndex + this.data.pageSize;
        const pageActivities = filteredActivities.slice(startIndex, endIndex);
        
        if (isRefresh) {
          this.setData({
            activities: pageActivities,
            hasMore: pageActivities.length === this.data.pageSize
          });
        } else {
          this.setData({
            activities: this.data.activities.concat(pageActivities),
            hasMore: pageActivities.length === this.data.pageSize
          });
        }
        
        this.setData({ loading: false });
        resolve();
      }, 800); // 模拟网络请求延迟
    });
  },

  /**
   * 加载更多活动
   */
  loadMoreActivities() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ pageIndex: this.data.pageIndex + 1 });
    this.loadActivities();
  },

  /**
   * 根据筛选条件过滤活动
   */
  filterActivities(activities, filter) {
    const now = new Date();
    
    switch (filter) {
      case 'online':
        return activities.filter(item => item.type === 'online');
      case 'offline':
        return activities.filter(item => item.type === 'offline');
      case 'upcoming':
        return activities.filter(item => {
          const eventDate = new Date(item.date);
          return eventDate > now;
        });
      case 'hot':
        return activities.filter(item => item.participants > 100);
      default:
        return activities;
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
  },

  /**
   * 筛选条件变化
   */
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.value;
    this.setData({
      activeFilter: filter,
      pageIndex: 1,
      activities: []
    });
    this.loadActivities();
  },

  /**
   * 活动点击事件
   */
  onActivityTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?id=${id}`
    });
  },

  /**
   * 报名按钮点击事件
   */
  onRegisterTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showLoading({ title: '报名中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      });
      
      // 更新活动状态
      const activities = this.data.activities.map(item => {
        if (item.id === id) {
          return { ...item, isRegistered: true, participants: item.participants + 1 };
        }
        return item;
      });
      
      this.setData({ activities });
    }, 1000);
    
    // 阻止事件冒泡
    e.stopPropagation();
  },

  /**
   * 加载更多点击事件
   */
  onLoadMore() {
    this.loadMoreActivities();
  },

  /**
   * 用户分享
   */
  onShareAppMessage() {
    return {
      title: '安粮期货投研智演实验室 - 活动中心',
      path: '/pages/activity/activity'
    };
  }
});