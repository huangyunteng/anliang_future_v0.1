// pages/report-list/report-list.js - 研报完整列表页面
const app = getApp();

Page({
  data: {
    // 分类名称
    categoryName: '期遇粮机',
    category: '期遇粮机',
    
    // 研报列表
    reportList: [],
    
    // 加载状态
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad(options) {
    if (options.category) {
      this.setData({
        category: options.category,
        categoryName: options.category
      });
      wx.setNavigationBarTitle({
        title: options.category
      });
    }
    
    this.loadReports();
  },

  // 加载研报数据
  loadReports() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    // 模拟从后端获取数据
    // 实际项目中替换为真实API调用
    setTimeout(() => {
      const allReports = this.generateReports(this.data.category);
      const start = (this.data.page - 1) * this.data.pageSize;
      const end = start + this.data.pageSize;
      const newReports = allReports.slice(start, end);
      
      const reportList = this.data.page === 1 
        ? newReports 
        : this.data.reportList.concat(newReports);
      
      const hasMore = end < allReports.length;
      
      this.setData({
        reportList,
        hasMore,
        loading: false
      });
    }, 500);
  },

  // 生成研报数据（模拟）
  generateReports(category) {
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
    
    // 生成更多数据用于测试
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(i / 4));
      const dateStr = date.toISOString().split('T')[0];
      
      titles.forEach((title, idx) => {
        if (reports.length < 50) {
          reports.push({
            id: `${category}-${i}-${idx}`,
            category: category,
            title: `${title}${dateStr.replace(/-/g, '')}`,
            author: '安粮期货研究所',
            views: Math.floor(Math.random() * 2000) + 100,
            date: dateStr
          });
        }
      });
    }
    
    return reports;
  },

  // 加载更多
  onLoadMore() {
    if (!this.data.hasMore || this.data.loading) return;
    
    this.setData({ page: this.data.page + 1 });
    this.loadReports();
  },

  // 研报点击
  onReportTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/report-detail/report-detail?id=${id}`
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  }
});
