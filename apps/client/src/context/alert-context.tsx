import React, { ReactNode, createContext, useState, useContext } from 'react';
import Alert from '@mui/material/Alert';
import { Stack } from '@mui/material';


type AlertType = 'Success' | 'Error' | 'Warning' | 'Info';

type Alert = {
  type: AlertType;
  message: string;
};

type AlertContext = {
  showAlert: (type: AlertType, message: string) => void;
};

type AlertContextProvider = {
  children: ReactNode;
};

// Create a new context for the Alert
export const AlertContext = createContext<AlertContext>({
  showAlert: () => { },
});


export const AlertProvider: React.FC<AlertContextProvider> = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState<Alert[]>([]);

  // Function to hide an alert based on its index
  const hideAlert = (index: number) => {
    setAlertMessage((prev) => prev.filter((_, i) => i != index));
  };

  // Context value containing the showAlert function
  const contextValue: AlertContext = {
    showAlert: (type, message) => {
      const alertMessage: Alert = {
        type,
        message,
      };
      setAlertMessage((prev) => [...prev, alertMessage]);
    },
  };

  return (
    <AlertContext.Provider value={contextValue}>
      <div id="alert-container" className='alert-container'>
        <Stack sx={{ width: '100%' }} spacing={2}>
          {alertMessage.map((alert, index) => (
            <Alert
              key={index}
              variant="filled"
              onClose={() => hideAlert(index)}
              severity={alert.type.toLowerCase()}
            >
              <div>{alert.message}</div>
            </Alert>
          ))}
        </Stack>
      </div>
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook to use auth
export const useAlert = () => useContext(AlertContext);
