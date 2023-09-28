import React from "react";

import PopupWithForm from "./PopupWithForm";

export default function ConfirmDeletePopup({ isOpen, onClose, isSending, onDeleteCardConfirm, cardId }) {
  function handleSubmit(evt) {
    evt.preventDefault();
    onDeleteCardConfirm(cardId);
  };
  
  return (
    <PopupWithForm
      name="delete"
      title="Вы уверены?"
      buttonText="Да"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSending={isSending}
    />
   );
}