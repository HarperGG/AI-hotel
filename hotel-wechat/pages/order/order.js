var app = getApp()
Page({
  data: {
    current: 'tab1',
    ishistory: true,
    // 待支付的订单
    noUserOrder: [],
    openID: '',
    token:'',
    orderType:1
  },
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openId',
      success(res) {
        console.log(res);
        that.setData({
          openID: res.data,
        })
            wx.getStorage({
              key: 'token',
              success(res) {
                that.setData({
                  token: res.data
                })
                that.getNoUseOrder()
              }
            })
      }
    })
  },
  // 历史订单
  historyorder() {
    this.setData({
      ishistory: false
    })
    this.getOrder('phone/getRecentOrders/')
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  // 获取待使用订单
  getNoUseOrder() {
    this.getOrder('phone/getNotUsedOrders/')
  },
  // 获取全部订单
  getAllOrder(){
    this.getOrder('phone/getAllOrders/')
  },
  // 获取订单函数
  getOrder(url){
    var that = this;
    wx.request({
      url: app.globalData.host + url + that.data.openID,
      header: {
        token: that.data.token
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res);
        let dataOrder1 = [];
        that.setData({
          noUserOrder: []
        })
        res.data.data.forEach(item => {
          var status = ''
          if (item.status == 0) {
            status = '订单已过期'
          } else if (item.status == 1) {
            status = '订单预定失败'
          } else if (item.status == 2) {
            status = '已取消'
          } else if (item.status == 3) {
            status = '待使用'
          } else if (item.status == 4) {
            status = '已使用'
          }
          var  dataItem
          if (typeof (item.phone)=='undefined'){
            dataItem = {
              money: item.money,
              room_number: item.room_number,
              name: item.name,
              check_in_time: that.timef(new Date(item.check_in_time)),
              check_out_time: that.timef(new Date(item.check_out_time)),
              create_at: that.timef(new Date(item.create_at)),
              status: status,
              id: item.id,
            }
          }else{
            dataItem = {
              money: item.money,
              room_number: 'c1 大堂',
              name: '餐厅',
              check_in_time: that.timef(new Date(item.check_in_time)),
              check_out_time: that.timef(new Date(item.check_in_time)),
              create_at: that.timef(new Date(item.create_at)),
              status: status,
              id: item.id,
            }
          }
          
          dataOrder1.push(dataItem)
        });
        that.setData({
          noUserOrder: dataOrder1
        })
      },
      fail: () => { },
      complete: () => { }
    });

  },
  // 格式化时间戳
  timef: function (time) {
    var m = time.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = time.getDate();
    d = d < 10 ? ('0' + d) : d;
    return m + '月' + d + '日';
  },
  // 跳转详情也
  orderInfo(e){
    console.log();
    wx.navigateTo({
      url: '../orderInfo/orderInfo',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: e.currentTarget.dataset.id
        })
      }
    })
  },
  onReady: function () {},
  onShow: function () {
    this.setData({
      ishistory: true
    })
  },
  onShow(){
    var that = this
 wx.getStorage({
       key: 'token',
       success(res) {
         that.setData({
           token: res.data
         })
         
         wx.getStorage({
           key: 'orderType',
           success(res) {
             console.log(res.data);
             that.setData({
               orderType: res.data,
             })
             if (res.data == 1) {
               console.log(1);
               that.setData({
                 current: 'tab2',
                 ishistory: true
               })
               that.getAllOrder()
             } else if (res.data == 2) {
               that.setData({
                 current: 'tab1',
                 ishistory: true
               })

               that.getNoUseOrder()
             } else if (res.data == 3) {
               console.log(3);
               that.setData({
                 ishistory: false
               })
               that.historyorder()
             }
           }
         })
        }})

    
  }
})