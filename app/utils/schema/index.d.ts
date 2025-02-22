export {};

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          prompt: () => void;
          initialize: ({ client_id }) => void;
        };
      };
    };
  }
}
