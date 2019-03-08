<template>
    <div>
      <el-form :inline="true"
               size="medium" label-width="100px"
               label-suffix="："
               class="demo-form-inline"
               ref="searchForm">
        <el-form-item label="类目">
          <!--<el-cascader clearable-->
            <!--:options="firstLevel"-->
            <!--v-model="firstLevelId"-->
            <!--@change="handleChange">-->
          <!--</el-cascader>-->
          <el-select v-model="firstLevelId" clearable @change="chooseFirst" placeholder="请选择">
            <el-option
              v-for="item in firstLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="secondLevelId" @change="chooseSecond" clearable placeholder="请选择">
            <el-option
              v-for="item in secondLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="brandName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="name" placeholder="请输入"></el-input>
        </el-form-item>
        <!--<el-form-item label="成本价" >-->
          <!--<div style="display: flex">-->
          <!--<span style="border: 1px solid gainsboro;padding: 0 5px;border-radius: 5px;margin-right: 4px">>=</span>-->
          <!--<el-input v-model="costPriceMin" placeholder="请输入数字"></el-input>-->
          <!--<span style="border: 1px solid gainsboro;padding: 0 5px;border-radius: 5px;margin:0 4px"><=</span>-->
          <!--<el-input v-model="costPriceMax" placeholder="请输入数字"></el-input>-->
          <!--</div>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="findProductList()" size="medium">查询</el-button>
          <el-button type="info" @click="resetForm()" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
      <!--表格-->
      <el-table
        ref="multipleTable"
        :data="productTable"
        v-loading="vLoading"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="序号"  width="55">
          <template slot-scope="scope">
            <span>{{indexMethods(scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="displayCategoryName"
          label="类目"
          width="120">
          <!--<template slot-scope="scope">{{ scope.row.displayCategoryName}}</template>-->
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="品牌"
          width="120">
        </el-table-column>
        <el-table-column
          prop="name"
          label="产品名称"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
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
      <div slot="footer" class="footerBtn">
        <el-button type="primary" @click="ensureAdd()">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
</template>

<script>
  import http from 'http/warehouseMessageApi'
    export default {
        name: "chooseProduct",
      data(){
          return{
            currentPage:1,
            pageSize:20,
            totalCount:``,
            categoryId:``,
            vLoading:true,
            firstLevel: [],
            firstLevelId: [],
            secondLevel: [],
            secondLevelId:``,
            valueTwo: '',
            brandName:``,//品牌名称
            name:``,
            productTable: [],
            multipleSelection: []
          }
      },
      // activated(){
      //   this.findProductList();
      //   this.findCategorys();
      // },
      mounted(){
        this.findProductList();
        this.findCategorys();
      },
      methods: {
        chooseFirst(firstId){
          this.secondLevel=this.firstLevel.find(item=>item.id===firstId).childs;
        },
        chooseSecond(secondId){
          this.categoryId=secondId;
        },
          //查询产品接口
        findProductList(){
          let {categoryId,brandName,name,currentPage,pageSize}=this;
          http.findProductList({categoryId,brandName,name,currentPage,pageSize}).then(data=>{
            this.productTable=data.dataList;
            this.totalCount=data.pager.recordCount;
            this.vLoading=false
          }).catch(e=>{
            console.log(e)
            this.vLoading=false
          })
        },
        //查询类目接口
        findCategorys(){
          http.findCategorys().then(data=>{
            this.firstLevel=data||[];
          }).catch(e=>{
            console.log(e)
          })
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        indexMethods(index) {
          return (this.currentPage - 1) * this.pageSize + index + 1
        },
        handlePageNumChange(num) {
          this.currentPage = num;
          this.findProductList();
        },
        resetForm(){
          this.categoryId=``;
          this.brandName=``;
          this.name=``;
          this.firstLevelId=``;
          this.secondLevelId=``;
          this.findProductList();
        },
        ensureAdd(){
          let productList = JSON.stringify(this.multipleSelection)
          this.$router.push({name: `addStrategy`,query:{productList}})
        },
        cancel(){
          this.$refs.multipleTable.clearSelection()
        }
      }

    }
</script>

<style lang="stylus" scoped>
  .footerBtn{
    text-align center;
    margin-top 10px;
  }
</style>
