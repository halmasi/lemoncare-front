export interface UserProps {
  username: string;
  email: string;
  phoneNumber: number;
  password: string;
}
export interface ErrorProps {
  status: number;
  name: string;
  message: string;
  details: object;
}
export interface LoginUserProps {
  data: {
    user: {
      id: number;
      documentId: string;
      email: string;
      provider: string;
      confirmed: boolean;
      blocked: boolean;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      username: string;
      fullName: string;
    };
    jwt: string;
    error?: string;
  };
}
export interface SignInState {
  success: boolean;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    server?: string[];
  };
  jwt?: string;
  user?: string;
}
