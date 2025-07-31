'use client';

import {
  getCookie,
  getFullUserData,
  setCookie,
} from '@/app/utils/actions/actionMethods';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useEffect } from 'react';

export default function LoginHandler() {
  const { setUser, jwt, setJwt, user, resetUser } = useDataStore();

  useEffect(() => {
    const checkJwtCookie = async () => {
      const jwtCookie = await getCookie('jwt');
      if (!jwtCookie && jwt) {
        setCookie('jwt', 'Bearer ' + jwt);
      } else if (jwtCookie && !jwt) {
        const jwtWithoutBearer = jwtCookie.replace(/Bearer /g, '');
        setJwt(jwtWithoutBearer);
      } else if (jwt && !user) {
        const userData = await getFullUserData();
        setUser(userData.body);
      }
    };
    checkJwtCookie();
  }, [jwt, user, resetUser]);

  return null;
}
