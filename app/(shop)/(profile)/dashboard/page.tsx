'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import {
  getCookie,
  getFullUserData,
  logoutAction,
} from '@/app/utils/actions/actionMethods';
import { useEffect } from 'react';
export default function Dashboard() {
  const { resetUser, setUser, setJwt, user, jwt } = useDataStore();

  useEffect(() => {
    if (!user || !jwt) {
      const func = async () => {
        const token = await getCookie('jwt');
        if (token) {
          const res = await getFullUserData(token);
          setJwt(token);
          setUser(res.body);
        }
      };
      func();
    }
  }, [user, jwt]);

  return (
    <div>
      <form
        action={() => {
          logoutAction();
          resetUser();
        }}
      >
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          خروج
        </button>
      </form>
    </div>
  );
}
