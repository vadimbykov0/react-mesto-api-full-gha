export default function ImagePopup({name, card, onClose}) {
  function handleOverlayClose(evt) {
    if (evt.target.classList.contains('popup')) {
      onClose();
    };
  }
  return (
    <div className={`popup popup_type_${name} ${Object.keys(card).length && ('popup_opened')}`}
    onClick={handleOverlayClose} >
      <div className="popup__picture-container">
        <img className="popup__picture" src={card.link} alt={`Фото ${card.name}`} />
        <button className="popup__close-button" type="button" onClick={onClose}></button>
        <h2 className="popup__picture-title">{card.name}</h2>
      </div>
    </div>
  )
}
