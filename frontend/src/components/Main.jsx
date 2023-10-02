import React, { useContext } from "react";

import Card from "./Card";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardDelete,
  cards,
  onCardLike
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section
        className="profile"
        aria-label="Профиль"
      >
        <button
          className="profile__avatar-button"
          type="button"
          onClick={onEditAvatar}
        >
          <img className="profile__image" src={currentUser.avatar} alt="Аватар пользователя" />
        </button>
        <div className="profile__info">
          <h1 className="profile__info-title">{currentUser.name}</h1>
          <button
            className="profile__edit-button"
            type="button"
            aria-label="Изменить данные профиля"
            onClick={onEditProfile}
          />
          <p className="profile__info-subtitle">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Добавить карточку с фотографией"
          onClick={onAddPlace}
        />
      </section>
      <section
        className="elements"
        aria-label="Карточки мест"
      >
        {cards.map((data) => {
          return (
            <div className="element" key={data._id}>
              <Card
                card={data}
                onCardLike={onCardLike}
                onCardClick={onCardClick}
                onCardDelete={onCardDelete}
              />
            </div>
          );
        })}
      </section>
    </main>
  );
}