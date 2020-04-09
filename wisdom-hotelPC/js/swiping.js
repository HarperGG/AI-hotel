< script >
  $(document).ready(function () {

    $(".photograph").mLoading({
      text: "识别中...", //加载文字，默认值：加载中...
      icon: "", //加载图标，默认值：一个小型的base64的gif图片
      html: true, //设置加载内容是否是html格式，默认值是false
      content: "", //忽略icon和text的值，直接在加载框中显示此值
      mask: true //是否显示遮罩效果，默认显示
    });
    $(".photograph").mLoading("hide"); //隐藏loading组件
    //获得video摄像头区域
    let video = document.getElementById("video");
    let constraints = {
      video: {
        width: 800,
        height: 500
      },
      audio: true
    };
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(function (MediaStream) {
      video.srcObject = MediaStream;
      video.play();
    }).catch(function (PermissionDeniedError) {
      console.log(PermissionDeniedError);
    })

    $(".scan").click(function () {
      $(".photograph").mLoading("show"); //显示loading组件
      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 800, 500);
      var image = new Image();
      image.src = canvas.toDataURL("image/png");
      var fileImg = dataURLtoFile(image.src, '1.jpg')
      var formdata = new FormData();
      formdata.append("file", fileImg);
      // 判断是入住还是退房
      if (window.sessionStorage.getItem('check') == 0) {
        $.ajax({
          type: "post",
          url: "http://jiangwei.online:8080/uploadImg",
          cache: false,
          headers: {
            token: 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODYwNDk1NjIsInN1YiI6IjQyMTIyMzE5OTkwODIyMDAxOCIsImlhdCI6MTU4NjAwNjM2MjE1MH0.MxiPm9jM51GTcLSovmWKuXt7DpAvGcZt_JwVX1Wlpudm39hppPRVwQTcve0Hb_5QF-xmM-V2PDibhrSvrtKiXQ'
          },
          processData: false,
          contentType: false,
          data: formdata,
          dataType: "json",
          success: function (res) {
            $.ajax({
              type: "post",
              url: "http://jiangwei.online:8080/phone/isOne",
              // url: "http://jiangwei.online:8080/phone/isOne?name="+res.data+"&occasion=0",
              data: {
                name: res.data,
                occasion: 0
              },
              headers: {
                token: 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODYwNDk1NjIsInN1YiI6IjQyMTIyMzE5OTkwODIyMDAxOCIsImlhdCI6MTU4NjAwNjM2MjE1MH0.MxiPm9jM51GTcLSovmWKuXt7DpAvGcZt_JwVX1Wlpudm39hppPRVwQTcve0Hb_5QF-xmM-V2PDibhrSvrtKiXQ'
              },
              dataType: "json",
              success: function (res) {
                if (res.code == 200) {
                  window.sessionStorage.setItem('infoData', res.data)
                  setTimeout(function () {
                    var notification = new NotificationFx({
                      message: `<span class="icon icon-calendar"></span>
                          <p>人脸信息比对成功！</p>
                          <p>正在跳转...</p>`,
                      layout: 'attached',
                      effect: 'bouncyflip',
                      type: 'warning', // notice, warning or error
                    });
                    notification.show();
                    $(".photograph").mLoading("hide"); //隐藏loading组件
                  }, 1200);

                  setTimeout(function () {
                    window.location.href = './check_in.html'
                  }, 1000)
                } else {
                  setTimeout(function () {
                    var notification = new NotificationFx({
                      message: `<span class="icon icon-calendar"></span>
                    <p>人脸信息比对失败...</p>`,
                      layout: 'attached',
                      effect: 'bouncyflip',
                      type: 'warning', // notice, warning or error
                    });
                    notification.show();
                    $(".photograph").mLoading("hide"); //隐藏loading组件
                  }, 1200);
                }
              },
              error: function (error) {
                setTimeout(function () {
                  var notification = new NotificationFx({
                    message: `<span class="icon icon-calendar"></span>
                       <p>人脸信息比对失败...</p>`,
                    layout: 'attached',
                    effect: 'bouncyflip',
                    type: 'warning', // notice, warning or error
                  });
                  notification.show();
                  $(".photograph").mLoading("hide"); //隐藏loading组件
                }, 1200);
              }
            });
          }
        });
      } else {
        $.ajax({
          type: "post",
          url: "http://jiangwei.online:8080/uploadImg",
          cache: false,
          processData: false,
          contentType: false,
          data: formdata,
          dataType: "json",
          success: function (res) {
            $.ajax({
              type: "post",
              url: "http://jiangwei.online:8080/phone/isOne",
              data: {
                name: res.data,
                occasion: 1
              },
              dataType: "json",
              success: function (res) {
                window.sessionStorage.setItem('infoData', JSON.stringify(res.data))
                window.sessionStorage.setItem('idCardNum', res.data[0].id_number)
                console.log(res);
                setTimeout(function () {
                  var notification = new NotificationFx({
                    message: `<span class="icon icon-calendar"></span>
                          <p>人脸信息比对成功！</p>
                          <p>正在跳转...</p>`,
                    layout: 'attached',
                    effect: 'bouncyflip',
                    type: 'warning', // notice, warning or error
                  });
                  notification.show();
                  $(".photograph").mLoading("hide"); //隐藏loading组件
                }, 1200);

                setTimeout(function () {
                  window.location.href = './check_out.html'
                }, 1000)

              },
              error: function (error) {
                setTimeout(function () {
                  var notification = new NotificationFx({
                    message: `<span class="icon icon-calendar"></span>
                                  <p>人脸信息比对失败...</p>`,
                    layout: 'attached',
                    effect: 'bouncyflip',
                    type: 'warning', // notice, warning or error
                  });
                  notification.show();
                  $(".photograph").mLoading("hide"); //隐藏loading组件
                }, 1200);
              }
            });
          }
        });
      }
    })

    function dataURLtoFile(dataurl, filename) { //将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: mime
      });
    }
  }) <
  /script>
