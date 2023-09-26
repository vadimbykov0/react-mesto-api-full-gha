import { useContext, useEffect } from "react";

import useFormValidation from "../hooks/useFormValidation";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function EditProfilePopup({ isOpen, onClose, onUpdateUser, isSending }) {
  const currentUser = useContext(CurrentUserContext);
  const { values, errors, isValid, isInputValid, handleChange, reset, setValue } = useFormValidation();

  useEffect(() => {
    setValue("name", currentUser.name);
    setValue("about", currentUser.about);
  }, [currentUser, setValue]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name: values.name, 
      about: values.about 
    }, reset)
  };

  function resetForClose() {
    onClose();
    reset({
      name: currentUser.name,
      about: currentUser.about
    });
  }

  return (
    <PopupWithForm
      name="profile"
      title="Редактировать профиль"
      buttonText="Сохранить"
      isOpen={isOpen}
      onClose={resetForClose}
      isValid={isValid}
      isSending={isSending}
      onSubmit={handleSubmit}
    >
      <input
        name="name"
        id="name"
        type="text"
        className={`popup__input ${isInputValid.name === undefined || isInputValid.name ? '' : 'popup__input-error'}`}
        placeholder="Введите имя"
        minLength={2}
        maxLength={40}
        disabled={isSending}
        onChange={handleChange}
        value={values.name ? values.name : ''}
        required
      />
      <span className="popup__error">{errors.name}</span>
      <input
        name="about"
        id="about"
        type="text"
        className={`popup__input ${isInputValid.about === undefined || isInputValid.about ? '' : 'popup__input-error'}`}
        placeholder="Введите описание"
        minLength={2}
        maxLength={200}
        disabled={isSending}
        onChange={handleChange}
        value={values.about ? values.about : ''}
        required
      />
      <span className="popup__error">{errors.about}</span>
    </PopupWithForm>
  );
}