// components/custom-tabbar/custom-tabbar.js
// 科技感自定义TabBar组件 - 安粮期货投研智演实验室

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 当前选中的tab索引
    currentTab: {
      type: Number,
      value: 0
    },
    // Tab配置数组
    tabs: {
      type: Array,
      value: [
        {
          pagePath: "pages/index/index",
          text: "推荐"
        },
        {
          pagePath: "pages/report/report",
          text: "研报"
        },
        {
          pagePath: "pages/ai-agent/ai-agent",
          text: "智演智能体"
        },
        {
          pagePath: "pages/activity/activity",
          text: "活动"
        },
        {
          pagePath: "pages/data/data",
          text: "数据"
        }
      ]
    },
    // 底部安全区域高度（单位px）
    safeAreaBottom: {
      type: Number,
      value: 0
    },
    // 是否隐藏TabBar
    hidden: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 内部状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * Tab点击事件
     */
    onTabTap(e) {
      const { index } = e.currentTarget.dataset;
      const indexNum = parseInt(index);
      
      if (indexNum === this.data.currentTab) {
        return; // 当前已选中，不重复触发
      }
      
      // 更新组件内部状态
      this.setData({
        currentTab: indexNum
      });
      
      // 触发外部事件
      this.triggerEvent('tabchange', { 
        index: indexNum,
        pagePath: this.data.tabs[indexNum].pagePath
      });
    },

    /**
     * 切换到指定索引的Tab
     */
    switchTab(index) {
      if (index < 0 || index >= this.data.tabs.length) {
        return;
      }
      
      this.setData({
        currentTab: index
      });
    },

    /**
     * 显示/隐藏TabBar
     */
    setHidden(hidden) {
      this.setData({ hidden });
    },

    /**
     * 更新当前Tab（根据页面路径）
     */
    updateCurrentTab() {
      const pages = getCurrentPages();
      if (pages.length === 0) return;
      
      const currentPage = pages[pages.length - 1];
      const currentPath = '/' + currentPage.route;
      
      const tabIndex = this.data.tabs.findIndex(tab => tab.pagePath === currentPath);
      if (tabIndex !== -1 && tabIndex !== this.data.currentTab) {
        this.setData({ currentTab: tabIndex });
      }
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 组件挂载时，获取系统信息计算底部安全区域
      try {
        const windowInfo = wx.getWindowInfo();
        const safeArea = windowInfo.safeArea;
        
        let safeAreaBottom = 0;
        if (safeArea) {
          safeAreaBottom = windowInfo.screenHeight - safeArea.bottom;
        }
        
        this.setData({
          safeAreaBottom: Math.max(safeAreaBottom, 0)
        });
      } catch (e) {
        console.log('获取安全区域信息失败', e);
        this.setData({
          safeAreaBottom: 0
        });
      }
    }
  },

  /**
   * 页面生命周期
   */
  pageLifetimes: {
    show() {
      // 页面显示时更新当前tab
      this.updateCurrentTab();
    }
  }
});
