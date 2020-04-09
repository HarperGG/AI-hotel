<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>图片管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <el-alert type="info" center show-icon title="图片管理">
      </el-alert>

      <el-row>
        <el-row v-for="item in imgData" :key="item.index">
          <div :data-type="item.imgType" ref="dataType"></div>
          <el-divider content-position="left">{{item.name}}图片</el-divider>
          <el-upload action="123" :http-request="imgUpLoad" auto-upload list-type="picture-card" :file-list="item.imgs"
            :limit="5" :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus" @click="getImgType(item.imgType)"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-row>
      </el-row>


    </el-card>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 房间数据
        imgData: [],
        searchRoomType: '',
        // dialog是否访问
        roomDialogFormVisible: false,
        formLabelWidth: '80px',
        // 图片上传
        dialogImageUrl: '',
        dialogVisible: false,
        imgType: '',
        flog: true
      }
    },
    created() {
      // 获取房屋信息
      this.getRoomData()
    },
    methods: {
      // 获取所有图片
      getRoomData() {
        this.$http.get('web/getAllTypeImg')
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            console.log(res);
            const allData = []
            for (let key in res.data.data) {
              const newImg = []
              res.data.data[key].data.forEach(item => {
                let newItem = {
                  id: item.id,
                  url: 'http://jiangwei.online:8080/static/' + item.path
                }
                newImg.push(newItem)
              })
              let newData = {
                name:res.data.data[key].name,
                imgType: key,
                imgs: newImg
              }
              allData.push(newData)
            }
            this.imgData = allData
            console.log(this.imgData);
          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取图片信息失败',
              type: 'error'
            });
          })
      },
      // 上图片绑定type
      getImgType(type) {
        this.imgType = type
      },
      // 上传
      imgUpLoad(file) {
        let that = this
        var formData = new FormData();
        formData.append('file', file.file)
        that.$http.post('uploadHotelImg', formData)
          .then(res => {
            console.log(res);
            if (res.data.code != 200) return that.$message.error(res.data.msg)
            let imgPath = res.data.data

            that.$http.post('web/addHotelImg', this.$qs.stringify({
                house_type: this.imgType,
                path: imgPath
              }))
              .then(res => {
                if (res.data.code != 200) return that.$message.error(res.data.msg)
                that.$message.success(res.data.msg)
                // that.getRoomData()

              }).catch(() => {
                this.$message({
                  dangerouslyUseHTMLString: true,
                  showClose: true,
                  message: '获取图片信息失败',
                  type: 'error'
                });
              })
          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取图片信息失败',
              type: 'error'
            });
          })
      },
      // 超过五张图片
      handleExceed() {
        this.$message.warning(`最多只能选择5张图片`);
      },
      handleRemove(file) {
        var that = this
        that.$http.delete('web/deleteHotelImg', {
          params:{
            id:file.id
          }
        })
        .then(res => {
          if (res.data.code != 200) return that.$message.error(res.data.msg)
          console.log(that.imgData);
          that.$message.success(res.data.msg)

        }).catch(() => {
          this.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '获取图片信息失败',
            type: 'error'
          });
        })

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    },
  }
</script>

<style lang='less' scoped>
  .el-icon-plus {
    width: 100%;
    height: 100%;
    line-height: 146px;
  }

  .main {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }

  .el-alert {
    margin-bottom: 20px;
  }

  .el-tag {
    width: 100px;
    text-align: center;

  }

  .el-tag+.el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .addRoom {
    cursor: pointer;
  }
</style>