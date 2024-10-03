
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../helper/AsyncStorage";

const AsyncStorageObject = {

    setItem: async (name, value) => {
        if (name && value) {
            await AsyncStorage.setItem(name, value);
        }
    },

    setJSONItem: async (name, value) => {
        if (name) {
            value = JSON.stringify(value);
            if (value) {
                await AsyncStorage.setItem(name, value);
            }
        }
        return true
    },

    getJSONItem: async (name) => {
        if (name) {
            let cookieValue = await AsyncStorage.getItem(name);

            if (cookieValue) {
                cookieValue = JSON.parse(cookieValue);
            }

            return cookieValue;

        }

        return null

    },

    getItem: async (name) => {
        if (name) {
            let cookieValue = await AsyncStorage.getItem(name);
            return cookieValue;

        }
    },

    clearAll: async (isClearAll) => {
        if(isClearAll){
            AsyncStorage.clear()
            .then(() => console.log('All Data Cleared'))
            .catch((error) => console.error('Error clearing AsyncStorage', error))
        }else{
            try {
            
                const keys = await AsyncStorage.getAllKeys();
                const filteredKeys = keys.filter(key => key !== AsyncStorageConstants.SELECTED_LOCATION_NAME && key !== AsyncStorageConstants.SELECTED_LOCATION_ID && key !== AsyncStorageConstants.SHIFT);
                await AsyncStorage.multiRemove(filteredKeys);
                console.log('All Data Cleared except SELECTED_LOCATION_NAME and SELECTED_LOCATION_ID');
            } catch (error) {
                console.error('Error clearing AsyncStorage', error);
            }
        }
       
    },
    clear: async (value) => {
        try {
            if(value){
                await AsyncStorage.removeItem(value);
            }
        } catch (error) {
            console.error('Error clearing Shift', error);
        }
       
    }
  
    
    
};

export default AsyncStorageObject;
