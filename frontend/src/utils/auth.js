class Auth {
  constructor(config) {
    this._url = config.baseUrl;
  };

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status} ${res.statusText}`);
    } else {
      return res.json();
    }
  };

  register(password, email) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
        email: email
      }),
    })
    .then(this._getResponseData)
  };

  login(password, email) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
    .then(this._getResponseData)
  };

  checkToken(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    .then(this._getResponseData)
  };
}

const auth = new Auth({
  baseUrl: 'https://api.mesto.vadimbykov.nomoredomainsrocks.ru',
});

export default auth;