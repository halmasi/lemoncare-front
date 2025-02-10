'use client';

import { useDataStore } from '@/app/utils/states/useUserdata';
import { useCartStore } from '@/app/utils/states/useCartData';
import { logoutAction } from '@/app/utils/actions/actionMethods';
export default function Dashboard() {
  const { resetUser } = useDataStore();
  const { resetCart } = useCartStore();

  return (
    <div>
      <form
        action={() => {
          logoutAction();
          resetUser();
          resetCart();
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
