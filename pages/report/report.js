// pages/report/report.js - 研报页面

Page({
  data: {
    // 自定义TabBar当前索引
    currentTabIndex: 1,

    // 一级选项卡索引: 0=7×24快讯, 1=研报, 2=研究团队
    level1Index: 1,
    
    // 二级选项卡数据（研报分类）
    level2Tabs: [
      { id: 'qiyuliangji', name: '期遇粮机' },
      { id: 'anliangguanshi', name: '安粮观市' },
      { id: 'redian', name: '热点' },
      { id: 'zhoubao', name: '周报' },
      { id: 'yuebao', name: '月报' },
      { id: 'nianbao', name: '年报' },
      { id: 'zhuanti', name: '专题' },
      { id: 'qiquan', name: '期权' }
    ],
    
    // 二级选项卡索引
    level2Index: 0,

    // 7×24快讯数据
    newsList: [
      { id: 1, time: '刚刚', title: '央行宣布降准0.5个百分点', summary: '释放长期资金约1万亿元，支持实体经济发展...' },
      { id: 2, time: '10分钟前', title: '玉米期货价格突破年内新高', summary: '受天气因素影响，玉米期价大幅上涨...' },
      { id: 3, time: '30分钟前', title: '大豆出口报告符合预期', summary: '美国农业部发布的大豆出口数据符合市场预期...' },
      { id: 4, time: '1小时前', title: '油脂板块集体走强', summary: '受棕榈油减产预期影响，油脂板块表现强劲...' },
      { id: 5, time: '2小时前', title: '生猪期货成交量创新高', summary: '养殖企业积极参与套保，成交量大幅增加...' }
    ],

    // 研报列表数据（按当前二级分类筛选）
    reportList: [],

    // 研究团队数据
    teamList: [
      { id: 1, name: '赵肖肖', avatar: '/images/team/赵肖肖.png', position: '安粮期货研究所负责人', licenseNo: 'F0303938', consultNo: 'Z0022015' },
      { id: 2, name: '李雨馨', avatar: '/images/team/李雨馨.png', position: '安粮期货研究所对冲策略中心负责人/所长助理', licenseNo: 'F3023505', consultNo: 'Z0013987' },
      { id: 3, name: '潘兆敏', avatar: '/images/team/潘兆敏.png', position: '安粮期货农产品研究员', licenseNo: 'F3064781', consultNo: 'Z0022343' },
      { id: 4, name: '朱书颖', avatar: '/images/team/朱书颖.png', position: '安粮期货油脂研究员', licenseNo: 'F03120547', consultNo: 'Z0022992' },
      { id: 5, name: '杨璐', avatar: '/images/team/杨璐.png', position: '安粮期货贵金属研究员', licenseNo: 'F3071017', consultNo: 'Z0021280' },
      { id: 6, name: '张莎', avatar: '/images/team/张莎.png', position: '安粮期货期权研究员', licenseNo: 'F03088817', consultNo: 'Z0019577' },
      { id: 7, name: '汪志伟', avatar: '/images/team/汪志伟.png', position: '安粮期货期权研究员', licenseNo: 'F03124800', consultNo: '' },
      { id: 8, name: '杨明明', avatar: '/images/team/杨明明.png', position: '安粮期货有色及新能源研究员', licenseNo: 'F03136091', consultNo: '' },
      { id: 9, name: '曾凡达', avatar: '/images/team/曾凡达.png', position: '安粮期货农产品研究员', licenseNo: 'F03151137', consultNo: '' },
      { id: 10, name: '郑钰岷', avatar: '/images/team/郑钰岷.png', position: '安粮期货化工研究员', licenseNo: 'F03146524', consultNo: '' },
      { id: 11, name: '郭芳', avatar: '/images/team/郭芳.png', position: '安粮期货黑色研究员', licenseNo: 'F03101430', consultNo: '' },
      { id: 12, name: '钟远', avatar: '/images/team/钟远.png', position: '安粮期货投资咨询部总经理', licenseNo: 'F0303681', consultNo: 'Z0011824' },
      { id: 13, name: '刘筱璇', avatar: '/images/team/刘筱璇.png', position: '安粮期货投资顾问', licenseNo: 'F03101434', consultNo: 'Z0021181' },
      { id: 14, name: '曹帅', avatar: '/images/team/曹帅.png', position: '安粮期货投资顾问', licenseNo: 'F03088816', consultNo: 'Z0019565' },
      { id: 15, name: '龚悦', avatar: '/images/team/龚悦.png', position: '安粮期货投资顾问', licenseNo: 'F3023504', consultNo: 'Z0014055' },
      { id: 16, name: '郑丽萍', avatar: '/images/team/郑丽萍.png', position: '安粮期货投资顾问', licenseNo: 'F03100199', consultNo: 'Z0021130' }
    ],

    // 所有研报数据（按分类存储）
    allReports: {}
  },

  onLoad(options) {
    // 如果从外部传入了一级/二级选项卡索引，使用传入值
    if (options.level1) {
      this.setData({ level1Index: parseInt(options.level1) });
    }
    if (options.level2) {
      this.setData({ level2Index: parseInt(options.level2) });
    }
    
    // 初始化研报数据
    this.initReportData();
    
    // 根据当前选项卡加载数据
    this.loadCurrentTabData();
  },

  onShow() {
    this.setData({ currentTabIndex: 1 });
  },

  // 初始化研报数据（模拟数据）
  initReportData() {
    const categories = ['期遇粮机', '安粮观市', '热点', '周报', '月报', '年报', '专题', '期权'];
    const allReports = {};
    
    categories.forEach(category => {
      allReports[category] = this.generateReportsByCategory(category);
    });
    
    this.setData({ allReports });
  },

  // 根据分类生成研报数据
  generateReportsByCategory(category) {
    const baseData = {
      '期遇粮机': ['重点机会品种分析', '产业链供需报告', '跨品种套利策略', '进口成本测算'],
      '安粮观市': ['周度市场综述', '月度行情展望', '政策解读分析', '期现结合策略'],
      '热点': ['突发事件点评', '行业动态追踪', '市场情绪分析', '热点事件解读'],
      '周报': ['本周市场回顾', '下周行情预判', '持仓变化分析', '交易机会梳理'],
      '月报': ['月度市场总结', '品种强弱排名', '资金流向追踪', '策略表现回顾'],
      '年报': ['年度市场展望', '品种年度报告', '行业深度研究', '策略年度报告'],
      '专题': ['深度专题研究', '产业链调研', '交割制度分析', '期权策略专题'],
      '期权': ['期权周报', '波动率分析', '套保策略研究', '期权定价模型']
    };

    const titles = baseData[category] || ['研究报告'];
    const reports = [];
    const today = new Date();
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      titles.forEach((title, idx) => {
        reports.push({
          id: `${category}-${i}-${idx}`,
          category: category,
          title: `${title}${dateStr.replace(/-/g, '')}`,
          author: '安粮期货研究所',
          views: Math.floor(Math.random() * 2000) + 100,
          date: dateStr
        });
      });
    }
    
    return reports;
  },

  // 根据当前选项卡加载数据
  loadCurrentTabData() {
    if (this.data.level1Index === 1) {
      this.loadReportList();
    }
  },

  // 加载研报列表
  loadReportList() {
    const category = this.data.level2Tabs[this.data.level2Index].name;
    const allReports = this.data.allReports;
    const categoryReports = allReports[category] || [];
    
    // 只取前5条
    const reportList = categoryReports.slice(0, 5);
    
    this.setData({ reportList });
  },

  // 一级选项卡切换
  onLevel1TabChange(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ level1Index: index });
    
    // 切换到研报时，重新加载列表
    if (index === 1) {
      this.loadReportList();
    }
  },

  // Swiper 滑动切换
  onSwiperChange(e) {
    const index = e.detail.current;
    this.setData({ level1Index: index });
    
    // 切换到研报时，重新加载列表
    if (index === 1) {
      this.loadReportList();
    }
  },

  // 二级选项卡切换
  onLevel2TabChange(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ level2Index: index });
    this.loadReportList();
  },

  // 研报点击
  onReportTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/report-detail/report-detail?id=${id}`
    });
  },

  // 快讯点击
  onNewsTap() {
    wx.showToast({
      title: '快讯详情开发中',
      icon: 'none'
    });
  },

  // 团队成员点击 - 跳转到成员详情页
  onTeamMemberTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/team-detail/team-detail?id=${id}`
    });
  },

  // 查看更多研报
  onViewMore() {
    const category = this.data.level2Tabs[this.data.level2Index].name;
    wx.navigateTo({
      url: `/pages/report-list/report-list?category=${category}`
    });
  },

  // 滚动到底部
  onScrollToLower() {
    // 可在此添加加载更多逻辑
  },

  // 处理自定义TabBar切换
  onTabChange(e) {
    const { index } = e.detail;
    
    const pages = [
      '/pages/index/index',
      '/pages/report/report',
      '/pages/ai-agent/ai-agent',
      '/pages/activity/activity',
      '/pages/data/data'
    ];
    
    if (index !== undefined && index >= 0 && index < pages.length) {
      wx.reLaunch({
        url: pages[index]
      });
    }
  }
});
