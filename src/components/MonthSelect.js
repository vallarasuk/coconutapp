import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import DateTime from "../lib/DateTime";


const MonthSelect = ({ selectedMonth, label, onChange, required, placeholder, divider, disable, control, name, showBorder }) => {


    const [monthOption, setMonthOption] = useState([]);

    useEffect(() => {
      getYears();
    }, []);
  
    const getYears = () => {
      let monthOption = DateTime.getMonths();
      setMonthOption(monthOption);
    };

    return (
        <Select
            control={control}
            options={monthOption}
            getDetails={(values) => onChange && onChange(values)}
            label={label}
            placeholder={placeholder}
            data={selectedMonth}
            name={name}
            divider={divider}
            disable={disable}
            showBorder={showBorder}
            required={required}
            userCard
        />
    )
};
export default MonthSelect;
