'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { logoutAction } from '@/app/utils/actions/actionMethods';
export default function dashboard() {
  const { resetUser } = useDataStore();
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
