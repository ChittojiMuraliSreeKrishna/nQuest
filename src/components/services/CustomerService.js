import axios from "axios";
import { BILLING_PORTAL, NEW_SALE_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class CustomerService {
  createDeliverySlip (createObj) {
    console.log({ createObj });
    return axios.post(BASE_URL + NEW_SALE_URL.saveDelivery, createObj);
  }

  saveLineItems (lineItem, domainId) {
    const param = '/' + domainId;
    return axios.post(BASE_URL + NEW_SALE_URL.getLineItems + param, lineItem);
  }

  getCheckPromoAmount (storeId, domainId, reqObj) {
    const param = '?storeId=' + storeId + '&domainId=' + domainId;
    return axios.post(BASE_URL + NEW_SALE_URL.getPromoDiscount + param, reqObj);
  }

  getDeliverySlip (barcodeId, storeId, smnumber) {
    const param = '?barcode=' + barcodeId + '&storeId=' + storeId;
    return axios.get(BASE_URL + NEW_SALE_URL.getDeliverySlip + param);
  }

  getAllDayClosure () {
    return BASE_URL + "/new-sale/newsale/getPendingDeliverySlips";
  }

  dayCloseActivity () {
    return BASE_URL + "/new-sale/newsale/closePendingDeliverySlips";
  }

  getHsnDetails () {
    return BASE_URL + "/hsn-details/hsn-details/getHsnDetails";
  }

  saveSale () {
    return BASE_URL + "/new-sale/newsale/sale";
  }

  getDsSlip (esnumber, flag, storeId) {
    let params = esnumber + flag + storeId;
    console.log({ params });
    if (flag) {
      const param = '?dsNumber=' + esnumber;
      return axios.get(BASE_URL + NEW_SALE_URL.getDslipData + param);
    } else {
      const param = '?barcode=' + esnumber + '&storeId=' + storeId;
      return axios.get(BASE_URL + NEW_SALE_URL.getDsAsbarcode + param);
    }
  }

  getMobileData () {
    return BASE_URL + "/user-management/user/customer/mobileNo";
  }

  getDiscountReasons () {
    return BASE_URL + "/new-sale/newsale/discTypes";
  }


  getLineItems () {
    return BASE_URL + "/new-sale/newsale/savelineitems";
  }

  getCustomerMobile () {
    return BASE_URL + "/user-management/user/customer/mobileNo";
  }

  getCoupons () {
    return BASE_URL + "/new-sale/newsale/getGv";
  }


  getGiftVocher () {
    return BASE_URL + "/new-sale/newsale/getlistofgv";
  }

  saveGiftVoucher (saveobj) {
    return axios.post(BASE_URL + "/new-sale/newsale/saveGv", saveobj);
  }

  getReturnSlip () {
    return BASE_URL + "/new-sale/newsale/getInvoiceDetails";
  }

  saveRetunSlip () {
    return BASE_URL + "/new-sale/return_slip/createReturnSlip";
  }


  getRetailBarcode () {
    return BASE_URL + "/inventory/inventoryRetail/getBarcodeId";
  }


  addCustomer () {
    return BASE_URL + "/user-management/auth/createUser";
  }

  searchGiftVoucher (obj) {
    return axios.post(BASE_URL + BILLING_PORTAL.searchGiftVoucher, obj);
  }

  getDates (storeId) {
    const param = '?storeId=' + storeId;
    return axios.get(BASE_URL + "/new-sale/newsale/getDates" + param);
  }

  saveGvNumber (gvObj, status) {
    const param = '?flag=' + status;
    return axios.put(BASE_URL + "/new-sale/newsale/changeflaggv" + param, gvObj);
  }

}
export default new CustomerService();
