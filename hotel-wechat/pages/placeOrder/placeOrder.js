var app = getApp()
const {
  $Message
} = require('../../lib/dist/base/index');

// 设置当前时间
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();

Page({
  data: {
    array: [],
    index: 0,
    addpersonnum: '添加入住人',
    // 电话输入框内容
    userNumber: null,
    //loading
     spinShow: true,
       switch: false,
    // 钱
    money:'0',
    // 是否配送
    radioChange: 3,
    // 下单数据
    items: [],
    open_id: '',
    imgPath:[],
    //下单人
    
    personNum: '',
    roomType:'',
    isPage: 1,

    // 时间
    startDate: "请选择日期",
    // 配送时间
    TimeNow: '',
    isShowLoading:false,
    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
  },
  onLoad: function (options) {
    var that = this;
     that.setData({
       uuid: that.randomString(10) + Date.parse(new Date())
     })
     wx.getStorage({
       key: 'token',
       success(res) {
         that.setData({
           token: res.data
         })
         // 获取图片
         console.log(111111);
         that.getImg();
       }
     })

    // 获取菜单数据
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data)
      that.setData({
        roomType: data.roomType,
        items: data.orderData,
        money: data.money
      })
    })
    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          open_id: res.data
        })
      }
    })

   

  },
  // loading
  onSwitchChange({
    detail
  }) {
    const value = detail.value;
    this.setData({
      switch: value,
      spinShow: !value
    });
  },

   randomString(len) {
     len = len || 32;
     var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 
     var maxPos = $chars.length;
     var pwd = '';
     for (let i = 0; i < len; i++) {
       pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
     }
     return pwd;
   },
     getIdByUuid() {
         var that = this
         wx.request({
           url: app.globalData.host + 'phone/getIdByUuid/' + that.data.uuid,
           header: {
             token: that.data.token
           },
           method: 'get',
           dataType: 'json',
           success(res) {
             if (res.data.code == 200) {
              setTimeout(()=>{
                that.getStatusById(res.data.data)
              },500)
             } else {
               that.setData({
                 isShowLoading: false
               })
               $Message({
                 
                 content: '下单失败',
                 type: 'warning'
               });
             }
             console.log(res);

           },
           fail: () => {},
         });
       },
       getStatusById(rest) {
         var that = this
         wx.request({
           url: app.globalData.host + 'phone/getStatusById/rest/' + rest,
           header: {
             token: that.data.token
           },
           method: 'get',
           dataType: 'json',
           success(res) {
             if (res.data.data != null) {
               that.setData({
                 isShowLoading:false
               })
               $Message({
                 content: '下单成功,正在跳转',
                 type: 'success'
               });
               setTimeout(function () {
                 wx.switchTab({
                   url: '../order/order'
                 });
               }, 1000)
             } else {
               that.setData({
                 isShowLoading: false
               })
               $Message({
                 content: '下单失败',
                 type: 'warning'
               });
             }

           },
           fail: () => {},
         });
       },
  onShow() {
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var json = currPage.data.mydata;
    if (typeof (json) != 'undefined') {
      that.setData({
        personNum: json.idCard,
        addpersonnum: json.numName
      })
    }
  },
  // 是否配送
  radioChange: function (e) {
    this.setData({
      radioChange: e.detail.value
    })
  },
  // 添加入住人
  addPerson() {
    wx.navigateTo({
      url: '../../pages/myinfo/myinfo',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          isOrder: '1'
        })
      }
    })
  },
  voteTitle: function (e) {
    this.data.userNumber = e.detail.value;
  },

  // 添加订单
  addOrder() {
    var that = this;
    console.log(new Date(that.data.TimeNow));
    if ((that.data.personNum == '') ||
      (that.data.userNumber == null) ||
      (that.data.radioChange == 3) ||
      (that.data.TimeNow == '')) {
      $Message({
        content: '请将信息填写完整',
        type: 'warning'
      });
      return;
    }
     that.setData({
       isShowLoading: true
     })
    var newData = {
        is_delivery: that.data.radioChange,
        id_number: that.data.personNum,
        items: JSON.stringify(that.data.items),
        phone: that.data.userNumber,
        check_in_time: new Date(that.data.TimeNow),
        open_id: that.data.open_id
      }
    wx.request({
      url: app.globalData.host + 'phone/addRestOrder/'+that.data.uuid,
       header: {
         token: that.data.token,
         'content-type': 'application/x-www-form-urlencoded'
       },
      data: newData,
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        if(res.data.code == 200){
          setTimeout(() => {
            that.getIdByUuid()
          }, 1500)

        }else{
          that.setData({
            isShowLoading: false
          })
           $Message({
             content: '下单失败',
             type: 'error'
           });
        }
        console.log(res);
        
      },
      fail: () => {
         $Message({
           content: '下单失败',
           type: 'error'
         });
      },
      complete: () => {}
    });
  },

  // 获取图片
  getImg() {
    var that =this
    
      wx.request({
        url: app.globalData.host + 'web/getImg',
         header: {
           token: that.data.token
         },
        data: {
          type:111
        },
        method: 'get',
        dataType: 'json',
        success(res) {
          console.log(res);
          that.setData({
            imgPath:res.data.data
          })
        },
        fail: () => {},
      });
    

  },

  pickerTap: function () {
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },
  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];
    console.log(that.data.multiArray);

    var years = new Date()
    var dataTime = years.getFullYear()
    var TimeNow = ''

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
      TimeNow = dataTime + '-' + month + '-' + day
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
      TimeNow = dataTime + '-' + month + '-' + day
    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
      TimeNow = dataTime + '-' + month + '-' + day
    }
    console.log((hours + '').length);

    if ((hours + '').length == 1) {
      hours = '0' + hours;
    }
    if ((minute + '').length == 1) {
      minute = '0' + minute;
    }
    var startDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      startDate: startDate,
      TimeNow: TimeNow + ' ' + hours + ":" + minute + ":00"
    })
  },

})