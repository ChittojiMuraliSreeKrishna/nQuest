import AsyncStorage from '@react-native-async-storage/async-storage';
import URMService from '../components/services/UrmService';

const getChildPrivileges = async (subPrivilege) => {
    let childPrivileges = [];
    const roleName = await AsyncStorage.getItem("rolename");
    let data = URMService.getSubPrivilegesbyRoleId(roleName).then(res => {
        if (res) {
            let initialValue = {
                mobile: [],
                web: []
            }
            if (res.data.parentPrivileges) {
                const result = res.data.parentPrivileges.reduce((accumulator, current) => {
                    (current.previlegeType === 'Mobile') ? accumulator.mobile.push(current) : accumulator.web.push(current);
                    return accumulator;
                }, initialValue);
                result.mobile.forEach((parent) => {
                    parent.subPrivileges.forEach((sub) => {
                        if (sub.name === subPrivilege) {
                            sub.childPrivileges.forEach((child) => {
                                childPrivileges.push(child);
                            });
                        }
                    });
                });
            }
        }
        return childPrivileges;
    });
    return data;
}
export default getChildPrivileges;