<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>餐厅管理</el-breadcrumb-item>
      <el-breadcrumb-item>餐厅菜单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <!-- <el-alert center type="info" show-icon title="订单管理">
      </el-alert> -->
      <div style="margin-top:10px;margin-bottom:10px" class="title">
        <el-input style="width:95%" placeholder="请输入菜品名" size="small " v-model="searchcontent"
          class="input-with-select">
          <el-button @click="searchPerson()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="addOrder" icon="el-icon-circle-plus-outline" size="small"></el-button>
      </div>

      <!-- table表 -->
      <el-table :data="tableData" size="small" style="width: 100%;">
        <el-table-column prop="money" label="价格" width="180">
          <template scope="scope">
            <span>￥ {{scope.row.money}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜名">
        </el-table-column>
        <el-table-column label="照片" width="180">
          <template scope="scope">
            <el-image style="height:100px" :src="'http://jiangwei.online:8080/static/'+scope.row.path"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot="header" slot-scope="">
          </template>
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
      <el-dialog width="40%" center :title="orderName" :visible.sync="DialogFormVisible">
        <el-divider></el-divider>
        <el-form :rules="rulesData" ref="refRuleForm" :model="dialogData" :label-width="formLabelWidth" size="small">

          <el-form-item prop="name" label="菜名" :label-width="formLabelWidth">
            <el-input v-model="dialogData.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="money" label="价格" :label-width="formLabelWidth">
            <el-input v-model="dialogData.money" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="菜品类型" :label-width="formLabelWidth">
            <el-select v-model="dialogData.type" placeholder="请选择">
              <el-option v-for="item in roomType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片" :label-width="formLabelWidth">
            <el-upload style="width:800px;" name="file" accept=".jpg,.png"
              action="http://jiangwei.online:8080/uploadMenuImg" :show-file-list="false"
              :on-success="handleAvatarSuccess"
               :headers="headers">
              
              <img v-if="!(picUrl=='')" style="  width: 178px;height: 178px;  border: 1px dashed #d9d9d9;"
                :src="'http://jiangwei.online:8080/static/'+picUrl" class="avatar">
              <i v-else style="border: 1px dashed #d9d9d9;" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="DialogFormVisible = false">取 消</el-button>
          <el-button v-if="isconfirmAdd" type="primary" @click="submitUpload">确 定</el-button>
          <el-button v-if="!isconfirmAdd" type="primary" @click="confirmAdd">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rulesData: {
          name: [{
            required: true,
            message: '请输入菜品名',
            trigger: 'blur'
          }],
          money: [{
            required: true,
            message: '请输入菜品价格',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请选择菜品类型',
            trigger: 'change'
          }],
        },
        searchcontent: '',
        tableData: [],
        DialogFormVisible: false,
        formLabelWidth: '80px',
        dialogData: {},
        totalNum: 0,
        isconfirmAdd: true,
        currentPage: 1,
        uploadAction: '',
        orderName: '',
        picUrl: '',
        uploadForm: new FormData(),
        //分页权限
        isSearch: false,
        headers:'',
        roomType: [{
            value: '0',
            label: '西餐'
          },
          {
            value: '1',
            label: '甜点'
          },
          {
            value: '2',
            label: '特色菜'
          },
          {
            value: '3',
            label: '北方菜'
          },
          {
            value: '4',
            label: '南方菜'
          }
        ]
      }
    },
    created() {
      this.getMenuInfo()
      this.headers = {
        token: window.sessionStorage.getItem('token')
      }
     
    },
    methods: {
      // 上传图片成功
      handleAvatarSuccess(res) {
        this.picUrl = res.data
      },
      getMenuInfo(page = '1') {
        this.$http.get('/web/getMenus/' + page)
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            console.log(res);

            this.isSearch == false
            this.tableData = res.data.data.data
            this.totalNum = res.data.data.total
            this.currentPage = res.data.data.currentPage + 1
          }).catch(() => {
            this.$message.error('菜单信息失败')
          })
      },
      // 查找
      searchPerson(page = '1') {
        if (this.searchcontent == '') {
          return this.$message.warning('请输入菜品名')
        }
        this.$http.get('web/searchMenuItemByName/' + this.searchcontent + '/' + page)
          .then(res => {
            console.log(res);
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            this.tableData = res.data.data.data
            this.totalNum = res.data.data.total
            this.currentPage = res.data.data.currentPage + 1
            this.isSearch = true
          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '查询失败',
              type: 'error'
            });
          })
      },
      // 编辑
      handleEdit(row) {
        this.orderName = '编辑菜单'
        this.isconfirmAdd = true
        this.DialogFormVisible = true
        this.dialogData = row
        this.picUrl = row.path
      },
      // 提交
      submitUpload() {
        this.$refs.refRuleForm.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return;

          delete this.dialogData.create_at
          delete this.dialogData.update_at
          this.dialogData.path = this.picUrl

          this.$http.put('web/updateMenuItem', this.$qs.stringify(this.dialogData)).then(res => {
            console.log(res);
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.DialogFormVisible = false
              this.getMenuInfo(this.currentPage)
            }
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
      addOrder() {
        this.orderName = '添加菜单'
        this.isconfirmAdd = false
        this.DialogFormVisible = true
        this.dialogData = {}
        this.picUrl = ''
      },

      confirmAdd() {
        this.$refs.refRuleForm.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return;

          if (this.picUrl == '') return this.$message.warning('请添加图片')

          this.dialogData.path = this.picUrl
          this.$http.post('web/addMenuItem', this.$qs.stringify(this.dialogData))
            .then(res => {
              if (res.data.code != 200) return this.$message.error(res.data.msg)
              this.getMenuInfo()
              this.DialogFormVisible = false
              this.$message.success("添加成功！")
            }).catch(() => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: '添加失败',
                type: 'error'
              });
            })
        })
      },
      //删除
      handleDelete(row) {
        this.$http.delete('web/deleteMenuItem', {
            params: {
              id: row.id
            }
          })
          .then(res => {
            if (res.data.code != 200) return this.$message.error(res.data.msg)
            this.$message.success("删除成功！")
            if (this.isSearch == true) {
              this.searchPerson(this.currentPage)
            } else {
              this.getMenuInfo(this.currentPage)
            }
          }).catch(() => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '删除失败',
              type: 'error'
            });
          })
      },
      // 页码改动函数
      handleCurrentChange(page) {
        this.currentPage = page
        if (this.isSearch == true) {
          this.searchPerson(page)
        } else {
          this.getMenuInfo(page)
        }
      },

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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>