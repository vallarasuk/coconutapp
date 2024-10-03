import AsyncStorageConstants from "../helper/AsyncStorage";
import AsyncStorage from "../lib/AsyncStorage";
class AsyncStorageService {
    async getUserId() {
        let UserId = await AsyncStorage.getItem(
            AsyncStorageConstants.USER_ID
        );
        return UserId
    }
    async getUserName() {
        let UserName = await AsyncStorage.getItem(
            AsyncStorageConstants.USER_NAME
        );
        return UserName
    }
    async getPermissions() {
        let Permissions = await AsyncStorage.getItem(
            AsyncStorageConstants.PERMISSIONS
        );
        return Permissions
    }

    async getSettings(){
        let Settings = await AsyncStorage.getItem(
            AsyncStorageConstants.SETTINGS
        );
        return Settings

    }
    async getStatusList() {
        let Permissions = await AsyncStorage.getItem(
            AsyncStorageConstants.STATUS_LIST
        );
        return Permissions
    }
    async getSessionToken() {
        let sessionToken = await AsyncStorage.getItem(
            AsyncStorageConstants.SESSION_TOKEN
        );
        return sessionToken
    }
    async getSelectedLocationId() {
        let storeId = await AsyncStorage.getItem(
            AsyncStorageConstants.SELECTED_LOCATION_ID
        );

        return storeId
    }
    async getSelectedLocationName() {
        let storeId = await AsyncStorage.getItem(
            AsyncStorageConstants.SELECTED_LOCATION_NAME
        );
        return storeId
    }
    async getRoleId() {
        let roleId = await AsyncStorage.getItem(
            AsyncStorageConstants.ROLE_ID
        );
        return roleId
    }
    async getLastSynced() {
        let LastSynced = await AsyncStorage.getItem(
            AsyncStorageConstants.LAST_SYNCED
        );
        return LastSynced
    }
    async setUserId(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.USER_ID, data);

    }

    async setShift(data) {

        await AsyncStorage.setItem(
            AsyncStorageConstants.SHIFT, JSON.stringify(data));
    }

    async getShift() {
        let shift = await AsyncStorage.getItem(
            AsyncStorageConstants.SHIFT
        );
        return shift
    }

    async setAppId(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.APP_ID, data);

    }
    async getAppId() {
       let appId = await AsyncStorage.getItem(
            AsyncStorageConstants.APP_ID);
            return appId
    }
    async setUserName(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.USER_NAME, data);

    }
    async setPermissions(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.PERMISSIONS, data);

    }
    async setSettings(data) {
        if(data){
            await AsyncStorage.setItem(
                AsyncStorageConstants.SETTINGS, data);
        }
       

    }
    async setStatusList(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.STATUS_LIST, data);

    }
    async setSessionToken(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.SESSION_TOKEN, data);

    }
    async setSelectedLocationId(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.SELECTED_LOCATION_ID, data);

    }
    async setSelectedLocationName(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.SELECTED_LOCATION_NAME, data);

    }
    async setRoleId(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.ROLE_ID, data);
    }
    async setLastSync(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.LAST_SYNCED, data);
    }
    async setShiftTime(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.SHIFT_TIME, data);
    }
    async getShiftTime() {
        let shiftTime = await AsyncStorage.getItem(
            AsyncStorageConstants.SHIFT_TIME
        );
        return shiftTime
    }

    async setDeviceInfoStatus(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.DEVICE_STATUS, data);
    }
    async getDeviceInfoStatus() {
        let status = await AsyncStorage.getItem(
            AsyncStorageConstants.DEVICE_STATUS
        );
        return status
    }

    async setAccountId(accountId) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.CUSTOMER_ACCOUNT_ID,
            accountId
        );
    }

    async setAppFeatures(data) {
        if(data){
            await AsyncStorage.setItem(
                AsyncStorageConstants.APP_FEATURES, data);
        }
    }

    async getAppFeatures(){
        let features = await AsyncStorage.getItem(
            AsyncStorageConstants.APP_FEATURES
        );
        return features
    }

}
const asyncStorageService = new AsyncStorageService();
export default asyncStorageService