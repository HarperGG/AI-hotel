var app = getApp()
Page({
  data: {
    // 数据
    activeData: [],
    token: ''
  },
  onLoad: function (options) {
    this.getData()
  },
  // 跳转房间详情页
  ship(e) {
    if (e.currentTarget.dataset.type == 111) {
       wx.getStorage({
             key: 'token',
             success(res) {
               wx.navigateTo({
                 url: '../orderInfo/orderInfo',
                 header: {
                   token: res.data
                 },
                 success: function (res) {
                   res.eventChannel.emit('acceptDataFromOpenerPage', {
                     roomType: 111
                   })
                 }
               })
             }})
     
    } else {
       wx.getStorage({
             key: 'token',
      success(res) {
        wx.navigateTo({
          url: '../activedetail/activedetail',
          header: {
            token: res.data
          },
          success: function (res) {
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              roomType: e.currentTarget.dataset.type
            })
          }
        })
      }})
     
    }
  },
  getData() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: app.globalData.host + 'web/getActiveHouse',
          header: {
            token: res.data
          },
          method: 'GET',
          dataType: 'json',
          success: (res) => {
            that.setData({
              activeData: res.data.data
            })
          },
          fail: () => {},
          complete: () => {}
        });
      }
    })
  }

})