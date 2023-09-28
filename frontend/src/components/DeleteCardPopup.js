import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function DeleteCardPopup({ isOpen, onClose, hedlerDeleteCartd, buttonText }) {

  /**
   * Hendler for EditAvatarPopup form submit
   * */
  function handleDeleteCard(e) {
    e.preventDefault();
    hedlerDeleteCartd();
  }

  return (
    <PopupWithForm
      name={'delete-card'}
      title={'Вы уверены?'}
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleDeleteCard} />
  )
}
