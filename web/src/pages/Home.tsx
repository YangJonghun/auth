import React from 'react';
import gql from 'graphql-tag';
import { useUsersQuery } from '../generated/graphql';

gql`
  query Users {
    users {
      id
      email
    }
  }
`;

interface Props {}

const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' });
  if (loading || !data) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <div></div>
      <ul>
        {data.users.map(user => (
          <li key={user.id}>
            {user.email} : {user.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
