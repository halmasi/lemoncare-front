import { create } from 'zustand';

export interface LoginDataProps {
  username: string;
  // email: string;
  password: string;
  id: number;
  step:
    | 'identifier'
    | 'login'
    | 'register'
    | 'phoneConfirmationLogin'
    | 'phoneConfirmationLoginNoPhone'
    | 'phoneConfirmationRegister';
  errors: {
    identifier: string[];
    username: string[];
    password: string[];
    name: string[];
    server: string[];
  };
  setErrors: (errors: LoginDataProps['errors']) => void;
  setUsername: (username: string) => void;
  // setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setId: (id: number) => void;
  setStep: (
    step:
      | 'identifier'
      | 'login'
      | 'register'
      | 'phoneConfirmationLogin'
      | 'phoneConfirmationLoginNoPhone'
      | 'phoneConfirmationRegister'
  ) => void;
  resetForm: () => void;
}
export const useLoginData = create<LoginDataProps>((set) => ({
  username: '',
  // email: '',
  password: '',
  id: 0,
  step: 'identifier',
  errors: {
    identifier: [],
    username: [],
    password: [],
    name: [],
    server: [],
  },
  setErrors: (errors) =>
    set((state) => ({
      errors: { ...state.errors, ...errors },
    })),
  setUsername: (username) => set(() => ({ username })),
  // setEmail: (email) => set(() => ({ email })),
  setPassword: (password) => set(() => ({ password })),
  setId: (id) => set(() => ({ id })),
  setStep: (step) => set(() => ({ step })),
  resetForm: () =>
    set(() => ({
      identifier: '',
      username: '',
      password: '',
      step: 'identifier',
      errors: {
        identifier: [],
        username: [],
        password: [],
        name: [],
        server: [],
      },
    })),
}));
