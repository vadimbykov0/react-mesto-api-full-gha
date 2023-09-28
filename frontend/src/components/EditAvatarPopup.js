import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, buttonText }) {

  const avatarInputRef = React.useRef();
  const [errors, setErrors] = React.useState({});

  /**
   * Hendler for EditAvatarPopup form submit
   * */
  function handleEditAvatarSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({ avatar: avatarInputRef.current.value });
  }

  /**
   * Hendler for name input
   * */
  function handleNameChange(e) {
    setErrors({
      ...errors,
      avatar: avatarInputRef.current.validationMessage
    })
  }

  React.useEffect(() => {
    avatarInputRef.current.value = '';
  }, [isOpen])

  return (
    <PopupWithForm
      name={'edit-avatar'}
      title={'Обновить аватар'}
      nameForm={'formEditAvatar'}
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleEditAvatarSubmit}>
        <div className="popup__field">
          <input
            id="avatar-input"
            className="popup__input popup__input_input_link"
            type="url"
            placeholder="Ссылка на картинку"
            name="avatar"
            ref={avatarInputRef}
            onChange={handleNameChange}
            required />
          <span className="popup__input-error avatar-input-error">{errors.avatar}</span>
        </div>
    </PopupWithForm>
  )
}
