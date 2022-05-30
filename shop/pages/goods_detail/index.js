// pages/goods_detail/index.js
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },

  //商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { goods_id } = options;
    // console.log(goods_id);
    this.getGoodsDetails(goods_id);
  },

  //获取商品详情数据
  async getGoodsDetails(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    // console.log(res);

    this.GoodsInfo = goodsObj;

    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //iphone部分手机不识别webp图片格式
        //临时改成jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },
  //点击轮播图放大
  handlePrevewImage(e) {
    // console.log('我被点了');
    //构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //接收传递过来的图片url
    // console.log(e);
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls,
    });
  },

  //点击加入购物车
  handleCartAdd() {
    // console.log('我被加入了购物车');
    //获取缓存中的购物车
    let cart = wx.getStorageSync("cart") || [];
    //判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    wx.setStorageSync("cart", cart);

    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });

  }
})