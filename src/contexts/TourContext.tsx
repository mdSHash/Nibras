import { createContext, ReactNode, useContext } from 'react';
import { useTour } from '../hooks/useTour';

type TourContextValue = ReturnType<typeof useTour>;

const TourContext = createContext<TourContextValue | null>(null);

export const TourProvider = ({ children }: { children: ReactNode }) => (
  <TourContext.Provider value={useTour()}>{children}</TourContext.Provider>
);

export const useTourContext = (): TourContextValue => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTourContext must be used within TourProvider');
  return ctx;
};
