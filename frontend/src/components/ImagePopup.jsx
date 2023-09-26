export default function ImagePopup({ card, isOpen, onClose }) {
  return (
    <div className={`popup popup_type_photo ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container-image">
        <img
          className="popup__card-image"
          src={card.link ? card.link : "#"}
          alt={card.name ? card.name : "#"}
        />
        <figcaption className="popup__caption">{card.name}</figcaption>
        <button
          className="popup__close"
          type="button"
          aria-label="Закрыть просмотр фотографии"
          onClick={onClose}
        />
      </div>
    </div>
  );
}