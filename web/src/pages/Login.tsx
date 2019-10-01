import React, { useState, useCallback } from 'react';
import gql from 'graphql-tag';
import {
  useLoginMutation,
  CurrentUserDocument,
  CurrentUserQuery,
} from '../generated/graphql';
import { RouteComponentProps } from 'react-router';
import { useDispatch } from 'react-redux';

import { setAccessToken } from '../store/modules/user';

gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        email
        name
      }
    }
  }
`;

interface Props extends RouteComponentProps {}

const Login: React.FC<Props> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const setAccessTokenDispatcher = useCallback(
    (token: string) => dispatch(setAccessToken(token)),
    [dispatch],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login({
      variables: {
        email,
        password,
      },
      update: (store, { data }) => {
        if (!data) return null;
        store.writeQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
          data: {
            currentUser: data.login.user,
          },
        });
      },
    });
    if (response && response.data) {
      setAccessTokenDispatcher(response.data.login.accessToken);
    }
    history.push('/');
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          value={email}
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          value={password}
          type="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default Login;
