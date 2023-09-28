import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from './contexts/CurrentUserContext';

export default function EditProfilePopup({ isOpen, onClose, onUpdateUser, buttonText }) {

  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [isOpen]);

  /**
   * Hendler for name input
   * */
  function handleNameChange(e) {
    setName(e.target.value);
    setErrors({
      ...errors,
      [e.target.name]: e.target.validationMessage
    })
  }

  /**
   * Hendler for description input
   * */
  function handleDescriptionChange(e) {
    setDescription(e.target.value);
    setErrors({
      ...errors,
      [e.target.name]: e.target.validationMessage
    })
  }

  /**
   * Hendler for EditProfilePopup form submit
   * */
  function handleEditProfileSubmit(e) {
    e.preventDefault();
    onUpdateUser(name, description);
  }

  return (
    <PopupWithForm
      name={'edit-profile'}
      title={'Редактировать профиль'}
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleEditProfileSubmit}
      nameForm={'formEditProfile'}>
        <div className="popup__field">
          <input
            id="name-input"
            className="popup__input popup__input_input_name"
            type="text"
            placeholder="Ваше имя"
            name="name"
            minLength="2"
            maxLength="40"
            value={name}
            onChange={handleNameChange}
            required />
          <span className="popup__input-error name-input-error">{errors.name}</span>
        </div>
        <div className="popup__field">
          <input
            id="job-input"
            className="popup__input popup__input_input_job"
            type="text"
            placeholder="Ваше занятие"
            name="description"
            minLength="2"
            maxLength="200"
            value={description}
            onChange={handleDescriptionChange}
            required />
          <span className="popup__input-error job-input-error">{errors.description}</span>
        </div>
    </PopupWithForm>
  )
}
