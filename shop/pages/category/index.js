import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList: [],
    //右侧商品数据
    rightContent: [],
    //选中商品
    currentIndex: 0,
    //右侧滚动条距离顶部距离
    scrollTop: 0
  },
  //接口返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getCates();

    //获取本地存储
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 300) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },

  //获取分类数据
  async getCates() {
    //     request({ url: "/categories" })
    //       .then(result => {
    //         this.Cates = result.data.message;
    // 
    //         //把接口数据存入到本地存储
    //         // wx.setStorage('cates', { time: Date.now(), data: this.Cates });
    // 
    //         wx.setStorageSync(
    //           'cates',
    //           {
    //             time: Date.now(),
    //             data: this.Cates
    //           },
    //         );
    // 
    // 
    //         let leftMenuList = this.Cates.map(v => v.cat_name)
    //         // console.log(result);
    // 
    //         let rightContent = this.Cates[0].children;
    //         this.setData({
    //           leftMenuList,
    //           rightContent
    //         })
    //       })


    // 1 使用es7的async await来发送请求
    const res = await request({ url: "/categories" });
    // this.Cates = res.data.message;
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  //左侧菜单点击事件
  handleItemTap(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})