// pages/orderInfo/orderInfo.js
var app = getApp();
const {
  $Message
} = require('../../lib/dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    baseUrl: app.globalData.host,
    roomId: 0,
    allMoney: 0,
    orderDetail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data);
      that.setData({
        roomId: data.data
      })
    })

     wx.getStorage({
       key: 'token',
       success(res) {
         that.setData({
           token: res.data
         })
         // 获取图片
          that.getOrder()
       }
     })
   
  },
  // 获取菜单
  getOrder() {
    var that = this;
    wx.request({
      url: app.globalData.host + 'web/getMenuItems',
      method: 'get',
      dataType: 'json',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
          token: that.data.token
      },
      success: (res) => {
        that.setData({
          orderData: res.data.data
        })
      },
      fail: () => {},
      complete: () => {}
    });
  },
  // 加菜
  addItem(e) {
    let orderData = this.data.orderDetail
    let item = {
      id: e.currentTarget.dataset.id,
      money: e.currentTarget.dataset.money,
      name: e.currentTarget.dataset.name
    }
    orderData.push(item);
    this.setData({
      allMoney: this.data.allMoney + e.currentTarget.dataset.money,
      orderDetail: orderData
    })
  },
  //添加订单
  addOrder() {
    var that = this
    if (that.data.allMoney == 0) {
      $Message({
        content: '请点菜',
        type: 'warning'
      });
      return;
    }
    wx.navigateTo({
      url: '../placeOrder/placeOrder',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          orderData: that.data.orderDetail,
          roomType: that.data.roomId,
          money: that.data.allMoney
        })
      }
    })
  }
})