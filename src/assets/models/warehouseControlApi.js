import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {
  getWarehouseConfigList(params){
    return axios.post(prefix + '/warehouseControl/getWareHouseConfigList', params)
  },
  addWarehouseConfig(params){
    return axios.post(prefix + '/warehouseControl/addWareHouseConfig', params)
  },
  updateWarehouseConfig(params){
    return axios.post(prefix + '/warehouseControl/updateWareHouseConfig', params)
  },
  getWarehouseConfigInfo(params){
    return axios.post(prefix+'/warehouseControl/getWareHouseConfigInfo',params)
  }
}
