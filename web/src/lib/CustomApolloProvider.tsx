import React, { useCallback } from 'react';
import ApolloClient from 'apollo-boost';
import { useSelector, useDispatch } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';

import { RootState } from '../store/modules';
import { setAccessToken } from '../store/modules/user';

const getRefreshToken = async (): Promise<string | void> => {
  try {
    const result = await fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    });
    const { accessToken } = await result.json();
    return accessToken;
  } catch(err) {
    console.warn('Your refresh token is invalid, Try to re-login');
    console.error(err)
  }
};

const CustomApolloProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector<RootState, string>(
    state => state.user.accessToken,
  );

  const setAccessTokenDispatcher = useCallback(
    (token: string) => dispatch(setAccessToken(token)),
    [dispatch],
  );

  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    request: async operation => {
      let isTokenValid: boolean = true;
      try {
        const { exp } = jwtDecode(accessToken);
        if (Date.now() >= exp * 1000) {
          isTokenValid = false;
        }
      } catch {
        isTokenValid = false;
      }

      // access token is expired or invalid
      if (!isTokenValid) {
        const result = await getRefreshToken();
        if (result) {
          setAccessTokenDispatcher(result);
        } else {
          return;
        }
      }

      operation.setContext({
        headers: {
          authorization: accessToken ? `bearer ${accessToken}` : '',
        },
      });
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
