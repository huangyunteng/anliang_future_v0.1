// pages/index/index.js - 中金点睛首页
const app = getApp()

Page({
  data: {
    // Tab切换
    currentTab: 'recommend', // focus/recommend
    
    // 用户头像
    avatarUrl: '',
    
    // 顶部状态栏高度
    statusBarHeight: 0,
    navigationHeight: 0,

    // scroll-view 顶部内边距（避免被固定导航栏遮挡）
    scrollPaddingTop: 0,
    
    // Banner数据
    banners: [
      {
        id: 1,
        imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
        title: '2024年宏观经济展望',
        subtitle: '把握投资机遇，洞见未来趋势'
      },
      {
        id: 2,
        imageUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
        title: '金融科技深度报告',
        subtitle: '数字化转型引领行业变革'
      },
      {
        id: 3,
        imageUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
        title: '碳中和投资策略',
        subtitle: '绿色金融时代的投资机会'
      }
    ],
    currentBannerIndex: 0,

    // 主题专栏 swiper 索引
    currentThemeIndex: 0,

    // 中金推荐 swiper 索引
    currentReportIndex: 0,

    // 活动日历 swiper 索引
    currentEventIndex: 0,

    // 特色活动 swiper 索引
    currentFeaturedEventIndex: 0,

    // 主题专栏数据
    themeColumns: [
      {
        id: 1,
        imageUrl: 'https://images.pexels.com/photos/53621/lady-reading-book-large.jpg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
        title: '宏观研究',
        subtitle: '深度解析经济形势'
      },
      {
        id: 2,
        imageUrl: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
        title: '行业分析',
        subtitle: '洞察产业投资机会'
      },
      {
        id: 3,
        imageUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
        title: '策略报告',
        subtitle: '投资组合优化建议'
      },
      {
        id: 4,
        imageUrl: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
        title: '金融科技',
        subtitle: '数字化金融创新'
      },
      {
        id: 5,
        imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
        title: '大宗商品',
        subtitle: '期货市场分析'
      }
    ],
    
    // 大家都在问
    hotQuestions: [
      {
        id: 1,
        title: '如何看待当前A股市场的结构性机会？',
        answer: '当前A股市场呈现出明显的结构性特征，主要体现在新能源、半导体、医药等成长板块的投资机会较为突出...',
        isExpanded: false
      },
      {
        id: 2,
        title: '美联储加息周期对全球资产配置的影响？',
        answer: '美联储进入加息周期对全球资产配置产生深远影响，建议关注美元资产配置和利率敏感型资产的调整...',
        isExpanded: false
      },
      {
        id: 3,
        title: '如何把握消费复苏带来的投资机会？',
        answer: '消费复苏将成为2024年的重要投资主线，重点关注高端消费、线上消费和新兴消费品牌的投资机会...',
        isExpanded: false
      }
    ],
    
    // 文章精选分类标签
    articleCategories: ['宏观研究', '策略分析', '行业深度', '金融科技', '海外市场'],
    selectedCategoryIndex: 0,
    
    // 文章列表
    articles: [
      {
        id: 1,
        title: '2024年一季度宏观经济形势分析与展望',
        summary: '本文对2024年一季度宏观经济形势进行深入分析，结合国内外经济数据，展望未来发展趋势...',
        author: '王明',
        time: '3小时前',
        readCount: 3245,
        commentCount: 89,
        category: '宏观研究'
      },
      {
        id: 2,
        title: '人工智能技术在金融领域的应用与前景',
        summary: '随着人工智能技术的快速发展，其在金融风控、智能投顾、量化交易等领域的应用日益广泛...',
        author: '李华',
        time: '5小时前',
        readCount: 4567,
        commentCount: 156,
        category: '金融科技'
      },
      {
        id: 3,
        title: '新能源产业链投资价值深度挖掘',
        summary: '从上游原材料到下游应用，新能源产业链各环节存在哪些投资机会？本文为你详细解读...',
        author: '张伟',
        time: '昨天',
        readCount: 7890,
        commentCount: 234,
        category: '行业深度'
      }
    ],
    
    // 中金推荐研报
    recommendedReports: [
      {
        id: 1,
        title: '银行业：数字化转型下的新机遇',
        author: '中金研究部',
        date: '2024-02-15',
        pageCount: 45,
        rating: 4.8,
        coverImage: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        tags: ['银行业', '金融科技', '数字化转型']
      },
      {
        id: 2,
        title: '医药行业：创新药投资逻辑分析',
        author: '中金医药团队',
        date: '2024-02-14',
        pageCount: 38,
        rating: 4.9,
        coverImage: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        tags: ['医药', '创新药', '投资策略']
      },
      {
        id: 3,
        title: '房地产：市场调整期的机遇与挑战',
        author: '中金地产研究',
        date: '2024-02-13',
        pageCount: 52,
        rating: 4.7,
        coverImage: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        tags: ['房地产', '市场分析', '投资研究']
      }
    ],
    
    // 活动日历
    calendarDates: [
      { id: 1, date: '02/15', day: '周四', hasEvent: true },
      { id: 2, date: '02/16', day: '周五', hasEvent: true },
      { id: 3, date: '02/17', day: '周六', hasEvent: false },
      { id: 4, date: '02/18', day: '周日', hasEvent: true },
      { id: 5, date: '02/19', day: '周一', hasEvent: true },
      { id: 6, date: '02/20', day: '周二', hasEvent: true },
      { id: 7, date: '02/21', day: '周三', hasEvent: false }
    ],
    selectedCalendarDateIndex: 0,
    events: [
      { id: 1, date: '02/15', title: '中金投资策略会', time: '14:00', location: '北京' },
      { id: 2, date: '02/16', title: '金融科技论坛', time: '09:30', location: '上海' },
      { id: 3, date: '02/18', title: '宏观经济峰会', time: '10:00', location: '深圳' }
    ],
    
    // 特色活动
    featuredEvents: [
      {
        id: 1,
        title: '2024年全球投资峰会',
        date: '2024-03-08',
        location: '北京国家会议中心',
        imageUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
      },
      {
        id: 2,
        title: '金融数字化转型研讨会',
        date: '2024-03-15',
        location: '上海金融中心',
        imageUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
      }
    ],
    
    // 研究团队
    researchTeam: [
      {
        id: 1,
        name: '王明',
        title: '首席经济学家',
        avatar: '/images/avatar-user.png',
        expertise: ['宏观研究', '政策分析']
      },
      {
        id: 2,
        name: '李华',
        title: '策略研究主管',
        avatar: '/images/avatar-user.png',
        expertise: ['投资策略', '资产配置']
      },
      {
        id: 3,
        name: '张伟',
        title: '行业研究总监',
        avatar: '/images/avatar-user.png',
        expertise: ['新能源', '制造业']
      }
    ],
    
    // 出版书籍
    publishedBooks: [
      {
        id: 1,
        title: '中国资本市场30年',
        author: '中金研究部',
        coverImage: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=200&h=280&fit=crop',
        description: '全面解读中国资本市场发展历程'
      },
      {
        id: 2,
        title: '金融科技革命',
        author: '中金科技团队',
        coverImage: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=200&h=280&fit=crop',
        description: '数字化时代的金融创新'
      }
    ],
    
    // 页面状态
    loading: false,
    refreshLoading: false
  },

  onLoad() {
    console.log('CODEBUDDY_DEBUG index onLoad - page started')
    console.log('CODEBUDDY_DEBUG index onLoad - checking search bar visibility')
    console.log('CODEBUDDY_DEBUG index onLoad - checking scrollPaddingTop initial value=', this.data.scrollPaddingTop)

    this.calculateNavigationBarHeight()

    console.log('CODEBUDDY_DEBUG index onLoad - after calculateNavigationBarHeight, scrollPaddingTop=', this.data.scrollPaddingTop)
    console.log('CODEBUDDY_DEBUG index onLoad - search bar should be visible with padding-top=', this.data.scrollPaddingTop, 'px')
    console.log('CODEBUDDY_DEBUG index onLoad - statusBarHeight=', this.data.statusBarHeight, 'px')
    console.log('CODEBUDDY_DEBUG index onLoad - navigationHeight=', this.data.navigationHeight, 'px')

    // 验证所有外部图片URL是否正常
    const externalImages = [
      ...this.data.banners.map(b => b.imageUrl),
      ...this.data.recommendedReports.map(r => r.coverImage),
      ...this.data.featuredEvents.map(e => e.imageUrl),
      ...this.data.researchTeam.map(t => t.avatar),
      ...this.data.publishedBooks.map(b => b.coverImage)
    ]
    console.log('CODEBUDDY_DEBUG index onLoad externalImages count=', externalImages.length)

    console.log('中金点睛首页加载')

    // 设置用户头像
    const app = getApp()
    const userInfo = app.globalData.userInfo
    if (userInfo && userInfo.avatarUrl) {
      this.setData({ avatarUrl: userInfo.avatarUrl })
      console.log('CODEBUDDY_DEBUG index onLoad using user avatarUrl=', userInfo.avatarUrl)
    } else {
      // 默认头像 - 使用存在的图片
      this.setData({ avatarUrl: '/images/avatar-user.png' })
      console.log('CODEBUDDY_DEBUG index onLoad using default avatar avatar-user.png')
    }

    console.log('CODEBUDDY_DEBUG index onLoad - complete, search bar should now be visible')
  },

  onShow() {
    console.log('CODEBUDDY_DEBUG index onShow currentTab=', this.data.currentTab)
    this.setData({
      currentTab: 'recommend',
      selectedCalendarDateIndex: 0
    })
  },

  onPullDownRefresh() {
    // 模拟下拉刷新
    wx.showLoading({ title: '刷新中...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      app.showToast('刷新成功')
    }, 1000)
  },

  // 计算导航栏高度（使用新的API）
  calculateNavigationBarHeight() {
    const windowInfo = wx.getWindowInfo()
    const navHeight = windowInfo.statusBarHeight + 44
    console.log('CODEBUDDY_DEBUG index calculateNavigationBarHeight statusBarHeight=', windowInfo.statusBarHeight)
    console.log('CODEBUDDY_DEBUG index calculateNavigationBarHeight totalNavHeight=', navHeight)
    this.setData({
      statusBarHeight: windowInfo.statusBarHeight,
      navigationHeight: 44, // 标准导航栏高度
      scrollPaddingTop: navHeight + 5 // 导航栏高度 + 缩小额外间距
    })
    console.log('CODEBUDDY_DEBUG index calculateNavigationBarHeight scrollPaddingTop set to', navHeight + 10)
  },

  // Tab切换事件（支持自定义导航栏组件事件）
  onTabSwitch(e) {
    const tab = e.detail ? e.detail.tab : e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  // Banner切换事件
  onBannerChange(e) {
    console.log('CODEBUDDY_DEBUG index onBannerChange current=', e.detail.current, 'total=', this.data.banners.length)
    this.setData({
      currentBannerIndex: e.detail.current
    })
  },

  // 主题专栏切换事件
  onThemeChange(e) {
    console.log('CODEBUDDY_DEBUG index onThemeChange current=', e.detail.current, 'total=', this.data.themeColumns.length)
    this.setData({
      currentThemeIndex: e.detail.current
    })
  },

  // 中金推荐切换事件
  onReportChange(e) {
    console.log('CODEBUDDY_DEBUG index onReportChange current=', e.detail.current, 'total=', this.data.recommendedReports.length)
    this.setData({
      currentReportIndex: e.detail.current
    })
  },

  // 活动日历切换事件
  onEventChange(e) {
    console.log('CODEBUDDY_DEBUG index onEventChange current=', e.detail.current, 'total=', this.data.events.length)
    this.setData({
      currentEventIndex: e.detail.current
    })
  },

  // 特色活动切换事件
  onFeaturedEventChange(e) {
    console.log('CODEBUDDY_DEBUG index onFeaturedEventChange current=', e.detail.current, 'total=', this.data.featuredEvents.length)
    this.setData({
      currentFeaturedEventIndex: e.detail.current
    })
  },

  // 搜索栏点击事件
  onSearchTap() {
    console.log('CODEBUDDY_DEBUG index onSearchTap triggered')
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  // 主题专栏点击事件
  onThemeColumnTap(e) {
    const id = e.currentTarget.dataset.id
    const column = this.data.themeColumns.find(item => item.id === id)
    if (column) {
      wx.showToast({
        title: `进入${column.title}`,
        icon: 'none'
      })
    }
  },

  // Banner点击事件
  onBannerTap(e) {
    const index = e.currentTarget.dataset.index
    const banner = this.data.banners[index]
    wx.showModal({
      title: banner.title,
      content: banner.subtitle,
      showCancel: false
    })
  },

  // 搜索事件
  onSearchTap() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  // 大家都在问展开/收起
  onQuestionToggle(e) {
    const index = e.currentTarget.dataset.index
    const questions = this.data.hotQuestions.map((item, idx) => {
      if (idx === index) {
        return { ...item, isExpanded: !item.isExpanded }
      }
      return item
    })
    this.setData({ hotQuestions: questions })
  },

  // 文章分类切换
  onCategoryTabSwitch(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedCategoryIndex: index })
  },

  // 文章点击
  onArticleTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/article/detail?id=${id}`
    })
  },

  // 研报点击
  onReportTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/report/detail?id=${id}`
    })
  },

  // 日历日期切换
  onCalendarDateSwitch(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedCalendarDateIndex: index })
  },

  // 活动点击
  onEventTap(e) {
    const id = e.currentTarget.dataset.id
    const event = this.data.events.find(item => item.id === id)
    if (event) {
      wx.showModal({
        title: event.title,
        content: `时间：${event.time}\n地点：${event.location}`,
        showCancel: false
      })
    }
  },

  // 分析师点击
  onAnalystTap(e) {
    const id = e.currentTarget.dataset.id
    const analyst = this.data.researchTeam.find(item => item.id === id)
    if (analyst) {
      wx.showModal({
        title: analyst.name,
        content: `职位：${analyst.title}\n研究领域：${analyst.expertise.join('、')}`,
        showCancel: false
      })
    }
  },

  // 书籍点击
  onBookTap(e) {
    const id = e.currentTarget.dataset.id
    const book = this.data.publishedBooks.find(item => item.id === id)
    if (book) {
      wx.showModal({
        title: book.title,
        content: `作者：${book.author}\n简介：${book.description}`,
        showCancel: false
      })
    }
  },

  // 查看更多文章
  onMoreArticles() {
    wx.navigateTo({
      url: '/pages/article/list'
    })
  },

  // 查看更多研报
  onMoreReports() {
    wx.switchTab({
      url: '/pages/report/report'
    })
  },

  // 查看更多活动
  onMoreEvents() {
    wx.navigateTo({
      url: '/pages/event/list'
    })
  },

  // 查看全部分析师
  onMoreAnalysts() {
    wx.navigateTo({
      url: '/pages/analyst/list'
    })
  },

  onPageScroll(_e) {
    // 处理滚动事件，可以用于控制某些元素的显示/隐藏
  },

  // 自定义导航栏事件
  onAvatarTap() {
    // 处理头像点击，跳转到个人中心
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  onMoreTap() {
    // 处理更多按钮点击，显示菜单
    wx.showActionSheet({
      itemList: ['分享', '收藏', '设置'],
      success: (res) => {
        console.log(res.tapIndex);
      }
    });
  },

  onBrowseTap() {
    // 处理浏览按钮点击，跳转到浏览历史
    wx.navigateTo({
      url: '/pages/browse/history'
    });
  }
})