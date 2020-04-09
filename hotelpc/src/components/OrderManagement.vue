<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <!-- <el-alert center type="info" show-icon title="订单管理">
      </el-alert> -->
      <div style="margin-top:10px;margin-bottom:10px" class="title">
        <el-input style="width:95%" placeholder="请输入身份证号码" size="small " v-model="searchIdNum"
          class="input-with-select">
          <el-button @click="searchPerson()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="addOrder" icon="el-icon-circle-plus-outline" size="small"></el-button>
      </div>

      <!-- table表 -->
      <el-table border highlight-current-row :data="tableData" size="mini" style="width: 100%">
        <el-table-column prop="room_number" label="房间号" width="180">
        </el-table-column>
        <el-table-column prop="id_number" label="身份证号" width="180">
        </el-table-column>
        <el-table-column prop="house_type" label="住房类型">
          <template scope="scope">
            <div v-for="item in roomType" :key="item.index">
              <div v-if="scope.row.house_type==item.value">
                {{item.label}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="check_in_time" label="入住时间">
        </el-table-column>
        <el-table-column prop="check_out_time" label="退房时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="margin-top:10px;text-align:center">
        <el-pagination center :hide-on-single-page="true" background @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
      </div>

      <!-- dialog -->
      <el-dialog width="40%" center title="编辑订单" :visible.sync="roomDialogFormVisible">
        <el-divider></el-divider>
        <el-form :rules="rulesData" ref="refRuleForm" :model="dialogData" :label-width="formLabelWidth" size="small">
          <el-form-item prop="id_number" label="身份证号" :label-width="formLabelWidth">
            <el-input type="number" v-model="dialogData.id_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="house_type" label="住房类型" :label-width="formLabelWidth">
            <el-select v-model="dialogData.house_type" placeholder="请选择">
              <el-option v-for="item in roomType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="phone" label="手机号" :label-width="formLabelWidth">
            <el-input clearable v-model="dialogData.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="check_in_time" label="入住时间" :label-width="formLabelWidth">
            <el-date-picker v-model="dialogData.check_in_time" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="check_out_time" label="退房时间" :label-width="formLabelWidth">

            <el-date-picker v-model="dialogData.check_out_time" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roomDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoomOrder">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      // 身份证验证规则
      var checkNum = (rule, value, callback) => {
        let str =
          /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (!str.test(String(value))) {
          callback(new Error(`输入合法的身份证号`));
        } else {
          callback();
        }
      }
      // 手机号验证规则
      var phoneNum = (rule, value, callback) => {
        let str = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
        if (!str.test(String(value))) {
          callback(new Error(`输入合法的手机号`));
        } else {
          callback();
        }
      }
      //退房时间言验证
      var check_in_time = (rule, value, callback) => {
        console.log(value);
        if (((new Date().getTime()) - (new Date(this.dialogData.check_in_time).getTime())) > 0) {
          console.log(222);
          callback(new Error(`入住时间必须在当前时间之后`));
        } else {
          console.log(111);
          callback();
        }
      }
      //退房时间言验证
      var check_out_time = (rule, value, callback) => {
        if (((new Date(value).getTime()) - (new Date(this.dialogData.check_in_time).getTime())) < 0) {
          console.log(222);
          callback(new Error(`退房时间必须在入住时间之后`));
        } else {
          console.log(111);
          callback();
        }
      }

      return {
        rulesData: {
          id_number: [{
            required: true,
            message: '请输入身份证号',
            trigger: 'blur'
          }, {
            validator: checkNum,
            trigger: 'blur'
          }],
          phone: [{
              required: true,
              message: '请输手机号',
              trigger: 'blur'
            },
            {
              validator: phoneNum,
              trigger: 'blur'
            }

          ],
          house_type: [{
            required: true,
            message: '请选择房间类型',
            trigger: 'change'
          }],
          check_in_time: [{
              // type: 'date',
              required: true,
              message: '请选择入住日期',
              trigger: 'change'
            },
            {
              validator: check_in_time,
              trigger: 'blur'
            }
          ],
          check_out_time: [{
              // type: 'date',
              required: true,
              message: '请选择退房日期',
              trigger: 'change'
            },
            {
              validator: check_out_time,
              trigger: 'blur'
            }
          ],


        },
        searchIdNum: null,
        tableData: [{
          check_in_time: "",
          check_out_time: "",
          house_type: 103,
          id_number: "",
          phone: "",
          room_number: ''
        }],
        roomDialogFormVisible: false,
        formLabelWidth: '80px',
        dialogData: {
          check_in_time: 0,
          check_out_time: 0,
          house_type: '',
          id_number: "",
          phone: "",
          open_id:'computer'
        },
        idsearch: false,
        // 当前页
        totalNum: 0,
        currentPage: 1,
        uploadAction: '',
        //房间类型
        roomValue: '',
        uuid: '',
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
      this.getOrderInfo()
      this.uuid = this.randomString(10) + Date.parse(new Date())
    },
    methods: {
      getOrderInfo(page = 1) {
        this.$http.get('phone/searchOrderByPage', {
            params: {
              pageNum: page,
              pageSize: 10,
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.code != 200) return this.$message.error("获取订单失败")
            res.data.data.content.forEach(item => {
              item.check_in_time = this.setTime(item.check_in_time)
              item.check_out_time = this.setTime(item.check_out_time)
            })
            this.idsearch = false
            this.totalNum = res.data.data.totalSize
            this.currentPage = res.data.data.pageNum
            this.tableData = res.data.data.content
          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取订单失败',
              type: 'error'
            });
          })
      },
      // 生辰uuid
      randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      // 查找
      searchPerson(page = 1) {
        this.$http.get('phone/searchOrderByPage', {
            params: {
              pageNum: page,
              pageSize: 10,
              num: this.searchIdNum
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.code != 200) return this.$message.error(res.data.msg)

            res.data.data.content.forEach(item => {
              item.check_in_time = this.setTime(item.check_in_time)
              item.check_out_time = this.setTime(item.check_out_time)
            })
            this.idsearch = true
            this.totalNum = res.data.data.totalSize
            this.currentPage = res.data.data.pageNum
            this.tableData = res.data.data.content
          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取订单失败',
              type: 'error'
            });
          })
      },
      // 页码改动函数
      handleCurrentChange(page) {
        this.currentPage = page
        if (this.idsearch == true) {
          this.searchPerson(page)
        } else {
          this.getOrderInfo(page)
        }
      },
      //添加订单
      addOrder() {
        this.dialogData = {}
        this.roomDialogFormVisible = true
      },
      addRoomOrder() {
        this.$refs.refRuleForm.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return;
          this.dialogData.check_in_time = this.setTime(new Date(this.dialogData.check_in_time))
          this.dialogData.check_out_time = this.setTime(new Date(this.dialogData.check_out_time))
          this.$http.post('phone/addHouseOrder/'+this.uuid, [this.dialogData])
            .then(res => {
              if (res.data.code != 200) return this.$message.error(res.data.msg)
              setTimeout(()=>{
                this.getIdByUuid()
              },1500)
              

            }).catch(() => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: '添加的订单失败',
                type: 'error'
              });
            })
        })
      },
       getIdByUuid() {
       
      this.$http.get('phone/getIdByUuid/' + this.uuid)
        .then(res => {
          console.log(res);
          if (res.data.code != 200) return this.$message.error(res.data.msg)
        this.getStatusById(res.data.data)

        }).catch(() => {
          this.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '添加的订单失败',
            type: 'error'
          });
        })
       
      },
       getStatusById(rest) {
       
      this.$http.get('phone/getStatusById/house/' + rest)
        .then(res => {
          console.log(res);
         if (res.data.code != 200)  return this.$message.error(res.data.msg)
        this.roomDialogFormVisible = false
        this.$message.success("添加订单成功！")
        this.getOrderInfo(this.currentPage)
        }).catch(() => {
          this.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '添加的订单失败',
            type: 'error'
          });
        })
       
      },
      //删除
      handleDelete(row) {
        this.$confirm('是否删除此房间, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http.delete('phone/deleteOrderById', {
              params: {
                id: 1
              }
            })
            .then(res => {
              if (res.data.code != 200) return this.$message.error(res.data.msg)
              if (this.idsearch == true) {
                this.searchPerson(this.currentPage)
              } else {
                this.getOrderInfo(this.currentPage)
              }

            }).catch(() => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: '删除订单信息失败',
                type: 'error'
              });
            })



        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });




        console.log(row);

      },
      //格式化时间
      setTime(newTime) {
        var time = new Date(newTime)
        var y = time.getFullYear(),
          m = time.getMonth() + 1,
          d = time.getDate(),
          H = time.getHours(),
          M = time.getMinutes(),
          S = time.getSeconds();

        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        H = H < 10 ? '0' + H : H;
        M = M < 10 ? '0' + M : M;
        S = S < 10 ? '0' + S : S;

        return y + '-' + m + '-' + d + ' ' + H + ':' + M + ':' + S
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

  .title {
    display: flex;
    justify-content: space-between;
  }
</style>