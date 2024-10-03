import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import userService from "../services/UserService";
import User from "../helper/User";
import countryService from "../services/CountryService";


const CountrySelect = ({ data, label, onChange, required, placeholder, disable, control, name }) => {
    const [list, setList] = useState([]);
    const isFocused = useIsFocused();


    useEffect(() => {
        getList();
    }, [isFocused]);


    const getList = () => {
        countryService.list(null, (response) => {
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
export default CountrySelect;
