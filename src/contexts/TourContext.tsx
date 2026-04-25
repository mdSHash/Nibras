import React, { createContext, useContext, ReactNode } from 'react';
import { useTour } from '../hooks/useTour';
import { TourState } from '../types/tour';

interface TourContextValue {
  state: TourState;
  currentStepData: any;
  totalSteps: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  skipTour: () => void;
  resetTour: () => void;
  showPrompt: boolean;
  acceptTourPrompt: () => void;
  declineTourPrompt: () => void;
  preferences: any;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tourValue = useTour();
  
  return (
    <TourContext.Provider value={tourValue}>
      {children}
    </TourContext.Provider>
  );
};

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within TourProvider');
  }
  return context;
};

