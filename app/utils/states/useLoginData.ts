import { create } from 'zustand';

export interface LoginDataProps {
  username: string;
  email: string;
  password: string;
  step:
    | 'identifier'
    | 'login'
    | 'register'
    | 'phoneConfirmationLogin'
    | 'phoneConfirmationRegister';
  completedSteps: {
    identifier: boolean;
    login: boolean;
    register: boolean;
  };
  errors: {
    identifier: string[];
    username: string[];
    password: string[];
    email: string[];
    server: string[];
  };
  setErrors: (errors: LoginDataProps['errors']) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setStep: (
    step:
      | 'identifier'
      | 'login'
      | 'register'
      | 'phoneConfirmationLogin'
      | 'phoneConfirmationRegister'
  ) => void;
  setCompletedStep: (
    step:
      | 'identifier'
      | 'login'
      | 'register'
      | 'phoneConfirmationLogin'
      | 'phoneConfirmationRegister',
    completed: boolean
  ) => void;
  resetForm: () => void;
}
export const useLoginData = create<LoginDataProps>((set) => ({
  username: '',
  email: '',
  password: '',
  step: 'identifier',
  completedSteps: {
    identifier: false,
    login: false,
    register: false,
  },
  errors: {
    identifier: [],
    username: [],
    password: [],
    email: [],
    server: [],
  },
  setErrors: (errors) =>
    set((state) => ({
      errors: { ...state.errors, ...errors },
    })),
  setUsername: (username) => set(() => ({ username })),
  setEmail: (email) => set(() => ({ email })),
  setPassword: (password) => set(() => ({ password })),
  setStep: (step) => set(() => ({ step })),
  setCompletedStep: (step, completed) =>
    set((state) => ({
      completedSteps: {
        ...state.completedSteps,
        [step]: completed,
      },
    })),
  resetForm: () =>
    set(() => ({
      identifier: '',
      username: '',
      email: '',
      password: '',
      step: 'identifier',
      errors: {
        identifier: [],
        username: [],
        password: [],
        email: [],
        server: [],
      },
    })),
}));
