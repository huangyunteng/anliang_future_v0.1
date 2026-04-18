// components/customer-service-float/customer-service-float.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示
    show: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHidden: false,    // 是否隐藏到边缘
    isExpanded: false   // 是否展开
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      console.log('CODEBUDDY_DEBUG customer-service-float attached - component loaded')
      console.log('CODEBUDDY_DEBUG customer-service-float initial state: isHidden=false, isExpanded=false')

      // 组件加载后延迟1.5秒后隐藏到边缘，只显示耳朵
      setTimeout(() => {
        console.log('CODEBUDDY_DEBUG customer-service-float starting slide to edge animation')
        this.setData({
          isHidden: true
        })
        console.log('CODEBUDDY_DEBUG customer-service-float state changed: isHidden=true')
      }, 1500)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击事件
    onTap() {
      console.log('CODEBUDDY_DEBUG customer-service-float onTap triggered')
      console.log('CODEBUDDY_DEBUG customer-service-float current state: isHidden=', this.data.isHidden, ', isExpanded=', this.data.isExpanded)

      if (this.data.isExpanded) {
        // 如果已经展开，则收起
        console.log('CODEBUDDY_DEBUG customer-service-float collapsing to edge')
        this.setData({
          isExpanded: false,
          isHidden: true
        })
        console.log('CODEBUDDY_DEBUG customer-service-float state changed: isExpanded=false, isHidden=true')
      } else {
        // 如果未展开，则展开显示完整客服
        console.log('CODEBUDDY_DEBUG customer-service-float expanding to full view')
        this.setData({
          isExpanded: true,
          isHidden: false
        })
        console.log('CODEBUDDY_DEBUG customer-service-float state changed: isExpanded=true, isHidden=false')

        // 展开后3秒自动收起
        setTimeout(() => {
          console.log('CODEBUDDY_DEBUG customer-service-float auto-collapsing after 3 seconds')
          this.setData({
            isExpanded: false,
            isHidden: true
          })
          console.log('CODEBUDDY_DEBUG customer-service-float state changed: isExpanded=false, isHidden=true')
        }, 3000)
      }
    }
  }
})
