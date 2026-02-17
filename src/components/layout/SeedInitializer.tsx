import { ReactNode, useEffect } from 'react';
import { seedMockData } from '../../constants/mockData';

interface SeedInitializerProps {
  children: ReactNode;
}

export const SeedInitializer = ({ children }: SeedInitializerProps) => {
  useEffect(() => {
    seedMockData();
  }, []);

  return <>{children}</>;
};

