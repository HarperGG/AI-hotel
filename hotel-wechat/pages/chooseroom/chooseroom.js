const {
  $Message
} = require('../../lib/dist/base/index');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //下拉框是否被选中
    ischeck: false,
    time1: '',
    time2: '',
    starTime: '',
    endTime: '',
    // 价格
    minMoney: 0,
    maxMoney: 100,
    // 高低排序
    filternum: '',
    // 房间筛选，
    filterRoom: [],
    name: '',
    // 搜索框内容
    voteTitle: null,
    // 所有房间
    allRoom: [],
    // 筛选价格数据
    filterPrice: [{
        id: 1,
        value: '150以下',
        ispitch: false,
        min: 0,
        max: 150
      }, {
        id: 2,
        value: '150-300',
        ispitch: false,
        min: 150,
        max: 300
      },
      {
        id: 3,
        value: '300-500',
        ispitch: false,
        min: 300,
        max: 500
      },
      {
        id: 4,
        value: '500-700',
        ispitch: false,
        min: 500,
        max: 700
      },
      {
        id: 5,
        value: '700以上',
        ispitch: false,
        min: 700,
        max: 999999
      }
    ],
    // 排序数据
    sortchoose: [{
        id: 1,
        value: '价格 低到高',
        text: 'down'
      },
      {
        id: 2,
        value: '价格 高到低',
        ischoose: false,
        text: 'up'
      }
    ],
    //筛选数据
    filterChoose: [{
        filterType: '房型',
        data: [{
            id: 1,
            value: '大床',
            ischoose: false,
          },
          {
            id: 2,
            value: '双床',
            ischoose: false,
          },
          {
            id: 3,
            value: '三床',
            ischoose: false,
          },
          {
            id: 4,
            value: '家庭房',
            ischoose: false,
          },
          {
            id: 5,
            value: '单人房',
            ischoose: false,
          },
          {
            id: 6,
            value: '情侣主题房',
            ischoose: false,
          }, {
            id: 12,
            value: '主题房',
            ischoose: false,
          }
        ]
      },
      {
        filterType: '服务设施',
        data: [{
            id: 7,
            value: '非中央空调',
            ischoose: false,
          },
          {
            id: 8,
            value: '浴缸',
            ischoose: false,
          },
          {
            id: 9,
            value: '免费WiFi',
            ischoose: false,
          },
          {
            id: 10,
            value: '投影设备',
            ischoose: false,
          },
          {
            id: 11,
            value: '电脑',
            ischoose: false,
          },
        ]
      }
    ],
    // 是否选择价格
    isPricechoose: false,
    // 是否选择排序
    issortchoose: false,
    // 是否筛选
    isfilterchoose: false,
    token:''
  },
  voteTitle: function (e) {
    this.data.voteTitle = e.detail.value;
  },
  // 搜索房间
  searchRoom() {
    var that = this;
    that.filterRoom(that.data.minMoney, that.data.maxMoney, that.data.starTime, that.data.endTime, that.data.voteTitle,             that.data.filternum, that.data.filterRoom)
  },
  // 选择房间
  chooseroom(e) {
    console.log(e.currentTarget.dataset.type);
    var that = this
    wx.setStorage({
      key: "choosePerson",
      data: []
    })
    wx.setStorage({
      key: "roomType",
      data: e.currentTarget.dataset.type
    })
    wx.setStorage({
      key: "money",
      data: e.currentTarget.dataset.money
    })
    wx.navigateTo({
      url: '/pages/chooseroomdetail/chooseroomdetail',
    })
  },
  onLoad: function (options) {
    // 设置时间
    var that = this;
    try {
      var time1 = wx.getStorageSync('time1')
      var time2 = wx.getStorageSync('time2')
      var starTime = wx.getStorageSync('starTime')
      var endTime = wx.getStorageSync('endTime')
      var minMoney = wx.getStorageSync('minMoney')
      var maxMoney = wx.getStorageSync('maxMoney')
      that.setData({
        time1: time1,
        time2: time2,
        starTime: starTime,
        endTime: endTime,
        minMoney: minMoney,
        maxMoney: maxMoney,
      })
      if (value) {
        
      }
    } catch (e) {}
     wx.getStorage({
       key: 'token',
       success(res) {
         that.setData({
           token: res.data
         })
         // 获取筛选数据
         that.filterRoom(that.data.minMoney, that.data.maxMoney, that.data.starTime, that.data.endTime, '', that.data.filternum, that.data.filterRoom)
       }
     })

    
  },
  // 选择价格
  chooseprice() {
    this.setData({
      isPricechoose: !this.data.isPricechoose,
      issortchoose: false,
      isfilterchoose: false
    })
  },
  // 点击排序
  chooseSort() {
    this.setData({
      issortchoose: !this.data.issortchoose,
      isPricechoose: false,
      isfilterchoose: false
    })
  },
  // 点击筛选
  chooseFilter() {
    this.setData({
      isfilterchoose: !this.data.isfilterchoose,
      isPricechoose: false,
      issortchoose: false
    })
  },

  // 改变选中价格状态
  changeStatus(e) {
    var that = this;
    var filterPrice1 = that.data.filterPrice;
    that.data.filterPrice.forEach((item, index1) => {
      filterPrice1[index1].ispitch = false;
    })
    that.setData({
      filterPrice: filterPrice1
    })
    that.data.filterPrice.forEach((item, index2) => {
      if (e.target.dataset.index == item.id) {
        var filterPrice2 = that.data.filterPrice;
        filterPrice2[index2].ispitch = !item.ispitch;
        that.setData({
          filterPrice: filterPrice2
        })
        if (filterPrice2[index2].ispitch == true) {
          that.setData({
            minMoney: filterPrice2[index2].min,
            maxMoney: filterPrice2[index2].max
          })
        }
      }
    })

    // 发起请求
    that.filterRoom(that.data.minMoney, that.data.maxMoney, that.data.starTime, that.data.endTime, '', that.data.filternum, that.data.filterRoom)
    setTimeout(function () {
      that.setData({
        isPricechoose: false
      })
    }, 500)
  },
  // 选择排序状态
  changeStatusSort(e) {

    var that = this;
    var sortchoose = that.data.sortchoose;
    that.data.sortchoose.forEach(item => {
      sortchoose[item.id - 1].ischoose = false;
    })
    that.setData({
      sortchoose: sortchoose
    })
    that.data.sortchoose.forEach(item => {
      if (e.target.dataset.index == item.id) {
        var sortchoose1 = that.data.sortchoose;
        sortchoose1[item.id - 1].ischoose = !item.ischoose;
        that.setData({
          sortchoose: sortchoose1
        })
      }
    })
    that.data.sortchoose.forEach(item => {
      if (item.ischoose == true) {
        that.setData({
          filternum: item.text
        })
      }
    })
    setTimeout(function () {
      that.setData({
        issortchoose: false
      })
    }, 500)
    that.filterRoom(that.data.minMoney, that.data.maxMoney, that.data.starTime, that.data.endTime, '', that.data.filternum, that.data.filterRoom)
  },
  // 筛选
  filterStatus(e) {
    var that = this;
    that.data.filterChoose.forEach((item1, index1) => {
      item1.data.forEach((item2, index2) => {
        if (e.target.dataset.index == item2.id) {
          var filterChoose = that.data.filterChoose;
          filterChoose[index1].data[index2].ischoose = !item2.ischoose;
          that.setData({
            filterChoose: filterChoose
          })
        }
      })
    })

  },
  // 筛选房间函数
  filterRoom(minMoney, maxMoney, startTime, endTime, name, filter, filterRooms) {
    var that = this;
    // 发起请求根据条件筛选
    wx.request({
      url: app.globalData.host + 'web/searchHouse',
      method: 'post',
      data: {
        moneyMin: minMoney,
        moneyMax: maxMoney,
        start: startTime,
        end: endTime,
        name: name,
        order: filter,
        fiter: filterRooms
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token:that.data.token
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            allRoom: res.data.data
          })
        } else {
          $Message({
            content: res.data.msg,
            type: 'warning'
          });
        }
      },

    })
  },
  // 取消筛选
  cancelFilter() {
    var that = this;
    that.data.filterChoose.forEach((item1, index1) => {
      item1.data.forEach((item2, index2) => {
        var filterChoose = that.data.filterChoose;
        filterChoose[index1].data[index2].ischoose = false;
        that.setData({
          filterChoose: filterChoose
        })
      })
    })
    this.setData({
      isfilterchoose: false
    })
  },
  // 确认筛选
  confirmFilter() {
    var filterRoomNum = [];
    var that = this;
    that.data.filterChoose.forEach((item1, index1) => {
      item1.data.forEach((item2, index2) => {
        if (item2.ischoose == true) {
          filterRoomNum.push(item2.value)
        }
      })
    })
    that.setData({
      filterRoom: filterRoomNum
    })
    that.filterRoom(that.data.minMoney, that.data.maxMoney, that.data.starTime, that.data.endTime, '', that.data.filternum, that.data.filterRoom)
    this.setData({
      isfilterchoose: false
    })
  },
})