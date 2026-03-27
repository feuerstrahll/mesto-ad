import {
  addCard,
  changeLikeCardStatus,
  deleteCard,
  getCardList,
  getUserInfo,
  setUserInfo,
  updateAvatar,
} from './api.js';

const validationConfig = {
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
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
const usersStatsModalUsersList = popupInfo.querySelector('.popup__users-list');
const infoDefinitionTemplate = document.querySelector('#popup-info-definition-template');
const userPreviewTemplate = document.querySelector('#popup-info-user-preview-template');

const forms = Array.from(document.querySelectorAll('.popup__form'));
const popups = Array.from(document.querySelectorAll('.popup'));

let currentUserId = '';
let cardToDelete = null;

const setButtonLoadingState = (buttonElement, isLoading, loadingText) => {
  if (!buttonElement) {
    return;
  }

  if (!buttonElement.dataset.defaultText) {
    buttonElement.dataset.defaultText = buttonElement.textContent;
  }

  buttonElement.textContent = isLoading ? loadingText : buttonElement.dataset.defaultText;
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

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!errorElement) {
    return;
  }

  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!errorElement) {
    return;
  }

  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(validationConfig.errorClass);
};

const hasInvalidInput = (inputList) => inputList.some((inputElement) => !inputElement.validity.valid);

const isProfileFormChanged = () =>
  inputName.value !== popupProfileForm.dataset.initialName ||
  inputAbout.value !== popupProfileForm.dataset.initialAbout;

const toggleButtonState = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  if (!buttonElement) {
    return;
  }

  const formRequiresChanges = formElement.dataset.requireChange === 'true';
  const hasChanges = !formRequiresChanges || isProfileFormChanged();
  const shouldDisable = hasInvalidInput(inputList) || !hasChanges;

  buttonElement.disabled = shouldDisable;
  buttonElement.classList.toggle(validationConfig.inactiveButtonClass, shouldDisable);
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const clearValidation = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
  });

  toggleButtonState(formElement);
};

const enableValidation = () => {
  forms.forEach((formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

    formElement.addEventListener('submit', (evt) => {
      if (!formElement.checkValidity()) {
        evt.preventDefault();
      }
    });

    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(formElement);
      });
    });

    toggleButtonState(formElement);
  });
};

const openProfilePopup = () => {
  inputName.value = profileInfoName.textContent;
  inputAbout.value = profileInfoAbout.textContent;
  popupProfileForm.dataset.initialName = inputName.value;
  popupProfileForm.dataset.initialAbout = inputAbout.value;
  popupProfileForm.dataset.requireChange = 'true';
  clearValidation(popupProfileForm);
  openPopup(popupProfile);
};

const openAvatarPopup = () => {
  popupAvatarForm.reset();
  popupAvatarForm.dataset.requireChange = 'false';
  clearValidation(popupAvatarForm);
  openPopup(popupAvatar);
};

const openAddCardPopup = () => {
  popupAddForm.reset();
  popupAddForm.dataset.requireChange = 'false';
  clearValidation(popupAddForm);
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
      popupProfileForm.dataset.initialName = profileInfoName.textContent;
      popupProfileForm.dataset.initialAbout = profileInfoAbout.textContent;
      toggleButtonState(popupProfileForm);
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
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonLoadingState(popupAvatarSubmitButton, false);
      toggleButtonState(popupAvatarForm);
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
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonLoadingState(popupAddSubmitButton, false);
      toggleButtonState(popupAddForm);
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

const createUserPreview = (userName) => {
  const userItem = userPreviewTemplate.content.querySelector('.popup__users-item').cloneNode(true);
  userItem.textContent = userName;
  return userItem;
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
      usersStatsModalUsersList.innerHTML = '';

      if (!cards.length) {
        usersStatsModalInfoList.append(createInfoString('Карточек в ленте:', '0'));
        openPopup(popupInfo);
        return;
      }

      const uniqueOwners = new Set(cards.map((card) => card.owner?.name).filter(Boolean));

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

      uniqueOwners.forEach((ownerName) => {
        usersStatsModalUsersList.append(createUserPreview(ownerName));
      });

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
siteLogo?.addEventListener('click', handleLogoClick);

popupProfileForm.addEventListener('submit', handleProfileFormSubmit);
popupAvatarForm.addEventListener('submit', handleAvatarFormSubmit);
popupAddForm.addEventListener('submit', handleAddCardSubmit);
popupRemoveCardForm.addEventListener('submit', handleRemoveCardSubmit);

popupProfileForm.dataset.requireChange = 'true';
popupAvatarForm.dataset.requireChange = 'false';
popupAddForm.dataset.requireChange = 'false';

attachPopupListeners();
enableValidation();

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    renderPage(cards, userData);
    popupProfileForm.dataset.initialName = userData.name;
    popupProfileForm.dataset.initialAbout = userData.about;
    toggleButtonState(popupProfileForm);
  })
  .catch((err) => {
    console.log(err);
  });
