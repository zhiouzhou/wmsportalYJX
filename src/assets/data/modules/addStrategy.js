const state = {
  strategyForm: {
    company: ``,
    configName: ``,    //策略名称
    defaultPolicy: 0,
    compulsoryCodeCopying: 1,
    warehouseIdList: [],
    warehouseWineConfigItemList: [],   //产品列表
  },
};
const getters = {};
const mutations = {
  setStrategyForm(state,strategyInfo){
    state.strategyForm = strategyInfo
  },
  setCompany(state, company) {
    state.strategyForm.company = company
  },
  setConfigName(state, configName) {
    state.strategyForm.configName = configName
  },
  setDefaultPolicy(state, defaultPolicy) {
    state.strategyForm.defaultPolicy = defaultPolicy
  },
  setCompulsoryCodeCopying(state, compulsoryCodeCopying) {
    state.strategyForm.compulsoryCodeCopying = compulsoryCodeCopying
  },
  setWarehouseIds(state, warehouseIds) {
    state.strategyForm.warehouseIdList = warehouseIds
  },
  setWarehouseWineConfigItemList(state, warehouseWineConfigItemList) {
    state.strategyForm.warehouseWineConfigItemList = warehouseWineConfigItemList
  },
  setCleanContent(state) {
    state.strategyForm = {
      company: ``,
      configName: ``,    //策略名称
      defaultPolicy: 0,
      compulsoryCodeCopying: 1,
      warehouseIdList: [],
      warehouseWineConfigItemList: [],   //产品列表
    }
  }
};
const actions = {};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
