import axios from "axios";
import { INVENTORY_PORTAL, USER_MANAGEMENT_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class InventoryService {
  //Retail
  createProduct() {
    return BASE_URL + '/inventory/inventoryRetail/createBarcode';
  }

  deleteBarcode() {
    return BASE_URL + '/inventory/inventoryTextile/deleteBarcode_Textile';
  }

  updateBarcode() {
    return BASE_URL + '/inventory/inventoryRetail/updateBarcode';
  }

  getAllBarcodes() {
    return BASE_URL + '/inventory/inventoryRetail/getAllBarcodes';
  }
  saveUOM() {
    return BASE_URL + '/uom/saveUom';
  }
  getUOM() {
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllUOMs);
  }

  getAllDivisions(domainType) {
    const divisionParam = '?domainType=' + domainType;
    console.log({ divisionParam });
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllDivisions + divisionParam);
  }

  getAllSections(id, domainType) {
    const sectionParam = '?id=' + id + '&domainType=' + domainType;
    console.log({ sectionParam });
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllSections + sectionParam);
  }

  getAllSubSections() {
    return BASE_URL + '/inventory/catalog/getcategoriesByid';
  }
  getAllCategories(domainType) {
    const categoriesParam = '?domainType=' + domainType;
    console.log({ categoriesParam });
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllCategories + categoriesParam);
  }

  getAllStores(clientId) {
    const storesParam = '?clientId=' + clientId + '&isActive=true';
    console.log({ storesParam });
    return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllStores + storesParam);
  }

  getAllHsnList() {
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllHsnList);
  }

  saveBarCode(list, domain, isEdit, value) {
    console.log({ list, domain, isEdit, value });
    if (domain && domain.label === "Retail") {
      if (isEdit) {
        return axios.put(BASE_URL + INVENTORY_PORTAL.updateBarcodes, list);
      } else {
        return axios.post(BASE_URL + INVENTORY_PORTAL.addBarcodes, list);
      }
    } else {
      if (isEdit) {
        if (value === "REBAR") {
          return axios.put(BASE_URL + INVENTORY_PORTAL.updatTextileBarcodes, list);
        } else {
          return axios.put(BASE_URL + INVENTORY_PORTAL.updateBarcodesQuntity, list);
        }

      } else {
        return axios.post(BASE_URL + INVENTORY_PORTAL.addTextileBarcodes, list);
      }
    }
  }
  updatTextileBarcodes() {
    return BASE_URL + "/inventory/inventoryTextile/updateBarcode_Textile";
  }

  getTextileBarcodes() {
    return BASE_URL + "/inventory/inventory-management/barcodes/filter";
  }

  // Getting Barcode Details
  getBarcodesDetails(storesId, domain, barcodeId) {
    if (domain && domain.label === "Retail") {
      const RetailDetails = '?barcode=' + barcodeId + '&storeId=' + storesId;
      console.log({ RetailDetails });
      return axios.get(BASE_URL + INVENTORY_PORTAL.getRetailBarcodeDetails + RetailDetails);
    } else {
      const TextileDetails = '?barcode=' + barcodeId + '&storeId=' + storesId;
      console.log({ TextileDetails });
      return axios.get(BASE_URL + INVENTORY_PORTAL.getTextileBarcodeDetails + TextileDetails);
    }
  }

  deleteTextileBarcode() {
    return BASE_URL + "/inventory/inventoryTextile/deleteBarcode_Textile";
  }

  getbarcodeTexttileAdjustments() {
    return BASE_URL + "/inventory/inventory-management/adjustments/filter";
  }

  getStoreNameById() {
    return BASE_URL + "/user-management/store/storeList";
  }

  getProductCombo(params) {
    return axios.post(BASE_URL + INVENTORY_PORTAL.getAllProductBundleList + params);
  }

  addProductCombo(obj) {
    return axios.post(BASE_URL + INVENTORY_PORTAL.addProductBundle, obj);
  }

}
export default new InventoryService();
