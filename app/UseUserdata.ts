import { create } from 'zustand';

const datastore = create((set) => ({
  jwt: '',
  user: '',
}));
