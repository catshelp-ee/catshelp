import React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { useAlert } from "@context/AlertContext";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const googleAuthSuccess = async (response: any) => {
    try {
      await axios.post("/api/login-google", response);
    } catch (error ) {
      showAlert('Error', "Kasutajat ei leitud");
      return;
    }
  
    navigate(`/dashboard`);
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    if (!payload.email) {
      return;
    }

    try {
      await axios.post("/api/login-email", { email: payload.email });
      showAlert('Success', "Emailile saadeti link juhistega");
    } catch (error) {
      showAlert('Success', "Emaili saatmine ebaõnnestus");
    }
  }

  const errorMessage = (error: any) => {
    showAlert('Error', "Google abil sisenemine ebaõnnestus");
  };

  return (
    <div className="login-background">
      <div className="login-form-box">
        <form className="login-form" onSubmit={submitForm}>
          <h1>Logi sisse</h1>
          <div className="google-login">
            <GoogleLogin onSuccess={googleAuthSuccess} onError={errorMessage} />
          </div>
          <p>või</p>
          <div className="email-login">
            <TextField name="email" label="E-maili aadress" />
            <Button type="submit">Logi sisse lingiga</Button>
          </div>
          <span>Kui proovisid sisse logida, aga ei õnnestunud, aga sinu juures on mõni Cats Helpi kiisu, siis palun </span><a>Registreeri end siin</a>
        </form>
      </div>
      <a hidden className="attribution-link" target="_blank" href="https://www.vecteezy.com/free-vector/animals">Background image by Vecteezy</a>
    </div>
  );
};

export default LoginForm;
