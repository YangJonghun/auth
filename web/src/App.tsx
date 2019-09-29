import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Routes from './Routes';
import { setAccessToken } from './store/modules/user';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const setAccessTokenDispatcher = useCallback(
    (token: string) => dispatch(setAccessToken(token)),
    [dispatch],
  );

  useEffect(() => {
    fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async result => {
      const { accessToken } = await result.json();
      setAccessTokenDispatcher(accessToken);
      setLoading(false);
    });
  }, [setAccessTokenDispatcher]);

  if (loading) {
    return <div>loading...</div>;
  }

  return <Routes />;
};

export default App;
