class Auth {
  constructor(config) {
    this._url = config.baseUrl;
    this._headers = config.headers;
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
      headers: this._headers,
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
      headers: this._headers,
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
        ...this._headers,
        Authorization: `Bearer ${token}`,
      }
    })
    .then(this._getResponseData)
  };
}

const auth = new Auth({
  baseUrl: 'https://api.mesto.vadimbykov.nomoredomainsrocks.ru',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default auth;