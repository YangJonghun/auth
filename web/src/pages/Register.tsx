import React, { useState } from 'react';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';

import { useRegisterMutation } from '../generated/graphql';

gql`
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    register(
      data: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    )
  }
`;

interface Props extends RouteComponentProps {}

const Register: React.FC<Props> = ({ history }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFistName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [register] = useRegisterMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await register({
      variables: {
        email,
        password,
        firstName,
        lastName,
      },
    });
    if (response && response.data && response.data.register) {
      history.push('/');
    }
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
        <input
          value={firstName ? firstName : ''}
          placeholder="first name"
          onChange={e => setFistName(e.target.value)}
        />
        <input
          value={lastName ? lastName : ''}
          placeholder="last name"
          onChange={e => setLastName(e.target.value)}
        />
      </div>
      <button type="submit">register</button>
    </form>
  );
};

export default Register;
