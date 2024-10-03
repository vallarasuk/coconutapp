import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import accountService from "../services/AccountService";



const AccountSelect = (props) => {
    const { data, label, onChange, required,divider, placeholder, showBorder,disable, control,name, options } = props
    const [vendorList, setVendorList] = useState();
    const [isFocus, setIsFocus] = useState(false)
    const isFocused = useIsFocused();
    
    useEffect(() => {
        let mount = true;

        mount && accountService.GetList(null, (callback) => { setVendorList(callback) })

        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused])
   

    return (
        <Select
            label={label}
            options={isFocus ? vendorList : options ? options :vendorList}
            control={control}
            divider = {divider}
            data={data}
            name={name}
            showBorder={showBorder}
            getDetails={(values) =>onChange && onChange(values)}
            placeholder={placeholder}
             disable={disable}
            required={required}
            setIsFocus={setIsFocus}

        />
    )
};
export default AccountSelect;