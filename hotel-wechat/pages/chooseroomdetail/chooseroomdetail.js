var app = getApp()
const {
  $Message
} = require('../../lib/dist/base/index');

Page({
  data: {
    array: [],
    index: 0,
    addpersonnum: '添加入住人',
    // 电话输入框内容
    userNumber: null,
    // 入住人信息
    infodata: [],
    // 入住，退房时间
    starTime: '',
    endTime: '',
    // 入住人数
    personNum: 0,
    roomPrice: '0',
    //房间类型
    roomType: 0,
    openId:'',
    image: '',
    token:'',
    uuid:'',
    isShowLoading: false,
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      uuid: that.randomString(10) + Date.parse(new Date())
    })
    wx.getStorage({
      key: 'money',
      success(res) {
        that.setData({
          roomPrice: res.data
        })
      }
    })
     wx.getStorage({
       key: 'roomType',
       success(res) {
         that.setData({
           roomType: res.data
         })
       }
     })
    wx.getStorage({
      key: 'userNumber',
      success(res) {
        that.setData({
          userNumber: res.data
        })
      }
    })
    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId: res.data
        })
      }
    })

    wx.getStorage({
      key: 'token',
      success(res) {
        that.setData({
          token: res.data
        })
        // 获取图片
        that.getImg()
      }
    })

    // 获取时间
    try {
      var starTime = wx.getStorageSync('starTime')
      var endTime = wx.getStorageSync('endTime')
      console.log(that.parseTime(starTime));
      that.setData({
        starTime: that.parseTime(starTime),
        endTime: that.parseTime(endTime)
      })
      if (value) {}
    } catch (e) {}
    this.getCheckIn();
    var array = that.data.array;
    for (let i = 1; i <= 30; i++) {
      array.push(i);
    }
    that.setData({
      array: array
    })
    try {
      var starTime = wx.getStorageSync('starTime')
      var endTime = wx.getStorageSync('endTime')
      console.log(starTime, endTime);
      that.setData({
        starTime: starTime,
        endTime: endTime,
      })
    } catch (e) {}
  },
  // picker点击
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  // 添加入住人
  addPerson() {
    wx.navigateTo({
      url: '../../pages/myinfo/myinfo',
    })
  },
  voteTitle: function (e) {
    this.data.userNumber = e.detail.value;
    wx.setStorage({
      key: "userNumber",
      data: e.detail.value
    })

  },
  // 添加订单
  addOrder() {
    var that = this;
    var personData = [];
    
    if (that.data.personNum <= 0) {
      $Message({
        content: '请选择入住人',
        type: 'warning'
      });
      return;
    } else if (that.data.userNumber == null) {
      $Message({
        content: '请输入入住人电话',
        type: 'warning'
      });
      return;
    } else if (!(/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(that.data.userNumber))) {
      $Message({
        content: '手机号码有误，请重填',
        type: 'warning'
      });
      return;
    }
    that.data.infodata.forEach(item => {
      let info = {
        "check_in_time": that.parseTime(that.data.starTime),
        "check_out_time": that.parseTime(that.data.endTime),
        "house_type": that.data.roomType,
        "id_number": item.id_number,
        "phone": that.data.userNumber,
        "open_id": that.data.openId
      }
      personData.push(info);
    })
    that.setData({
      infodata: personData
    })
    that.setData({
      isShowLoading: true
    })
    wx.request({
      url: app.globalData.host + 'phone/addHouseOrder/'+that.data.uuid,
      header: {
        token: that.data.token
      },
      data: that.data.infodata,
      method: 'POST',
      dataType: 'json',
      success: (res) => {
       if(res.data.code==200){
         console.log(res);
         setTimeout(()=>{
          that.getIdByUuid()
         },2000)
       }else{
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
      complete: () => {}
    });
  },
 randomString (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
       pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  getIdByUuid(){
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
          that.getStatusById(res.data.data)
        }else{
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
      url: app.globalData.host + 'phone/getStatusById/house/' + rest,
      header: {
        token: that.data.token
      },
      method: 'get',
      dataType: 'json',
      success(res) {
         if (res.data.data != null) {
            that.setData({
              isShowLoading: true
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
  
  // 获取入住人数
  getCheckIn() {
    var that = this;
    var personNum;
    wx.getStorage({
      key: 'openId',
      success(res1) {
        wx.getStorage({
          key: 'choosePerson',
          success(res) {
            if (res.data.length != 0) {
              personNum = res.data
              that.setData({
                addpersonnum: res.data.length + '人',
                personNum: res.data.length
              })
              wx.request({
                url: app.globalData.host + 'phone/getUsersByOpen',
                data: {
                  openId: res1.data,
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  token:that.data.token
                },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success(res) {
                  console.log(res);
                  var infodata = that.data.infodata
                  console.log(personNum);
                  personNum.forEach(item1 => {
                    res.data.data.forEach(item2 => {
                      if (item1 == item2.id) {
                        let data = {
                          id_number: item2.id_number
                        }
                        infodata.push(data)
                      }
                    })
                  });
                  that.setData({
                    infodata: infodata
                  })
                },
                fail: () => {},
              });
            } else {
              console.log(232313);
            }
          }
        })

      }
    });

  },
  // 格式化时间
  parseTime(d) {
    const newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' +
      d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return newDate;
  },
  // 获取图片
  getImg() {
    var that = this
    wx.getStorage({
      key: 'roomType',
      success(res) {
        console.log(res);
        wx.request({
          url: app.globalData.host + 'web/getImg',
           header: {
             token: that.data.token
           },
          data: {
            type: res.data
          },
          method: 'get',
          dataType: 'json',
          success(res) {
            console.log(res);
            that.setData({
              image: res.data.data
            })
          },
          fail: () => {},
        });
      }
    })


  }

})