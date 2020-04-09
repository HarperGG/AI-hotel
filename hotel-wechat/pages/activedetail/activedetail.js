var app = getApp()
Page({

  data: {
    roomType: 0,
    imgPath: '',
    money: '',
    room_number: '',
    name: '',
    description: '',
    area: ''

  },
  onLoad: function (options) {
    var that = this
      wx.getStorage({
            key: 'token',
            success(res) {
               that.getDetail(res.data)
            }})
  },
  // 活动详情页面
  getDetail(token) {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data);
      wx.request({
        url: app.globalData.host + 'web/getHouseByType',
        data: {
          type: data.roomType
        },
        header: {
          'content-type': 'application/json',
            token: token
        },
        method: 'get',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          that.setData({
            money: res.data.data[0].money,
            room_number: res.data.data[0].room_number,
            name: res.data.data[0].name,
            description: res.data.data[0].description,
            area: res.data.data[0].area,
          })
        },
        fail: () => {},
        complete: () => {}
      });

      wx.request({
        url: app.globalData.host + 'web/getHouseByType',
        data: {
          type: data.roomType
        },
        header: {
          'content-type': 'application/json',
            token: token
        },
        method: 'get',
        dataType: 'json',
        success: (res) => {
          console.log(res);
          that.setData({
            money: res.data.data[0].money,
            type: res.data.data[0].type,
            room_number: res.data.data[0].room_number,
            name: res.data.data[0].name,
            description: res.data.data[0].description,
            area: res.data.data[0].area,
          })
        },
        fail: () => {},
        complete: () => {}
      });
      wx.request({
        url: app.globalData.host + 'web/getImg',
         header: {
           token: token
         },
        data: {
          type: data.roomType
        },
        method: 'get',
        dataType: 'json',
        success(res) {
          console.log(res);
          that.setData({
            imgPath: res.data.data
          })
        },
        fail: () => {},
      });
    })
  }
})