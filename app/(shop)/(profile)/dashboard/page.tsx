'use client';

import { useDataStore } from '@/app/UseUserdata';
import { logoutAction } from '@/app/utils/actions/actionMethods';
export default function dashboard() {
  const updateDataStore = useDataStore();

  const handleRunTest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission
    if (updateDataStore.jwt) {
      // const result = await RunTest(updateDataStore.jwt);
      // console.log('RunTest Result:', result);
    } else {
      console.error('JWT token is missing');
    }
  };

  return (
    <div>
      {/* Logout form */}
      <form
        action={() => {
          logoutAction();
          useDataStore().resetUser;
        }}
      >
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          خروج
        </button>
      </form>
      <form onSubmit={handleRunTest}>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          run
        </button>
      </form>
    </div>
  );
}
