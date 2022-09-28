import axios from 'axios';
import { NEW_SALE_URL } from '../../commonUtils/ApiConstants';
import { BASE_URL } from '../../commonUtils/Base';

class NewSaleService {
  payment () {
    return BASE_URL + '/paymentgateway/paymentgateway/create_order';
  }

  upiPayment () {
    return BASE_URL + '/paymentgateway/razorpay/create-payment-link';
  }

  getAllBarcodes () {
    return BASE_URL + '/new-sale/newsale/getAllBarcodes';
  }

  saveLineItems () {
    return BASE_URL + '/new-sale/newsale/savelineitems/2';
  }

  createOrder () {
    return BASE_URL + '/new-sale/newsale/sale';
  }

  getImageScanning () {
    return BASE_URL + '/user-management/auth/imageScanning';
  }

  getCoupons (clientId, couponCode) {
    const param = '/' + clientId;
    return axios.post(BASE_URL + "/new-sale/newsale/getGv" + param, couponCode);
  }

  saveCoupons () {
    return BASE_URL + "/new-sale/newsale/changeflaggv";
  }

  getMobileData (mobileNumber) {
    return axios.get(BASE_URL + NEW_SALE_URL.getMobileData + '/' + mobileNumber);
  }

  getRTDetails (rtnumber, storeId) {
    const param = "?storeId=" + storeId;
    console.log({ param }, rtnumber);
    return axios.post(BASE_URL + "/new-sale//return_slip/getReturnSlip" + param, rtnumber);
  }
}
export default new NewSaleService();
