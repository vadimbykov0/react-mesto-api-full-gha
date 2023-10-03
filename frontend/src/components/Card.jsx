import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = currentUser._id === card.owner;

  const isLiked = card.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = (
    `element__like ${isLiked ? 'element__like_active' : ''}`
  );

  function handleCardDelete() {
    onCardDelete(card);
  };

  function handleLikeClick() {
    onCardLike(card);
  };

  function handleImageOpenClick() {
    onCardClick({
      link: card.link,
      name: card.name
    })
  };

  return (
    <div className="element">
      <div className="element__item">
        <img
          className="element__image"
          src={card.link}
          alt={card.name}
          onClick={handleImageOpenClick}
        />
        <div className="element__image-info">
          <h2 className="element__title">{card.name}</h2>
          <div className="element__like-container">
          <button
            className={cardLikeButtonClassName}
            type="button"
            aria-label="Поставить лайк карточке"
            onClick={handleLikeClick}
          />
          <span className="element__like-counter">{card.likes.length}</span>
          </div>
            {isOwn && (
              <button
                className="element__image-basket"
                type="button"
                aria-label="Удалить место"
                onClick={handleCardDelete}
              />
            )}
        </div>
      </div>
    </div>
  );
}