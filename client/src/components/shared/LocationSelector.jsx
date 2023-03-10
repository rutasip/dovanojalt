import React from "react";
import Select from "react-select";
import cities from "../../data/cities";
import { isNullable } from "../../utils/null-checks";

function LocationSelector({ onChange, className, isClearable, defaultValue }) {
  const defaultLabel = isNullable(defaultValue)
    ? null
    : cities.find((city) => city.value === defaultValue);

  return (
    <Select
      isSearchable
      isClearable={isClearable}
      placeholder="Visi miestai"
      onChange={onChange}
      options={cities}
      className={className}
      classNamePrefix="select"
      defaultValue={defaultLabel}
    />
  );
}

export default LocationSelector;
