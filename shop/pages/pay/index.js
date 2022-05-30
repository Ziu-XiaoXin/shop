import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    //获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // console.log(address);

    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    this.setData({ address });

    //总价格
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    //判断数组是否为空
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //点击支付
  async handleOrderPay() {
    const token = wx.getStorageSync("token");

    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',

      });
      return;
    }
    // console.log("已经存在token");
    //创建订单
    //请求头参数
    const header = { Authorization: token };
    //请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))

    const orderParams = { order_price, consignee_addr, goods }
    const { order_number } = await request({ url: "my/orders/create", methods: "POST", data: orderParams, header });
    // console.log(res);
  }


})