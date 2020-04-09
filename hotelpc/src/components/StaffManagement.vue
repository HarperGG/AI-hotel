<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <!-- <el-alert center type="info" show-icon title="订单管理">
      </el-alert> -->
      <div style="margin-top:10px;margin-bottom:10px" class="title">
        <el-input style="width:95%" placeholder="请输入身份证号码" size="small " v-model="searchIdNum"
          class="input-with-select">
          <el-button type="number" @click="searchPerson()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="addStaff" icon="el-icon-circle-plus-outline" size="small"></el-button>
      </div>

      <!-- table表 -->
      <el-table border highlight-current-row :data="tableData" size="mini" style="width: 100%">
        <el-table-column prop="id" label="id" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="num" label="身份证号">
        </el-table-column>
        <el-table-column prop="iphone" label="手机号">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="role" label="职位">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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
      <el-dialog width="40%" center :title="dialogName" :visible.sync="DialogFormVisible">
        <el-divider></el-divider>
        <el-form ref="refFromData" :rules="rulesData" :model="dialogData" :label-width="formLabelWidth" size="small">
          <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
            <el-input placeholder="请输入姓名" v-model="dialogData.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="num" label="身份证号" :label-width="formLabelWidth">
            <el-input placeholder="请输入身份证号" maxlength="18" :disabled="!addStatus" v-model.number="dialogData.num" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item prop="iphone" label="手机号" :label-width="formLabelWidth">
            <el-input placeholder="请输入手机号"  maxlength="11" clearable v-model.number="dialogData.iphone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
            <el-input placeholder="请输入邮箱" clearable v-model="dialogData.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="role" label="职位" :label-width="formLabelWidth">
            <el-input placeholder="请输入职位" clearable v-model="dialogData.role" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password" v-if="addStatus" label="密码" :label-width="formLabelWidth">
            <el-input placeholder="请输入密码" maxlength="16"  v-model="dialogData.password" show-password></el-input>
          </el-form-item>



        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="DialogFormVisible = false">取 消</el-button>
          <el-button v-if="!addStatus" type="primary" @click="alterStaffInfo">确 定</el-button>
          <el-button v-if="addStatus" type="primary" @click="addStaffInfo">确 定</el-button>
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

      return {
        searchIdNum: null,
        tableData: [],
        totalNum: 0,
        currentPage: 1,
        DialogFormVisible: false,
        formLabelWidth: '80px',
        dialogData: {},
        addStatus: false,
        // dialogName
        dialogName: '',
        //表单规则
        rulesData: {
          num: [{
            required: true,
            message: '请输入身份证号',
            trigger: 'blur'
          }, {
            validator: checkNum,
            trigger: 'blur'
          }],
          iphone: [{
              required: true,
              message: '请输手机号',
              trigger: 'blur'
            },
            {
              validator: phoneNum,
              trigger: 'blur'
            }
            
          ],
          email: [{
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          role: [{
            required: true,
            message: '请填写职位',
            trigger: 'change'
          }],
          password: [{
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }],
          name: [{
            required: true,
            message: '请填写员工姓名',
            trigger: 'blur'
          }]
        }

      }
    },
    created() {
      this.getOrderInfo()
    },
    methods: {
      getOrderInfo(page = '1') {
        this.tableData = []
        this.$http.get('admin/getEmplooyeByPage?pageNum=' + page + '&pageSize=10')
          .then(res => {
            console.log(res);
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            this.tableData = res.data.data.content
            this.totalNum = res.data.data.totalSize
            this.currentPage = res.data.data.pageNum
          }).catch(() => {
            this.$message.error('获取员工信息失败')
          })
      },
      // 页码改动函数
      handleCurrentChange(page) {
        this.currentPage = page
        this.getOrderInfo(page)
      },
      // 查找
      searchPerson() {
        if (this.searchIdNum == '') {
          return this.$message.warning('请输入身份证号码')
        }else{
           this.$http.get('/admin/getEmplooyeBynum', {
             params:{
               num:this.searchIdNum
             }
           })
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            console.log(res);


          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '查询失败',
              type: 'error'
            });
          })
        }

      },
      // 编辑
      handleEdit(row) {
        this.dialogName = '编辑员工信息'
        this.addStatus = false
        this.DialogFormVisible = true
        this.dialogData = JSON.parse(JSON.stringify(row))
      },
      //确认编辑
      alterStaffInfo() {
         this.$refs.refFromData.validate(async valid  => {     
          // 判断验证是否通过
          if (!valid) return;
        this.$http.put('admin/updateEmployee', this.$qs.stringify(this.dialogData))
          .then(res => {
            if (res.data.code != 200) return this.$message.error('修改失败')
            this.$message.success(res.data.msg)
            this.DialogFormVisible = false
            this.getOrderInfo(this.currentPage)

          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '修改失败',
              type: 'error'
            });
          })
          })
      },
      //添加
      addStaff() {
        this.dialogName = '添加员工信息'
        this.DialogFormVisible = true
        this.dialogData = {}
        this.addStatus = true
      },
      //确认添加
      addStaffInfo() {
          this.$refs.refFromData.validate(async valid  => {     
          // 判断验证是否通过
          if (!valid) return;
            this.$http.post('admin/addEmployee', this.$qs.stringify(this.dialogData))
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            this.$message.success(res.data.msg)
            this.DialogFormVisible = false
            this.getOrderInfo(this.currentPage)

          }).catch(() => {
            console.log(111);
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '添加员工信息失败',
              type: 'error'
            });
          })
          })

        
      },
      //删除
      handleDelete(row) {
        this.$confirm('是否删除此员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/admin/deleteEmployee', {
              params: {
                id: row.id
              }
            })
            .then(res => {
              if (res.data.code != 200) return this.$message.error(res.data.msg)
              this.$message.success(res.data.msg)
              this.getOrderInfo1(this.currentPage)
            }).catch(() => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: '删除员工信息失败',
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