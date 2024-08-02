import { CHECKED_COLOR } from "../constant";
import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

interface CustomCheckboxProps {
  label?: string;
  isChecked: boolean;
  setIsChecked?: (isChecked: boolean) => void;
  color?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label = "",
  isChecked,
  setIsChecked = null,
  color = CHECKED_COLOR,
}) => {
  return (
    <div
      onClick={() => setIsChecked && setIsChecked(!isChecked)}
      className="flex w-full gap-2 items-center px-[16px] py-[6px] hover:bg-slate-100 cursor-pointer select-none"
    >
      <div
        className={`flex items-center justify-center w-4 h-4 shadow-md text-white ${
          isChecked ? "" : "bg-white border-[1px] border-[#000]"
        } border border-[#CBD5E0] rounded-[4px]`}
        style={{
          backgroundColor: color,
        }}
      >
        <CheckIcon />
      </div>
      {label && <span className={`leading-[160%]`}>{label}</span>}
    </div>
  );
};

export default CustomCheckbox;
