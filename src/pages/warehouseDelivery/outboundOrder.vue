<template>
  <div>
    <div class="box" v-loading="loading">
      <el-form :inline="true"
               size="medium" label-width="100px"
               label-suffix="："
               class="demo-form-inline"
               ref="searchForm">
        <el-form-item label="经销商手机">
          <el-input v-model="mobileNo" placeholder="请输入"></el-input>
        </el-form-item>
        <!--<el-form-item label="是否收费">-->
          <!--<el-select v-model="isGetWarehouseCharge" placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in stateOptions"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="业务类型">
          <el-select v-model="businessType" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in stateOptionTwo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <admin-city-selector
            ref="adminCitySelector"
            :targetLevel="2"
            @select-admin-city="onSelectAdminCity"
            @clean-admin-city="onCleanAdminCity"
          ></admin-city-selector>
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="warehouseId" size="medium" placeholder="请选择仓库">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseId"
              :label="item.name"
              :value="item.warehouseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="stockNo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="入库时间">
          <div class="block">
            <el-date-picker
              v-model="startTime"
              type="date"
              :picker-options="startDatePicker"
              value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="开始日期">
            </el-date-picker>
            <!--value-format=" yyyy-MM-dd" format="yyyy-MM-dd"-->
            <span>至</span>
            <el-date-picker
              v-model="endTime"
              type="date"
              :picker-options="endDatePicker"
              value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="结束日期">
            </el-date-picker>
            <!--<el-date-picker-->
              <!--v-model="timeGroup"-->
              <!--type="daterange"-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始日期"-->
              <!--end-placeholder="结束日期"-->
              <!--value-format=" yyyy-MM-dd" format="yyyy-MM-dd">-->
            <!--</el-date-picker>-->
          </div>
        </el-form-item>
      </el-form>
      <el-row class="query-btn">
          <el-button class="btn-inbox" type="primary" @click="clickSearch" size="medium">查询</el-button>
          <el-button class="btn-inbox" type="info" @click="emptyContent" size="medium">重置</el-button>
      </el-row>
      <!--状态切换-->
      <el-tabs v-model="state" @tab-click="handleClick">
        <!--待支付 = 0,待提货 = 1,待出库 = 2,已出库 = 3,部分出库 = 4,已取消 = 5-->
        <el-tab-pane label="待支付" name='0'></el-tab-pane>
        <el-tab-pane label="待出库" name='2'></el-tab-pane>
        <el-tab-pane label="已出库" name='3'></el-tab-pane>
        <el-tab-pane label="已取消" name='5'></el-tab-pane>
        <el-tab-pane label="全部" name='null'></el-tab-pane>
      </el-tabs>

      <!--表单-->
      <div style="overflow-y:auto;height:520px;">
      <div v-for="item in orderList" style="overflow-y:auto;height:520px;margin-top:10px;">
        <div class="table-header">
          <span style="padding-left: 5px">出库单编号：{{item.stockNo}}</span>
          <span style="padding-left:18px">创建时间：{{item.createTime}}</span>
          <!--目前写死为正常业务-->
          <span class="genre" style=" color: #0096FF;">正常业务</span>
          <!--<span class="genre" style=" color: #0096FF;" v-if="item.businessType">{{item.businessType?'贷款业务':'正常业务'}}</span>-->
          <span class="genre" style=" color: #0096FF;" v-if="!item.deliveryFee">自提</span>
        </div>
        <div class="table-content">
          <el-table
            :data="item.items"
            :show-header="false"
            height="220"
            border
          >
            <el-table-column
              prop="productName"
              show-header="false"
              >
            </el-table-column>
            <el-table-column
              prop="specificationName"
             >
            </el-table-column>
            <el-table-column
              prop="resultUnit"
              >
            </el-table-column>
          </el-table>
          <div class="table-content-div">
            <span>仓库：{{item.warehouseName}}</span>
            <span>经销商手机号：{{item.mobileNo}}</span>
            <span>实际收取费用：{{item.actualAmount?item.actualAmount:0}}</span>
            <!--<span>是否收取费用：{{item.isGetWarehouseCharge?'收取':'不收取'}}</span>-->
            <span>托管费用：￥{{item.depositFee}}</span>
          </div>
          <div class="table-content-state">
            <span v-if="item.state==0">待支付</span>
            <span v-if="item.state==1">待提货</span>
            <span v-if="item.state==2">待出库</span>
            <span v-if="item.state==3">已出库</span>
            <span v-if="item.state==4">部分出库</span>
            <span v-if="item.state==5">已取消</span>
          </div>
          <div class="table-content-state">
            <el-button type="text"  @click="gotoDetail(item.stockNo,item.dealerId)">详情
            </el-button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="pagination">
      <!--<p>每页{{pageSize}}条 | 共{{totalCount}}条记录 | 当前第{{currentPage}}/{{pageCount}}页 | 共{{pageCount}}页</p>-->
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handlePageNumChange($event)"
        :page-size="pageSize"
        :total="totalCount"
        v-if="totalCount>0"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import http from 'http/orderManageApi';
  import AdminCitySelector from 'common/AdministrativeCitySelector';
  import {mapState, mapGetters} from 'vuex';
  export default {
    name: "outboundOrder",
    data(){
      return{
        state: '0',//	出库单据状态(待支付 = 0,待提货 = 1,待出库 = 2,已出库 = 3,部分出库 = 4,已取消 = 5)； 委托配送状态： 待支付=0 新增=1 待配送=2 配送中=3 已完成=4 已取消=5
        stockNo: null,//订单编号
        mobileNo: '',//经销商手机
        isGetWarehouseCharge: null,//是否收取仓库费用
        businessType: null,//业务类型  0=正常业务 1=贷款业务
        pageNum: 1,
        pageSize: 20,
        totalCount:0,
        cityId: ``,
        city: ``,
        loading:false,
        warehouseId: ``,
        warehouseList: [],
        feeDialogVisible: false,
        formLabelWidth: `100px`,
        startTime:null,
        endTime:null,
        //timeGroup: [],
        orderList: [],
        cityList: [],
        optionTwo: [],
        stateOptions: [{
          value: 1,
          label: '是'
        }, {
          value: 0,
          label: '否'
        }],
        stateOptionTwo: [{
          value: 0,
          label: '正常业务'
        }, {
          value: 1,
          label: '贷款业务'
        }],
        startDatePicker:this.beginDate(),
        endDatePicker:this.processDate()
      }
    },
    components: {
      AdminCitySelector
    },
    methods: {
      //开始时间小于结束时间
      beginDate(){
        let self = this
        return {
          disabledDate(time){
            if(self.endTime){
              return new Date(self.endTime).getTime()<time.getTime()
            }
            //return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      //结束时间必须大于开始时间
      processDate(){
        let self = this
        return {
          disabledDate(time){
            if(self.startTime){
              return new Date(self.startTime).getTime() > time.getTime()
            }
          }
        }
      },
      //查询仓库信息
      handleGetWarehouseList() {
        let city = ``;
        let pageNum = 1;
        let pageSize = 1000;
        //ruleOrgType=2是集团公司，ruleOrgType=1是一般公司
        //如果是集团公司，就只传到parentcityId
        //如果是一般公司，就parentcityId和cityId都穿服务商Id
        let checkCompany = this.choseRoleInfoList.ruleOrgType || '';
        let serviceId = this.choseRoleInfoList.ruleOrgId;
        //把服务商id传到parentcityId里面去可以查服务商及子服务商的仓库,
        //如果只查一个服务商的仓库，那就把id同时传到parentcityId和’cityId里面
        //分页参数是必须填的，parentcityId必填，其它的不用的话都可以不填
        let cityId = ``;
        let parentCityId = ``;
        if (checkCompany === 1) {//一般公司
          cityId = serviceId;
          parentCityId = serviceId;
        } else {//集团公司
          parentCityId = serviceId;
        }
        http.getWarehouseList({city, cityId, parentCityId, pageNum, pageSize}).then(data => {
          this.warehouseList = data;
        }).catch(e => {
          console.log(e)
        })
      },
      //出库，委托配送申请单列表查询
      selectStockApplyNote() {
        this.loading=true;
        let startTime=this.startTime;
        let endTime = this.endTime;
        let applyType = 1;//1：出库申请单，2：委托配送单
        let facilitatorId = this.choseRoleInfoList.ruleOrgId;//1023有测试数据
        let state = ``;
        //选择全部，state传null
        if (this.state === `null`) {
          state = null;
        } else {
          state = this.state;
        }
        let {stockNo, mobileNo, isGetWarehouseCharge, businessType, cityId, pageNum, pageSize, warehouseId} = this;
        http.selectStockApplyNote({
          applyType,
          startTime,
          endTime,
          facilitatorId,
          stockNo,
          mobileNo,
          isGetWarehouseCharge,
          businessType,
          cityId,
          pageNum,
          pageSize,
          state,
          warehouseId
        }).then(data => {
          this.totalCount = data.pager ? data.pager.recordCount : 0;
          let dataResultList = data.dataList;
          dataResultList.forEach(bigData => {
            bigData.items.forEach(smallList => {
              smallList.resultUnit = smallList.packageCount + '' + smallList.packageName + '' + smallList.unitCount + '' + smallList.unitName
            })
            return bigData
          })
          this.orderList = dataResultList;
          this.loading=false;
        }).catch(e => {
          console.log(e);
          this.loading=false;
        })
      },
      onSelectAdminCity(valueArr) {
        console.log('valueArr', valueArr)
        this.cityId = valueArr[valueArr.length - 1].id;
        this.city = valueArr[valueArr.length - 1].name;
      },
      onCleanAdminCity() {
        this.city = ``
      },
      emptyContent() {
        this.stockNo = null;
        this.mobileNo = null;
        this.isGetWarehouseCharge = null;
        this.businessType = null;
        this.cityId = null;
        this.warehouseId = null;
        this.startTime=null;
        this.endTime=null;
        this.$refs[`adminCitySelector`].clean();
        this.selectStockApplyNote();
      },
      //查询
      clickSearch() {
        this.selectStockApplyNote();
      },
      handleClick(tab, event) {
        this.selectStockApplyNote();
        console.log(tab, event);
      },
      gotoDetail(stockNo, dealerId) {
        this.$router.push({name: `outboundDetail`, params: {stockNo, dealerId}})
      },
      handlePageNumChange(num) {
        this.pageNum = num;
        this.selectStockApplyNote();
      },

    },
    mounted() {
      this.selectStockApplyNote();
      this.handleGetWarehouseList();
    },
    computed: {
      showWarehouseSelector() {
        return !!this.city
      },
      ...mapState(`user`, [`choseRoleInfoList`])
    },
  }
</script>

<style lang="stylus" scoped>
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
  }
  .table-header{
    height 50px;
    background-color  #F6F6F6;
    line-height 50px;
    font-weight bolder;
    font-size 15px;
    border-bottom 1px solid #EDEDED;
    border-top 1px solid #EDEDED;
    overflow hidden;
  }
  .genre {
    font-size 14px;
    color #0096FF;
    display inline-block;
    text-align center;
    margin-left 10px;
    width 70px;
    height 22px;
    font-weight normal;
    line-height 22px;
    border 0.8px solid #0096FF;
    border-radius 10px;
    background-color rgba(0,150,255,0.1)
  }
  .table-content{
    display flex;
    flex-direction row;
    justify-content space-between;
    border 1px solid #EDEDED;
    .table-content-div{
      display flex;
      flex-direction column;
      // justify-content space-between;
     // width 354px;
      width 25%
      line-height 40px;
      padding 10px;
      border-right  1px solid #EDEDED;
      font-size:14px
    }
    .table-content-state{
      //width 200px;
      width 18%;
      padding 10px;
      border-right  1px solid #EDEDED;
      font-size:14px
    }
  }

  .query-btn{
    text-align center
    padding:20px 0
    border-bottom:1px solid #ededed
  }

  .el-col{
    font-size:14px
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
    color: #999;
    float: right
  }
</style>
