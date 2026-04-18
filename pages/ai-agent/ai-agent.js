// pages/ai-agent/ai-agent.js
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
    
    // AI聊天相关
    quickQuestions: [
      '今日期货市场走势如何？',
      '黄金期货未来趋势分析',
      '如何控制期货交易风险？',
      '推荐适合新手的期货品种'
    ],
    messages: [],
    selectedModel: 'qianwen',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    this.loadChatHistory();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 系统TabBar会自动管理选中状态
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
   * 加载聊天历史
   */
  loadChatHistory() {
    // 从本地存储加载历史记录
    const history = wx.getStorageSync('ai_chat_history') || [];
    this.setData({ messages: history.slice(-10) }); // 只显示最近10条
  },

  /**
   * 保存聊天记录
   */
  saveChatHistory() {
    wx.setStorageSync('ai_chat_history', this.data.messages);
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
   * 快捷提问点击事件
   */
  onQuickQuestionTap(e) {
    const question = e.currentTarget.dataset.question;
    this.sendMessage(question);
  },

  /**
   * 开始对话按钮点击
   */
  onStartChatTap() {
    wx.navigateTo({
      url: '/pages/ai-chat/ai-chat'
    });
  },

  /**
   * 模型选择事件
   */
  onModelSelect(e) {
    const model = e.currentTarget.dataset.model;
    this.setData({ selectedModel: model });
    wx.showToast({
      title: `已切换为${model === 'qianwen' ? '千问' : '豆包'}模型`,
      icon: 'success'
    });
  },

  /**
   * 发送消息
   */
  sendMessage(content) {
    if (!content.trim() || this.data.loading) return;
    
    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content,
      time: this.formatTime(new Date())
    };
    
    this.setData({
      messages: [...this.data.messages, userMessage],
      loading: true
    });
    
    // 保存历史
    this.saveChatHistory();
    
    // 调用AI接口
    const { selectedModel } = this.data;
    const modelConfig = selectedModel === 'qianwen' 
      ? app.globalData.aiConfig.qianwen 
      : app.globalData.aiConfig.doubao;
    
    app.generateAIChatResponse(content, modelConfig, selectedModel)
      .then(response => {
        // 添加AI回复
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response,
          time: this.formatTime(new Date())
        };
        
        this.setData({
          messages: [...this.data.messages, aiMessage],
          loading: false
        });
        
        this.saveChatHistory();
      })
      .catch(error => {
        console.error('AI回复失败:', error);
        wx.showToast({
          title: 'AI回复失败，请重试',
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  /**
   * 格式化时间
   */
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * 用户分享
   */
  onShareAppMessage() {
    return {
      title: '安粮期货投研智演实验室',
      path: '/pages/ai-agent/ai-agent'
    };
  }
});