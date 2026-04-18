/**
 * 行情页面逻辑
 */

const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    currentCategory: 'all',
    marketList: [],
    topGainers: [],
    topLosers: []
  },

  onLoad() {
    this.loadMarketData();
  },

  onRefresh() {
    this.loadMarketData();
  },

  // 加载行情数据（模拟）
  loadMarketData() {
    util.showLoading('加载中');
    
    // 模拟数据
    setTimeout(() => {
      const allData = [
        { symbol: 'RB2405', name: '螺纹钢', price: '3688', change: 1.25, category: 'metal' },
        { symbol: 'IF2403', name: '沪深 300', price: '3456', change: -0.82, category: 'financial' },
        { symbol: 'AU2404', name: '黄金', price: '486.5', change: 0.56, category: 'metal' },
        { symbol: 'CU2404', name: '沪铜', price: '68520', change: -1.15, category: 'metal' },
        { symbol: 'SC2404', name: '原油', price: '612.8', change: 2.34, category: 'energy' },
        { symbol: 'NG2404', name: '天然气', price: '2.85', change: -3.21, category: 'energy' },
        { symbol: 'M2405', name: '豆粕', price: '3256', change: 0.45, category: 'agric' },
        { symbol: 'Y2405', name: '豆油', price: '7842', change: -0.67, category: 'agric' },
        { symbol: 'SR2405', name: '白糖', price: '6523', change: 1.12, category: 'agric' },
        { symbol: 'TF2403', name: '10 年国债', price: '102.5', change: 0.08, category: 'financial' }
      ];

      // 按涨跌排序
      const sorted = [...allData].sort((a, b) => b.change - a.change);
      const topGainers = sorted.slice(0, 5);
      const topLosers = sorted.slice(-5).reverse();

      this.setData({
        marketList: allData,
        topGainers,
        topLosers
      });

      util.hideLoading();
    }, 500);
  },

  // 切换分类
  switchCategory(e) {
    const category = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: category });
    
    // 实际应过滤数据，这里简化处理
    if (category === 'all') {
      this.loadMarketData();
    }
  },

  // 搜索
  search() {
    util.showError('搜索功能开发中');
  },

  // 查看详情
  goToDetail(e) {
    const item = e.currentTarget.dataset.item;
    util.showSuccess(`查看 ${item.symbol} 详情`);
    // TODO: 跳转到 K 线图页面
  },

  // 预警设置
  goToAlert() {
    util.showError('预警功能开发中');
  }
});
