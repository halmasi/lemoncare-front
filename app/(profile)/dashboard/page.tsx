import { logoutAction } from '@/app/utils/actions/actionMethods';

export default function dashboard() {
  return (
    <div>
      {/* Logout form */}
      <form action={logoutAction}>
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
