// components/Tabs/Tabs.js
Component({
  properties: {
    //接收tabs
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e) {
      // console.log(e);
      const { index } = e.currentTarget.dataset;
      // console.log(index);
      this.triggerEvent("tabsItemChange", { index });
    }
  }
})
