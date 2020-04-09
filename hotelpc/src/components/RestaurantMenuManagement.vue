<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>餐厅管理</el-breadcrumb-item>
      <el-breadcrumb-item>餐厅订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <!-- <el-alert center type="info" show-icon title="订单管理">
      </el-alert> -->
      <div style="margin-top:10px;margin-bottom:10px" class="title">
        <el-input type="number" style="width:100%" placeholder="请输入身份证号码" size="small " v-model="searchIdNum"
          class="input-with-select">
          <el-button @click="searchPerson()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- <el-button type="primary" @click="addOrder" icon="el-icon-circle-plus-outline" size="small"></el-button> -->
      </div>

      <!-- table表 -->
      <el-table border highlight-current-row :data="tableData" size="mini" style="width: 100%">

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="手机号:">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="菜单详情:">
                <span v-for="item in props.row.items" :key="item.index">
                  <el-tag>{{item.name}}</el-tag>
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80">
        </el-table-column>

        <el-table-column prop="id_number" label="身份证号" width="180">
        </el-table-column>
        <el-table-column label="是否配送" width="80">
          <template scope="scope">
            <el-switch v-model="scope.row.is_delivery" disabled>
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="check_in_time" label="下单时间">
        </el-table-column>
        <el-table-column prop="create_at" label="送餐时间">
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
        <el-form :model="dialogData" :label-width="formLabelWidth" size="small">
          <el-form-item label="身份证号" :label-width="formLabelWidth">
            <el-input :disabled="true" v-model="dialogData.id_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="住房类型" :label-width="formLabelWidth">

          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input clearable v-model="dialogData.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="入住时间" :label-width="formLabelWidth">
            <!-- <el-input v-model="dialogData.check_in_time" autocomplete="off"></el-input> -->
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="dialogData.check_in_time" style="width: 100%;">
                </el-date-picker>
              </el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="dialogData.check_in_time" style="width: 100%;">
                </el-time-picker>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item label="退房时间" :label-width="formLabelWidth">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="dialogData.check_out_time" style="width: 100%;">
                </el-date-picker>
              </el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="dialogData.check_out_time" style="width: 100%;">
                </el-time-picker>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roomDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrder">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchIdNum: '',
        tableData: [],
        roomDialogFormVisible: false,
        formLabelWidth: '80px',
        dialogData: [],
        // 当前页
        totalNum: 0,
        currentPage: 0,
        // 是否是搜索
        isSearch: false,
        uploadAction: '',

      }
    },
    created() {
      // 获取房屋信息
      this.getRestOrders()
    },
    methods: {
      getRestOrders(page = 1) {
        this.$http.get('phone/getRestOrders/' + page)
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            this.isSearch = false
            res.data.data.data.forEach(item => {
              item.check_in_time = this.setTime(item.check_in_time)
              item.create_at = this.setTime(item.create_at)
              item.items = JSON.parse(item.items)
              if (item.is_delivery == 1) {
                item.is_delivery = true
              } else {
                item.is_delivery = false
              }
            })
            this.totalNum = res.data.data.total
            this.currentPage = res.data.data.currentPage + 1
            this.tableData = res.data.data.data

          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取订单失败',
              type: 'error'
            });
          })
      },
      // 查找
      searchPerson(page = 1) {
        if (this.searchIdNum == '') {
          return this.$message.warning('请输入身份证号码')
        }
        this.$http.get('phone/SearchRestOrdersById/' + this.searchIdNum + '/' + page)
          .then(res => {
            this.tableData = res.data.data
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            this.isSearch = true
            res.data.data.data.forEach(item => {
              item.check_in_time = this.setTime(item.check_in_time)
              item.create_at = this.setTime(item.create_at)
              item.items = JSON.parse(item.items)
              if (item.is_delivery == 1) {
                item.is_delivery = true
              } else {
                item.is_delivery = false
              }
            })
            this.totalNum = res.data.data.total
            this.currentPage = res.data.data.currentPage + 1
            this.tableData = res.data.data.data

          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '删除订单信息失败',
              type: 'error'
            });
          })
      },
      //添加订单
      addOrder() {
        this.roomDialogFormVisible = true
      },
      // 页码改动函数
      handleCurrentChange(page) {
        this.currentPage = page
        if (this.isSearch == true) {
          this.searchPerson(page)
        } else {
          this.getRestOrders(page)
        }
      },

      //删除
      handleDelete(row) {

        this.$confirm('是否删除此订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('phone/deleteRestOrder/' + row.id)
            .then(res => {
              if (res.data.code != 200) return this.$message.error(res.data.msg)

              if (this.isSearch == true) {
                this.searchPerson(this.currentPage)
              } else {
                this.getRestOrders(this.currentPage)
              }

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

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    text-align: left;
  }

  .el-tag {
    margin-right: 10px;
  }
</style>