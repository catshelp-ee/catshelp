import React, { useRef } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();


  const googleAuthSuccess = async (response: any) => {
    const loginReq = await axios.post("/api/login-google", response);
    if (loginReq == null) {
      console.log("No user");
      return;
    }
    navigate("/dashboard");
  };

  const submitForm = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    if (!payload.email) {
      return;
    }
    await axios.post("/api/login-email", { email: payload.email });
  }

  const errorMessage = (error: any) => {
    console.log(error);
  };

  return (
    <form className="flex flex-col" onSubmit={submitForm}>
      <div>
        <h2>Sisene</h2>
        <GoogleLogin onSuccess={googleAuthSuccess} onError={errorMessage} />
      </div>
      <div>
        <TextField name="email" label="EMAIL" />
        <Button type="submit">Logi sisse lingiga</Button>
      </div>
    </form>
  );
};

export default LoginForm;
