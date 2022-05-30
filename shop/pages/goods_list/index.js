// pages/goods_list/index.js
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      }, {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      },
    ],
    goodsList: []
  },


  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },

  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },

  //获取商品列表
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // console.log(res);
    //获取总条数
    const total = res.total;
    //计算总页面数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    // console.log(this.totalPages);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    //关闭下拉刷新动画
    wx.stopPullDownRefresh();

  },

  //页面上滑 滚动条触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // console.log("到底了");
      wx.showToast({
        title: '到底了',
      });

    } else {
      // console.log("还有数据");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新
  onPullDownRefresh() {
    // console.log("刷新");
    this.setData({
      goodsList: []
    })

    this.QueryParams.pagenum = 1;

    this.getGoodsList();

  }
})