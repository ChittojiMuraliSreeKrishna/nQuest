export const ACCOUNTING_PORTAL = {
	getCreditNotes: "/hsn-details/accounting",
	getAllTaxes: "/hsn-details/tax/getTaxDetails",
	getAllHsnCodesData: "/hsn-details/hsn-details/getHsnDetails",
	saveMasterTax: "/hsn-details/tax/addnewtax",
	updateTax: "/hsn-details/tax/updatetax",
	getDescritionData: "/hsn-details/hsn-details/getEnums/description",
	getTaxAppliesOnData: "/hsn-details/hsn-details/getEnums/taxAppliesOn",
	saveHsnCode: "/hsn-details/hsn-details/save",
	updateHsnCode: "/hsn-details/hsn-details/updateHsn",
	saveCredit: "/hsn-details/accounting/save",
	getAllLedgerLogs: "/hsn-details/accounting/ledger-logs",
	saveDebit: "/hsn-details/accounting/sale",
};

export const NEW_SALE_URL = {
	getDeliverySlip: "/inventory/inventory-management/barcode-details",
	getMobileData: "/user-management/user/customer/mobileNo",
	createDeliverySlip: "/new-sale/newsale/createdeliveryslip",
	saveDelivery: "/new-sale/newsale/createdeliveryslip",
	getLineItems: "/new-sale/newsale/savelineitems",
	getPromoDiscount: "/connection-pool/promo/checkPromtionTextile",
	getDslipData: "/new-sale/newsale/getdeliveryslip",
	getDsAsbarcode: "/inventory/inventory-management/scan-barcode",
};

export const INVENTORY_PORTAL = {
	// Retail
	updateBarcodes: "/inventory/inventoryRetail/updateBarcode",
	addBarcodes: "/inventory/inventoryRetail/createBarcode",
	getRetailBarcodeDetails: "/inventory/inventoryRetail/getBarcodeId",

	// Textile
	getAllBarcodes: "/inventory/inventoryTextile/getAllBarcodeTextiles",
	getTextileBarcodes: "/inventory/inventory-management/barcodes/filter",
	getAllProductBundleList: "/inventory/productBundle/all",
	getAllDivisions: "/inventory/catalog/divisions",
	getAllUOMs: "/inventory/uom/list",
	getAllSections: "/inventory/catalog/category",
	getAllCategories: "/inventory/catalog/categories",
	getAllHsnList: "/hsn-details/hsn-details/getHsnDetails",
	getStoreNamesByIds: "/user-management/store/storeList",
	updatTextileBarcodes: "/inventory/inventory-management/product",
	addProductBundle: "/inventory/productBundle/add",
	addTextileBarcodes: "/inventory/inventory-management/product",
	updateBarcodesQuntity: "/inventory/inventory-management/product-qty",
	getTextileBarcodeDetails: "/inventory/inventory-management/barcode",
};

export const BILLING_PORTAL = {
	searchGiftVoucher: "/new-sale/newsale//gvSearching",
};

export const LOGIN_URL = {
	getToken: "/user-management/auth/temporary-login",
	registerUser: "/user-management/client/create-client",
	changePassword: "/user-management/auth/auth-challenge",
};

export const USER_MANAGEMENT_URL = {
	// Stores
	getAllStores: "/user-management/store/client/stores",
	saveStore: "/user-management/store/create-store",
	editStore: "/user-management/store/store",
	getStates: "/user-management/store/allStates",
	getDistricts: "/user-management/store/getDistrict",
	getStoresBySearch: "/user-management/store/getStoresWithFilter",
	getGstNumber: "/user-management/store/getgstDetails",

	// Users
	getAllUsers: "/user-management/user/users",
	saveUser: "/user-management/auth/create-user",
	editUser: "/user-management/user/updateUser",
	getUserBySearch: "/user-management/user/getUser",

	// Roles
	getAllRoles: "/user-management/roles/client",
	saveRole: "/user-management/roles/create-role",
	getAllPrivileges: "/user-management/roles/getAllPrivilages",
	editRole: "/user-management/roles/updateRole",
	getRolesBySearch: "/user-management/roles/rolesWithFilter",
	getPrivilegesByRoleName: "/user-management/roles/privilagesByName/",
};

export const CREATE_DELEVIRY_SLIP_URL = {
	addCustomer: "/user-management/auth/create-user",
};
