var app = getApp()
const {
  $Message
} = require('../../lib/dist/base/index');
var app = getApp()

Page({

  data: {

    date: '2016-09-01',
    // 当前页面
    currentIndexNav:1,
    // 所有图片
    allimg: [],
    // 是否是全日制
    isallday: true,
    maxPrice:100,
    minPrice:0,
    starTime:'',
    // 选择价格区间
    array: ['0-100', '100-200', '200-300', '300+'],
    objectArray: [{
        id: 0,
        name: '0-100',
        min: '0',
        max: '100'
      },
      {
        id: 1,
        name: '100-200',
        min: '100',
        max: '200'
      },
      {
        id: 2,
        name: '200-300',
        min: '200',
        max: '300'
      },
      {
        id: 3,
        name: '300+',
        min: '300',
        max: '999999'
      }
    ],
    index: 0,

  },
  onLoad: function (options) {
    var that = this
    try {
      wx.setStorageSync('minMoney', that.data.minPrice)
      wx.setStorageSync('maxMoney', that.data.maxPrice)
    } catch (e) {}
    // 获取图片
    wx.request({
      url: app.globalData.host + 'web/getImg?type=101', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          allimg: res.data.data
        })
      }
    })
    // this.getToken()
  },
  // getToken(){
  //    wx.request({
  //      url: app.globalData.host + 'login',
  //      method: 'post',
  //      data: {
  //        username: '513701199802202000',
  //        password:'123456'
  //      },
  //     //  header: {
  //     //    'Content-Type': 'application/x-www-form-urlencoded'
  //     //  },
  //      success(res) {
  //        console.log(res);
  //      },

  //    })
  // },
  // 钟点房时间
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var timeData = e.detail.value.split('-')
    var starTime = timeData[1] + '月' + timeData[2] + '日'
    var endTime = timeData[1] + '月' + timeData[2] + '日'
     try {
       wx.setStorageSync('starTime', new Date(timeData[0] + '-' + timeData[1] + '-' + timeData[2] + ' ' + '00:00:00'))
       wx.setStorageSync('endTime', new Date(timeData[0] + '-' + timeData[1] + '-' + timeData[2] + ' ' + '11:59:59'))
       wx.setStorageSync('time1', starTime)
       wx.setStorageSync('time2', endTime)
     } catch (e) {}
    this.setData({
      starTime: starTime
    })
  },
  // 选择价格
  bindPickerChange: function (e) {
    var that = this
    this.data.objectArray.forEach(item => {
      if (item.id == e.detail.value){
        that.setData({
          maxPrice: item.max,
          minPrice: item.min
        })
        try {
          wx.setStorageSync('minMoney', that.data.minPrice)
          wx.setStorageSync('maxMoney', that.data.maxPrice)
        } catch (e) {}
      }
    });

    this.setData({
      index: e.detail.value
    })
  },
  // 点击切换房型
  activeNav(e) {
    var that = this;
    that.setData({
      currentIndexNav: e.target.dataset.index
    })
    if (e.target.dataset.index == 2) {
      try {
        wx.setStorageSync('isallday', '2')
      } catch (e) {}
      that.setData({
        isallday: false,
      })
    } else {
      try {
        wx.setStorageSync('isallday', '1')
      } catch (e) {}
      that.setData({
        isallday: false
      })
      that.setData({
        isallday: true,
      })
    }
  },
  dianji: function () {
      this.yunxin() //调用回调函数
    
  },
  // 选择日期
  yunxin: function () {
    var that = this;
    if (that.data.isallday) {

    }
    that.rili = that.selectComponent("#rili")
    var starTime = ''
    var day = ''
    var endTime = ''
    that.rili.xianShi({
      data: function (res) {
        console.log(res);
        if (res != null) {
          if (res.length == 1) {
            starTime = that.timef(new Date(res[0].getTime))
            try {
              wx.setStorageSync('starTime', new Date(res[0].getTime))
              wx.setStorageSync('endTime', new Date(res[0].getTime))
            } catch (e) {}
          } else if (res.length == 2) {
            starTime = that.timef(new Date(res[0].getTime))
            endTime = that.timef(new Date(res[1].getTime))
            day = res[1].chaDay
            try {
              wx.setStorageSync('starTime', new Date(res[0].getTime))
              wx.setStorageSync('endTime', new Date(res[1].getTime))
            } catch (e) {}
          }
        } else {
          starTime = that.timef(new Date())
          day = '0'
          endTime = that.timef(new Date())
        }
        console.log(starTime, endTime);
        that.setData({
          starTime: starTime,
          endTime: endTime,
          day: day,
        })
      }
    })
  },
  // 格式化时间戳
  timef: function (time) {
    var m = time.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = time.getDate();
    d = d < 10 ? ('0' + d) : d;
    return m + '月' + d + '日';
  },
  // 查找房间
  chooseroom() {
    if (this.data.starTime == this.data.endTime){
       $Message({
         content: "请不要选择同一天",
         type: 'warning'
       });
       return;
    }
     var minMoney
     var maxMoney
    try {
      minMoney = wx.getStorageSync('minMoney')
       maxMoney = wx.getStorageSync('maxMoney')
      if (value) {
      }
    } catch (e) {}
    console.log(wx.getStorageSync('minMoney'));
    if (minMoney==''){
      
      $Message({
        content: "请选择价格区间",
        type: 'warning'
      });
    }else{
       var that = this;
       that.setStorage(that.data.starTime, that.data.endTime)
       wx.navigateTo({
         url: '/pages/chooseroom/chooseroom'
       })
    }
   
  },
  // 储存时间
  setStorage(time1, time2) {
    try {
      wx.setStorageSync('time1', time1)
      wx.setStorageSync('time2', time2)
    } catch (e) {}
  },

  onReady: function () {
    var myDate = new Date();
    try {
      wx.setStorageSync('starTime', new Date())
      wx.setStorageSync('endTime', new Date())
    } catch (e) {}
    var m = myDate.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = myDate.getDate();
    d = d < 10 ? ('0' + d) : d;
    var nowTime = m + '月' + d + '日';
    this.setData({
      starTime: nowTime,
      endTime: nowTime,
      day: '0',
    })
  },

  
})