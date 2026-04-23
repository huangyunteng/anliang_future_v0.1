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

    // 聊天消息 - 新格式：包含role, content, agent_used, suggested_agents等
    messages: [],
    
    // 热点智能体 (快捷入口)
    hotAgents: [
      { id: 1, name: '任务规划', desc: '智能任务拆解', icon: '📋', color: '#4CAF50' },
      { id: 2, name: '信息搜索', desc: '全网实时资讯', icon: '🔍', color: '#2196F3' },
      { id: 3, name: '品种分析', desc: '深度基本面分析', icon: '📊', color: '#FF9800' },
      { id: 4, name: '策略规划', desc: '交易策略设计', icon: '🎯', color: '#9C27B0' },
      { id: 5, name: '策略回测', desc: '历史数据验证', icon: '📈', color: '#F44336' },
      { id: 6, name: '宏观分析', desc: '经济数据分析', icon: '🌍', color: '#00BCD4' },
      { id: 7, name: '风险评估', desc: '风险识别管理', icon: '⚠️', color: '#FF5722' },
      { id: 8, name: '资金管理', desc: '仓位资金规划', icon: '💰', color: '#607D8B' }
    ],
    
    // 热点工具skills (保留，可能在其他页面使用)
    hotSkills: [
      { id: 1, name: '新闻聚合', desc: '实时财经新闻', icon: '📰', color: '#3F51B5' },
      { id: 2, name: '数据提取', desc: '关键数据抓取', icon: '📥', color: '#009688' },
      { id: 3, name: '图表生成', desc: '可视化分析图', icon: '📊', color: '#E91E63' },
      { id: 4, name: '预测模型', desc: '趋势预测分析', icon: '🔮', color: '#673AB7' },
      { id: 5, name: '情绪分析', desc: '市场情绪监控', icon: '😊', color: '#FFC107' },
      { id: 6, name: '回测引擎', desc: '策略历史回测', icon: '⚙️', color: '#795548' },
      { id: 7, name: '风险管理', desc: '风险价值计算', icon: '🛡️', color: '#8BC34A' },
      { id: 8, name: '报告生成', desc: '专业研报生成', icon: '📄', color: '#FF9800' }
    ],
    
    // 最热搜索问题 (改为快捷提问)
    hotQuestions: [
      '螺纹钢期货近期走势如何？影响因素有哪些？',
      '如何利用AI智能体设计一个稳健的期货交易策略？'
    ],
    
    // 输入相关
    inputValue: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('CODEBUDDY_DEBUG ai-agent onLoad options=', options);
    console.log('CODEBUDDY_DEBUG ai-agent onLoad - step 1: calculateNavigationBarHeight start');
    this.calculateNavigationBarHeight();
    console.log('CODEBUDDY_DEBUG ai-agent onLoad - step 2: loadUserAvatar start');
    this.loadUserAvatar();
    console.log('CODEBUDDY_DEBUG ai-agent onLoad - step 3: loadChatHistory start');
    this.loadChatHistory();
    console.log('CODEBUDDY_DEBUG ai-agent onLoad complete, all steps finished');
    
    // 页面加载完成后滚动到底部
    setTimeout(() => {
      this.scrollToBottom();
    }, 300);
    
    // 检查是否有智能体参数
    if (options && options.agentName) {
      const agentName = decodeURIComponent(options.agentName);
      console.log('CODEBUDDY_DEBUG ai-agent onLoad - agentName parameter:', agentName);
      
      // 根据智能体类型预设问题
      const presetQuestions = {
        '任务规划': '请帮我规划一个关于螺纹钢期货的投研任务',
        '信息搜索': '搜索最新的铁矿石期货市场新闻',
        '品种分析': '请分析螺纹钢期货的基本面和技术面',
        '策略规划': '设计一个适合当前市场的期货交易策略',
        '策略回测': '回测一个基于移动平均线的趋势跟踪策略',
        '宏观分析': '分析当前宏观经济对期货市场的影响',
        '风险评估': '评估当前期货市场的整体风险水平',
        '资金管理': '为100万资金设计一个期货投资的资金管理方案'
      };
      
      const question = presetQuestions[agentName] || `请${agentName}帮我分析期货市场`;
      
      // 延迟设置输入框并发送，确保页面已渲染
      setTimeout(() => {
        this.setData({
          inputValue: question
        });
        
        // 自动发送
        setTimeout(() => {
          this.onSend();
        }, 500);
      }, 800);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('CODEBUDDY_DEBUG ai-agent onShow');
    // 如果有新消息，滚动到底部
    this.scrollToBottom();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('CODEBUDDY_DEBUG ai-agent onReady - page rendered');
  },

  /**
   * 计算导航栏高度（使用新的API）
   */
  calculateNavigationBarHeight() {
    console.log('CODEBUDDY_DEBUG calculateNavigationBarHeight start');
    try {
      const windowInfo = wx.getWindowInfo();
      console.log('CODEBUDDY_DEBUG calculateNavigationBarHeight windowInfo received');
      this.setData({
        statusBarHeight: windowInfo.statusBarHeight,
        navigationHeight: 44 // 标准导航栏高度
      });
      console.log('CODEBUDDY_DEBUG calculateNavigationBarHeight setData complete');
    } catch (err) {
      console.error('CODEBUDDY_DEBUG calculateNavigationBarHeight error:', err);
    }
  },

  /**
   * 加载用户头像
   */
  loadUserAvatar() {
    console.log('CODEBUDDY_DEBUG loadUserAvatar start');
    try {
      const userInfo = app.globalData.userInfo;
      console.log('CODEBUDDY_DEBUG loadUserAvatar userInfo=', userInfo);

      if (userInfo && userInfo.avatarUrl) {
        console.log('CODEBUDDY_DEBUG loadUserAvatar set avatar from userInfo=', userInfo.avatarUrl);
        this.setData({ avatarUrl: userInfo.avatarUrl });
      } else {
        const defaultAvatar = '/images/default-avatar.png';
        console.log('CODEBUDDY_DEBUG loadUserAvatar set default avatar=', defaultAvatar);
        this.setData({ avatarUrl: defaultAvatar });
      }
      console.log('CODEBUDDY_DEBUG loadUserAvatar success');
    } catch (err) {
      console.error('CODEBUDDY_DEBUG loadUserAvatar error:', err);
    }
  },

  /**
   * 加载聊天历史（兼容新旧格式）
   */
  loadChatHistory() {
    console.log('CODEBUDDY_DEBUG ai-agent loadChatHistory start');
    try {
      const history = wx.getStorageSync('ai_chat_history') || [];
      console.log('CODEBUDDY_DEBUG ai-agent loadChatHistory history length=', history.length);
      
      // 转换历史记录到新格式（如果旧格式是纯字符串数组）
      const formattedMessages = history.map(msg => {
        if (typeof msg === 'string') {
          // 旧格式：假设都是用户消息
          return { role: 'user', content: msg };
        } else if (msg.role && msg.content) {
          // 已经是新格式
          return msg;
        } else {
          // 未知格式，转换为用户消息
          return { role: 'user', content: String(msg) };
        }
      });
      
      const messagesToSet = formattedMessages.slice(-20); // 显示最近20条
      console.log('CODEBUDDY_DEBUG ai-agent loadChatHistory messagesToSet=', messagesToSet);
      this.setData({ messages: messagesToSet });
      console.log('CODEBUDDY_DEBUG ai-agent loadChatHistory setData complete');
    } catch (err) {
      console.error('CODEBUDDY_DEBUG ai-agent loadChatHistory error:', err);
    }
  },

  /**
   * 保存聊天记录
   */
  saveChatHistory() {
    try {
      wx.setStorageSync('ai_chat_history', this.data.messages);
      console.log('CODEBUDDY_DEBUG ai-agent saveChatHistory - saved', this.data.messages.length, 'messages');
    } catch (err) {
      console.error('CODEBUDDY_DEBUG ai-agent saveChatHistory error:', err);
    }
  },

  /**
   * 滚动到消息底部
   */
  scrollToBottom() {
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('#chat-messages')
        .boundingClientRect(rect => {
          if (rect) {
            wx.pageScrollTo({
              scrollTop: rect.bottom,
              duration: 300
            });
          }
        })
        .exec();
    }, 100);
  },

  /**
   * 快捷智能体点击事件
   */
  onQuickAgentTap(e) {
    const id = e.currentTarget.dataset.id;
    const agent = this.data.hotAgents.find(item => item.id == id);
    if (agent) {
      console.log('CODEBUDDY_DEBUG onQuickAgentTap - agent selected:', agent.name);
      
      // 根据智能体类型预设问题
      const presetQuestions = {
        '任务规划': '请帮我规划一个关于螺纹钢期货的投研任务',
        '信息搜索': '搜索最新的铁矿石期货市场新闻',
        '品种分析': '请分析螺纹钢期货的基本面和技术面',
        '策略规划': '设计一个适合当前市场的期货交易策略',
        '策略回测': '回测一个基于移动平均线的趋势跟踪策略',
        '宏观分析': '分析当前宏观经济对期货市场的影响',
        '风险评估': '评估当前期货市场的整体风险水平',
        '资金管理': '为100万资金设计一个期货投资的资金管理方案'
      };
      
      const question = presetQuestions[agent.name] || `请${agent.name}帮我分析期货市场`;
      
      // 设置输入框并发送
      this.setData({
        inputValue: question
      });
      
      // 延迟发送，让用户看到输入内容
      setTimeout(() => {
        this.onSend();
      }, 300);
    }
  },

  /**
   * 推荐智能体点击事件
   */
  onSuggestedAgentTap(e) {
    const agentName = e.currentTarget.dataset.agent;
    console.log('CODEBUDDY_DEBUG onSuggestedAgentTap - suggested agent:', agentName);
    
    // 使用推荐智能体发送预设问题
    const presetQuestions = {
      '任务规划': '请帮我规划一个期货投研任务',
      '信息搜索': '搜索最新的期货市场资讯',
      '品种分析': '请分析一个期货品种',
      '策略规划': '设计一个期货交易策略',
      '策略回测': '回测一个交易策略',
      '宏观分析': '分析宏观经济形势',
      '风险评估': '评估投资风险',
      '资金管理': '设计资金管理方案'
    };
    
    const question = presetQuestions[agentName] || `请${agentName}协助我进行期货分析`;
    this.setData({
      inputValue: question
    });
    
    setTimeout(() => {
      this.onSend();
    }, 300);
  },

  onAvatarTap() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  onMoreTap() {
    console.log('CODEBUDDY_DEBUG onMoreTap called, jump to agent-square');
    // 跳转到智能体/工具skills广场
    wx.navigateTo({
      url: '/pages/agent-square/agent-square'
    });
  },

  /**
   * 返回按钮点击事件
   */
  onBackTap() {
    console.log('CODEBUDDY_DEBUG onBackTap called');
    // 尝试返回到上一个页面
    const pages = getCurrentPages();
    console.log('CODEBUDDY_DEBUG current pages length=', pages.length);

    if (pages.length > 1) {
      // 如果有历史页面，直接返回
      wx.navigateBack({
        success: () => {
          console.log('CODEBUDDY_DEBUG navigateBack success');
        },
        fail: () => {
          console.log('CODEBUDDY_DEBUG navigateBack fail, switch to agent-square');
          // 如果返回失败，跳转到智能体广场
          wx.navigateTo({
            url: '/pages/agent-square/agent-square'
          });
        }
      });
    } else {
      // 如果没有历史页面（直接打开的），跳转到智能体广场
      console.log('CODEBUDDY_DEBUG no history, jump to agent-square');
      wx.navigateTo({
        url: '/pages/agent-square/agent-square'
      });
    }
  },

  onBrowseTap() {
    wx.navigateTo({
      url: '/pages/browse/history'
    });
  },

  /**
   * 智能体点击事件（兼容原跳转逻辑）
   */
  onAgentTap(e) {
    const id = e.currentTarget.dataset.id;
    const agent = this.data.hotAgents.find(item => item.id == id);
    if (agent) {
      wx.showToast({
        title: `启动 ${agent.name} 智能体`,
        icon: 'none',
        duration: 1500
      });
      // 跳转到搜索页面，携带智能体信息
      wx.navigateTo({
        url: `/pages/search/search?type=agent&id=${id}&name=${encodeURIComponent(agent.name)}`
      });
    }
  },

  /**
   * 工具skill点击事件（兼容原跳转逻辑）
   */
  onSkillTap(e) {
    const id = e.currentTarget.dataset.id;
    const skill = this.data.hotSkills.find(item => item.id == id);
    if (skill) {
      wx.showToast({
        title: `使用 ${skill.name} 工具`,
        icon: 'none',
        duration: 1500
      });
      // 跳转到搜索页面，携带工具信息
      wx.navigateTo({
        url: `/pages/search/search?type=skill&id=${id}&name=${encodeURIComponent(skill.name)}`
      });
    }
  },

  /**
   * 热门问题点击事件
   */
  onHotQuestionTap(e) {
    const question = e.currentTarget.dataset.question;
    console.log('CODEBUDDY_DEBUG onHotQuestionTap - question:', question);
    
    this.setData({
      inputValue: question
    });
    
    // 直接发送问题，不再跳转
    setTimeout(() => {
      this.onSend();
    }, 300);
  },

  /**
   * 输入框输入事件
   */
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  /**
   * 发送消息事件（原搜索事件改为发送消息）
   */
  onSend() {
    const query = this.data.inputValue.trim();
    if (!query) {
      wx.showToast({
        title: '请输入问题',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 清空输入框
    this.setData({
      inputValue: '',
      loading: true
    });
    
    // 添加用户消息
    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().getTime()
    };
    
    const messages = this.data.messages.concat([userMessage]);
    this.setData({ messages });
    this.saveChatHistory();
    
    // 滚动到底部
    this.scrollToBottom();
    
    // 调用AI接口
    this.sendMessageToAI(query);
  },

  /**
   * 搜索事件（保留兼容性，但不使用）
   */
  onSearch() {
    // 改为发送消息，不再跳转
    this.onSend();
  },

  /**
   * 调用AI接口发送消息
   */
  async sendMessageToAI(question) {
    console.log('CODEBUDDY_DEBUG ai-agent sendMessageToAI - question:', question);
    
    try {
      const response = await app.request({
        url: '/api/chat',
        method: 'POST',
        data: { question }
      });
      
      console.log('CODEBUDDY_DEBUG ai-agent sendMessageToAI - response:', response);
      
      if (response.code === 200) {
        // 添加AI回复消息
        const aiMessage = {
          role: 'assistant',
          content: response.data.answer,
          agent_used: response.data.agent_used,
          suggested_agents: response.data.suggested_agents || [],
          timestamp: new Date().getTime()
        };
        
        const messages = this.data.messages.concat([aiMessage]);
        this.setData({ 
          messages,
          loading: false
        });
        
        this.saveChatHistory();
        this.scrollToBottom();
      } else {
        throw new Error(response.message || 'AI处理失败');
      }
    } catch (error) {
      console.error('CODEBUDDY_DEBUG ai-agent sendMessageToAI error:', error);
      
      // 添加错误消息
      const errorMessage = {
        role: 'assistant',
        content: `抱歉，处理请求时出错：${error.message}`,
        agent_used: 'system_error',
        timestamp: new Date().getTime()
      };
      
      const messages = this.data.messages.concat([errorMessage]);
      this.setData({ 
        messages,
        loading: false
      });
      
      this.saveChatHistory();
      this.scrollToBottom();
      
      wx.showToast({
        title: '请求失败，请检查网络连接',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 语音输入事件
   */
  onVoiceTap() {
    wx.showToast({
      title: '语音功能开发中',
      icon: 'none',
      duration: 1500
    });
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