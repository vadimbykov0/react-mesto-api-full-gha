import React from 'react';
export default function PopupWithForm({ isOpen, onClose, name, title, buttonText, onSubmit, children, nameForm }) {

  function handleEscClose(evt) {
    if (evt.key === 'Escape') {
      onClose();
    };
  }

  function handleOverlayClose(evt) {
    if (evt.target.classList.contains('popup')) {
      onClose();
    };
  }

  React.useEffect(() => {
    document.addEventListener('keyup', handleEscClose);
    return () => {
      document.removeEventListener('keyup', handleEscClose);
    }
  }, [isOpen]);

  return (
    <div className={`popup popup_type_${name} ${isOpen && ('popup_opened')}`}
      onClick={handleOverlayClose}>
      <div className="popup__container">
        <button className="popup__close-button" type="button" onClick={onClose} />
        <h2 className="popup__title">{`${title}`}</h2>
        <form className="popup__form" name={nameForm} onSubmit={onSubmit}>
          <fieldset className="popup__fieldset">
            {children}
            <button className="popup__save-button" type="submit" name="saveButton">{buttonText}</button>
          </fieldset>
        </form>
      </div>
    </div >
  )
}
