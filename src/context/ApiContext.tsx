import { createContext, ReactNode, useContext } from 'react';
import { AxiosInstance } from 'axios';
import apiClient from '../services/apiClient';

const ApiContext = createContext<AxiosInstance>(apiClient);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>;
};

export const useApi = (): AxiosInstance => {
  return useContext(ApiContext);
};
