// Import React and Component
import React, { useEffect, useState } from "react";

import { BackHandler } from "react-native";

import Layout from "../../components/Layout";

import LocationSelect from "../../components/LocationSelector";

import { useNavigation } from "@react-navigation/native";

import asyncStorageService from "../../services/AsyncStorageService";
import settingService from "../../services/SettingService";
import Setting from "../../lib/Setting";
import AttendanceService from "../../services/AttendanceService";
import DateTime from "../../lib/DateTime";
import OTPCofirmationModal from "../../components/OTPCofirmationModal";
import OTPService from "../../services/OTPService";
import Device from "../../lib/Device";
import userService from "../../services/UserService";

const StoreSetting = (props) => {
  const [forceCheckInValue, setForceCheckInValue] = useState("");
  const [otp, setOTP] = useState("");

  const [attendance, setAttendance] = useState([]);

  const [isOtpModelOpen, setIsotpModalOpen] = useState(false);
  const [locationRowValue, setLocationRowValue] = useState(null);
  const [oldLocationId, setOldLocationId] = useState(null);
  const [otpVerificationPermission, setOtpVerificationPermission] =
    useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const params = props?.route?.params;

  const navigation = useNavigation();

  useEffect(() => {
    forceCheckIn();
    if (params?.isInitialSetup) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );
      return () => backHandler.remove();
    }
    getLocationData();
    getOtpVerificationPermission();
    GetDeviceInformation();
  }, []);

  const GetDeviceInformation = async () => {
    await Device.GetIpAddress((callback) => setIpAddress(callback));
    let deviceName = await Device.GetDeviceName();
    setDeviceName(deviceName);
  };

  const getOtpVerificationPermission = async () => {
    await settingService.get(
      Setting.REQUIRE_VERIFICATION_ON_LOCATION_CHANGE,
      (err, response) => {
        if (response && response?.settings && response?.settings[0]?.value) {
          const settingValue =
            response && response?.settings && response?.settings[0]?.value;
          setOtpVerificationPermission(settingValue);
        }
      }
    );
  };

  const getLocationData = async () => {
    let oldLocationId = await asyncStorageService.getSelectedLocationId();
    setOldLocationId(oldLocationId);
  };

  const forceCheckIn = async () => {
    let userId = await asyncStorageService.getUserId();
    let RoleId = await asyncStorageService.getRoleId();
    await settingService.get(
      Setting.FORCE_CHECK_IN_AFTER_LOGIN,
      async (error, response) => {
        setForceCheckInValue(
          response && response.settings && response.settings[0].value
        );
      },
      RoleId
    );
    let attendance = {
      user: userId,
      startDate: DateTime.formatDate(new Date()),
      endDate: DateTime.toISOEndTimeAndDate(new Date()),
    };
    AttendanceService.getAttendanceList(null, attendance, (error, response) => {
      setAttendance(response);
    });
  };

  const handleOTPSend = async (location) => {
    let oldLocationName = await asyncStorageService.getSelectedLocationName();
    let data = new FormData();
    data.append("oldLocationName", oldLocationName);
    data.append(
      "newLocationName",
      location && location?.name ? location?.name : locationRowValue?.name
    );
    data.append("deviceName", deviceName ? deviceName : "");
    data.append("ipAddress", ipAddress ? ipAddress : "");

    await OTPService.create(data, null, (err, res) => {});
  };

  const onStorePress = async (location) => {
    let oldLocationId = await asyncStorageService.getSelectedLocationId();
    if (
      params &&
      params?.isLocationChange &&
      otpVerificationPermission === "true"
    ) {
      if (oldLocationId) {
        if (Number(oldLocationId) !== Number(location?.id)) {
          handleOTPSend(location);
          setLocationRowValue(location);
          setIsotpModalOpen(true);
        } else {
          navigation.navigate("Settings");
        }
      } else {
        handleOTPSend(location);
        setLocationRowValue(location);
        setIsotpModalOpen(true);
      }
    } else {
      await asyncStorageService.setSelectedLocationName(location?.name);
      await asyncStorageService.setSelectedLocationId(
        JSON.stringify(location?.id)
      );

      if (params?.isInitialSetup) {
        if (forceCheckInValue === "true" && attendance.length == 0) {
          navigation.navigate("shiftSelect", {
            store_id: location?.id,
            navigation: navigation,
            reDirectionUrl: "Dashboard",
          });
        } else {
          navigation.navigate("Dashboard", { login: true });
        }
      } else {
        navigation.navigate("Settings");
      }
    }
  };
  const handleSubmit = async (otp) => {
    if (otp) {
      let data = {
        verificationCode: otp,
        deviceName: deviceName ? deviceName : "",
      };

      await OTPService.validate(data, async (err, res) => {
        if (res) {
          await asyncStorageService.setSelectedLocationName(
            locationRowValue?.name
          );
          await asyncStorageService.setSelectedLocationId(
            JSON.stringify(locationRowValue?.id)
          );

          let userId = await asyncStorageService.getUserId();
          userService.update(
            userId,
            { currentLocationId: locationRowValue?.id },
            () => {}
          );

          if (params?.isInitialSetup) {
            if (forceCheckInValue === "true" && attendance.length == 0) {
              navigation.navigate("shiftSelect", {
                store_id: locationRowValue?.id,
                navigation: navigation,
                reDirectionUrl: "Dashboard",
              });
            } else {
              navigation.navigate("Dashboard", { login: true });
            }
          } else {
            navigation.navigate("Settings");
          }
        } else if (err) {
          setOTP("");
        }
      });
    }
  };

  const handleResendOTP = () => {
    handleOTPSend(null);
  };

  return (
    <>
      <Layout
        title="Select Location"
        HideSideMenu={params?.isInitialSetup ? true : false}
        emptyMenu={params?.isInitialSetup ? true : false}
        defaultFooter={true}
        showBackIcon={params?.isLocationChange ? true : false}
      >
        <OTPCofirmationModal
          isOpen={isOtpModelOpen}
          onClose={() => setIsotpModalOpen(false)}
          onSubmit={handleSubmit}
          setOTP={setOTP}
          otp={otp}
          handleResendOTP={handleResendOTP}
        />
        <LocationSelect
          onPress={onStorePress}
          locationByRole={params?.locationByRole}
          showSelectedRow
          selectedRowProperty={"id"}
          rowCompareValue={oldLocationId}
        />
      </Layout>
    </>
  );
};

export default StoreSetting;
