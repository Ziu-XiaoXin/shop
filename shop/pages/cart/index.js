// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    //获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // console.log(address);

    //获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    //     //计算全选
    //     // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    //     let allChecked = true;
    //     //总价格
    //     let totalPrice = 0;
    //     let totalNum = 0;
    //     cart.forEach(v => {
    //       if (v.checked) {
    //         totalPrice += v.num * v.goods_price;
    //         totalNum += v.num;
    //       } else {
    //         allChecked = false
    //       }
    //     })
    //     //判断数组是否为空
    //     allChecked = cart.length != 0 ? allChecked : false
    // 
    //     this.setData({
    //       address,
    //       cart,
    //       allChecked,
    //       totalPrice,
    //       totalNum
    //     });
    this.setData({
      address
    });
    this.setCart(cart)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //收货地址
  handleChooseAddress() {
    // console.log("我是收货地址");
    wx.chooseAddress({
      success: (result) => {
        // console.log(result);
        let address = result
        console.log(address);
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
        wx.setStorageSync("address", address);
      }
    });
  },

  //商品选中
  handleItemChange(e) {
    // console.log(e);
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },


  setCart(cart) {
    let allChecked = true;
    //总价格
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false
      }
    })
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false

    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },

  //商品全选
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  //商品数量编辑
  handleItemNumEdit(e) {
    const { operation, id } = e.currentTarget.dataset
    // console.log(id, operation);
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: 'Tips',
        content: '您是否要删除',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index, 1);
            this.setCart(cart);
          }
        },
        fail: () => { },
        complete: () => { }
      });
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }

  },

  //点击结算
  handlePay() {
    const { address, totalNum } = this.data;
    if (!address.userName) {
      wx.showToast({
        title: '您还没有选择收货地址',
        icon: 'none',
      });
      return
    }
    if (totalNum === 0) {
      wx.showToast({
        title: '您还没有选购商品',
        icon: 'none',
      });
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });

  }
})