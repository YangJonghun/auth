import React, { useState, useCallback } from 'react';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';

import { useRegisterMutation } from '../generated/graphql';

gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

interface Props extends RouteComponentProps {}

const Register: React.FC<Props> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register] = useRegisterMutation();

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const response = await register({
        variables: {
          email,
          password,
        },
      });
      if (response && response.data && response.data.register) {
        history.push('/');
      }
    },
    [email, password, register, history],
  );

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          value={email}
          placeholder='email'
          onChange={e => setEmail(e.target.value)}
        />
        <input
          value={password}
          type='password'
          placeholder='password'
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type='submit'>register</button>
    </form>
  );
};

export default Register;
