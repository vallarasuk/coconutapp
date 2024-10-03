import React, { useEffect, useState } from "react";
import Select from '../components/Select';
import { useIsFocused } from "@react-navigation/native";

const StoryPointSelect = ({ onChange, required, data, placeholder, divider, disable, control, name, showBorder }) => {
  const [storyPointOptions, setStoryPointOptions] = useState([]);
  useEffect(() => {
    getStoryPoint();
  }, []);
  const getStoryPoint = () => {
    let storyPointOption = [];
    const options = Array.from({ length: 17 }, (_, i) =>
      i < 2 ? i * 0.25 + 0.25 : (i - 2) * 0.5 + 1
    );
    for (let i = 0; i < options.length; i++) {
      storyPointOption.push({ label: options[i].toString(), value: options[i].toString() });
    }

    setStoryPointOptions(storyPointOption);
  };

  return (
    <Select
      control={control}
      options={storyPointOptions}
      OnSelect={(values) => onChange(values)}
      label="Story Points"
      placeholder={placeholder}
      name={name}
      required={required}
      divider={divider}
      data={data}
    />
  );
};

export default StoryPointSelect;
