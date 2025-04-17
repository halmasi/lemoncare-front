import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export interface ErrorsProps {
  identifier: string[];
  username: string[];
  password: string[];
  email: string[];
  server: string[];
}

export interface LoginDataProps {
  email: string;
  username: string;
  identifier: string;
  step: 'identifier' | 'login' | 'register';
  errors: ErrorsProps;
  completedSteps: {
    identifier: boolean;
    login: boolean;
    register: boolean;
  };
  setErrors: (errors: ErrorsProps) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setIdentifier: (identifier: string) => void;
  setStep: (step: 'identifier' | 'login' | 'register') => void;
  resetForm: () => void;
}

export const useLoginData = create(
  persist<LoginDataProps>(
    (set) => ({
      email: '',
      username: '',
      identifier: '',
      step: 'identifier',
      errors: {
        email: [],
        username: [],
        password: [],
        identifier: [],
        server: [],
      },
      completedSteps: {
        identifier: false,
        login: false,
        register: false,
      },
      setErrors: (errors) => set(() => ({ errors })),
      setEmail: (email) => set(() => ({ email })),
      setUsername: (username) => set(() => ({ username })),
      setIdentifier: (identifier) => set(() => ({ identifier })),
      setStep: (step) => set(() => ({ step })),
      resetForm: () => {
        set(() => ({
          username: '',
          email: '',
          identifier: '',
          step: 'identifier',
          errors: {
            email: [],
            username: [],
            password: [],
            identifier: [],
            server: [],
          },
          completedSteps: {
            identifier: false,
            login: false,
            register: false,
          },
        }));
        localStorage.removeItem('login-store');
      },
    }),
    {
      name: 'login-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
