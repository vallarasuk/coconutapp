import React, { useEffect, useState } from "react";
import Select from "./Select";
import AccountTypeService from "../services/AccountTypeService";

const AccountTypeSelect = (props) => {
    const { name, data, label, onChange, disable, divider, showBorder,required, control: controlProp } = props

  const [options, setOptions] = useState([]);

  useEffect(() => {
    getList();
  }, []);


  const getList = async () => {
    try{
        AccountTypeService.list({},(response) => {
            setOptions(response); 
      });
    }catch(err){
      console.log(err);
    }
  };

  return (
    <>
       <Select
      control={controlProp ? controlProp : control}
      options={options}
      getDetails={onChange}
      label={label}
      name={name}
      divider={divider}
      showBorder={showBorder}
      placeholder={"Select Type"}
      data={data}
      disable={disable}
      required={required}
    />
    </>
  );
};

export default AccountTypeSelect;
