import axios from 'axios';
import { REPORTS_URL } from '../../commonUtils/ApiConstants';
import { BASE_URL } from "../../commonUtils/Base";
class ReportsService {

  estimationSlips (data, pageNumber = 0) {
    const param = '?page=' + pageNumber;
    return axios.post(BASE_URL + REPORTS_URL.estimationslipsList + param + '&size=10', data);
  }

  newSaleReports (data, pageNumber = 0) {
    const param = '?page=' + pageNumber;
    return axios.post(BASE_URL + REPORTS_URL.listOfSaleBills + param + '&size=10', data);
  }

  returnSlips (data, pageNumber = 0) {
    const param = '?page=' + pageNumber;
    return axios.post(BASE_URL + REPORTS_URL.returnslipsList + param, data);
  }


  getListOfBarcodes (data, pageNumber) {
    const param = '?page=' + pageNumber;
    return axios.post(BASE_URL + REPORTS_URL.listOfBarcodes + param + '&size=10', data);
  }

  promotionsList (data, pageNumber) {
    const param = '?page=' + pageNumber;
    return axios.post(BASE_URL + '/connection-pool/promo/promotionsSearching' + param + '&size=10', data);
  }

  saleReports (data, storeId) {
    console.log(data);
    //   const param = '?storeId='+ storeId; 
    return axios.post(BASE_URL + '/new-sale/newsale/getsalereport', data);
  }

  getReturnSlipDetails (rtNumber) {
    return axios.get(BASE_URL + "/new-sale/return_slip/getReturnSlipsDetails" + "?rtNumber=" + rtNumber);
  }

}

export default new ReportsService();
