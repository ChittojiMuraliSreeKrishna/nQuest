import axios from "axios";
import { LOGIN_URL, USER_MANAGEMENT_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class LoginService {
  getStores () {
    return BASE_URL + '/user-management/store/client/stores';
  }

  getUserStores (clientId) {
    const param = '?clientId=' + clientId;
    return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllStores + param);
  }

  getSelectStores (userId) {
    let param = '?userId=' + userId + '&isActive=true';
    console.log({ param });
    return axios.get(BASE_URL + LOGIN_URL.selcetStore + param);
  }

  getAllClient (userId) {
    const param = '?userId=' + userId;
    console.log({ param });
    return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllClients + param);
  }

  getStoreIdWithStoreName () {
    return BASE_URL + '/user-management/store/getStoresWithFilter';
  }

  getDomainsList () {
    return BASE_URL + '/user-management/client/getDomiansForClient/';
  }


  channelsList () {
    return BASE_URL + '/user-management/client/getMasterDomains';
  }


  createUser () {
    return BASE_URL + '/user-management/auth/createUser';
  }

  getUser () {
    return BASE_URL + '/user-management/user/getUser';
  }

  forgotPasswordCodeSent () {
    return BASE_URL + '/user-management/auth/forgetPassword';
  }

  forgotPassword () {
    return BASE_URL + '/user-management/auth/confirmforgetPassword';
  }


  sendVerificationCode () {
    return BASE_URL + '/user-management/auth/resetUserPassword/';
  }

  getAuth (obj) {
    let route = BASE_URL + LOGIN_URL.getToken;
    console.log({ route, obj });
    return axios.post(BASE_URL + LOGIN_URL.getToken, obj);
  }
}
export default new LoginService();
