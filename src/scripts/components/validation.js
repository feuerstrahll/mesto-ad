const isTextInputWithCustomRule = (inputElement, settings) =>
  settings.textInputSelectors.some((selector) => inputElement.matches(selector));

const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!errorElement) {
    return;
  }

  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!errorElement) {
    return;
  }

  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
};

const checkInputValidity = (formElement, inputElement, settings) => {
  if (isTextInputWithCustomRule(inputElement, settings)) {
    const isPatternBroken =
      inputElement.value !== '' && !settings.textInputPattern.test(inputElement.value);

    inputElement.setCustomValidity(
      isPatternBroken ? settings.textInputErrorMessage : ''
    );
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((inputElement) => !inputElement.validity.valid);

const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
};

const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(settings.inactiveButtonClass);
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity('');
    hideInputError(formElement, inputElement, settings);
  });

  disableSubmitButton(buttonElement, settings);
};

export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));

    if (!inputList.length) {
      return;
    }

    formElement.addEventListener('submit', (evt) => {
      if (!formElement.checkValidity()) {
        evt.preventDefault();
      }
    });

    setEventListeners(formElement, settings);
  });
};
