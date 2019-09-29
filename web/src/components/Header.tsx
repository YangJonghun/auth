import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useDispatch } from 'react-redux';

import { useCurrentUserQuery, useLogoutMutation } from '../generated/graphql';
import { setAccessToken } from '../store/modules/user';

gql`
  query CurrentUser {
    currentUser {
      email
    }
  }
`;

gql`
  mutation Logout {
    logout
  }
`;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { data } = useCurrentUserQuery();
  const [logout, { client }] = useLogoutMutation();
  const setAccessTokenDispatcher = useCallback(
    (token: string) => dispatch(setAccessToken(token)),
    [dispatch],
  );

  const handleLogout = async () => {
    await logout();
    setAccessTokenDispatcher('');
    await client!.resetStore();
  };

  return (
    <header>
      <div>
        <Link to='/'>home</Link>
      </div>
      <div>
        <Link to='/register'>register</Link>
      </div>
      <div>
        <Link to='/login'>login</Link>
      </div>
      {data && data.currentUser ? (
        <div>
          <div>you are logged in as: {data.currentUser.email} </div>
          <button onClick={handleLogout}>logout</button>
        </div>
      ) : (
        <div>not logged in</div>
      )}
    </header>
  );
};

export default Header;
