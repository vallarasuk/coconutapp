import asyncStorageService from "./AsyncStorageService";
class PermissionService {
    static async hasPermission(permission) {
        let isExist = false;
        let permissionList = await asyncStorageService.getPermissions();
        if (permissionList) {
            permissionList = JSON.parse(permissionList);
            if (permissionList && permissionList.length > 0) {
                for (let i = 0; i < permissionList.length; i++) {
                    if (permissionList[i].role_permission == permission) {
                        isExist = true;
                    }
                }
            }
        }
        return isExist;
    }

    static async getFeaturePermission(appFeaturePermission, rolePermission) {
        let features = await asyncStorageService.getAppFeatures();
        if (features) {
            features = JSON.parse(features);
            if (features && features.length > 0) {
                let featurePermission = features.find((data) => data?.name === appFeaturePermission && data?.value === "true") || false;
                if (featurePermission) {
                    let isRolePermission = await this.hasPermission(rolePermission);
                    if (isRolePermission) {
                        return true
                    }else{
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    }

}
export default PermissionService;