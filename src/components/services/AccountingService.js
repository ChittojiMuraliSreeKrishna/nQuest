import axios from "axios";
import { ACCOUNTING_PORTAL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class AccountingService {
	getCreditNotes(obj) {
		return axios.post(BASE_URL + ACCOUNTING_PORTAL.getCreditNotes, obj);
	}

	getDebitNotes(obj) {
		return axios.post(BASE_URL + ACCOUNTING_PORTAL.getCreditNotes, obj);
	}

	getAllMasterTax() {
		return axios.get(BASE_URL + ACCOUNTING_PORTAL.getAllTaxes);
	}

	getAllHsnCodes() {
		return axios.get(BASE_URL + ACCOUNTING_PORTAL.getAllHsnCodesData);
	}

	saveMasterTax(saveTax) {
		return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveMasterTax, saveTax);
	}
	updateMasterTax(saveTax) {
		return axios.put(BASE_URL + ACCOUNTING_PORTAL.updateTax, saveTax);
	}
	getAllMasterTax() {
		return axios.get(BASE_URL + ACCOUNTING_PORTAL.getAllTaxes);
	}

	getDescrition() {
		return axios.get(BASE_URL + ACCOUNTING_PORTAL.getDescritionData);
	}

	getTaxAppliesOn() {
		return axios.get(BASE_URL + ACCOUNTING_PORTAL.getTaxAppliesOnData);
	}

	saveHsnCode(domainType, saveHsnObj) {
		let param = `?domainType=${domainType}`;
		return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveHsnCode + param, saveHsnObj);
	}
	updateHsnCode(domainType, updateHsnObj) {
		let param = `?domainType=${domainType}`;
		return axios.put(BASE_URL + ACCOUNTING_PORTAL.updateHsnCode + param, updateHsnObj);
	}
	saveCredit(saveCredit) {
		return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveCredit, saveCredit);
	}

	creditDebitOrder(reqObj) {
		const URL =
			BASE_URL + "/paymentgateway/paymentgateway/create_creditdebit_order";
		return axios.post(URL, reqObj, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	getAllLedgerLogs(obj) {
		return axios.post(BASE_URL + ACCOUNTING_PORTAL.getAllLedgerLogs, obj);
	}

	saveDebit(obj) {
		return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveDebit, obj);
	}
}

export default new AccountingService();
