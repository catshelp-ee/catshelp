import React from "react";

interface FormInputProps {
  question?: string;
  type?: string;
  id: string;
  required?: boolean;
  admin?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  question,
  id,
  type = "text",
  required = false,
  admin = false,
}) => {
  return (
    <>
      {admin ? (
        <div className="bg-slate-300 p-4 w-1/3 rounded-lg flex gap">
          <h1 className="text-2xl">{id}. </h1>
          <textarea
            className="w-full"
            placeholder="Kirjuta siia küsimus"
            name=""
            id={id}
          ></textarea>
        </div>
      ) : (
        <>
          <label htmlFor={id}>{question}</label>
          <input id={id} type={type} required={required} />
        </>
      )}
    </>
  );
};

export default FormInput;
