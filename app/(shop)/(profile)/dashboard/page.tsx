'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import {
  getFullUserData,
  logoutAction,
  RunTest,
} from '@/app/utils/actions/actionMethods';
export default function Dashboard() {
  const { resetUser, jwt } = useDataStore();

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
      <form
        action={() => {
          RunTest(jwt);
        }}
      >
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Run{' '}
        </button>
      </form>
      <form
        action={() => {
          getFullUserData(jwt, [
            {
              orderHistory: {
                populate: { order: { populate: { items: { populate: '*' } } } },
              },
            },
          ]);
          console.log('JWT TOKEN : ', jwt);

          (async () => {
            const a = await getFullUserData(jwt, []);
            console.log(a);
          })();
        }}
      >
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Get Info{' '}
        </button>
      </form>
    </div>
  );
}
