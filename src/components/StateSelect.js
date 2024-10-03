import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import countryService from "../services/CountryService";


const StateSelect = ({ data,label,countryId, onChange, required, placeholder,disable, control, name }) => {
    const [list, setList] = useState([]);
    useEffect(() => {
        countryId &&  getStateList();
    }, [countryId]);
    let params = "";
    if (countryId) {
      params += "?stateList=true";
    }
    const getStateList = async() => {
        countryService.getStateList(countryId,params, (response) => {
            setList(response);

        })
    }
   

    return (
        <Select
            control={control}
            options={list}
            getDetails={(values) => onChange && onChange(values)}
            label={label}
            placeholder={placeholder}
            data={data}
            name={name}
            disable={disable}
            showBorder
            required={required}
        />
    )
};
export default StateSelect;
