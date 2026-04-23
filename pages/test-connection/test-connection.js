Page({
  data: {
    testResult: '未测试',
    apiStatus: '待检测',
    url: 'http://127.0.0.1:8000'
  },

  onLoad() {
    console.log('测试页面加载');
  },

  // 测试网络连接
  testNetwork() {
    const app = getApp();
    this.setData({ testResult: '测试中...' });
    
    console.log('开始测试API连接');
    
    // 测试根接口
    app.get('/')
      .then(res => {
        console.log('根接口响应:', res);
        this.setData({ 
          testResult: '✅ 网络连接正常',
          apiStatus: '服务运行中' 
        });
        
        // 进一步测试技能接口
        this.testSkills();
      })
      .catch(err => {
        console.error('连接失败:', err);
        this.setData({ 
          testResult: '❌ 连接失败: ' + (err.message || '未知错误'),
          apiStatus: '服务未响应'
        });
      });
  },

  // 测试技能接口
  testSkills() {
    const app = getApp();
    
    app.get('/api/skills')
      .then(res => {
        console.log('技能列表响应:', res);
        const skills = res.data || [];
        wx.showModal({
          title: '✅ 连接成功！',
          content: `检测到 ${skills.length} 个技能\n第一个技能: ${skills[0] || '无'}`,
          showCancel: false
        });
      })
      .catch(err => {
        console.error('技能接口失败:', err);
      });
  },

  // 测试AI聊天
  testChat() {
    const app = getApp();
    
    app.post('/api/chat', { 
      question: '你好，测试一下连接' 
    })
      .then(res => {
        console.log('聊天接口响应:', res);
        wx.showModal({
          title: '✅ AI聊天测试成功',
          content: '智能体已正常响应',
          showCancel: false
        });
      })
      .catch(err => {
        console.error('聊天接口失败:', err);
      });
  },

  // 复制API地址
  copyUrl() {
    wx.setClipboardData({
      data: this.data.url,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  }
})