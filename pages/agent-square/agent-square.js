// pages/agent-square/agent-square.js
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
    
    // 智能体分类
    agentCategories: [
      { label: '全部', value: 'all' },
      { label: '规划', value: 'planning' },
      { label: '搜索', value: 'search' },
      { label: '分析', value: 'analysis' },
      { label: '策略', value: 'strategy' },
      { label: '回测', value: 'backtest' },
      { label: '宏观', value: 'macro' },
      { label: '风险', value: 'risk' },
      { label: '资金', value: 'capital' }
    ],
    activeAgentCategory: 'all',
    
    // 工具skills分类
    skillCategories: [
      { label: '全部', value: 'all' },
      { label: '动量', value: 'momentum' },
      { label: '资金', value: 'capital' },
      { label: '策略', value: 'strategy' },
      { label: '宏观', value: 'macro' },
      { label: '周期', value: 'cycle' }
    ],
    activeSkillCategory: 'all',
    
    // 智能体列表（与后端智能体对应）
    agents: [
      {
        id: 1,
        name: '任务规划',
        category: 'planning',
        categoryLabel: '规划',
        description: '智能任务拆解与执行规划，协调多智能体协作',
        icon: '📋',
        color: '#4CAF50',
        status: 'online',
        usageCount: 1284,
        rating: 4.8,
        responseTime: 2.3,
        tags: ['任务拆解', '规划执行', '多智能体协作']
      },
      {
        id: 2,
        name: '信息搜索',
        category: 'search',
        categoryLabel: '搜索',
        description: '实时搜索金融市场资讯、新闻、公告和数据',
        icon: '🔍',
        color: '#2196F3',
        status: 'online',
        usageCount: 956,
        rating: 4.7,
        responseTime: 1.8,
        tags: ['实时搜索', '资讯聚合', '数据获取']
      },
      {
        id: 3,
        name: '品种分析',
        category: 'analysis',
        categoryLabel: '分析',
        description: '深度分析特定期货品种的基本面和技术面',
        icon: '📊',
        color: '#FF9800',
        status: 'online',
        usageCount: 742,
        rating: 4.9,
        responseTime: 3.5,
        tags: ['基本面分析', '技术分析', '量化分析']
      },
      {
        id: 4,
        name: '策略规划',
        category: 'strategy',
        categoryLabel: '策略',
        description: '设计期货交易策略，制定具体交易规则',
        icon: '🎯',
        color: '#9C27B0',
        status: 'online',
        usageCount: 621,
        rating: 4.6,
        responseTime: 4.2,
        tags: ['策略设计', '交易规则', '仓位管理']
      },
      {
        id: 5,
        name: '策略回测',
        category: 'backtest',
        categoryLabel: '回测',
        description: '对交易策略进行历史回测和绩效评估',
        icon: '📈',
        color: '#F44336',
        status: 'online',
        usageCount: 534,
        rating: 4.5,
        responseTime: 2.8,
        tags: ['历史回测', '绩效评估', '参数优化']
      },
      {
        id: 6,
        name: '宏观分析',
        category: 'macro',
        categoryLabel: '宏观',
        description: '分析国内外宏观经济形势和政策变化',
        icon: '🌍',
        color: '#00BCD4',
        status: 'online',
        usageCount: 892,
        rating: 4.8,
        responseTime: 1.5,
        tags: ['宏观经济', '政策分析', '经济指标']
      },
      {
        id: 7,
        name: '风险评估',
        category: 'risk',
        categoryLabel: '风险',
        description: '识别和评估期货交易中的各类风险',
        icon: '⚠️',
        color: '#FF5722',
        status: 'online',
        usageCount: 487,
        rating: 4.7,
        responseTime: 2.1,
        tags: ['风险识别', '风险评估', '风险控制']
      },
      {
        id: 8,
        name: '资金管理',
        category: 'capital',
        categoryLabel: '资金',
        description: '制定科学的资金分配和仓位管理方案',
        icon: '💰',
        color: '#607D8B',
        status: 'online',
        usageCount: 723,
        rating: 4.4,
        responseTime: 2.5,
        tags: ['资金管理', '仓位管理', '风险控制']
      }
    ],
    
    // 工具skills列表
    skills: [
      {
        id: 1,
        name: '动量指标计算器',
        category: 'momentum',
        categoryLabel: '动量',
        description: '计算各类动量技术指标，支持自定义参数',
        icon: '📊',
        color: '#3F51B5',
        type: 'free',
        features: ['RSI计算', 'MACD分析', '布林带指标', '自定义参数']
      },
      {
        id: 2,
        name: '资金流分析工具',
        category: 'capital',
        categoryLabel: '资金',
        description: '深度分析资金流向，可视化展示资金动向',
        icon: '📈',
        color: '#009688',
        type: 'professional',
        features: ['资金流向图', '主力追踪', '机构持仓', '历史对比']
      },
      {
        id: 3,
        name: '策略回测引擎',
        category: 'strategy',
        categoryLabel: '策略',
        description: '快速回测交易策略，支持多维度绩效评估',
        icon: '⚙️',
        color: '#E91E63',
        type: 'professional',
        features: ['历史回测', '参数优化', '绩效报告', '风险分析']
      },
      {
        id: 4,
        name: '宏观数据仪表盘',
        category: 'macro',
        categoryLabel: '宏观',
        description: '集成宏观经济数据，实时监控经济指标',
        icon: '📋',
        color: '#673AB7',
        type: 'free',
        features: ['CPI/PPI监控', '利率走势', '就业数据', '贸易数据']
      },
      {
        id: 5,
        name: '周期分析工具箱',
        category: 'cycle',
        categoryLabel: '周期',
        description: '专业周期分析工具，支持多周期叠加分析',
        icon: '🔄',
        color: '#FF9800',
        type: 'professional',
        features: ['周期识别', '周期叠加', '历史对比', '预测模型']
      },
      {
        id: 6,
        name: '风险管理工具包',
        category: 'strategy',
        categoryLabel: '策略',
        description: '全面风险管理工具，计算VaR等风险指标',
        icon: '🛡️',
        color: '#8BC34A',
        type: 'professional',
        features: ['VaR计算', '压力测试', '风险敞口', '止损优化']
      },
      {
        id: 7,
        name: '数据抓取工具',
        category: 'all',
        categoryLabel: '通用',
        description: '自动抓取网络金融数据，支持多种数据源',
        icon: '📥',
        color: '#795548',
        type: 'free',
        features: ['多数据源', '自动更新', '数据清洗', '格式转换']
      },
      {
        id: 8,
        name: '可视化图表生成',
        category: 'all',
        categoryLabel: '通用',
        description: '一键生成专业金融图表，支持多种图表类型',
        icon: '📊',
        color: '#FF5722',
        type: 'free',
        features: ['K线图', '热力图', '分布图', '趋势图']
      }
    ],
    
    // 过滤后的列表
    filteredAgents: [],
    filteredSkills: [],
    
    // 底部导航栏
    tabBarList: [
      {
        key: 'recommend',
        text: '推荐',
        icon: '/images/tabs/home.png',
        selectedIcon: '/images/tabs/home-active.png'
      },
      {
        key: 'report',
        text: '研报',
        icon: '/images/tabs/report.png',
        selectedIcon: '/images/tabs/report-active.png'
      },
      {
        key: 'ai-agent',
        text: '智演智能体',
        icon: '/images/tabs/ai.png',
        selectedIcon: '/images/tabs/ai-active.png'
      },
      {
        key: 'activity',
        text: '活动',
        icon: '/images/tabs/activity.png',
        selectedIcon: '/images/tabs/activity-active.png'
      },
      {
        key: 'data',
        text: '数据',
        icon: '/images/tabs/data.png',
        selectedIcon: '/images/tabs/data-active.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(_options) {
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    
    // 初始化过滤列表
    this.filterAgents();
    this.filterSkills();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 系统TabBar会自动管理选中状态
  },

  /**
   * 计算导航栏高度
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
   * 过滤智能体
   */
  filterAgents() {
    const { activeAgentCategory, agents } = this.data;
    let filteredAgents = agents;
    
    if (activeAgentCategory !== 'all') {
      filteredAgents = agents.filter(item => item.category === activeAgentCategory);
    }
    
    this.setData({ filteredAgents });
  },

  /**
   * 过滤工具skills
   */
  filterSkills() {
    const { activeSkillCategory, skills } = this.data;
    let filteredSkills = skills;
    
    if (activeSkillCategory !== 'all') {
      filteredSkills = skills.filter(item => 
        item.category === activeSkillCategory || item.category === 'all'
      );
    }
    
    this.setData({ filteredSkills });
  },

  /**
   * 智能体分类点击事件
   */
  onAgentCategoryTap(e) {
    const category = e.currentTarget.dataset.value;
    this.setData({
      activeAgentCategory: category
    }, () => {
      this.filterAgents();
    });
  },

  /**
   * 工具skills分类点击事件
   */
  onSkillCategoryTap(e) {
    const category = e.currentTarget.dataset.value;
    this.setData({
      activeSkillCategory: category
    }, () => {
      this.filterSkills();
    });
  },

  /**
   * 智能体卡片点击事件
   */
  onAgentCardTap(e) {
    const id = e.currentTarget.dataset.id;
    const agent = this.data.agents.find(item => item.id == id);
    if (agent) {
      wx.showToast({
        title: `启动 ${agent.name} 智能体`,
        icon: 'none',
        duration: 1500
      });
      
      // 跳转到AI聊天页面，携带智能体信息
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/ai-agent/ai-agent?agentName=${encodeURIComponent(agent.name)}`
        });
      }, 500);
    }
  },

  /**
   * 工具skill卡片点击事件
   */
  onSkillCardTap(e) {
    const id = e.currentTarget.dataset.id;
    const skill = this.data.skills.find(item => item.id == id);
    if (skill) {
      // 显示技能详情
      wx.showModal({
        title: skill.name,
        content: skill.description,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  /**
   * 试用工具按钮点击事件
   */
  onTrySkillTap(e) {
    e.stopPropagation(); // 阻止事件冒泡
    const id = e.currentTarget.dataset.id;
    const skill = this.data.skills.find(item => item.id == id);
    if (skill) {
      wx.showToast({
        title: `开始试用 ${skill.name}`,
        icon: 'none',
        duration: 1500
      });
      
      // 跳转到搜索页面，使用该工具
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/search/search?type=skill&id=${id}&name=${encodeURIComponent(skill.name)}`
        });
      }, 500);
    }
  },

  /**
   * 工具详情按钮点击事件
   */
  onSkillDetailTap(e) {
    e.stopPropagation(); // 阻止事件冒泡
    const id = e.currentTarget.dataset.id;
    const skill = this.data.skills.find(item => item.id == id);
    if (skill) {
      wx.showModal({
        title: `${skill.name} - 详细信息`,
        content: `${skill.description}\n\n类型：${skill.type === 'free' ? '免费工具' : '专业工具'}\n分类：${skill.categoryLabel}\n功能：${skill.features.join('、')}`,
        showCancel: false,
        confirmText: '关闭'
      });
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
   * 底部导航栏切换事件
   */
  onTabChange(e) {
    const key = e.currentTarget.dataset.key;
    const { currentTab } = this.data;
    
    if (currentTab === key) {
      return; // 已经是当前页面，不切换
    }
    
    this.setData({ currentTab: key });
    
    // 根据tab键值跳转到不同页面
    switch (key) {
      case 'recommend':
        wx.redirectTo({
          url: '/pages/index/index'
        });
        break;
      case 'report':
        wx.redirectTo({
          url: '/pages/report/report'
        });
        break;
      case 'ai-agent':
        wx.redirectTo({
          url: '/pages/ai-agent/ai-agent'
        });
        break;
      case 'activity':
        wx.redirectTo({
          url: '/pages/activity/activity'
        });
        break;
      case 'data':
        wx.redirectTo({
          url: '/pages/data/data'
        });
        break;
    }
  },

  /**
   * 用户分享
   */
  onShareAppMessage() {
    return {
      title: '安粮期货智能体广场',
      path: '/pages/agent-square/agent-square'
    };
  }
});