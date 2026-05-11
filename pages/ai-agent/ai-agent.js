// pages/ai-agent/ai-agent.js
const app = getApp();

Page({
  data: {
    currentTab: 'recommend',
    statusBarHeight: 20,
    navigationHeight: 44,
    avatarUrl: '',
    
    // 自定义TabBar当前索引
    currentTabIndex: 2,

    // 聊天消息
    messages: [],
    
    // 历史对话信息
    lastTopic: '新对话',
    lastTime: '',
    isHistoryExpanded: false,
    historyList: [],
    allHistoryTopics: [],
    
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

    // 输入相关
    inputValue: '',
    loading: false
  },

  onLoad(options) {
    // 异步初始化
    setTimeout(() => {
      this.calculateNavigationBarHeight();
      this.loadUserAvatar();
      this.loadChatHistory();
    }, 100);
    
    // 页面加载完成后滚动到底部
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
    
    // 检查是否有智能体参数
    if (options && options.agentName) {
      const agentName = decodeURIComponent(options.agentName);
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
      
      setTimeout(() => {
        this.setData({ inputValue: question });
        setTimeout(() => {
          this.onSend();
        }, 500);
      }, 1000);
    }
  },

  onShow() {
    this.setData({ currentTabIndex: 2 });
    this.scrollToBottom();
  },

  onReady() {
    // 页面渲染完成
  },

  calculateNavigationBarHeight() {
    try {
      const windowInfo = wx.getWindowInfo();
      this.setData({
        statusBarHeight: windowInfo.statusBarHeight,
        navigationHeight: 44
      });
    } catch (err) {
      console.error('计算导航栏高度失败:', err);
    }
  },

  loadUserAvatar() {
    try {
      const userInfo = app.globalData.userInfo;
      if (userInfo && userInfo.avatarUrl) {
        this.setData({ avatarUrl: userInfo.avatarUrl });
      } else {
        this.setData({ avatarUrl: '/images/default-avatar.png' });
      }
    } catch (err) {
      this.setData({ avatarUrl: '/images/default-avatar.png' });
    }
  },

  loadChatHistory() {
    try {
      const history = wx.getStorageSync('ai_chat_history') || [];
      
      const formattedMessages = history.map(msg => {
        if (typeof msg === 'string') {
          return { role: 'user', content: msg };
        } else if (msg.role && msg.content) {
          return msg;
        } else {
          return { role: 'user', content: String(msg) };
        }
      });
      
      // 只构建历史列表，不加载消息到对话区域（默认显示新对话）
      // 获取最近一条用户消息作为历史头部显示
      let lastTopic = '新对话';
      let lastTime = '';
      if (formattedMessages.length > 0) {
        const lastUserMsg = [...formattedMessages].reverse().find(msg => msg.role === 'user');
        if (lastUserMsg) {
          lastTopic = lastUserMsg.content.substring(0, 15) + (lastUserMsg.content.length > 15 ? '...' : '');
          if (lastUserMsg.timestamp) {
            const date = new Date(lastUserMsg.timestamp);
            lastTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          }
        }
      }
      
      // 构建所有历史对话主题列表
      const allTopics = [];
      formattedMessages.forEach(msg => {
        if (msg.role === 'user' && msg.content) {
          const topic = msg.content.substring(0, 15) + (msg.content.length > 15 ? '...' : '');
          let timeStr = '';
          if (msg.timestamp) {
            const date = new Date(msg.timestamp);
            timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          }
          const existingIndex = allTopics.findIndex(t => t.topic === topic);
          if (existingIndex >= 0) {
            if (msg.timestamp && allTopics[existingIndex].timestamp < msg.timestamp) {
              allTopics[existingIndex] = { topic, time: timeStr, timestamp: msg.timestamp, content: msg.content };
            }
          } else {
            allTopics.push({ topic, time: timeStr, timestamp: msg.timestamp || 0, content: msg.content });
          }
        }
      });
      allTopics.sort((a, b) => b.timestamp - a.timestamp);
      const historyList = allTopics.slice(0, 10);
      
      // messages 保持为空，显示新对话和欢迎语
      this.setData({ 
        messages: [],
        lastTopic: lastTopic,
        lastTime: lastTime,
        historyList: historyList,
        allHistoryTopics: allTopics
      });
    } catch (err) {
      console.error('加载聊天历史失败:', err);
    }
  },

  saveChatHistory() {
    try {
      wx.setStorageSync('ai_chat_history', this.data.messages);
    } catch (err) {
      console.error('保存聊天记录失败:', err);
    }
  },

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

  onHistoryTap() {
    this.setData({ isHistoryExpanded: !this.data.isHistoryExpanded });
  },

  onCollapseHistory() {
    if (this.data.isHistoryExpanded) {
      this.setData({ isHistoryExpanded: false });
    }
  },

  onHistoryItemTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    if (item) {
      this.setData({
        isHistoryExpanded: false,
        inputValue: item.content
      });
    }
  },

  onDeleteHistory(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    if (!item) return;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除这条历史对话吗？`,
      success: (modalRes) => {
        if (modalRes.confirm) {
          // 从消息中删除该主题的所有消息
          const content = item.content;
          const filteredMessages = this.data.messages.filter(msg => {
            return !(msg.role === 'user' && msg.content === content);
          });
          
          // 更新存储
          wx.setStorageSync('ai_chat_history', filteredMessages);
          
          // 重新构建历史列表
          const allTopics = [];
          filteredMessages.forEach(msg => {
            if (msg.role === 'user' && msg.content) {
              const topic = msg.content.substring(0, 15) + (msg.content.length > 15 ? '...' : '');
              let timeStr = '';
              if (msg.timestamp) {
                const date = new Date(msg.timestamp);
                timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
              }
              const existingIndex = allTopics.findIndex(t => t.topic === topic);
              if (existingIndex >= 0) {
                if (msg.timestamp && allTopics[existingIndex].timestamp < msg.timestamp) {
                  allTopics[existingIndex] = { topic, time: timeStr, timestamp: msg.timestamp, content: msg.content };
                }
              } else {
                allTopics.push({ topic, time: timeStr, timestamp: msg.timestamp || 0, content: msg.content });
              }
            }
          });
          allTopics.sort((a, b) => b.timestamp - a.timestamp);
          const historyList = allTopics.slice(0, 10);
          
          // 更新lastTopic和lastTime
          let lastTopic = '新对话';
          let lastTime = '';
          if (filteredMessages.length > 0) {
            const lastUserMsg = [...filteredMessages].reverse().find(msg => msg.role === 'user');
            if (lastUserMsg) {
              lastTopic = lastUserMsg.content.substring(0, 15) + (lastUserMsg.content.length > 15 ? '...' : '');
              if (lastUserMsg.timestamp) {
                const date = new Date(lastUserMsg.timestamp);
                lastTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
              }
            }
          }
          
          this.setData({
            messages: filteredMessages,
            historyList: historyList,
            allHistoryTopics: allTopics,
            lastTopic: lastTopic,
            lastTime: lastTime
          });
          
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onQuickAgentTap(e) {
    const id = e.currentTarget.dataset.id;
    const agent = this.data.hotAgents.find(item => item.id == id);
    if (agent) {
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
      this.setData({ inputValue: question });
      
      setTimeout(() => {
        this.onSend();
      }, 300);
    }
  },

  onSuggestedAgentTap(e) {
    const agentName = e.currentTarget.dataset.agent;
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
    this.setData({ inputValue: question });
    
    setTimeout(() => {
      this.onSend();
    }, 300);
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

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
    
    this.setData({
      inputValue: '',
      loading: true
    });
    
    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().getTime()
    };
    
    const messages = this.data.messages.concat([userMessage]);
    this.setData({ messages });
    this.saveChatHistory();
    this.scrollToBottom();
    
    this.sendMessageToAI(query);
  },

  async sendMessageToAI(question) {
    try {
      const response = await app.request({
        url: '/api/chat',
        method: 'POST',
        data: { question }
      });
      
      if (response.code === 200) {
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
      const errorMessage = {
        role: 'assistant',
        content: `抱歉，处理请求时出错：${error.message || '网络连接失败'}`,
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
        title: '请求失败，请检查网络',
        icon: 'none',
        duration: 2000
      });
    }
  },

  onShareAppMessage() {
    return {
      title: '安粮期货投研智演实验室',
      path: '/pages/ai-agent/ai-agent'
    };
  },

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
