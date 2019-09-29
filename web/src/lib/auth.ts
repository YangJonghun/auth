export const getAccessToken = async () => {
  const result = await fetch('http://localhost:4000/refresh_token', {
    method: 'POST',
    credentials: 'include',
  });
  const { accessToken } = await result.json();
  return accessToken;
};
