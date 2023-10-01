class Api {
  constructor(config) {
    this._url = config.baseUrl;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status} ${res.statusText}`);
    } else {
      return res.json();
    }
  };

  // Обновление аватара пользователя
  setUserAvatar(data, token) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
    .then(this._getResponseData)
  };

  // Загрузка информации о пользователе с сервера
  getUserInfo(token) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(this._getResponseData)
  };

  // Загрузка карточек с сервера
  getCards(token) {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(this._getResponseData)
  };

  // Изменение данных профиля
  changeUserInfo(data, token) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      })
    })
    .then(this._getResponseData)
  }

  // Добавление новой карточки
  addNewCard(data, token) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.title,
        link: data.link
      })
    })
    .then(this._getResponseData)
  };

  // Удаление карточки
  deleteCard(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(this._getResponseData)
  };

  // Установка и снятие лайка
  setLike(id, token) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(this._getResponseData)
  };

  deleteLike(id, token) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(this._getResponseData)
  };
}

const api = new Api({
  baseUrl: 'https://api.mesto.vadimbykov.nomoredomainsrocks.ru',
});

export default api;