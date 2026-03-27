import {
  addCard,
  changeLikeCardStatus,
  deleteCard,
  getCardList,
  getUserInfo,
  setUserInfo,
  updateAvatar,
} from '../src/scripts/components/api.js';
import { clearValidation, enableValidation } from '../src/scripts/components/validation.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
  textInputSelectors: ['.popup__input_type_name', '.popup__input_type_card-name'],
  textInputPattern: /^[A-Za-zА-Яа-яЁё\- ]+$/,
  textInputErrorMessage: 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.',
};

const popupProfile = document.querySelector('.popup_type_edit');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupRemoveCard = document.querySelector('.popup_type_remove-card');
const popupImage = document.querySelector('.popup_type_image');
const popupInfo = document.querySelector('.popup_type_info');

const profileOpenButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileImage = document.querySelector('.profile__image');
const siteLogo = document.querySelector('.header__logo');

const popupProfileForm = popupProfile.querySelector('.popup__form');
const popupAvatarForm = popupAvatar.querySelector('.popup__form');
const popupAddForm = popupAdd.querySelector('.popup__form');
const popupRemoveCardForm = popupRemoveCard.querySelector('.popup__form');

const popupProfileSubmitButton = popupProfileForm.querySelector('.popup__button');
const popupAvatarSubmitButton = popupAvatarForm.querySelector('.popup__button');
const popupAddSubmitButton = popupAddForm.querySelector('.popup__button');
const popupRemoveCardSubmitButton = popupRemoveCardForm.querySelector('.popup__button');

const inputName = popupProfile.querySelector('.popup__input_type_name');
const inputAbout = popupProfile.querySelector('.popup__input_type_description');
const inputAvatar = popupAvatar.querySelector('.popup__input_type_avatar');
const inputTitle = popupAdd.querySelector('.popup__input_type_card-name');
const inputLink = popupAdd.querySelector('.popup__input_type_url');

const profileInfoName = document.querySelector('.profile__title');
const profileInfoAbout = document.querySelector('.profile__description');
const listContainer = document.querySelector('.places__list');
const template = document.querySelector('.template');

const popupPic = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

const usersStatsModalInfoList = popupInfo.querySelector('.popup__info-list');
const infoDefinitionTemplate = document.querySelector('#popup-info-definition-template');

const popups = Array.from(document.querySelectorAll('.popup'));

let currentUserId = '';
let cardToDelete = null;

const setButtonLoadingState = (buttonElement, isLoading, loadingText) => {
  if (!buttonElement.dataset.defaultText) {
    buttonElement.dataset.defaultText = buttonElement.textContent;
  }

  buttonElement.textContent = isLoading ? loadingText : buttonElement.dataset.defaultText;
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
};

const enableButton = (buttonElement) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(validationConfig.inactiveButtonClass);
};

const openPopup = (popupElement) => {
  popupElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeClose);
};

const closePopup = (popupElement) => {
  popupElement.classList.remove('popup_is-opened');

  if (!document.querySelector('.popup_is-opened')) {
    document.removeEventListener('keydown', handleEscapeClose);
  }
};

function handleEscapeClose(evt) {
  if (evt.key !== 'Escape') {
    return;
  }

  const openedPopup = document.querySelector('.popup_is-opened');

  if (openedPopup) {
    closePopup(openedPopup);
  }
}

const hasProfileChanges = () =>
  inputName.value !== profileInfoName.textContent ||
  inputAbout.value !== profileInfoAbout.textContent;

const syncProfileSubmitButtonState = () => {
  if (popupProfileForm.checkValidity() && hasProfileChanges()) {
    enableButton(popupProfileSubmitButton);
  } else {
    disableButton(popupProfileSubmitButton);
  }
};

const openProfilePopup = () => {
  inputName.value = profileInfoName.textContent;
  inputAbout.value = profileInfoAbout.textContent;
  clearValidation(popupProfileForm, validationConfig);
  syncProfileSubmitButtonState();
  openPopup(popupProfile);
};

const openAvatarPopup = () => {
  popupAvatarForm.reset();
  clearValidation(popupAvatarForm, validationConfig);
  openPopup(popupAvatar);
};

const openAddCardPopup = () => {
  popupAddForm.reset();
  clearValidation(popupAddForm, validationConfig);
  openPopup(popupAdd);
};

const openImagePopup = ({ name, link }) => {
  popupPic.src = link;
  popupPic.alt = name;
  popupCaption.textContent = name;
  openPopup(popupImage);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  setButtonLoadingState(popupProfileSubmitButton, true, 'Сохранение...');

  setUserInfo({
    name: inputName.value,
    about: inputAbout.value,
  })
    .then((userData) => {
      profileInfoName.textContent = userData.name;
      profileInfoAbout.textContent = userData.about;
      closePopup(popupProfile);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonLoadingState(popupProfileSubmitButton, false);
      syncProfileSubmitButtonState();
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  setButtonLoadingState(popupAvatarSubmitButton, true, 'Сохранение...');

  updateAvatar({ avatar: inputAvatar.value })
    .then((userData) => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      popupAvatarForm.reset();
      closePopup(popupAvatar);
      clearValidation(popupAvatarForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonLoadingState(popupAvatarSubmitButton, false);
    });
};

const handleAddCardSubmit = (evt) => {
  evt.preventDefault();
  setButtonLoadingState(popupAddSubmitButton, true, 'Создание...');

  addCard({
    name: inputTitle.value,
    link: inputLink.value,
  })
    .then((newCardData) => {
      listContainer.prepend(createCard(newCardData));
      popupAddForm.reset();
      closePopup(popupAdd);
      clearValidation(popupAddForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonLoadingState(popupAddSubmitButton, false);
    });
};

const handleRemoveCardSubmit = (evt) => {
  evt.preventDefault();

  if (!cardToDelete) {
    return;
  }

  setButtonLoadingState(popupRemoveCardSubmitButton, true, 'Удаление...');

  deleteCard(cardToDelete.cardId)
    .then(() => {
      cardToDelete.element.remove();
      cardToDelete = null;
      closePopup(popupRemoveCard);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonLoadingState(popupRemoveCardSubmitButton, false);
    });
};

const handleLikeCard = (likeButton, likeCountElement, cardId, isLiked) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      const likedByCurrentUser = updatedCard.likes.some((user) => user._id === currentUserId);
      likeButton.classList.toggle('card__like-button_is-active', likedByCurrentUser);
      likeCountElement.textContent = String(updatedCard.likes.length);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createInfoString = (label, value) => {
  const listItem = infoDefinitionTemplate.content.querySelector('.popup__info-item').cloneNode(true);
  listItem.querySelector('.popup__info-label').textContent = label;
  listItem.querySelector('.popup__info-value').textContent = value;
  return listItem;
};

const formatDate = (date) =>
  date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const handleLogoClick = () => {
  getCardList()
    .then((cards) => {
      usersStatsModalInfoList.innerHTML = '';

      if (!cards.length) {
        usersStatsModalInfoList.append(createInfoString('Карточек в ленте:', '0'));
        openPopup(popupInfo);
        return;
      }

      const uniqueOwners = new Set(cards.map((card) => card.owner?.name).filter(Boolean));
      const totalLikes = cards.reduce((sum, card) => sum + (card.likes?.length ?? 0), 0);
      const mostPopularCard = cards.reduce((topCard, card) => {
        if (!topCard || (card.likes?.length ?? 0) > (topCard.likes?.length ?? 0)) {
          return card;
        }

        return topCard;
      }, null);

      usersStatsModalInfoList.append(
        createInfoString('Карточек в ленте:', String(cards.length))
      );
      usersStatsModalInfoList.append(
        createInfoString('Уникальных авторов:', String(uniqueOwners.size))
      );
      usersStatsModalInfoList.append(
        createInfoString('Первая создана:', formatDate(new Date(cards[cards.length - 1].createdAt)))
      );
      usersStatsModalInfoList.append(
        createInfoString('Последняя создана:', formatDate(new Date(cards[0].createdAt)))
      );
      usersStatsModalInfoList.append(
        createInfoString('Количество лайков:', String(totalLikes))
      );
      usersStatsModalInfoList.append(
        createInfoString(
          'Самая популярная картинка:',
          `${mostPopularCard.name} (${mostPopularCard.likes.length} лайков)`
        )
      );

      openPopup(popupInfo);
    })
    .catch((err) => {
      console.log(err);
    });
};

function createCard(item) {
  const newItem = template.content.querySelector('.card').cloneNode(true);
  const cardImage = newItem.querySelector('.card__image');
  const cardTitle = newItem.querySelector('.card__title');
  const deleteButton = newItem.querySelector('.card__delete-button');
  const likeButton = newItem.querySelector('.card__like-button');
  const likeCount = newItem.querySelector('.card__like-count');

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  likeCount.textContent = String(item.likes?.length ?? 0);

  const likedByCurrentUser = item.likes?.some((user) => user._id === currentUserId);
  likeButton.classList.toggle('card__like-button_is-active', Boolean(likedByCurrentUser));

  if (item.owner?._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      cardToDelete = { element: newItem, cardId: item._id };
      openPopup(popupRemoveCard);
    });
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    handleLikeCard(likeButton, likeCount, item._id, isLiked);
  });

  cardImage.addEventListener('click', () => {
    openImagePopup(item);
  });

  return newItem;
}

const renderPage = (cards, userData) => {
  currentUserId = userData._id;
  profileInfoName.textContent = userData.name;
  profileInfoAbout.textContent = userData.about;
  profileImage.style.backgroundImage = `url('${userData.avatar}')`;

  listContainer.innerHTML = '';
  cards.forEach((item) => {
    listContainer.append(createCard(item));
  });
};

const attachPopupListeners = () => {
  popups.forEach((popupElement) => {
    popupElement.addEventListener('mousedown', (evt) => {
      if (evt.target === popupElement) {
        closePopup(popupElement);
      }
    });
  });

  document.querySelectorAll('.popup__close').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      const parentPopup = closeButton.closest('.popup');

      if (parentPopup) {
        closePopup(parentPopup);
      }
    });
  });
};

profileOpenButton.addEventListener('click', openProfilePopup);
profileAddButton.addEventListener('click', openAddCardPopup);
profileImage.addEventListener('click', openAvatarPopup);
profileImage.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter' || evt.key === ' ') {
    evt.preventDefault();
    openAvatarPopup();
  }
});
siteLogo.addEventListener('click', handleLogoClick);

popupProfileForm.addEventListener('submit', handleProfileFormSubmit);
popupAvatarForm.addEventListener('submit', handleAvatarFormSubmit);
popupAddForm.addEventListener('submit', handleAddCardSubmit);
popupRemoveCardForm.addEventListener('submit', handleRemoveCardSubmit);

inputName.addEventListener('input', syncProfileSubmitButtonState);
inputAbout.addEventListener('input', syncProfileSubmitButtonState);

attachPopupListeners();
enableValidation(validationConfig);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    renderPage(cards, userData);
    clearValidation(popupProfileForm, validationConfig);
    clearValidation(popupAvatarForm, validationConfig);
    clearValidation(popupAddForm, validationConfig);
    syncProfileSubmitButtonState();
  })
  .catch((err) => {
    console.log(err);
  });
