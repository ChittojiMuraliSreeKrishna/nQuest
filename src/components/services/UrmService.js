import axios from "axios";
import { LOGIN_URL, USER_MANAGEMENT_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class UrmService {
  // User Services
  // Register Client
  registerUser(obj) {
    let registerUser = BASE_URL + LOGIN_URL.registerUser;
    console.log({ registerUser, obj });
    return axios.post(registerUser, obj);
  }

  // Edit User
  editUser() {
    let editUser = BASE_URL + USER_MANAGEMENT_URL.editUser;
    console.log({ editUser });
    return editUser;
  }

  // Save User
  saveUser(saveObj) {
    let saveUser = BASE_URL + USER_MANAGEMENT_URL.saveUser;
    console.log({ saveUser, saveObj });
    return axios.post(saveUser, saveObj);
  }

  // Change Password
  changePassword(obj) {
    let changePass = BASE_URL + LOGIN_URL.changePassword;
    console.log({ changePass, obj });
    return axios.post(changePass, obj);
  }

  // Get all Privileges
  getAllPrivillages(type) {
    const getPrivileges = BASE_URL + USER_MANAGEMENT_URL.getAllPrivileges;
    const params = "?type=" + type;
    console.log({ getPrivileges, params });
    return axios.get(getPrivileges + params);
  }

  // Getting User Details
  getUserDetails(user, pageNumber = 0) {
    const param = "?page=" + pageNumber + "&size=10";
    let userDetails = BASE_URL + USER_MANAGEMENT_URL.getUserBySearch;
    console.log({ userDetails, param });
    return axios.post(userDetails + param, user);
  }

  // Get Privileges By RoleName
  getPrivillagesByRoleName(value) {
    let assignedRoles = BASE_URL + USER_MANAGEMENT_URL.getPrivilegesByRoleName;
    let param = "/" + value;
    console.log({ assignedRoles });
    return axios.get(assignedRoles + param);
  }

  // Getting Roles
  getRolesByDomainId(clientId) {
    const param = "/" + clientId;
    let getDomainRoles = BASE_URL + USER_MANAGEMENT_URL.getAllRoles;
    console.log({ getDomainRoles, param });
    return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllRoles + param);
  }

  // Get All Users
  getAllUsers(clientId, pageNumber) {
    const param = "/" + parseInt(clientId);
    const pages = "?page=" + pageNumber + "&size=10";
    let getUsers = BASE_URL + USER_MANAGEMENT_URL.getAllUsers;
    console.log({ getUsers, param, pages });
    return axios.get(getUsers + param + pages);
  }

  // Filter Users
  getUserBySearch(list, page) {
    let userSearch = BASE_URL + USER_MANAGEMENT_URL.getUserBySearch;
    const param2 = "?page=" + page;
    console.log({ userSearch, list, param2 });
    return axios.post(userSearch + param2, list);
  }

  // Store Services
  // Save Store
  saveStore() {
    let saveStore = BASE_URL + USER_MANAGEMENT_URL.saveStore;
    console.log({ saveStore });
    return saveStore;
  }

  // Edit Store
  editStore() {
    let editStore = BASE_URL + USER_MANAGEMENT_URL.editStore;
    console.log({ editStore });
    return editStore;
  }

  // Get All Stores
  getAllStores(clientId, pageNumber, isActive) {
    const param = "?clientId=" + clientId + "&isActive=false";
    let storesPath = BASE_URL + USER_MANAGEMENT_URL.getAllStores;
    console.log({ storesPath, param });
    return axios.get(storesPath + param);
  }

  // Get States
  getStates() {
    let getStates = BASE_URL + USER_MANAGEMENT_URL.getStates;
    console.log({ getStates });
    return axios.get(getStates);
  }

  // Get Disctricts
  getDistricts(value) {
    const params = "?stateCode=" + value;
    let getDistricts = BASE_URL + USER_MANAGEMENT_URL.getDistricts;
    console.log({ getDistricts, params });
    return axios.get(getDistricts + params);
  }

  // Filter Stores
  getStoresBySearch(list) {
    let filterStores = BASE_URL + USER_MANAGEMENT_URL.getStoresBySearch;
    console.log({ filterStores, list });
    return axios.post(filterStores, list);
  }

  // Get Gst Number for store edit
  getGSTNumber(clientId, statecode) {
    let gstNumber = BASE_URL + USER_MANAGEMENT_URL.getGSTNumber;
    const params = '?clientId=' + clientId + '&stateCode=' + statecode;
    console.log({ gstNumber, params });
    return axios.get(gstNumber + params);
  }

  // Roles Services
  // Get All Roles
  getAllRoles(clientId, pageNumber) {
    const params = "/" + clientId;
    const pages = "?page=" + pageNumber + "&size=10";
    let getRoles = BASE_URL + USER_MANAGEMENT_URL.getAllRoles;
    console.log({ getRoles, params, pages });
    return axios.get(getRoles + params + pages);
  }

  getRolesBySearch(data) {
    return axios.post(BASE_URL + USER_MANAGEMENT_URL.getRolesBySearch, data);
  }

  // Save Role
  saveRole(saveObj) {
    let saveRole = BASE_URL + USER_MANAGEMENT_URL.saveRole;
    console.log({ saveRole, saveObj });
    return axios.post(saveRole, saveObj);
  }

  // Edit Role
  editRole(saveObj) {
    let editRole = BASE_URL + USER_MANAGEMENT_URL.editRole;
    console.log({ editRole, saveObj });
    return axios.put(editRole, saveObj);
  }

  getSubPrivilegesbyRoleId(roleId) {
    const param = '/' + roleId;
    return axios.get(BASE_URL + "/user-management/roles/privilagesByName" + param);
  }
}
export default new UrmService();
