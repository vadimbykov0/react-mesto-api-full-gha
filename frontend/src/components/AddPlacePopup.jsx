import useFormValidation from "../hooks/useFormValidation";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({ isOpen, onClose, onAddPlace, isSending }) {
  const { values, errors, isValid, isInputValid, handleChange, reset } = useFormValidation();

  function resetForClose() {
    onClose();
    reset();
  };

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      title: values.title,
      link: values.link
    }, reset)
  };

  return (
    <PopupWithForm
      name="add-place"
      title="Новое место"
      buttonText="Создать"
      isOpen={isOpen}
      onClose={resetForClose}
      isValid={isValid}
      onSubmit={handleSubmit}
      isSending={isSending}
    >
      <label className="popup__form-container">
        <input
          name="title"
          id="title"
          type="text"
          className={`popup__input ${isInputValid.title === undefined || isInputValid.title ? '' : 'popup__input-error'}`}
          placeholder="Название"
          minLength={2}
          maxLength={30}
          onChange={handleChange}
          value={values.title ? values.title : ''}
          disabled={isSending}
          required
      />
        <span className="popup__error">{errors.title}</span>
      </label>
      <label className="popup__form-container">
        <input
          name="link"
          id="link"
          type="url"
          className={`popup__input ${isInputValid.link === undefined || isInputValid.link ? '' : 'popup__input-error'}`}
          placeholder="Ссылка на картинку"
          onChange={handleChange}
          value={values.link ? values.link : ''}
          disabled={isSending}
          required
        />
        <span className="popup__error">{errors.link}</span>
      </label>
    </PopupWithForm>
  );
}