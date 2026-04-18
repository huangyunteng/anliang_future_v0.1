// pages/activity-detail/activity-detail.js
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
    
    // 活动详情
    activity: {
      title: '',
      type: 'online',
      category: '',
      coverImage: '',
      date: '',
      time: '',
      location: '',
      participants: 0,
      organizer: '',
      description: '',
      agenda: [],
      speakers: [],
      isRegistered: false
    },
    
    // 页面参数
    activityId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    
    // 获取活动ID
    const { id } = options;
    this.setData({ activityId: id });
    
    // 加载活动详情
    this.loadActivityDetail(id);
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
   * 加载活动详情
   */
  loadActivityDetail(id) {
    wx.showLoading({ title: '加载中...' });
    
    // 模拟网络请求
    setTimeout(() => {
      // 生成模拟活动数据
      const events = generateEvents(1);
      if (events.length > 0) {
        const event = events[0];
        
        // 扩展详情内容
        const fullActivity = {
          ...event,
          date: event.date,
          time: '14:00-17:00',
          location: event.location || '线上直播',
          participants: event.participants || 150,
          organizer: '安粮期货投研部',
          description: '本次活动将深入探讨期货市场的投资机会和风险管理策略，邀请行业专家分享最新研究成果和实践经验。',
          agenda: [
            { time: '14:00-14:30', content: '开场致辞及市场展望' },
            { time: '14:30-15:30', content: '期货投资策略分享' },
            { time: '15:30-16:30', content: '互动问答环节' },
            { time: '16:30-17:00', content: '交流讨论' }
          ],
          speakers: [
            { id: 1, name: '王明', title: '首席经济学家', avatar: '/images/default-avatar.png' },
            { id: 2, name: '李华', title: '策略研究主管', avatar: '/images/default-avatar.png' }
          ],
          isRegistered: false
        };
        
        this.setData({ activity: fullActivity });
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
   * 报名/取消报名
   */
  onRegister() {
    const { activity } = this.data;
    const newRegisterStatus = !activity.isRegistered;
    
    this.setData({
      'activity.isRegistered': newRegisterStatus,
      'activity.participants': newRegisterStatus ? activity.participants + 1 : activity.participants - 1
    });
    
    wx.showToast({
      title: newRegisterStatus ? '报名成功' : '已取消报名',
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
    const { activity } = this.data;
    return {
      title: activity.title,
      path: `/pages/activity-detail/activity-detail?id=${this.data.activityId}`
    };
  }
});