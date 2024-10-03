import React, { useEffect, useState } from 'react';

import BottomDrawer from "../../components/BottomDrawer";

import Select from "../../components/Select";

import { useForm } from "react-hook-form";

import {  Dimensions, View } from "react-native";

import styles from '../../helper/Styles';

import ObjectName from '../../helper/ObjectName';
import StatusService from '../../services/StatusServices';
import DatePicker from '../../components/DatePicker';
import VerticalSpace10 from '../../components/VerticleSpace10';
import userService from '../../services/UserService';
import storeService from '../../services/StoreService';

const FilterDrawer = ({ isOpen,handleSubmit, onClose, closeDrawer,onEndDateSelect,selectedEndDate,selectedDate,onDateSelect,shiftOnSelect,userOnSelect,locationOnSelect, clearFilter,statusOnSelect, applyFilter, values }) => {
  const [statusList, setStatusList] = useState();
  const [userList, setUserList] = useState();
  const [locationList,setLocationList] = useState();

 
  const windowHeight = Dimensions.get('window').height;

  const {
    control,
    formState: { errors },
  } = useForm({ defaultValues: {} });

  useEffect(() => {
    getFilterList();
  }, []);


  const getFilterList = async () => {
    let status = [];
    const response = await StatusService.list(ObjectName.STOCK_ENTRY);
    
    response && response.forEach((statusList) => {
            status.push({
                label: statusList.name,
                value: statusList.status_id,
                id: statusList.status_id
            });
    });

    setStatusList(status);
    userService.list(null, (callback) => { setUserList(callback) });
    storeService.list({},(error, response) => {
        const storeListOption = new Array();
        let storeList = response?.data?.data;
        if (storeList && storeList.length > 0) {
          for (let i = 0; i < storeList.length; i++) {
            storeListOption.push({
              label: storeList[i].name,
              value: storeList[i].id,
            });
          }
  
          setLocationList(storeListOption);
        }
  
      });


  }

  const CloseDrawer = () => {
    closeDrawer();
  }

  return (
    <>
      <BottomDrawer 
        isOpen={isOpen} 
        onClose={onClose} 
        height={windowHeight * 0.8} 
        clearFilter ={clearFilter} 
        title={"Stock Entry Filter"} 
        closeDrawer={CloseDrawer} 
        applyFilter={handleSubmit}>

              <Select
                    label="Location"
                    name="location"
                    options={locationList}
                    showBorder={true}
                    control={control}
                    data={values && values?.location}
                    OnSelect={locationOnSelect}
                    placeholder="Select Location"
                  /> 
                  <VerticalSpace10/>
                   <Select
                    label="User"
                    name="userName"
                    options={userList}
                    showBorder={true}
                    control={control}
                    data={values && values?.user}
                    OnSelect={userOnSelect}
                    placeholder="Select User"
                  /> 
                <VerticalSpace10/>

                   <Select
                        label={"Status"}
                        name="status"
                        control={control}
                        options={statusList}
                        showBorder={true}
                        data={values && values?.status}
                        placeholder={"Select Status"}
                        OnSelect={statusOnSelect}
                     />
                     
                     <VerticalSpace10/>
                   

                  <DatePicker 
                  onClear={()=>onDateSelect("")} 
                  name={"startDate"}  
                  title={"Start Date"}  
                  onDateSelect={onDateSelect} 
                  selectedDate={selectedDate} />
                  <VerticalSpace10/>
                  <DatePicker 
                  onClear={()=>onEndDateSelect("")} 
                  name={"endDate"} 
                  title={"End Date"} 
                  onDateSelect={onEndDateSelect} 
                  selectedDate={selectedEndDate} 
                  />
                  <VerticalSpace10/>

                  
     </BottomDrawer>


    </>
  )
};

export default FilterDrawer;