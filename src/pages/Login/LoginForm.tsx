import React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext.tsx";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const responseMessage = async (response: any) => {
    const loginReq = await axios.post("/api/login", response);
    if (loginReq == null) {
      console.log("No user");
      return;
    }
    const userReq = await axios.get('/api/user');
    if (!userReq.data) {
      console.log("Can't get user data");
      return;
    }
    
    setUser(userReq.data);
    
    navigate("/");
  };

  const errorMessage = (error: any) => {
    console.log(error);
  };

  return (
    <div>
      <h2>Sisene</h2>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
};

export default LoginForm;
