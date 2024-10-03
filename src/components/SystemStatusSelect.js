import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import userService from "../services/UserService";
import User from "../helper/User";
import StatusService from "../services/StatusServices";
import asyncStorageService from "../services/AsyncStorageService";
import Status from "../helper/Status";


const SystemStatusSelect = (props) => {
    const { data, onChange, required, placeholder, label,divider, showBorder,name,disable, control, currentStatusId, projectId, disableSearch } = props


   
    const Options = [
        {
            value: Status.ACTIVE,
            label: Status.ACTIVE_TEXT,
        },
        {
            value: Status.INACTIVE,
            label: Status.INACTIVE_TEXT,
        }
    ]


    return (
        <Select
            control={control}
            options={Options}
            getDetails={(values) => onChange && onChange(values)}
            label={label ? label : "Status"}
            placeholder={placeholder}
            name={name}
            data={data}
            divider={divider}
            disable={disable}
            required={required}
            disableSearch={disableSearch}
        />
    )
};
export default SystemStatusSelect;
