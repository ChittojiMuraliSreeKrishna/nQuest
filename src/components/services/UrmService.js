import axios from "axios";
import { LOGIN_URL, USER_MANAGEMENT_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class UrmService {
	registerUser(obj) {
		return axios.post(BASE_URL + LOGIN_URL.registerUser, obj);
	}

	saveUser(saveObj) {
		return axios.post(BASE_URL + USER_MANAGEMENT_URL.saveUser, saveObj);
	}

	changePassword(obj) {
		return axios.post(BASE_URL + LOGIN_URL.changePassword, obj);
	}

	getAllPrivillages() {
		return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllPrivileges);
	}

	getPrivillagesByRoleName() {
		return BASE_URL + "/user-management/roles/privilagesByName/";
	}

	getDomainName() {
		return BASE_URL + "/user-management/client/domian/";
	}

	getDomains() {
		return BASE_URL + "/user-management/client/getDomiansForClient/";
	}

	getPrivilegesByName() {
		return BASE_URL + "/user-management/roles/privilagesByName/";
	}

	getMasterDomains() {
		return BASE_URL + "/user-management/client/getMasterDomains";
	}

	saveDomain() {
		return BASE_URL + "/user-management/client/assignDomianToClient";
	}

	saveStore() {
		return BASE_URL + "/user-management/store/create-store";
	}

	editStore() {
		return BASE_URL + "/user-management/store/store";
	}

	getAllStores(clientId, pageNumber, isActive) {
		const param = "?clientId=" + clientId + "&isActive=" + isActive;
		// let storesPath = BASE_URL + USER_MANAGEMENT_URL.getAllStores;
		let storesPath = BASE_URL + "/user-management/store/getAllStores";
		console.log({ storesPath, param });
		return axios.get(storesPath);
	}

	getStores() {
		const param = "";
	}

	deleteStore() {
		return BASE_URL + "/user-management/store/deleteStore";
	}

	getStates() {
		return BASE_URL + "/user-management/store/allStates";
	}

	getDistricts() {
		return BASE_URL + "/user-management/store/getDistrict";
	}

	getStoresBySearch() {
		return BASE_URL + "/user-management/store/getStoresWithFilter";
	}

	getRolesByDomainId(clientId) {
		const param = "/" + clientId;
		return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllRoles + param);
	}

	getAllRoles(clientId, pageNumber) {
		const param = "/" + clientId;
		const pages = "?page=" + pageNumber + "&size=10";
		return axios.get(
			BASE_URL + USER_MANAGEMENT_URL.getAllRoles + param + pages,
		);
	}

	getAllUsers(clientId, pageNumber) {
		const param = "/" + parseInt(clientId);
		const pages = "?page=" + pageNumber + "&size=10";
		return axios.get(
			BASE_URL + USER_MANAGEMENT_URL.getAllUsers + param + pages,
		);
	}

	getUserBySearch() {
		return BASE_URL + "/user-management/user/getUser";
	}

	getRolesBySearch(searchRole) {
		console.log({ searchRole });
		return axios.post(
			BASE_URL + USER_MANAGEMENT_URL.getRolesBySearch,
			searchRole,
		);
	}

	saveRole(saveObj) {
		return axios.post(BASE_URL + USER_MANAGEMENT_URL.saveRole, saveObj);
	}

	editRole(saveObj) {
		return axios.put(BASE_URL + USER_MANAGEMENT_URL.editRole, saveObj);
	}

	editUser() {
		return BASE_URL + "/user-management/user/updateUser";
	}

	getGSTNumber() {
		return BASE_URL + "/user-management/store/getgstDetails";
	}

	getUserDetails(user, pageNumber = 0) {
		const param = "?page=" + pageNumber + "&size=10";
		return axios.post(
			BASE_URL + USER_MANAGEMENT_URL.getUserBySearch + param,
			user,
		);
	}
}
export default new UrmService();
