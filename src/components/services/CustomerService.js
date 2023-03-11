import axios from "axios";
import { BILLING_PORTAL, menuCategoryService, NEW_SALE_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class CustomerService {
  createDeliverySlip(createObj) {
    console.log({ createObj });
    return axios.post(BASE_URL + NEW_SALE_URL.saveDelivery, createObj);
  }

  saveLineItems(lineItem, domainId) {
    // const param = '/' + domainId;
    return axios.post(BASE_URL + NEW_SALE_URL.getLineItems, lineItem);
  }
  saveLineItemsRes(lineItem) {
    // const param = '/' + domainId;
    return axios.post(BASE_URL + NEW_SALE_URL.getLineItems, lineItem);
  }

  getinvoiceLevelCheckPro(domainId, storeId, reqObj) {
    const param = '?storeId=' + storeId + '&domainId=' + domainId;
    return axios.post(BASE_URL + "/connection-pool/promo/invoiceLevelCheckPromtionTextile" + param, reqObj);
  }

  getCheckPromoAmount(storeId, domainId, reqObj) {
    const param = '?storeId=' + storeId + '&domainId=' + domainId;
    return axios.post(BASE_URL + NEW_SALE_URL.getPromoDiscount + param, reqObj);
  }

  getDeliverySlip(barcodeId, storeId, smnumber) {
    const param = '?barcode=' + barcodeId + '&storeId=' + storeId;
    return axios.get(BASE_URL + NEW_SALE_URL.getDeliverySlip + param);
  }

  getAllDayClosr(storeId) {
    const param = '?storeId=' + storeId;
    return axios.get(BASE_URL + "/new-sale/newsale/getPendingDeliverySlips" + param);
  }
  dayCloseActivity() {
    return BASE_URL + "/new-sale/newsale/closePendingDeliverySlips";
  }

  getHsnDetails() {
    return BASE_URL + "/hsn-details/hsn-details/getHsnDetails";
  }

  saveSale() {
    return BASE_URL + "/new-sale/newsale/sale";
  }

  getDsSlip(esnumber, flag, storeId) {
    let params = esnumber + flag + storeId;
    console.log({ params });
    if (flag) {
      const param = '?dsNumber=' + esnumber + '&storeId=' + storeId;
      const url = BASE_URL + NEW_SALE_URL.getDslipData + param;
      console.log("url get Dsslip", url);
      return axios.get(url);
    } else {
      const param = '?barcode=' + esnumber + '&storeId=' + storeId;
      return axios.get(BASE_URL + NEW_SALE_URL.getDsAsbarcode + param);
    }
  }

  getMobileData() {
    return BASE_URL + "/user-management/user/customer/mobileNo";
  }

  getDiscountReasons() {
    return BASE_URL + "/new-sale/newsale/discTypes";
  }


  getLineItems() {
    return BASE_URL + "/new-sale/newsale/savelineitems";
  }

  getCustomerMobile() {
    return BASE_URL + "/user-management/user/customer/mobileNo";
  }

  getCreditNotes(mobileNumber, customerId) {
    const param = '?mobileNumber=' + mobileNumber + '&customerId=' + customerId;
    return axios.get(BASE_URL + "/hsn-details/accounting/getCreditNotes" + param);
  }

  getCoupons() {
    return BASE_URL + "/new-sale/newsale/getGv";
  }


  getGiftVocher() {
    return BASE_URL + "/new-sale/newsale/getlistofgv";
  }

  saveGiftVoucher(saveobj) {
    return axios.post(BASE_URL + "/new-sale/newsale/saveGv", saveobj);
  }

  getReturnSlipDetails(obj) {
    console.log({ obj });
    return axios.post(BASE_URL + "/new-sale/newsale/getInvoiceDetails", obj);
  }

  saveRetunSlip() {
    return BASE_URL + "new-sale/return_slip/createReturnSlip";
  }


  getRetailBarcode() {
    return BASE_URL + "/inventory/inventoryRetail/getBarcodeId";
  }


  addCustomer() {
    return BASE_URL + "/user-management/auth/createUser";
  }

  searchGiftVoucher(obj) {
    return axios.post(BASE_URL + BILLING_PORTAL.searchGiftVoucher, obj);
  }

  getDates(storeId) {
    const param = '?storeId=' + storeId;
    return axios.get(BASE_URL + "/new-sale/newsale/getDates" + param);
  }

  saveGvNumber(gvObj, status) {
    const param = '?flag=' + status;
    return axios.put(BASE_URL + "/new-sale/newsale/changeflaggv" + param, gvObj);
  }

  deleteEstimationSlip(dsNumber) {
    const param2 = '?dsNumber=' + dsNumber;
    return axios.delete(BASE_URL + "/new-sale/newsale/deletedeliveryslip" + param2);
  }

  getAllLoyaltyPoints() {
    return axios.get(BASE_URL + "/new-sale/newsale/getAllLoyaltyPoints");
  }

  searchLoyaltyPoints(obj) {
    return axios.post(BASE_URL + "/new-sale/newsale/searchLoyaltyPoints", obj);
  }

  getInvoiceDetails(invoiceNum) {
    const param = `?orderNumber=${invoiceNum}`;
    return axios.get(BASE_URL + "/new-sale/newsale/getinvoicedata" + param);
  }

  saveLoyaltyPoints(obj) {
    return axios.post(BASE_URL + "/new-sale/newsale/saveLoyaltyPoints", obj);
  }

  getPendingDeliverySlips(fromDate, storeId) {
    const param = '?fromDate=' + fromDate + '&storeId=' + storeId;
    return axios.get(BASE_URL + "/new-sale/newsale/getPendingDeliverySlips" + param);
  }
  saveDayCloser(obj) {
    //const param = '?storeId=' + storeId ;
    return axios.post(BASE_URL + "/new-sale/newsale/savedayclosure", obj);
  }
  closePendingDeliverySlips(fromDate, storeId) {
    const param = '?fromDate=' + fromDate + '&storeId=' + storeId;
    return axios.put(BASE_URL + "/new-sale/newsale/closePendingDeliverySlips" + param);
  }

  getTablesList(storeId, clientId, bookingType) {
    const sipId = '?clientId=' + clientId + '&storeId=' + storeId + "&bookingType=Table";
    const url = BASE_URL + menuCategoryService.getAllTables + sipId;
    console.log({ sipId, url });
    return axios.get(url);
  }

  getRoomsList(storeId, clientId, bookingType) {
    const sipId = '?clientId=' + clientId + '&storeId=' + storeId + "&bookingType=Room";
    const url = BASE_URL + menuCategoryService.getAllTables + sipId;
    console.log({ sipId, url });
    return axios.get(url);
  }

  saveTable(obj) {
    const url = BASE_URL + menuCategoryService.saveTable;
    console.log({ url, obj });
    return axios.post(url, obj);
  }

  editTable(obj) {
    const url = BASE_URL + menuCategoryService.editTable;
    console.log({ url, obj });
    return axios.put(url, obj);
  }

  bookTable(obj) {
    const url = BASE_URL + menuCategoryService.bookTable;
    console.log({ url, obj });
    return axios.post(url, obj);
  }

  bookRoom(obj) {
    const url = BASE_URL + menuCategoryService.bookTable;
    console.log({ url, obj });
    return axios.post(url, obj);
  }

  getTableItems(tableId) {
    const url = BASE_URL + menuCategoryService.getTableList;
    const params = "?id=" + tableId;
    console.log({ url, params });
    return axios.get(url + params);
  }
  getRoomOrders(tableId, storeId) {
    const url = BASE_URL + menuCategoryService.roomOrder;
    const params = "?roomId=" + tableId + "&storeId=" + storeId;
    console.log({ url, params });
    return axios.get(url + params);
  }

  getOrderItems(obj) {
    const url = BASE_URL + menuCategoryService.getTableList;
    return axios.post(url, obj);
  }

  billTable(status, tableId) {
    const url = BASE_URL + menuCategoryService.billTable;
    const param = '?isBillGenerated=' + status + '&tableId=' + tableId;
    console.log({ url, param });
    return axios.put(url + param);
  }

  shiftTable(fromTable, toTable) {
    const url = BASE_URL + menuCategoryService.shiftTable;
    const param = "?fromTable=" + fromTable + "&toTable=" + toTable;
    console.log(url + param);
    return axios.put(url + param);
  }

  shiftRoom(fromTable, toTable) {
    const url = BASE_URL + menuCategoryService.shiftTable;
    const param = "?fromTable=" + fromTable + "&toTable=" + toTable;
    console.log(url + param);
    return axios.put(url + param);
  }

  getAllMenuOrders(clientId, storeId) {
    const params = "?clientId=" + clientId + "&storeId=" + storeId;
    const url = BASE_URL + menuCategoryService.menuOrders;
    console.log(url + params);
    return axios.get(url + params);
  }

  updateOrders(itemId, status) {
    const params = '?lineItemId=' + itemId + "&status=" + status;
    const url = BASE_URL + menuCategoryService.updateOrders;
    console.log(url + params);
    return axios.put(url + params);
  }

  viewOrder(orderId, storeId) {
    const params = "?orderId=" + orderId + "&storeId=" + storeId;
    const url = BASE_URL + menuCategoryService.viewOrder;
    console.log(url + params);
    return axios.get(url + params);
  }

  cteateInvoice(obj) {
    const url = BASE_URL + menuCategoryService.payTable;
    console.log({ url, obj });
    return axios.post(url, obj);
  }

}
export default new CustomerService();
