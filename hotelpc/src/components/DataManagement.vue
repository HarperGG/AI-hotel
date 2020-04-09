<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="dataTitle">
            <span class="title-info">日销售</span>
            <span class="header-text">单</span>
          </div>
          <span class="content-text">{{houseInfo.daySale}}</span>
          <div class="content-footer">
            <span>最大日销售</span>
            <span>15单<i class="el-icon-s-flag"></i></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="dataTitle">
            <span class="title-info">周销售</span>
            <span style=" background-color:#333 " class="header-text">单</span>
          </div>
          <span class="content-text">{{houseInfo.weekSale}}</span>
          <div class="content-footer">
            <span>最大周销售</span>
            <span>200单<i class="el-icon-s-home"></i></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="dataTitle">
            <span class="title-info">月销售</span>
            <span style=" background-color:#009688 " class="header-text">单</span>
          </div>
          <span class="content-text">{{houseInfo.monSale}}</span>
          <div class="content-footer">
            <span>最大月销售</span>
            <span>1000单<i class="el-icon-s-marketing"></i></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="dataTitle">
            <span class="title-info">房间空闲</span>
            <span style=" background-color:#FFB800 " class="header-text">间</span>
          </div>
          <span class="content-text">{{houseInfo.leisure}}</span>
          <div class="content-footer">
            <span>房间总数</span>
            <span>500间<i class="el-icon-info"></i></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="dataTitle">
            <span class="title-info">待清理</span>
            <span style=" background-color:#F56C6C " class="header-text">间</span>
          </div>
          <span class="content-text">{{houseInfo.clear}}</span>
          <div class="content-footer">
            <span>共需清理</span>
            <span>500间<i class="el-icon-s-tools"></i></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="dataTitle">
            <span class="title-info">待维修</span>
            <span style=" background-color:#909399 " class="header-text">间</span>
          </div>
          <span class="content-text">{{houseInfo.repair}}</span>
          <div class="content-footer">
            <span>废弃房间</span>
            <span>10间<i class="el-icon-s-release"></i></span>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row class="content-info" :gutter="10">
      <el-col :span="18">
        <el-card class="box-card" style="height:420px">
          <div slot="header" class="clearfix">
            <span>近七天销售额</span>
            <el-button circle size="mini" type="primary" icon="el-icon-loading"></el-button>
          </div>
          <div id="myChart" :style="{width: '100%', height: '350px'}"></div>

        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" style="height:420px;">
          <div slot="header" class="clearfix">
            <span style="font-size:12px">销售数据</span>
            <el-select @change="changeOption" size="small" style="float: right; padding: 3px 0;width:100px" v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="content-excel">
            <div class="content-test">
              <div class="content-excel-item" v-for="item in initData" :key="item.index">
                <div>{{item}}</div>
                <div>
                  <el-button @click="downloadFile(item+'')" circle size="mini" style="background:rgba(0,150,136)" type="info" icon="el-icon-download">
                  </el-button>
                </div>
              </div>
            </div>
          </div>


        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataNew: [],
        // 初始数据
        initData:{},
        options: [],
        value: '',
        salesTimeData:[],
        salesData:[],
        //房间信息
        houseInfo:[],
        //初始年
        initYear:''
      }
    },
    created() {
      this.getSalesData()
      this.getHouseInfo()
      this.getfileData()
    },
    mounted() {
      
    },
    methods: {
      // 下载文件
      downloadFile(fileName){
        console.log(encodeURIComponent(fileName));
        window.open('http://jiangwei.online:8080/downAnalysis/'+this.initYear+'/'+encodeURIComponent(fileName),'_blank')
      },
      // 选择年限
      changeOption(e){
        console.log(e);
        this.initYear = e
        this.dataNew.forEach(item=>{
          if(item.years == e){
            this.initData = item.data
          }
        })
      },
      // 获取近七天销售额
      getSalesData(){
        var _this = this
        _this.$http.get('getRecent7Data')
          .then(res => {
            if (res.data.code != 200) return _this.$message.error(res.data.msg)
            console.log(res);
            let newTimeData=[];
            let newData = []
            res.data.data.forEach(item=>{
             newTimeData.push(_this.setTime(item.date))
             newData.push(item.money)
            })
             _this.salesTimeData = newTimeData
             _this.salesData = newData
             _this.drawLine()

          }).catch(() => {
            _this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取近七天销售额信息失败',
              type: 'error'
            });
          })
      },
      // 获取住房情况
      getHouseInfo(){
         var _this = this
        _this.$http.get('getDataStatistic')
          .then(res => {
            if (res.data.code != 200) return _this.$message.error(res.data.msg)
            console.log(res);
            this.houseInfo = res.data.data
          }).catch(() => {
            _this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取房间信息失败',
              type: 'error'
            });
          })
      },
      //格式化时间
      setTime(newTime) {
        var time = new Date(newTime)
        var y = time.getFullYear(),
          m = time.getMonth() + 1,
          d = time.getDate();

          m = m < 10 ? '0' + m : m;
           d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d
      },
      // 获取文件数据
      getfileData(){
        this.options = []
         var _this = this
        _this.$http.get('getCFStatus')
          .then(res => {
            if (res.data.code != 200) return _this.$message.error(res.data.msg)
            console.log(res.data.data);
            const allData = []
            const optionAllData = []
            for(let key in res.data.data){
              console.log(key);
              let optionsData = {
                value: key,
                label: key
              }
              optionAllData.push(optionsData)
               let newData = {
                years: key,
                data: res.data.data[key]
              }
             allData.push(newData)
            }
            this.dataNew = allData
            this.options = optionAllData

            this.initData = res.data.data[this.options[0].value]
            this.initYear = this.options[0].value
            console.log(this.dataNew);
            console.log(this.options);
          }).catch(() => {
            _this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: '获取文件信息失败',
              type: 'error'
            });
          })
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['近七天销售额']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.salesTimeData
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            color: '#6fbae1',
            name: '近七天销售额',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.salesData
          }, ]
        });
      },
    },
  }
</script>

<style lang='less' scoped>
  .main {
    // overflow-y: auto;
    width: 100%;
    height: 100%;

  }

  .dataTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10px;
  }

  .data-info .el-card {
    background-color: rgba(248, 248, 248);
    margin-bottom: 10px;
    
  }

  .el-card {
    border-radius: 0px
  }

  .title-info {
    color: #333;
    font-size: 12px;
  }

  .header-text {
    background-color: #1E9FFF;
    border-radius: 2px;
    display: inline-block;
    padding: 0 6px;
    font-size: 12px;
    text-align: center;
    color: #fff;
  }

  .content-text {
    font-size: 30px;
    color: #666;
    line-height: 36px;
    padding: 5px 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;

  }

  .content-footer {
    margin-top: 5px;
    color: #666;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%
  }

  .content-info {
    margin-top: 10px;
  }

  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10px;
  }

  .content-excel {
    height: 330px;
    overflow-y: auto;
    width: 100%;

  }

  .content-excel-item {
    color: #666;
    border-top: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    border-left: 1px solid #e6e6e6;
    height: 40px;
    display: flex;


  }


  .content-excel-item:nth-last-of-type(1) {
    border-bottom: 1px solid #e6e6e6;
  }

  .content-excel-item div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content-excel-item div:nth-of-type(1) {

    width: 80%;
    border-right: 1px solid #e6e6e6;
  }

  .content-excel-item div:nth-of-type(2) {

    width: 20%;
  }
</style>