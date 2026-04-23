// pages/search/search.js
const { generateReports, generateArticles, generateEvents } = require('../../utils/mock-data.js');
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
    
    // 搜索相关（普通搜索模式）
    searchKeyword: '',
    searchResult: [],
    searchHistory: [],
    hotSearchTags: [
      '期货投资策略',
      '宏观经济分析',
      '黄金价格走势',
      '原油期货',
      '农产品期货',
      '风险管理',
      '量化交易',
      '期货市场'
    ],
    loading: false,
    
    // 智能体搜索模式
    isAgentSearch: false,
    searchType: '', // 'agent' or 'skill'
    agentName: '',
    skillName: '',
    searchQuery: '',
    thinkingSteps: [],
    searchProcess: [],
    finalAnswer: '',
    isLoading: false,
    loadingText: '智能体思考中...',
    newQuery: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('CODEBUDDY_DEBUG search onLoad - page loading started')
    this.calculateNavigationBarHeight();
    this.loadUserAvatar();
    this.loadSearchHistory();
    console.log('CODEBUDDY_DEBUG search onLoad - statusBarHeight=', this.data.statusBarHeight)
    console.log('CODEBUDDY_DEBUG search onLoad - navigationHeight=', this.data.navigationHeight)
    
    // 检查是否为智能体搜索模式
    if (options.query || options.type) {
      this.startAgentSearch(options);
    }
  },

  onShow() {
    console.log('CODEBUDDY_DEBUG search onShow - page displayed')
    console.log('CODEBUDDY_DEBUG search onShow - statusBarHeight=', this.data.statusBarHeight)
    console.log('CODEBUDDY_DEBUG search onShow - navigationHeight=', this.data.navigationHeight)
  },

  /**
   * 计算导航栏高度
   */
  calculateNavigationBarHeight() {
    const windowInfo = wx.getWindowInfo();
    console.log('CODEBUDDY_DEBUG search calculateNavigationBarHeight windowInfo.statusBarHeight=', windowInfo.statusBarHeight)
    this.setData({
      statusBarHeight: windowInfo.statusBarHeight,
      navigationHeight: 44 // 标准导航栏高度
    });
    console.log('CODEBUDDY_DEBUG search calculateNavigationBarHeight statusBarHeight set to=', windowInfo.statusBarHeight)
    console.log('CODEBUDDY_DEBUG search calculateNavigationBarHeight navigationHeight set to=44')
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
   * 加载搜索历史
   */
  loadSearchHistory() {
    const history = wx.getStorageSync('search_history') || [];
    this.setData({ searchHistory: history });
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory(keyword) {
    if (!keyword.trim()) return;
    
    let history = this.data.searchHistory;
    // 移除重复项
    history = history.filter(item => item !== keyword);
    // 添加到开头
    history.unshift(keyword);
    // 保留最近10条
    history = history.slice(0, 10);
    
    this.setData({ searchHistory: history });
    wx.setStorageSync('search_history', history);
  },

  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  /**
   * 搜索确认事件
   */
  onSearchConfirm(e) {
    const keyword = e.detail.value || this.data.searchKeyword;
    if (!keyword.trim()) return;
    
    this.performSearch(keyword);
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      searchResult: []
    });
  },

  /**
   * 取消搜索
   */
  onCancelSearch() {
    wx.navigateBack();
  },

  /**
   * 热门搜索点击
   */
  onHotSearchTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.performSearch(keyword);
  },

  /**
   * 历史搜索点击
   */
  onHistorySearchTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.performSearch(keyword);
  },

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    if (!keyword.trim()) return;
    
    this.setData({ loading: true });
    
    // 保存搜索历史
    this.saveSearchHistory(keyword);
    
    // 模拟搜索延迟
    setTimeout(() => {
      // 生成模拟数据
      const reports = generateReports(5).map(item => ({
        ...item,
        type: 'report',
        summary: item.summary || '研报摘要'
      }));
      
      const articles = generateArticles(5).map(item => ({
        ...item,
        type: 'article',
        summary: item.summary || '文章摘要'
      }));
      
      const events = generateEvents(5).map(item => ({
        ...item,
        type: 'event',
        summary: item.description || '活动描述',
        author: item.organizer || '组织方'
      }));
      
      // 合并所有结果
      const allResults = [...reports, ...articles, ...events];
      
      // 简单关键词过滤（模拟）
      const filteredResults = allResults.filter(item => 
        item.title.includes(keyword) || 
        (item.summary && item.summary.includes(keyword)) ||
        (item.author && item.author.includes(keyword))
      );
      
      this.setData({
        searchResult: filteredResults,
        loading: false
      });
    }, 800);
  },

  /**
   * 清除搜索历史
   */
  onClearHistory() {
    wx.showModal({
      title: '提示',
      content: '确认清除所有搜索历史？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ searchHistory: [] });
          wx.removeStorageSync('search_history');
        }
      }
    });
  },

  /**
   * 搜索结果点击
   */
  onResultTap(e) {
    const { id, type } = e.currentTarget.dataset;
    
    switch (type) {
      case 'report':
        wx.navigateTo({
          url: `/pages/report-detail/report-detail?id=${id}`
        });
        break;
      case 'article':
        wx.navigateTo({
          url: `/pages/article-detail/article-detail?id=${id}`
        });
        break;
      case 'event':
        wx.navigateTo({
          url: `/pages/activity-detail/activity-detail?id=${id}`
        });
        break;
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
   * 开始智能体搜索
   */
  startAgentSearch(options) {
    console.log('开始智能体搜索:', options);
    console.log('CODEBUDDY_DEBUG search startAgentSearch options=', options);

    const { query = '', type = '', id: _id = '', name = '' } = options;

    let searchType = type;
    let agentName = '';
    let skillName = '';

    if (type === 'agent') {
      agentName = decodeURIComponent(name);
    } else if (type === 'skill') {
      skillName = decodeURIComponent(name);
    }

    console.log('CODEBUDDY_DEBUG search startAgentSearch before setData');
    this.setData({
      isAgentSearch: true,
      searchType: searchType,
      agentName: agentName,
      skillName: skillName,
      searchQuery: decodeURIComponent(query || name || '分析请求'),
      isLoading: true,
      thinkingSteps: [],
      searchProcess: [],
      finalAnswer: '',
      newQuery: ''
    });
    console.log('CODEBUDDY_DEBUG search startAgentSearch after setData');
    console.log('CODEBUDDY_DEBUG search startAgentSearch isAgentSearch=', this.data.isAgentSearch);
    console.log('CODEBUDDY_DEBUG search startAgentSearch isLoading=', this.data.isLoading);

    // 开始调用真实智能体服务
    this.callBackendAPI();
  },

  /**
   * 调用后端API进行真实智能体分析
   */
  callBackendAPI() {
    const { searchQuery, searchType, agentName, skillName } = this.data;
    const app = getApp();

    console.log('CODEBUDDY_DEBUG search callBackendAPI - searchQuery=', searchQuery);
    console.log('CODEBUDDY_DEBUG search callBackendAPI - searchType=', searchType);
    console.log('CODEBUDDY_DEBUG search callBackendAPI - agentName=', agentName);
    console.log('CODEBUDDY_DEBUG search callBackendAPI - skillName=', skillName);
    console.log('CODEBUDDY_DEBUG search callBackendAPI - apiBaseUrl=', app.globalData.apiBaseUrl);
    
    // 更新思考步骤：显示正在连接服务器
    const thinkingSteps = [];
    thinkingSteps.push({
      content: `理解用户问题："${searchQuery}"，正在连接智能体服务器...`,
      time: this.formatTime(new Date())
    });
    
    let step2 = '';
    if (searchType === 'agent') {
      step2 = `调用${agentName}智能体，使用专业领域知识进行分析`;
    } else if (searchType === 'skill') {
      step2 = `使用${skillName}工具，执行相应的分析任务`;
    } else {
      step2 = '确定分析框架：市场分析 -> 数据收集 -> 风险评估 -> 投资建议';
    }
    thinkingSteps.push({
      content: step2,
      time: this.formatTime(new Date())
    });
    
    console.log('CODEBUDDY_DEBUG search callBackendAPI before setData thinkingSteps');
    this.setData({
      thinkingSteps: thinkingSteps,
      loadingText: '正在调用智能体服务...',
      searchProcess: []
    });
    console.log('CODEBUDDY_DEBUG search callBackendAPI after setData thinkingSteps, thinkingSteps length=', thinkingSteps.length);
    
    // 根据类型调用不同的API
    let apiUrl = '';
    let requestData = {};
    
    if (searchType === 'agent') {
      apiUrl = `/api/chat/${agentName}`;
      requestData = { question: searchQuery };
    } else if (searchType === 'skill') {
      apiUrl = `/api/skill/${skillName}`;
      requestData = {};
      // 根据不同的技能传递不同的参数
      if (skillName === '新闻聚合') {
        requestData = { keyword: searchQuery, limit: 5 };
      } else if (skillName === '数据提取') {
        requestData = { data_type: 'future' };
      } else if (skillName === '图表生成') {
        requestData = { chart_type: 'line' };
      } else if (skillName === '预测模型') {
        requestData = { period: 'medium' };
      } else if (skillName === '情绪分析') {
        requestData = { text: searchQuery };
      } else if (skillName === '回测引擎') {
        requestData = { strategy_rules: searchQuery };
      } else if (skillName === '风险管理') {
        requestData = { position: 100, volatility: 0.2 };
      } else if (skillName === '报告生成') {
        requestData = { report_type: 'market' };
      } else if (skillName === '计算器') {
        requestData = { expression: searchQuery };
      } else if (skillName === '当前时间') {
        requestData = {};
      }
    } else {
      apiUrl = '/api/chat';
      requestData = { question: searchQuery };
    }
    
    console.log('调用后端API:', apiUrl, requestData);
    console.log('CODEBUDDY_DEBUG search callBackendAPI - apiUrl=', apiUrl);
    console.log('CODEBUDDY_DEBUG search callBackendAPI - requestData=', requestData);
    
    // 更新搜索过程状态
    const searchProcess = [];
    searchProcess.push({
      type: 'web',
      query: '连接智能体服务器',
      status: '进行中',
      result: '正在建立连接...'
    });
    this.setData({ searchProcess });
    
    // 发送请求
    app.post(apiUrl, requestData)
      .then(response => {
        console.log('API响应:', response);
        console.log('CODEBUDDY_DEBUG search callBackendAPI API success - response=', response);

        // 更新搜索过程状态
        searchProcess[0].status = '完成';
        searchProcess[0].result = '智能体服务器连接成功';

        // 添加新的过程步骤
        searchProcess.push({
          type: 'data',
          query: '智能体分析中',
          status: '完成',
          result: '智能体已完成分析'
        });

        console.log('CODEBUDDY_DEBUG search callBackendAPI before setData searchProcess');
        this.setData({
          searchProcess,
          loadingText: '正在生成分析报告...'
        });
        console.log('CODEBUDDY_DEBUG search callBackendAPI after setData searchProcess, searchProcess length=', searchProcess.length);
        
        // 处理响应数据
        let finalAnswer = '';
        if (searchType === 'skill' && response.data) {
          const skillResponse = response.data;
          finalAnswer = `# ${skillName} 工具执行结果\n\n`;
          finalAnswer += `**查询参数:** ${JSON.stringify(skillResponse.params || {})}\n\n`;
          finalAnswer += `**结果:**\n${skillResponse.result || '无结果'}`;
        } else if (response.data && response.data.answer) {
          finalAnswer = response.data.answer;
        } else {
          finalAnswer = JSON.stringify(response, null, 2);
        }

        console.log('CODEBUDDY_DEBUG search callBackendAPI finalAnswer before clean=', finalAnswer);
        console.log('CODEBUDDY_DEBUG search callBackendAPI finalAnswer contains markdown=', finalAnswer.includes('##') || finalAnswer.includes('**'));
        console.log('CODEBUDDY_DEBUG search callBackendAPI finalAnswer length=', finalAnswer.length);

        // 更新最终答案
        console.log('CODEBUDDY_DEBUG search callBackendAPI before setData finalAnswer');
        this.setData({
          finalAnswer: finalAnswer,
          isLoading: false,
          loadingText: ''
        });
        console.log('CODEBUDDY_DEBUG search callBackendAPI after setData finalAnswer, finalAnswer length=', this.data.finalAnswer.length);
        console.log('CODEBUDDY_DEBUG search callBackendAPI after setData finalAnswer, isLoading=', this.data.isLoading);
      })
      .catch(error => {
        console.error('API调用失败:', error);
        console.error('CODEBUDDY_DEBUG search callBackendAPI API failed - error=', error);
        console.error('CODEBUDDY_DEBUG search callBackendAPI API failed - error.message=', error.message);
        console.error('CODEBUDDY_DEBUG search callBackendAPI API failed - error.code=', error.code);
        console.error('CODEBUDDY_DEBUG search callBackendAPI API failed - error.data=', error.data);

        // 更新搜索过程状态
        searchProcess[0].status = '失败';
        searchProcess[0].result = `连接失败: ${error.message || '未知错误'}`;

        this.setData({
          searchProcess,
          loadingText: '请求失败，使用模拟数据',
          isLoading: false
        });

        console.log('CODEBUDDY_DEBUG search callBackendAPI - will use simulated data after 1 second');

        // 失败时使用模拟数据
        setTimeout(() => {
          console.log('CODEBUDDY_DEBUG search callBackendAPI - calling simulateSearchProcess');
          this.simulateSearchProcess();
        }, 1000);
      });
  },

  /**
   * 模拟搜索过程
   */
  simulateSearchProcess() {
    console.log('CODEBUDDY_DEBUG search simulateSearchProcess start');
    const { searchQuery } = this.data;
    const searchProcess = [];

    console.log('CODEBUDDY_DEBUG search simulateSearchProcess before setData loadingText');
    this.setData({
      loadingText: '正在收集市场数据...'
    });
    console.log('CODEBUDDY_DEBUG search simulateSearchProcess after setData loadingText');
    
    // 模拟网页搜索
    setTimeout(() => {
      searchProcess.push({
        type: 'web',
        query: `搜索"${searchQuery}"最新市场资讯`,
        status: '完成',
        result: '找到相关资讯15篇，提取关键信息：...'
      });
      
      this.setData({
        searchProcess: searchProcess,
        loadingText: '正在分析历史数据...'
      });
      
      // 模拟数据查询
      setTimeout(() => {
        searchProcess.push({
          type: 'data',
          query: '查询相关期货品种历史价格数据',
          status: '完成',
          result: '获取近3年价格数据，计算收益率和波动率'
        });
        
        this.setData({
          searchProcess: searchProcess,
          loadingText: '正在调用分析模型...'
        });
        
        // 模拟技能调用
        setTimeout(() => {
          searchProcess.push({
            type: 'skill',
            query: '调用预测模型进行趋势分析',
            status: '完成',
            result: '模型预测未来一周上涨概率65%'
          });
          
          this.setData({
            searchProcess: searchProcess,
            loadingText: '正在生成分析报告...'
          });
          
          // 生成最终答案
          setTimeout(() => {
            this.generateFinalAnswer();
          }, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  },

  /**
   * 生成最终答案
   */
  generateFinalAnswer() {
    const { searchQuery, searchType, agentName, skillName } = this.data;

    console.log('CODEBUDDY_DEBUG search generateFinalAnswer - called with simulated data');
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer - searchQuery=', searchQuery);
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer - searchType=', searchType);
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer - agentName=', agentName);
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer - skillName=', skillName);
    
    let finalAnswer = `# ${searchQuery} - 分析报告\n\n`;
    
    if (searchType === 'agent') {
      finalAnswer += `**智能体：${agentName}**\n\n`;
    } else if (searchType === 'skill') {
      finalAnswer += `**工具：${skillName}**\n\n`;
    }
    
    finalAnswer += `## 分析结论\n`;
    finalAnswer += `基于当前市场数据和历史表现分析，得出以下结论：\n\n`;
    
    finalAnswer += `1. **市场趋势**：相关品种呈现震荡上行趋势，短期支撑位有效\n`;
    finalAnswer += `2. **风险水平**：市场波动率处于历史中位水平，风险可控\n`;
    finalAnswer += `3. **投资建议**：建议采取分批建仓策略，设置合理止损位\n`;
    finalAnswer += `4. **时间窗口**：建议关注未来1-2周的关键时间节点\n\n`;
    
    finalAnswer += `## 详细分析\n`;
    finalAnswer += `### 1. 基本面分析\n`;
    finalAnswer += `- 供需关系：当前供需基本平衡，库存水平正常\n`;
    finalAnswer += `- 宏观因素：货币政策保持稳定，对市场影响中性\n`;
    finalAnswer += `- 政策环境：行业政策无重大变化，预期稳定\n\n`;
    
    finalAnswer += `### 2. 技术面分析\n`;
    finalAnswer += `- 价格形态：呈现上升三角形整理，有望突破\n`;
    finalAnswer += `- 关键价位：支撑位参考XXX，阻力位参考YYY\n`;
    finalAnswer += `- 成交量：近期成交量温和放大，显示资金关注\n\n`;
    
    finalAnswer += `### 3. 风险提示\n`;
    finalAnswer += `- 市场风险：注意外部市场波动传导风险\n`;
    finalAnswer += `- 操作风险：严格执行止损纪律，控制仓位\n`;
    finalAnswer += `- 流动性风险：关注市场流动性变化\n\n`;
    
    finalAnswer += `## 免责声明\n`;
    finalAnswer += `以上分析仅供参考，不构成投资建议。投资有风险，决策需谨慎。`;

    console.log('CODEBUDDY_DEBUG search generateFinalAnswer finalAnswer=', finalAnswer);
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer finalAnswer contains markdown=', finalAnswer.includes('##') || finalAnswer.includes('**'));
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer finalAnswer length=', finalAnswer.length);

    console.log('CODEBUDDY_DEBUG search generateFinalAnswer before setData finalAnswer');
    this.setData({
      finalAnswer: finalAnswer,
      isLoading: false,
      loadingText: ''
    });
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer after setData finalAnswer, finalAnswer length=', this.data.finalAnswer.length);
    console.log('CODEBUDDY_DEBUG search generateFinalAnswer after setData finalAnswer, isLoading=', this.data.isLoading);
  },

  /**
   * 新查询输入事件
   */
  onNewInput(e) {
    this.setData({
      newQuery: e.detail.value
    });
  },

  /**
   * 新搜索事件
   */
  onNewSearch() {
    console.log('CODEBUDDY_DEBUG search onNewSearch start');
    const query = this.data.newQuery.trim();
    if (!query) {
      wx.showToast({
        title: '请输入问题',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    console.log('CODEBUDDY_DEBUG search onNewSearch before setData reset state');
    // 重置状态，开始新的搜索
    this.setData({
      searchQuery: query,
      thinkingSteps: [],
      searchProcess: [],
      finalAnswer: '',
      isLoading: true,
      newQuery: ''
    });
    console.log('CODEBUDDY_DEBUG search onNewSearch after setData reset state, isLoading=', this.data.isLoading);

    // 开始新的思考过程
    this.callBackendAPI();
  },

  /**
   * 格式化时间（HH:MM:SS）
   */
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
});