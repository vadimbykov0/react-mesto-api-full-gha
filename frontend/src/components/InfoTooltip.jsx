import React from "react";
import acceptedImage from '../images/success-sign-up.svg';
import rejectedImage from '../images/not-success-sign-up.svg';

export default function InfoTooltip({ isSuccess, isOpen, onClose }) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <img
          src={isSuccess ? acceptedImage : rejectedImage}
          alt="Картинка"
          className="popup__notice-image"
        />
        <h2 className="popup__title popup__title_type_tooltip">
          {isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте еще раз'}
        </h2>
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        >
        </button>
      </div>
    </div>
  );
}