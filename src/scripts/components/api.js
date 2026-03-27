const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/apf-cohort-202',
  headers: {
    authorization: '5b6558cd-5d08-49a8-9546-ffa105df864a',
    'Content-Type': 'application/json',
  },
};

const getResponseData = (res) => {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  if (res.status === 204) {
    return Promise.resolve({});
  }

  return res.json();
};

export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(getResponseData);
};

export const setUserInfo = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  }).then(getResponseData);
};

export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
};

export const updateAvatar = ({ avatar }) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar }),
  }).then(getResponseData);
};

export const addCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  }).then(getResponseData);
};

export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(getResponseData);
};

export const changeLikeCardStatus = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: config.headers,
  }).then(getResponseData);
};
