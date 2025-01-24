import React from "react";
import InputField from "./InputField.tsx";
import { InputFieldProps } from "./InputField.tsx";
import { GoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";

const RegisterForm: React.FC = () => {
  const [cookies, setCookie] = useCookies(["oauth"]);
  const responseMessage = (response) => {
    setCookie("oauth", true, { path: "/" });
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div>
      <h2>React google login</h2>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
};

export default RegisterForm;
