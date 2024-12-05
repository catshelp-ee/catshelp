import React from "react";

export interface InputFieldProps {
  icon: string;
  placeholder: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="flex flex-wrap gap-6 px-5 py-4 mt-6 rounded-lg border border-solid border-neutral-600">
      <img
        loading="lazy"
        src={icon}
        alt=""
        className="object-contain shrink-0 w-7 aspect-square"
      />
      <input
        type={type}
        placeholder={placeholder}
        className="flex-auto my-auto w-[465px] max-md:max-w-full bg-transparent border-none outline-none"
        aria-label={placeholder}
      />
    </div>
  );
};

export default InputField;
