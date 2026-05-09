import { useAlert } from '@context/alert-context.tsx';
import EmailIcon from '@mui/icons-material/Email';
import { Button, InputAdornment, TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const googleAuthSuccess = async (response) => {
    try {
      const resp = await axios.post('/api/auth/login-google', response);
      navigate(`/users/${resp.data.id}`);
    } catch (_error) {
      showAlert('Error', 'Kasutajat ei leitud');
      return;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    if (!payload.email) {
      return;
    }

    try {
      await axios.post('/api/auth/login-email', { email: payload.email });
      showAlert('Success', 'Emailile saadeti link juhistega');
    } catch (_error) {
      showAlert('Success', 'Emaili saatmine ebaõnnestus');
    }
  };

  const errorMessage = () => {
    showAlert('Error', 'Google abil sisenemine ebaõnnestus');
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
            <TextField
              name="email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#42ade2' }} />
                    </InputAdornment>
                  ),
                },
              }}
              label="E-maili aadress"
            />
            <div className="login-button-container">
              <Button
                type="submit"
                sx={{ textTransform: 'none', fontWeight: '500', fontSize: 16 }}
              >
                Logi sisse lingiga
              </Button>
            </div>
          </div>
          {/*<span>Kui proovisid sisse logida, aga ei õnnestunud, aga sinu juures on mõni Cats Helpi kiisu, siis palun </span><a>Registreeri end siin</a>*/}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
