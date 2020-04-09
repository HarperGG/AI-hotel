var app = getApp()
Page({
  data: {
    infodata: [],
    //选择数
    chooseNum: 0,
    //选择的人
    choosePerson: [],
    isOrder: ''
  },
  checkboxChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      chooseNum: e.detail.value.length,
      choosePerson: e.detail.value
    })
  },
  onLoad() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        that.setData({
          token: res.data
        })
        // 获取图片
        that.getUserInfo(res.data)
        const eventChannel = that.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
          that.setData({
            isOrder: data.isOrder
          })
        })
      }
    })




  },

  // 获取用户信息
  getUserInfo(token) {
    var that = this;
    wx.getStorage({
      key: 'openId',
      success(res) {
        wx.request({
          url: app.globalData.host + 'phone/getUsersByOpen',
          data: {
            openId: res.data
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: token
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success(res) {
            that.setData({
              infodata: res.data.data
            })
          },
          fail: () => {},
        });
      }
    })

  },
  // 添加用户信息
  addInfo() {
    wx.navigateTo({
      url: '/pages/addinfo/addinfo'
    })
  },
  // 确认添加
  affirm() {
    var that = this;

    if (that.data.isOrder == 1) {
      var idCard;
      var numName;
      that.data.infodata.forEach(function (item) {

        if (that.data.choosePerson[0] == item.id) {
          idCard = item.id_number,
            numName = item.real_name
        }
      });
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        mydata: {
          idCard: idCard,
          numName: numName
        }
      })
      wx.navigateBack({
        delta: 1
      })


    } else {
      wx.setStorage({
        key: "choosePerson",
        data: that.data.choosePerson
      })
      wx.navigateTo({
        url: '/pages/chooseroomdetail/chooseroomdetail'

      })

    }
  }

})