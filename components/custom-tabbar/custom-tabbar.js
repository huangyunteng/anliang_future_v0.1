// components/custom-tabbar/custom-tabbar.js
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
    // Tab配置数组，结构与app.json中的tabBar.list一致
    tabs: {
      type: Array,
      value: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "/images/tabs/home.png",
          selectedIconPath: "/images/tabs/home-active.png"
        },
        {
          pagePath: "pages/report/report",
          text: "研报",
          iconPath: "/images/tabs/report.png",
          selectedIconPath: "/images/tabs/report-active.png"
        },
        {
          pagePath: "pages/ai-agent/ai-agent",
          text: "AI智能体",
          iconPath: "/images/tabs/ai-center.png",
          selectedIconPath: "/images/tabs/ai-center-active.png"
        },
        {
          pagePath: "pages/activity/activity",
          text: "活动",
          iconPath: "/images/tabs/activity.png",
          selectedIconPath: "/images/tabs/activity-active.png"
        },
        {
          pagePath: "pages/data/data",
          text: "数据",
          iconPath: "/images/tabs/data.png",
          selectedIconPath: "/images/tabs/data-active.png"
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
    // 可以添加其他内部数据
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
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 组件挂载时，如果没有传入safeAreaBottom，尝试获取系统信息
      if (!this.properties.safeAreaBottom) {
        const systemInfo = wx.getSystemInfoSync();
        const { safeArea } = systemInfo;
        
        // 计算底部安全区域高度
        let safeAreaBottom = 0;
        if (safeArea && systemInfo.screenHeight) {
          safeAreaBottom = systemInfo.screenHeight - safeArea.bottom;
        }
        
        // iOS设备通常有安全区域，Android可能为0
        this.setData({
          safeAreaBottom: Math.max(safeAreaBottom, 0)
        });
      }
    }
  },

  /**
   * 页面生命周期
   */
  pageLifetimes: {
    show() {
      // 页面显示时，可以更新当前tab
      // 这里可以通过页面路径判断当前应该激活哪个tab
    }
  }
});