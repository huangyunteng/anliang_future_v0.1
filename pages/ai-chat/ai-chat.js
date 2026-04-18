// components/ai-chat/ai-chat.js
const app = getApp();
const config = require('../../utils/config.js');

Component({
  // 组件属性列表
  properties: {
    // 控制显示/隐藏
    show: {
      type: Boolean,
      value: false
    },
    // 浮层位置
    position: {
      type: Object,
      value: { x: 0, y: 0 }
    }
  },

  // 组件数据
  data: {
    // 输入框值
    inputValue: '',
    // 消息列表
    messages: [
      {
        id: 1,
        role: 'assistant',
        content: '您好！我是安粮期货AI投顾助手，可以为您提供：\n\n1. 期货行情分析\n2. 市场趋势解读\n3. 投资策略建议\n4. 风险提示\n\n请问有什么可以帮您？',
        time: '刚刚'
      }
    ],
    // 是否正在发送
    sending: false,
    // 自动聚焦输入框
    autoFocus: true,
    // 滚动到指定消息
    scrollToId: 1,
    // 快捷问题建议
    suggestions: [
      '今日期货市场整体走势如何？',
      '螺纹钢近期价格趋势分析',
      '农产品期货的投资建议',
      '如何控制期货交易风险？'
    ],
    // 消息ID计数器
    messageId: 2
  },

  // 组件方法
  methods: {
    /**
     * 阻止触摸移动（防止背景滚动）
     */
    preventTouchMove() {
      return;
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
     * 发送消息
     */
    onSend() {
      const message = this.data.inputValue.trim();
      if (!message || this.data.sending) {
        return;
      }

      // 添加用户消息
      const userMessage = {
        id: this.data.messageId,
        role: 'user',
        content: message,
        time: this.formatTime(new Date())
      };
      
      this.data.messageId += 1;
      
      // 添加AI回复占位符
      const aiMessage = {
        id: this.data.messageId,
        role: 'assistant',
        content: '',
        loading: true
      };
      
      this.data.messageId += 1;
      
      this.setData({
        messages: [...this.data.messages, userMessage, aiMessage],
        inputValue: '',
        sending: true,
        scrollToId: aiMessage.id
      });

      // 调用AI接口
      this.callAIChatAPI(message, aiMessage.id);
    },

    /**
     * 调用AI聊天接口
     */
    callAIChatAPI(question, messageId) {
      const app = getApp();
      
      app.showLoading('AI思考中...');
      
      // 模拟API调用（实际开发中替换为真实接口）
      setTimeout(() => {
        const responses = [
          `根据当前市场数据分析，${question} 的答案是：建议关注相关品种的基本面和技术面变化，注意控制仓位风险。`,
          `关于"${question}"，从技术分析角度看，近期市场呈现震荡走势，建议等待更明确的方向信号。`,
          `对于您的问题"${question}"，从基本面分析，供需关系是主要影响因素，建议结合宏观经济数据综合分析。`,
          `"${question}"是当前市场关注的热点，建议参考专业机构的研究报告，同时注意风险管理。`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // 更新AI回复
        const updatedMessages = this.data.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: randomResponse,
              loading: false,
              time: this.formatTime(new Date())
            };
          }
          return msg;
        });
        
        this.setData({
          messages: updatedMessages,
          sending: false
        });
        
        app.hideLoading();
        
        // 触发发送事件
        this.triggerEvent('send', { 
          question: question,
          answer: randomResponse
        });
      }, 1500);
      
      // 实际接口调用代码（注释状态）
      /*
      app.post(config.API.AI_CHAT.SEND_MESSAGE, {
        question: question,
        history: this.data.messages.slice(0, -1) // 不包含当前的占位消息
      })
      .then(response => {
        // 更新AI回复
        const updatedMessages = this.data.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: response.answer,
              loading: false,
              time: this.formatTime(new Date())
            };
          }
          return msg;
        });
        
        this.setData({
          messages: updatedMessages,
          sending: false
        });
        
        app.hideLoading();
        
        // 触发发送事件
        this.triggerEvent('send', response);
      })
      .catch(error => {
        console.error('AI接口调用失败:', error);
        
        // 更新为错误消息
        const updatedMessages = this.data.messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: '抱歉，AI服务暂时不可用，请稍后重试。',
              loading: false,
              time: this.formatTime(new Date())
            };
          }
          return msg;
        });
        
        this.setData({
          messages: updatedMessages,
          sending: false
        });
        
        app.hideLoading();
        app.showError('AI服务请求失败');
      });
      */
    },

    /**
     * 点击快捷问题
     */
    onQuickQuestionTap(e) {
      const question = e.currentTarget.dataset.question;
      this.setData({
        inputValue: question
      });
      
      // 可选：自动发送
      // setTimeout(() => {
      //   this.onSend();
      // }, 100);
    },

    /**
     * 清空输入框
     */
    onClearTap() {
      this.setData({
        inputValue: ''
      });
    },

    /**
     * 关闭浮层
     */
    onCloseTap() {
      this.triggerEvent('close');
    },

    /**
     * 格式化时间
     */
    formatTime(date) {
      const d = new Date(date);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    /**
     * 清空对话
     */
    clearChat() {
      this.setData({
        messages: [{
          id: 1,
          role: 'assistant',
          content: '您好！我是安粮期货AI投顾助手，可以为您提供：\n\n1. 期货行情分析\n2. 市场趋势解读\n3. 投资策略建议\n4. 风险提示\n\n请问有什么可以帮您？',
          time: '刚刚'
        }],
        messageId: 2,
        scrollToId: 1
      });
    }
  },

  // 组件生命周期
  lifetimes: {
    attached() {
      console.log('AI对话组件 attached');
      
      // 加载快捷问题建议
      this.loadSuggestions();
    },
    
    detached() {
      console.log('AI对话组件 detached');
    }
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    show() {
      console.log('AI对话组件所在页面显示');
    },
    
    hide() {
      console.log('AI对话组件所在页面隐藏');
    }
  }
});