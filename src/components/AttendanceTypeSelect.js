import React, { useEffect, useState } from "react";
import Select from "./Select";
import AttendanceTypeService from "../services/AttendanceTypeService";

const AttendanceTypeSelect = (props) => {
    const { name, data, label, onChange, disable, divider, showBorder,required, control: controlProp } = props

  const [options, setOptions] = useState([]);

  useEffect(() => {
    getList();
  }, []);


  const getList = async () => {
    try{
      AttendanceTypeService.list({},(response) => {
        const optionList = new Array();
        let list = response;
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            optionList.push({
              label: list[i].name,
              value: list[i].name,
              id: list[i].id,
            });
          }
  
          setOptions(optionList);
        }
  
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
      OnSelect={onChange}
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

export default AttendanceTypeSelect;
