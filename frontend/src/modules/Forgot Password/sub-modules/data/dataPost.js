// Create a context to manage the shared data
import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function useDataContext() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [email, setEmailPOst] = useState('');
  const [verificationcode, setVerificationCode] = useState('');

  return (
    <DataContext.Provider value={{ email, setEmailPOst, verificationcode, setVerificationCode }}>
      {children}
    </DataContext.Provider>
  );
}