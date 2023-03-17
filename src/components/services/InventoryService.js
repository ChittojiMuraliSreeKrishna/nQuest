import axios from "axios";
import {
  INVENTORY_PORTAL,
  menuCategoryService,
  USER_MANAGEMENT_URL
} from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";
import { compileString } from "sass";

class InventoryService {
  // Getting all barcode -> Barcode.js
  getTextileBarcodes(list, pageNumber) {
    const barcodeParam = "?page=" + pageNumber + "&size=10";
    console.log({ barcodeParam });
    return axios.post(
      BASE_URL + INVENTORY_PORTAL.getTextileBarcodes + barcodeParam,
      list,
    );
  }

  // Get all Productcombo -> ProductCombo.js
  getProductCombo(params) {
    console.log({ params });
    return axios.post(BASE_URL + INVENTORY_PORTAL.getAllProductBundleList + params);
  }

  // Get all divisions for -> AddBarcodes.js, EditBarcodes.js
  getUOM() {
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllUOMs);
  }

  getColors() {
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllColors);
  }

  // Get all divisions for -> AddBarcodes.js, EditBarcodes.js
  getAllDivisions(domainType) {
    const divisionParam = "?domainType=" + domainType;
    console.log({ divisionParam });
    return axios.get(
      BASE_URL + INVENTORY_PORTAL.getAllDivisions + divisionParam,
    );
  }

  // Get all sections, subSections for -> addbarcode, EditBarcodes.js
  getAllSections(id, domainType) {
    const sectionParam = "?id=" + id + "&domainType=" + domainType;
    console.log({ sectionParam });
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllSections + sectionParam);
  }

  // Get all Categories for -> AddBarcode.js, EditBarcode.js
  getAllCategories(domainType) {
    const categoriesParam = "?domainType=" + domainType;
    console.log({ categoriesParam });
    return axios.get(
      BASE_URL + INVENTORY_PORTAL.getAllCategories + categoriesParam,
    );
  }

  // For Restaurants -> MenuCategory.js
  getAllCategory(id, domainType) {
    const categoryParam = "?id=" + id + "&domainType=" + domainType;
    console.log({ categoryParam });
    return axios.get(
      BASE_URL + INVENTORY_PORTAL.getAllCategory + categoryParam,
    );
  }


  // Get all stores for -> AddBarcodes.js, AddProductCombo.js, EditBarcodes.js
  getAllStores(clientId) {
    const storesParam = "?clientId=" + clientId + "&isActive=true";
    console.log({ storesParam });
    return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllStores + storesParam);
  }

  // Get all hsns 
  getAllHsnList() {
    return axios.get(BASE_URL + INVENTORY_PORTAL.getAllHsnList);
  }

  // Save Barocodes
  saveBarCode(list, domain, isEdit, value) {
    console.log({ list, domain, isEdit, value });

    if (isEdit) {
      // Re Barcode -> EditBarcode.js
      if (value === "REBAR") {
        const reBarcode = BASE_URL + INVENTORY_PORTAL.updatTextileBarcodes;
        console.log({ reBarcode, list });
        return axios.put(reBarcode, list);
      }
      // Edit Barcode -> EditBarcide.js
      else {
        const updateBarcode =
          BASE_URL + INVENTORY_PORTAL.updateBarcodesQuntity;
        console.log({ updateBarcode, list });
        return axios.put(updateBarcode, list);
      }
    }
    // Add Barcode -> AddBarcode.js
    else {
      const addBarcode = BASE_URL + INVENTORY_PORTAL.addTextileBarcodes;
      console.log({ addBarcode, list });
      return axios.post(addBarcode, list);
    }

  }

  // Saving List Items Restaurants
  saveListItem(isEdit, list) {
    console.log({ list });
    if (isEdit) {
      const updateListItem = BASE_URL + INVENTORY_PORTAL.updatTextileBarcodes;
      console.log({ updateListItem, list });
    } else {
      const addListItem = BASE_URL + INVENTORY_PORTAL.addTextileBarcodes;
      console.log({ addListItem, list });
      return axios.post(addListItem, list);
    }
  }

  // Get All List Items
  getListItems(storeId) {
    const getAllItems = BASE_URL + INVENTORY_PORTAL.getAllItems + "?storeId=" + storeId;
    console.log({ getAllItems, storeId });
    return axios.get(getAllItems);
  }

  // Get All Items MenuCategory.js
  getAllSearchItems(data, storeId) {
    const searchParms = "?section=" + data + "&storeId=" + storeId;
    const url = BASE_URL + INVENTORY_PORTAL.getAllItems;
    console.log({ searchParms });
    return axios.get(url + searchParms);
  }

  // Getting Barcode Details -> AddProductCombo.js
  getBarcodesDetails(storesId, domain, barcodeId) {
    if (domain && domain.label === "Retail") {
      const RetailDetails = "?barcode=" + barcodeId + "&storeId=" + storesId;
      console.log({ RetailDetails });
      return axios.get(
        BASE_URL + INVENTORY_PORTAL.getRetailBarcodeDetails + RetailDetails,
      );
    } else {
      const TextileDetails = "?barcode=" + barcodeId + "&storeId=" + storesId;
      console.log({ TextileDetails });
      return axios.get(
        BASE_URL + INVENTORY_PORTAL.getTextileBarcodeDetails + TextileDetails,
      );
    }
  }


  // Saving Product Combo -> AddProductCombo.js
  addProductCombo(obj) {
    return axios.post(BASE_URL + INVENTORY_PORTAL.addProductBundle, obj);
  }

  // Delete Barcodes
  deleteBarcode(id) {
    const param = '?id=' + id;
    return axios.delete(BASE_URL + INVENTORY_PORTAL.deleteTextileBarcode + param);
  }

  /* --- UNUSED CALLS --- */

  updatTextileBarcodes() {
    return BASE_URL + "/inventory/inventoryTextile/updateBarcode_Textile";
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

  createProduct() {
    return BASE_URL + "/inventory/inventoryRetail/createBarcode";
  }

  updateBarcode() {
    return BASE_URL + "/inventory/inventoryRetail/updateBarcode";
  }

  getAllBarcodes() {
    return BASE_URL + "/inventory/inventoryRetail/getAllBarcodes";
  }
  saveUOM() {
    return BASE_URL + "/uom/saveUom";
  }
  getDomainAttributes(domain) {
    const param2 = '?domainType=' + domain;
    console.log({ param2 });
    return axios.get(BASE_URL + "/inventory/inventory-management/domain-attributes" + param2);
  }

  kitchenAvailability(id, status, storeId) {
    const url = BASE_URL + INVENTORY_PORTAL.kitchenItemStatus;
    const param = "?id=" + id + "&status=" + status + "&storeId=" + storeId;
    console.log(url + param);
    return axios.put(url + param);
  }

}
export default new InventoryService();
