var app = getApp()
const {
  $Message
} = require('../../lib/dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片上传的是哪一个
    classify:1,
    isupload1:false,
    isupload2: false,
    isupload3: false,
    frontPath:'',
    backPath:'',
    idCardNumber:'',
    openId:'',
    realName:'',
    recentPicture:'',
    token:''
  },
  // 添加身份函数
  addUserInfo(e){
    var that = this
    if (e.target.dataset.type==1){
      that.setData({
        classify: 1,
      })
      that.addimg('face')
    } else if (e.target.dataset.type == 2) {
      that.setData({
        classify: 2,
      })
      that.addimg('back')
    }
  },
  // 识别照片
  addimg(side) {
    var that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
       
        var tempFilePath = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000,
          success: function () {},
          fail: function () {}
        })
        wx.uploadFile({
          url: app.globalData.host + 'phone/checkInCard',
           header: {
             token: that.data.token
           },
          filePath: tempFilePath[0],
          name: 'file',
          formData: {
            'side': side
          },
          success: function (res) {
            console.log(res);
            if (JSON.parse(res.data).code == 100) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: JSON.parse(res.data).msg,
                showCancel: false,
                success: function (res) {}
              })
            } else if (JSON.parse(res.data).code == 200) {
               console.log(JSON.parse(res.data));
              wx.hideToast();
              $Message({
                content: JSON.parse(res.data).msg,
                type: 'success'
              });
              if (that.data.classify==1){
                that.setData({
                  isupload1: true,
                  frontPath: JSON.parse(res.data).data[0],
                  realName: JSON.parse(res.data).data[5],
                  idCardNumber: JSON.parse(res.data).data[3]
                })
              } else if (that.data.classify == 2) {
                that.setData({
                  isupload2: true,
                  backPath: JSON.parse(res.data).data[1]
                })
              } else if (that.data.classify == 3) {
                that.setData({
                  isupload3: true,
                  recentPicture: JSON.parse(res.data).data
                })
              }
              
            }
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) {}
            }) 
          }
        });
      }
    });
  },
    // 识别照片
addimg1() {
      var that = this;
      wx.chooseImage({
        count: 1, //最多可以选择的图片总数
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var tempFilePath = res.tempFilePaths;
          //启动上传等待中...
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 10000,
            success: function () {},
            fail: function () {}
          })
          wx.uploadFile({
            url: app.globalData.host + 'uploadImg',
             header: {
               token: that.data.token
             },
            filePath: tempFilePath[0],
            name: 'file',
            success: function (res) {
              console.log(res);
              if (JSON.parse(res.data).code == 100) {
                wx.hideToast();
                wx.showModal({
                  title: '错误提示',
                  content: JSON.parse(res.data).msg,
                  showCancel: false,
                  success: function (res) {}
                })
              } else if (JSON.parse(res.data).code == 200) {
                 console.log(JSON.parse(res.data));
                 wx.hideToast();
                 $Message({
                   content: JSON.parse(res.data).msg,
                   type: 'success'
                 });
                  that.setData({
                    isupload3: true,
                    recentPicture: JSON.parse(res.data).data
                  })
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) {}
              })
            }
          });
        }
      });
    },
  // 添加用户
  submitUser() {
    var that = this;
     wx.request({
       url: app.globalData.host + 'phone/addUserMessage',
       data: {
           front: that.data.frontPath,
           back: that.data.backPath,
           idNumber: that.data.idCardNumber,
           open_id: that.data.openId,
           realName: that.data.realName,
           recent: that.data.recentPicture
       },
       method: 'POST',
        
       header:{
        'Content-Type': 'application/x-www-form-urlencoded',
        token: that.data.token
       },
       dataType: 'json',
       success: (res) => {
         console.log(res);
         if(res.data.code == 200){
            $Message({
              content: '添加成功，正在跳转',
              type: 'success'
            });
            setTimeout(function () {  
               wx.navigateTo({
                 url: '/pages/myinfo/myinfo'
               })
            },1800)
         }else if(res.data.code==100){
           $Message({
             content: res.data.msg,
             type: 'warming'
           });
         }else{
            $Message({
              content: '上传失败',
              type: 'warming'
            });
         }
       },
       fail: () => {
         $Message({
           content: '添加失败',
           type: 'warming'
         });
       },
       complete: () => {}
     });
  },
  onLoad: function (options) {
    var that = this

     wx.getStorage({
       key: 'token',
       success(res) {
         that.setData({
           token: res.data
         })
       }
     })


    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId:res.data
        })
      }
    })
  },
})