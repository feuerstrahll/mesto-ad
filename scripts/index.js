
import { getUserInfo, setUserInfo, getCardList, updateAvatar, addCard, deleteCard, changeLikeCardStatus } from './api.js';

// @todo: Темплейт карточки
const profileOpenButton = document.querySelector('.profile__edit-button');  /* кнопка открывает попап-профайл*/
const profileAddButton = document.querySelector('.profile__add-button'); 

const popup = document.querySelectorAll('.popup');                      /*затемнение на попап-общий */
const popupForm = document.querySelector('.popup__form');
const popupButtonClose = document.querySelector('.popup__close');   /*крестик закрытия попап-общий*/

const popupProfile = document.querySelector('.popup_type_edit');                      /* попап-профайл*/
const popupProfileBtnClose = popupProfile.querySelector('.popup__close');   /*крестик закрытия попап-профайл */
const popupProfileForm = popupProfile.querySelector('.popup__form');            /* форма попап-профайл*/
const popupProfileSubmitButton = popupProfileForm.querySelector('.popup__button');

const profileInfoName = document.querySelector('.profile__title');      /*профайл*/
const profileInfoAbout = document.querySelector('.profile__description');    /*профайл*/
const profileImage = document.querySelector('.profile__image');

const popupAdd = document.querySelector('.popup_type_new-card');                      /* попап добавления карточки*/
const popupAddBtnClose = popupAdd.querySelector('.popup__close');   /*крестик закрытия попапа-карточки */  
const popupAddForm = popupAdd.querySelector('.popup__form');             /* форма попапа-карточки**/
const popupAddSubmitButton = popupAddForm.querySelector('.popup__button');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popupAvatarForm = popupAvatar?.querySelector('.popup__form');
const popupAvatarBtnClose = popupAvatar?.querySelector('.popup__close');
const inputAvatar = popupAvatar?.querySelector('.popup__input_type_avatar');
const popupAvatarSubmitButton = popupAvatarForm?.querySelector('.popup__button');
const popupRemoveCard = document.querySelector('.popup_type_remove-card');
const popupRemoveCardForm = popupRemoveCard?.querySelector('.popup__form');
const popupRemoveCardBtnClose = popupRemoveCard?.querySelector('.popup__close');
const popupRemoveCardSubmitButton = popupRemoveCardForm?.querySelector('.popup__button');

const popupImgBtnClose = document.querySelector('.popup-img__btn-close');   /*крестик закрытия попап-img*/
const popupImg = document.querySelector('.popup_type_image');  
// const listContainer = document.querySelector('.cards');
// const template = document.querySelector('.template');
const listContainer = document.querySelector('.places__list');
const template = document.querySelector('.template');

const popupPic = popupImg.querySelector('.popup__image');
const popupAlt = popupImg.querySelector('.popup__caption');
const siteLogo = document.querySelector('.header__logo');
const usersStatsModalWindow = document.querySelector('.popup_type_info');
const usersStatsModalClose = usersStatsModalWindow?.querySelector('.popup__close');
const usersStatsModalInfoList = usersStatsModalWindow?.querySelector('.popup__info-list');
const usersStatsModalUsersList = usersStatsModalWindow?.querySelector('.popup__users-list');
const infoDefinitionTemplate = document.querySelector('#popup-info-definition-template');
const userPreviewTemplate = document.querySelector('#popup-info-user-preview-template');

const inputName = document.querySelector('.popup__input_type_name');    /*попап-профайл */
const inputAbout = document.querySelector('.popup__input_type_description');  /*попап-профайл */

const inputTitle = document.querySelector('.popup__input_type_card-name');  /*попап-карточки*/
const inputLink = document.querySelector('.popup__input_type_url');    /*попап-карточки*/

const root = document; /* общий для закрытия попапов */ 
let currentUserId = '';
let cardToDelete = null;
// @todo: DOM узлы
// @todo: Функция создания карточки

const setButtonLoadingState = (buttonElement, isLoading, loadingText) => {
  if (!buttonElement) return;
  if (!buttonElement.dataset.defaultText) {
    buttonElement.dataset.defaultText = buttonElement.textContent;
  }
  buttonElement.textContent = isLoading ? loadingText : buttonElement.dataset.defaultText;
};


function openPopup(arg){    /* общий открытие попапов*/
    arg.classList.add('popup_opened');

    // root.addEventListener('click', closeOnOverlay);         /*закрытие по overlay */
    root.addEventListener('keydown', keyHandler);       /*закрытие по esc */
}


function closePopup(popup){   /*общий закрытие попапов*/
    popup.classList.remove('popup_opened');

    root.removeEventListener('click', closeOnOverlay);         /*закрытие по overlay */
    root.removeEventListener('keydown', keyHandler);       /*закрытие по esc */
}

function closeOnOverlay(e){     /*закрытие по overlay */
    if(e.target.classList.contains('popup')){
        e.target.classList.remove('popup_opened');
    };
}

function keyHandler(evt) {      /*закрытие по esc */
    const openedPopup = document.querySelector('.popup_opened');

  if(evt.key === 'Escape'){
    openedPopup.classList.remove('popup_opened');
   };
} 

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
    });
};


function bindAddItemListener() {    /*создание новой карточки */
    popupAddForm.addEventListener('submit', addNewItem);
}
 

function addNewItem(event) {     /*создание новой карточки */
    event.preventDefault();
    setButtonLoadingState(popupAddSubmitButton, true, 'Создание...');
    addCard({
      name: inputTitle.value,
      link: inputLink.value,
    })
      .then((newCardData) => {
        const newItemCards = createCard(
          newCardData,
          { onOpenImage: openImage, onLikeCard: null, onRemoveItem: null }
        );
        popupAddForm.reset();
        listContainer.prepend(newItemCards);
        closePopup(popupAdd);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setButtonLoadingState(popupAddSubmitButton, false);
      });
}

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
    });
};

const handleRemoveCardSubmit = (evt) => {
  evt.preventDefault();
  if (!cardToDelete) return;
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

const handleLikeCard = (likeButton, likeCount, cardId, isLiked) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      const likedByCurrentUser = updatedCard.likes.some((user) => user._id === currentUserId);
      likeButton.classList.toggle('card__like-button_active', likedByCurrentUser);
      if (likeCount) {
        likeCount.textContent = String(updatedCard.likes.length);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// const removeItem = (cardElement, cardId) => { нужно переделать так
function removeItem(event){     /*удаление карточки */
    const targetItem = event.target.closest('.places__item');
    targetItem.remove();
}




// function openImage(item){   /*открытие попап-img*/
//     popupPic.src = item.link;
//     popupPic.alt = item.name;
//     popupAlt.textContent = item.name;
//     openPopup(popupImg);
// }

const openImage = (item) => {
    popupPic.src = item.link;
    popupPic.alt = item.name;
    popupAlt.textContent = item.name;
  openPopup(popupImg);
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

const handleLogoClick = () => {
  getCardList()
    .then((cards) => {
      if (!cards.length) {
        usersStatsModalInfoList.innerHTML = '';
        usersStatsModalUsersList.innerHTML = '';
        usersStatsModalInfoList.append(
          createInfoString('Карточек в ленте:', '0')
        );
        openPopup(usersStatsModalWindow);
        return;
      }

      const uniqueOwners = new Set(cards.map((card) => card.owner?.name).filter(Boolean));

      usersStatsModalInfoList.innerHTML = '';
      usersStatsModalUsersList.innerHTML = '';

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

      openPopup(usersStatsModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

// @todo: Функция удаления карточки
// @todo: Вывести карточки на страницу

function renderList() {
    const listCards = initialCards.map(createCard);
     
    listContainer.append(...listCards);
}
 
function createCard(item,
    { onOpenImage, onLikeCard, onRemoveItem }
){
    const newItem = template.content.querySelector('.card').cloneNode(true);
    const cardsImg = newItem.querySelector('.card__image'); 
    const cardsTitle = newItem.querySelector('.card__title');
    const cardsBtnRemove = newItem.querySelector('.card__delete-button');
    const cardsLike = newItem.querySelector('.card__like-button');
    const likeCount = newItem.querySelector(".card__like-count");
    if (likeCount) {
      likeCount.textContent = item.likes?.length ?? 0;
    }
    const likedByCurrentUser = item.likes?.some((user) => user._id === currentUserId);
    cardsLike.classList.toggle('card__like-button_active', Boolean(likedByCurrentUser));

    cardsImg.src = item.link;
    cardsImg.alt = item.name;
    cardsTitle.textContent = item.name;
 
    if (cardsBtnRemove) {
      if (item.owner?._id && currentUserId && item.owner._id !== currentUserId) {
        cardsBtnRemove.remove();
      }
      cardsBtnRemove.addEventListener("click", () => {
        if (onRemoveItem && item._id) {
          onRemoveItem(newItem, item._id);
        } else {
          newItem.remove();
        }
      });
    }

    // cardsLike.addEventListener('click', function (evt) {
    // evt.target.classList.toggle('card__like-button_active');
    // });
   cardsLike.addEventListener("click", () => {
    if (onLikeCard && item._id) {
      const isLiked = cardsLike.classList.contains('card__like-button_active');
      onLikeCard(cardsLike, likeCount, item._id, isLiked);
      return;
    }
    cardsLike.classList.toggle('card__like-button_active');
  });

    // cardsImg.addEventListener('click', function(){
    // openImage(item);
    // });
   cardsImg.addEventListener("click", () => {
    onOpenImage(item);
  });


    return newItem;
}



profileOpenButton.addEventListener('click', function(){  /*попап-профайл открытие и отображение информации*/
    inputName.value = profileInfoName.textContent;
    inputAbout.value = profileInfoAbout.textContent;
    openPopup(popupProfile);
});

profileImage?.addEventListener('click', function () {
  openPopup(popupAvatar);
});

popupProfileForm.addEventListener('submit', handleProfileFormSubmit); /* сабмит попап-профайл */

popupProfileBtnClose.addEventListener('click', function (){  /* закрытие попап-профайл */
    closePopup(popupProfile);
});

profileAddButton.addEventListener('click', function(){  /* открытие попап-карточки*/
    openPopup(popupAdd);
    popupAddForm.reset();
});

popupAddBtnClose.addEventListener('click', function (){  /* закрытие попап-карточки*/
    closePopup(popupAdd);
});

popupAvatarBtnClose?.addEventListener('click', function () {
  closePopup(popupAvatar);
});
popupAvatarForm?.addEventListener('submit', handleAvatarFormSubmit);
popupRemoveCardBtnClose?.addEventListener('click', function () {
  closePopup(popupRemoveCard);
});
popupRemoveCardForm?.addEventListener('submit', handleRemoveCardSubmit);

usersStatsModalClose?.addEventListener('click', function () {
  closePopup(usersStatsModalWindow);
});

siteLogo?.addEventListener('click', handleLogoClick);

// popupImgBtnClose.addEventListener('click', function (){ /* закрытие попап-img*/
//     closePopup(popupImg);
// });


//renderList();
bindAddItemListener();

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    profileInfoName.textContent = userData.name;
    profileInfoAbout.textContent = userData.about;
    if (profileImage && userData.avatar) {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
    }

    listContainer.innerHTML = '';
    cards.forEach((item) => {
      listContainer.append(
        createCard(
          item,
          {
             onOpenImage: openImage,
            onLikeCard: handleLikeCard,
            onRemoveItem: (cardElement, cardId) => {
              cardToDelete = { element: cardElement, cardId };
              openPopup(popupRemoveCard);
            },
          }
        )
      );
    });
  })
  .catch((err) => {
    console.log(err)
   });