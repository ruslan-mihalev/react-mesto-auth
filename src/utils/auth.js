const BASE_AUTH_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_AUTH_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password})
  })
    .then(response => {
      try {
        if (response.ok) {
          return response.json();
        }
      } catch(err) {
        return (err);
      }
    });
};

export const authorize = (email, password) => {
  return fetch(`${BASE_AUTH_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password})
  })
    .then(response => {
      try {
        if (response.ok) {
          return response.json();
        }
      } catch(err) {
        return (err);
      }
    });
};

export const validateToken = (token) => {
  return fetch(`${BASE_AUTH_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(response => {
      try {
        if (response.ok) {
          return response.json();
        }
      } catch(err) {
        return (err);
      }
    });
}
