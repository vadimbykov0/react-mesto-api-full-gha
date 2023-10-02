class Auth {
  constructor(config) {
    this._url = config.baseUrl;
    this._headers = config.headers;
  };

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    } else {
      return res.json();
    }
  };

  register(data) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data),
    })
    .then(this._getResponseData)
  };

  login(data) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data),
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