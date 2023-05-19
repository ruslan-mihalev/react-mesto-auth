const BASE_AUTH_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_AUTH_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password})
  })
    .then(response => response.json());
};

export const authorize = (email, password) => {
  return fetch(`${BASE_AUTH_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password})
  })
    .then(response => response.json());
};
