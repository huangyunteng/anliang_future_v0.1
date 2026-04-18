// pages/ai-chat/ai-chat.js
Page({
  // 页面初始数据
  data: {
    messageList: [], // 聊天消息列表
    inputText: '',   // 输入框内容
  },

  // 输入框内容同步
  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  // 发送消息（调用多智能体逻辑）
  async sendMessage() {
    const { inputText } = this.data;
    if (!inputText.trim()) return;

    // 1. 添加用户消息到列表
    const newMsg = [...this.data.messageList, { type: 'user', content: inputText }];
    this.setData({ messageList: newMsg, inputText: '' });

    // 2. 调用全局的多智能体分析方法（你之前在app.js写的）
    const app = getApp();
    const result = await app.getMultiAgentAnalysis(inputText);

    // 3. 添加AI回复到列表
    this.setData({
      messageList: [...this.data.messageList, { type: 'ai', content: result }]
    });
  },
});