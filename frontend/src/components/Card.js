import React from 'react';
import { CurrentUserContext } from './contexts/CurrentUserContext';

export default function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner === currentUser._id;
  const isLiked = props.card.likes.some(id => id === currentUser._id);

  /**
   * Handler for click on image
   */
  function handleImageClick() {
    props.onCardClick(props.card);
  }

  /**
   * Handler for click on like
   */
  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  /**
  * Handler for delet card
  */
  function handleCardDelete() {
    props.onDeleteClick(props.card);
  }

  return (
    <article className="element">
      <img className="element__image" src={props.card.link} alt={`Фото ${props.card.name}`}
      onClick={handleImageClick} />
      <h2 className="element__title">{props.card.name}</h2>
      <div className="element__reaction-container">
        <button type="button" name="reactionButton"
          className={`element__reaction-button ${isLiked && 'element__reaction-button_activ'}`}
          onClick={handleLikeClick} />
        <p className="element__like-counter">{props.card.likes.length}</p>
      </div>
      {isOwn && <button type="button" name="buttonTrash" className="element__trash-button"
      onClick={handleCardDelete}></button>}
    </article>
  )
}
