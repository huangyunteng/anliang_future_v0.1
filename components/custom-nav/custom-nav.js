// components/custom-nav/custom-nav.js
const { THEME_CONFIG } = require('../../utils/config.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 当前选中的tab: 'focus' | 'recommend'
    currentTab: {
      type: String,
      value: 'focus'
    },
    // 用户头像URL
    avatarUrl: {
      type: String,
      value: ''
    },
    // 更多按钮图标URL
    moreIcon: {
      type: String,
      value: '/images/icons/more.png'
    },
    // 浏览按钮图标URL
    browseIcon: {
      type: String,
      value: '/images/icons/browse.png'
    },
    // 状态栏高度（单位px），由页面传入
    statusBarHeight: {
      type: Number,
      value: 20
    },
    // 导航栏内容高度（单位px）
    navigationHeight: {
      type: Number,
      value: 44
    },
    // 是否显示搜索栏（占位用）
    showSearchPlaceholder: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 主题配置
    theme: THEME_CONFIG
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 头像点击事件
     */
    onAvatarTap() {
      this.triggerEvent('avatartap');
    },

    /**
     * Tab切换事件
     */
    onTabTap(e) {
      const { tab } = e.currentTarget.dataset;
      if (tab === this.data.currentTab) {
        return; // 当前已选中，不重复触发
      }
      
      // 更新组件内部状态
      this.setData({
        currentTab: tab
      });
      
      // 触发外部事件
      this.triggerEvent('tabchange', { tab });
    },

    /**
     * 更多按钮点击事件
     */
    onMoreTap() {
      this.triggerEvent('moretap');
    },

    /**
     * 浏览按钮点击事件
     */
    onBrowseTap() {
      this.triggerEvent('browsetap');
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 组件挂载时，如果没有传入statusBarHeight，尝试获取系统信息
      if (!this.properties.statusBarHeight) {
        const systemInfo = wx.getSystemInfoSync();
        const { statusBarHeight, platform } = systemInfo;
        
        // 设置默认状态栏高度
        let defaultStatusBarHeight = statusBarHeight || 20;
        let defaultNavigationHeight = 44; // 默认导航栏内容高度
        
        // iOS和Android的胶囊按钮高度可能不同
        if (platform === 'ios') {
          defaultNavigationHeight = 44;
        } else if (platform === 'android') {
          defaultNavigationHeight = 48;
        }
        
        this.setData({
          statusBarHeight: defaultStatusBarHeight,
          navigationHeight: defaultNavigationHeight
        });
      }
    }
  }
});