<template>
  <div id="addStrategy" v-loading = "loading">
    <div class="header">{{title}}</div>
    <el-form :inline="true" :model="strategyForm"
             size="medium" label-width="100px"
             label-suffix="："
             class="demo-form-inline"
             ref="strategyForm">
      <el-form-item label="所属公司">
        <el-input @change="setCompany($event)" v-model="strategyForm.company" type="text" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="策略名称">
        <el-input v-model="strategyForm.configName" @change="setConfigName($event)" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="默认策略">
        <el-switch
          @change="setDefaultPolicy($event)"
          v-model="strategyForm.defaultPolicy"
          class="switchStyle"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="管控仓库">
        <div class="nonDefault" v-if="strategyForm.defaultPolicy==0">
          <admin-city-selector
            ref="adminCitySelector"
            :targetLevel="2"
            :showAllLevels="true"
            @select-admin-city="onSelectAdminCity"
            @clean-admin-city="onCleanAdminCity"
          ></admin-city-selector>
          <el-select v-model="warehouseId" placeholder="请选择"
                     clearable :disabled="cityName?false:true" @change="selectWarehouse">
            <el-option v-for="item in warehouseOptions"
                       :key="item.warehouseId"
                       :value="item.warehouseId"
                       :label="item.name"
            ></el-option>
          </el-select>
          <el-button @click="addWarehouse">添加</el-button>
          <div class="warehouseName">
            <ul class="warehouseList">
              <li v-for="(item,index) in warehouseList">
                <span>【{{item.cityName}}】{{item.warehouseName}}</span>
                <i class="el-icon-close" @click="deleteWarehouse(index)"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="default" v-else>
          <el-input value="所有仓库" disabled></el-input>
        </div>
      </el-form-item>
      <el-form-item label="强制抄码">
        <el-switch
          @change="setCompulsoryCodeCopying($event)"
          v-model="strategyForm.compulsoryCodeCopying"
          class="switchStyle"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>
      <el-form-item label="抄码产品">
        <el-button @click="addProduct">添加产品</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="strategyForm.warehouseWineConfigItemList"
      border
      style="width: 100%;margin-top:16px;">
      <el-table-column label="序号" width="100" type="index">
        <!--<template slot-scope="scope">
          <span>{{indexMethods(scope.$index)}}</span>
        </template>-->
      </el-table-column>
      <el-table-column prop="productCategory" label="类目"></el-table-column>
      <el-table-column prop="productBrand" label="品牌"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteProduct(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-button">
      <el-button @click="ensureAdd()" type="primary">确认</el-button>
      <el-button @click="goBack()">取消</el-button>
    </div>
    <!--分页-->
    <!--<pagination :page-size="strategyForm.pageSize" :current-page="strategyForm.pageNum"
                :total-count="totalCount"
                @pageNumChange="handlePageNumChange"
    ></pagination>-->
  </div>
</template>

<script>
  import http from 'http/warehouseMessageApi'
  import https from 'http/warehouseControlApi'
  import AdminCitySelector from 'common/AdministrativeCitySelector'
  import {mapState, mapMutations} from 'vuex'
  import pagination from 'common/pagination.vue'


  export default {
    name: "addStrategy",
    data() {
      return {
        title:`新增策略`,
        loading:false,
        totalCount: 0,
        warehouseId: ``,   //仓库
        warehouseName: ``,
        warehouseList: [],
        cityName: ``,
        warehouseOptions: [],
        warehouseForm: {
          city: ``,
          cityId: ``,
          name: ``,
          pageNum: 1,
          pageSize: 100,
          parentCityId: ``,
          warehouseId: ``,
        },

      }
    },
    components: {
      AdminCitySelector,
      pagination
    },
    activated() {

      if (this.$route.query.id) {
        this.title = `修改策略`
        let id = JSON.parse(this.$route.query.id)
        this.loading = true
        https.getWarehouseConfigInfo({id}).then(data => {
          this.setStrategyForm(data)
          this.warehouseList = data.wareHouseList
          this.loading = false
        }).catch(e=>{
          this.$message(e)
          this.loading = false
        })
      }
      if (this.$route.query.productList) {
        let productList = JSON.parse(this.$route.query.productList)
        // console.log(productList)
        productList.forEach(item => {
          item.productName = item.name
          item.productBrand = item.brandName
          item.productCategory = item.displayCategoryName
          item.productSkuId = item.saleSpecificationList[0].productSkuId
          item.productSpecificationId = item.productInfoSpecificationId
        })
        this.setWarehouseWineConfigItemList(this.strategyForm.warehouseWineConfigItemList.concat(productList))
      }
      /*let productList = this.$route.query.productList
      console.log(productList)*/

    },
    methods: {
      onSelectAdminCity(valueArr) {
        console.log(valueArr)
        this.cityName = valueArr[valueArr.length - 1].name
        this.warehouseForm.city = valueArr[valueArr.length - 1].name   //仓库根据城市名搜索 暂时没数据
        // this.strategyForm.cityId = valueArr[valueArr.length - 1].id
        this.getWareHouseInfo()
      },
      onCleanAdminCity() {
        this.strategyForm.city = ``
      },
      getWareHouseInfo() {
        console.log(`获取仓库信息`)
        if (this.choseRoleInfoList.ruleOrgType == 1) {
          this.warehouseForm.cityId = this.choseRoleInfoList.ruleOrgId
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        } else {
          this.warehouseForm.cityId = ``
          this.warehouseForm.parentCityId = this.choseRoleInfoList.ruleOrgId
        }
        http.getWarehouseList(this.warehouseForm).then(data => {
          this.warehouseOptions = data
        })
      },
      selectWarehouse(id) {
        let obj = {};
        obj = this.warehouseOptions.find((item) => {
          return item.warehouseId === id
        })
        this.warehouseName = obj.name || ``
        this.warehouseId = obj.warehouseId
        console.log(this.warehouseId)
      },
      addWarehouse() {
        let that = this
        let warehouseArr = [];
        let count = this.warehouseList.filter(item => item.warehouseId === that.warehouseId)
        if (count.length == 0 || this.warehouseList.length == 0) {
          that.warehouseList.push({
            warehouseName: this.warehouseName,
            cityName: this.cityName,
            warehouseId: this.warehouseId
          })
          that.warehouseList.forEach(item => {
            warehouseArr.push(item.warehouseId)
          })
          that.setWarehouseIds(warehouseArr)
        } else {
          return this.$message(`仓库已存在`)
        }
        console.log(that.strategyForm.warehouseIdList)
      },
      deleteWarehouse(index) {
        this.warehouseList.splice(index, 1)
        this.strategyForm.warehouseIdList.splice(index, 1)
        console.log(this.strategyForm.warehouseIdList)
      },
      addProduct() {
        this.$router.push({name: `chooseProduct`})
      },
      deleteProduct(index) {
        this.strategyForm.warehouseWineConfigItemList.splice(index, 1)
      },
      indexMethods(index) {
        // return (this.strategyForm.pageNum - 1) * this.strategyForm.pageSize + index + 1
      },
      ensureAdd() {
        let {strategyForm} = this
        if (strategyForm.id) {
          strategyForm.lastUpdateUser = this.$store.state.user.userInfo.userId;
          https.updateWarehouseConfig(strategyForm).then(data=>{
            this.$router.replace({name: `warehouseControl`})
            this.$message(`修改成功`)
            this.setCleanContent()
          }).catch(e => {
            this.$message(e)
          })
        } else {
          strategyForm.createUser = this.$store.state.user.userInfo.userId;
          https.addWarehouseConfig(strategyForm).then(data => {
            this.$router.replace({name: `warehouseControl`})
            this.$message(`新增成功`)
            this.setCleanContent()
          }).catch(e => {
            this.$message(e)
          })
        }
      },
      changeStrategyState(state) {
        console.log(state)
      },
      goBack() {
        this.$router.replace({name: `warehouseControl`});
        this.setCleanContent()
      },

      ...mapMutations(`addStrategy`, [`setStrategyForm`, `setCompany`, `setConfigName`, `setDefaultPolicy`, `setCompulsoryCodeCopying`, `setWarehouseIds`, `setWarehouseWineConfigItemList`, `setCleanContent`])
    },
    computed: {
      ...mapState(`user`, [`choseRoleInfoList`]),
      ...mapState(`addStrategy`, [`strategyForm`])
    }
  }
</script>

<style lang="stylus">
  #addStrategy {
    .header {
      width: 100%
      padding: 20px
      border-bottom: 1px solid #ededed
    }

    .el-form {
      margin-top: 20px
      display: flex
      flex-direction: column
      .el-form-item {
        .el-cascader, .el-select, .el-input {
          width 250px;
        }
      }
    }
    .warehouseName {
      margin-top: 20px
      width: 250px;
      min-height: 36px;
      border: 1px solid #dcdfe6
      border-radius 4px
      background: #ededed
      > .warehouseList {
        padding: 0
        margin: 0
        width: 100%
        background: #ededed
        > li {

          padding: 0 12px;
          list-style-type: none;
          display: flex
          flex-direction: row
          justify-content space-between
          align-items center
        }
      }
    }

    .demo .el-switch__label {
      position: absolute;
      display: none;
      color: #fff;
    }

    .switchStyle .el-switch__label {
      position: absolute;
      display: none;
      color: #fff;
    }

    .switchStyle .el-switch__label--left {
      z-index: 9;
      left: 27px;
    }

    .switchStyle .el-switch__label--right {
      z-index: 9;
      left: 0px;
    }

    .switchStyle .el-switch__label.is-active {
      display: block;
    }

    .switchStyle.el-switch .el-switch__core,
    .el-switch .el-switch__label {
      width: 52px !important;
      height: 22px;
    }

    .add-button {
      text-align: center
      margin-top: 50px
    }
  }
</style>
