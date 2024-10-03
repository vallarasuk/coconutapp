// Import React and Component
import React, { useEffect, useState } from "react";

import AttendanceCardTab from "../attendance/components/AttendanceCardTab";
import userService from "../../services/UserService";
import FilterDrawer from "../../components/Filter";

const AttendanceMonthWiseReport = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isListFeatching, setIsListFeatching]=useState(false);
  const [userList, setUserList] = useState();
  const [values, setValues] = useState()
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    getUserList();
}, []);
  const getUserList = ()=>{
    userService.list(null, (callback) => { setUserList(callback) });

}
const userOnSelect = (value) => {
    if (value) {
      setValues((prevValues) => ({
        ...prevValues,
        user: value.value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        user: "",
      }));
    }
  };
  const closeDrawer = () => {
    setOpenFilter(!openFilter);
  };

  const handleSubmit = ()=>{
    setIsListFeatching(true)
    closeDrawer()
  }


  return (
   <>
         <FilterDrawer
        values={values}
        isOpen={openFilter}
        closeDrawer={closeDrawer}
        userOnSelect={userOnSelect}
        handleSubmit={handleSubmit}
        userList={userList}
        showUser
        clearFilter={() => {
          setValues("");
          closeDrawer();
        }}
      />
    
       

        <AttendanceCardTab
        refreshing={refreshing}
        setRefreshing={setRefreshing}
        values={values}
        isListFeatching={isListFeatching}
        setIsListFeatching={setIsListFeatching}
        closeDrawer={closeDrawer}
         />
      </>
  );
};
export default AttendanceMonthWiseReport;

