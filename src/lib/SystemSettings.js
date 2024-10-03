import systemSetting from "react-native-system-setting";


class SystemSetting{

    static async setVolume(desiredVolume){ 
              try {
                await systemSetting.setVolume(desiredVolume, { type: 'music' });
                await systemSetting.setVolume(desiredVolume, { type: 'ring' });
                await systemSetting.setVolume(desiredVolume, { type: 'notification' })      
        
            } catch (error) {
                console.error('Error setting media volume:', error);
            }
            }
               
  }
  export default SystemSetting;