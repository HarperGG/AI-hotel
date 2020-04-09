<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>控制台</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <el-alert type="info" show-icon title="页面中的小方块儿代表房间,不同颜色有不同的意义!">
      </el-alert>
      <el-row class="tagTitle" :gutter="10">
        <el-col :span="3">
          <el-tag effect="dark">空闲</el-tag>
        </el-col>
        <el-col :span="3">
          <el-tag effect="dark" type="danger">有人</el-tag>
        </el-col>
        <el-col :span="3">
          <el-tag effect="dark" type="warning">待打扫</el-tag>
        </el-col>
        <el-col :span="3">
          <el-tag effect="dark" type="info">待维修</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-row v-for="item in houseData" :key="item.index">
          <el-divider content-position="left">{{item.floot}}F房间分布</el-divider>
          <el-row>
            <el-tag class="addRoom" @click="showRoom(item1.id,item.floot)" v-for="item1 in item.rooms" :key="item1.id"
              :disable-transitions="false" effect="dark" closable @close="deleteRoom(item1.id)" :type="item1.status">
              {{item1.room_number}}房间</el-tag>
            <el-tag @click="addRoom(item.floot)" class="addRoom" hit type="info" :disable-transitions="false">
              + newRoom</el-tag>
          </el-row>
        </el-row>
      </el-row>
      <el-dialog :title="dialogName" :visible.sync="roomDialogFormVisible">
        <el-divider></el-divider>

        <el-form :rules="rulesData" ref="refRuleForm" :model="roomForm">
          <el-form-item prop="room_number" label="房间号" :label-width="formLabelWidth">
            <el-input :placeholder="'房间号为：'+roomFlootNum+'00-'+roomFlootNum+'99之间'" type="number"
              v-model="roomForm.room_number" autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item prop="name" label="房间名" :label-width="formLabelWidth">
            <el-input placeholder="请输入房间名" v-model="roomForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="money" label="价格" :label-width="formLabelWidth">
            <el-input placeholder="请输入价格" type="number" v-model="roomForm.money" autocomplete="off">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="type" label="住房类型" :label-width="formLabelWidth">
            <el-select v-model="roomForm.type" placeholder="请选择">
              <el-option v-for="item in roomType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间描述" prop="description" :label-width="formLabelWidth">
            <el-input placeholder="请输入房间描述" type="textarea" autocomplete="off" v-model="roomForm.description">
            </el-input>
          </el-form-item>
          <el-form-item prop="area" label="房间面积" :label-width="formLabelWidth">
            <el-input placeholder="请输入房间面积" type="number" v-model="roomForm.area" autocomplete="off">
              <template slot="append">平方米</template>
            </el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="roomDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFlootRoom">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>


  </div>
</template>

<script>
  export default {
    data() {

      var checkRoomNumber = (rule, value, callback) => {
        if (!value) {
           callback(new Error('请输入房间号'));
        }
        else if (String(value).length != 3) {
           callback(new Error('请输入长度为3的房间号'));
        }
        else if ((value + '').slice(0, 1) != this.roomFlootNum) {
           callback(new Error(`输入房间号请以${this.roomFlootNum}开头`));
        }else{
          callback();
        }
      }

      return {
        // 表单验证规则
        rulesData: {
          room_number: [{
            validator: checkRoomNumber,
            trigger: 'blur'
          }, ],
          name: [{
            required: true,
            message: '请输入房间名',
            trigger: 'blur'
          }],
          money: [{
            required: true,
            message: '请输房间价格',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请选择房间类型',
            trigger: 'change'
          }],
          description: [{
            required: true,
            message: '请填写房间描述',
            trigger: 'blur'
          }],
          area: [{
            required: true,
            message: '请输入房间面积',
            trigger: 'blur'
          }]
        },

        // 房间数据
        houseData: [],
        // dialog是否访问
        roomDialogFormVisible: false,
        formLabelWidth: '80px',
        // 单个房间信息
        roomForm: {
          room_number: '',
          name: '',
          money: '',
          type: '',
          description: '',
          area: ''
        },
        alertStatus: false,
        dialogName: '',

        //房间类型
        roomValue: '',
        roomFlootNum: '',
        roomType: [{
            value: 102,
            label: '大床房'
          },
          {
            value: 103,
            label: '双人房'
          },
          {
            value: 104,
            label: '套房'
          },
          {
            value: 105,
            label: '主题房'
          },
          {
            value: 106,
            label: '游泳馆'
          },
          {
            value: 107,
            label: '会议室'
          },
          {
            value: 108,
            label: 'KTV'
          },
          {
            value: 109,
            label: '棋牌室'
          },
          {
            value: 110,
            label: '健身房'
          }
        ]
      }
    },
    created() {
      // 获取房屋信息
      this.getRoomData()
    },
    methods: {
      getRoomData() {
        this.$http.get('web/getHouseStatus')
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            const allData = []
            for (let key in res.data.data) {
              res.data.data[key].forEach(item => {
                var info = '';
                if (item.status == 1) {
                  info = 'danger'
                } else if (item.status == 2) {
                  info = 'info'
                } else if (item.status == 3) {
                  info = 'warning'
                } else {
                  info = ''
                }
                item.status = info
              })
              let newData = {
                floot: key,
                rooms: res.data.data[key]
              }
              allData.push(newData)
            }
            this.houseData = allData
          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取房屋信息失败',
              type: 'error'
            });
          })
      },
      // 删除
      deleteRoom(id) {
        this.$confirm('是否删除此房间, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/web/deleteHouseInfo', {
              params: {
                id: id
              }
            })
            .then(res => {
              if (res.data.code != 200) return this.$message.error(res.data.msg)
              this.getRoomData()
              this.$message.success("删除成功")
            }).catch(() => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: '删除失败',
                type: 'error'
              });
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 显示房间星系  点击修改房间
      showRoom(id, floor) {
        this.dialogName = '房屋信息'
        this.roomFlootNum = floor
        this.alertStatus = true
        this.roomDialogFormVisible = true
        this.$http.get('/web/getHouseByIdForWeb', {
            params: {
              id: id
            }
          })
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            console.log(res);
            this.roomForm = res.data.data

          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '添加失败',
              type: 'error'
            });
          })
      },
      // 点击添加
      addRoom(Num) {
        this.dialogName = '添加房屋信息'
        console.log(Num);
        this.roomForm = {}
        this.alertStatus = false
        this.roomDialogFormVisible = true
        this.roomFlootNum = Num
      },
      // 点击添加修改房间
      addFlootRoom() {

         this.$refs.refRuleForm.validate(async valid  => {     
          // 判断验证是否通过
          if (!valid) return;
          // 提交表单
          if (this.alertStatus == false) {
            this.$http.post('/web/addHouse', this.$qs.stringify(this.roomForm))
              .then(res => {
                // if(JSON.parse(res.data).code==100)return this.$message.error(res.data.msg)
                if (res.data.code != 200) return this.$message.error(res.data.msg)
                this.getRoomData()
                this.$message.success("添加成功")
                this.roomDialogFormVisible = false

              }).catch(() => {
                this.$message({
                  dangerouslyUseHTMLString: true,
                  showClose: true,
                  message: '添加失败',
                  type: 'error'
                });
              })
          } else {
            this.$http.put('/web/updateHouseInfo', this.$qs.stringify(this.roomForm))
              .then(res => {
                if (res.data.code != 200) return this.$message.error(res.data.msg)
                console.log(res);
                this.getRoomData()
                this.$message.success("修改成功")
                this.roomDialogFormVisible = false

              }).catch(() => {
                this.$message({
                  dangerouslyUseHTMLString: true,
                  showClose: true,
                  message: '修改失败',
                  type: 'error'
                });
              })
          }
         })

     




      }
    },
  }
</script>

<style lang='less' scoped>
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
    margin-bottom: 10px;
    margin-right: 10px;
  }

  // .el-tag+.el-tag {
  //   margin-left: 10px;

  // }

  .addRoom {
    cursor: pointer;
  }
</style>