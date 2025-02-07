import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getCookie } from './actions/actionMethods';

const httpLink = new HttpLink({
  uri: process.env.BACKEND_GRAPHQL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getCookie('jwt');

  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
