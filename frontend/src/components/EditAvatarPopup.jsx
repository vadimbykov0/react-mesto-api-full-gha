import { useRef } from "react";

import PopupWithForm from "./PopupWithForm";
import useFormValidation from "../hooks/useFormValidation";

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isSending }) {
  const input = useRef();

  const { values, errors, isValid, isInputValid, handleChange, reset } = useFormValidation();

  function resetForClose() {
    onClose();
    reset();
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: input.current.value
    }, reset)
  };

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      buttonText="Сохранить"
      isOpen={isOpen}
      onClose={resetForClose}
      onSubmit={handleSubmit}
      isSending={isSending}
      isValid={isValid}
    >
      <input
        className={`popup__input ${isInputValid.avatar === undefined || isInputValid.avatar ? '' : 'popup__input-error'}`}
        placeholder="Ссылка на картинку"
        id="avatar"
        name="avatar"
        type="url"
        required
        ref={input}
        disabled={isSending}
        onChange={handleChange}
        value={values.avatar ? values.avatar : ''}
      />
      <span className="popup__error">{errors.avatar}</span>
    </PopupWithForm>
  );
}