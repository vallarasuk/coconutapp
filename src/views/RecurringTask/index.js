import React from "react";
import Layout from "../../components/Layout";
import { useState } from "react";
import { useEffect } from "react";
import PermissionService from "../../services/PermissionService";
import Permission from "../../helper/Permission";
import recurringTaskService from "../../services/RecurringTaskService";
import Status from "../../helper/Status";
import Refresh from "../../components/Refresh";
import NoRecordFound from "../../components/NoRecordFound";
import ShowMore from "../../components/ShowMore";
import { View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AlternativeColor from "../../components/AlternativeBackground";
import RecurringTaskCard from "./components/RecurringTaskCard";
import FilterDrawer from "../../components/Filter";
import userService from "../../services/UserService";
import DateTime from "../../lib/DateTime";
import ObjectName from "../../helper/ObjectName";


const RecurringTask = ()=>{

    const [isLoading, setIsLoading] = useState(false);
    const [recurringList,setRecurringList] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);
    const [addPermission, setAddPermission] = useState(false)
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [openFilter, setOpenFilter] = useState(false);
    const [values, setValues] = useState();
    const [userList, setUserList] = useState([])
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
  


    useEffect(() => {
        getPermission()
        getRecurringList(values)
    }, [isFocused]);
    useEffect(()=>{
      if(refreshing){
        getRecurringList(values)

      }

    },[refreshing])
    useEffect(() => {
      getUserList();
    }, [])

    const getPermission = async () => {
        const addPermission = await PermissionService.hasPermission(Permission.RECURRING_TASK_ADD)
        setAddPermission(addPermission)
    }

    const getRecurringList=async (value)=>{
        recurringList && recurringList.length == 0 && setIsLoading(true);
          let param = {status : Status.ACTIVE,objectName : ObjectName.RECURRING_TASK, user :value && value?.user ? value?.user : "" , startDate: value && value.startDate ? DateTime.toISOStringDate(value?.startDate) : "" ,endDate: value && value.endDate ? DateTime.toISOStringDate(value?.endDate) : ""}
         await recurringTaskService.search(param,(err, response) => {
          if (response) {
            setRecurringList(response)
        
          }
          setIsLoading(false);
          setRefreshing(false)
          
    
          
        });
    }
    const getUserList = ()=>{
      userService.list(null, (callback) => { setUserList(callback) });
  
  }
    const userOnselect = (value) => {
      if (value) {
        setValues((prevValues) => ({
          ...prevValues,
          user: value.value
        }));
      } else {
        setValues((prevValues) => ({
          ...prevValues,
          user: ""
        }));
      }
    }
    const handleSubmit = () => {
      getRecurringList(values)
      closeDrawer()
    };
    const LoadMoreList = async () => {
        try {
            setIsFetching(true);
    
            let params = {page : page,status : Status.ACTIVE, user :values && values?.user ? values?.user : "" , startDate: values && values.startDate ? DateTime.toISOStringDate(values?.startDate) : "" ,endDate: values && values.endDate ? DateTime.toISOStringDate(values?.endDate) : ""}
            recurringTaskService.search(params,(err, response)  => {
    
                let recurringTask = response
    
                setRecurringList((prevTitles) => {
                    return [...new Set([...prevTitles, ...recurringTask])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(recurringTask.length > 0);
                setIsFetching(false);
            });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };
    const AddNew =()=>{
        navigation.navigate("RecurringTaskForm",{isAddPage:true})
    }
    const closeDrawer = () => {
      setOpenFilter(!openFilter);
    }
    const onDateSelect = (value) => {
      if (value) {
        setValues((prevValues) => ({
          ...prevValues,
          startDate: new Date(value)
        }));
        setSelectedDate(new Date(value));
      } else {
        setValues((prevValues) => ({
          ...prevValues,
          startDate: ""
        }));
        setSelectedDate("");
      }
    }
    const onEndDateSelect = (value) => {
      if (value) {
        setValues((prevValues) => ({
          ...prevValues,
          endDate: new Date(value)
        }));
        setSelectedEndDate(new Date(value));
      } else {
        setValues((prevValues) => ({
          ...prevValues,
          endDate: ""
        }));
        setSelectedEndDate("");
      }
    }
    return(
        <Layout 
        title = "Recurring Task"
        isLoading={isLoading} 
        refreshing={refreshing} 
        addButton={addPermission ? true : false } 
        buttonOnPress={AddNew}
        showActionButton={addPermission} 
        showBackIcon={false}
        showFilter={true}
        onFilterPress={closeDrawer}
        >
           <FilterDrawer
        values={values}
        isOpen={openFilter}
        closeDrawer={closeDrawer}
        userOnSelect={userOnselect}
        userList={userList}
        onDateSelect={onDateSelect}
        onEndDateSelect={onEndDateSelect}
        selectedEndDate={selectedEndDate}
        selectedDate={selectedDate}
        label={'Assignee'}
        placeholder={'Select Assignee'}
        showDate
        showUser
        handleSubmit={handleSubmit}
      />
            <Refresh refreshing={refreshing}  setRefreshing={setRefreshing}>
            <View>
          <>
            {recurringList && recurringList.length > 0 ? (
              recurringList.map((item, index) => {
                const containerStyle =
                  AlternativeColor.getBackgroundColor(index);
                    return(
                        <RecurringTaskCard
                        alternative = {containerStyle}
                        item = {item}
                        onPress ={()=>navigation.navigate("RecurringTaskForm",{item})}
                        />
                    )               
              })
            ) : (
              <NoRecordFound iconName='receipt' />
            )}

            <ShowMore
              List={recurringList}
              isFetching={isFetching}
              HasMore={HasMore}
              onPress={LoadMoreList}
            />
          </>
        </View>
            </Refresh>

        </Layout>
    )
   
     
}
export default RecurringTask;