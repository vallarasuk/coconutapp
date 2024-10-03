import React, { useState, useEffect } from "react";
import Select from "../components/Select";
import DateTime from "../lib/DateTime";

const YearSelect = ({
  selectedYear,
  label,
  onChange,
  required,
  placeholder,
  divider,
  disable,
  control,
  name,
  showBorder,
}) => {
  const [yearOption, setYearOption] = useState([]);

  useEffect(() => {
    getYears();
  }, []);

  const getYears = () => {
    let yearOption = DateTime.getYears();
    setYearOption(yearOption);
  };

  return (
    <Select
      control={control}
      options={yearOption}
      getDetails={(values) => onChange && onChange(values)}
      label={label}
      placeholder={placeholder}
      data={selectedYear}
      name={name}
      divider={divider}
      disable={disable}
      showBorder={showBorder}
      required={required}
      userCard
    />
  );
};
export default YearSelect;
