import React from "react";
import Select from "./Select";
import { FilterOption } from "../helper/Filter";

const DateFilter = ({ handleDateFilterChange, control, data,options, showCloseIcon=true }) => {

    return (
        <Select
            options={options ? options : FilterOption}
            OnSelect={handleDateFilterChange}
            control={control}
            data={data}
            disableSearch
            showCloseIcon={showCloseIcon}
        />
    )

}
export default DateFilter



