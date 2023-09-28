import React from 'react';
import Card from './Card';
// import Footer from './Footer';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import { CardsContext } from './contexts/CardsContext';

export default function Main(props) {

  const currentUser = React.useContext(CurrentUserContext);

  const userName = currentUser.name; //user name
  const userDescription = currentUser.about; //user description
  const userAvatar = currentUser.avatar; //user anatar
  const cards = React.useContext(CardsContext); //State for cards

  return (
    <>
      <main className="content">
        <section className="profile" aria-label="Профаил">
          <div className="profile__card" >
            <button className="profile__edit-avatar-button" type="button" name="editNewAvater" onClick={props.onEditAvatar} >
              <img src={userAvatar} className="profile__avatar" alt="Фото профайла" />
              <div className="profile__avatar-blackout"></div>
            </button>
            <div className="profile__info">
              <h1 className="profile__name">{userName}</h1>
              <p className="profile__job">{userDescription}</p>
              <button className="profile__edit-button" type="button" name="editProfile" onClick={props.onEditProfile} />
            </div>
          </div>
          <button className="profile__add-button" type="button" name="editCard" onClick={props.onAddPlace} />
        </section>
        <section className="elements" aria-label="Картачки c фотографиями">
          {
            cards.map((card) => <Card
              key={card._id}
              card={card}
              onCardClick={props.onCardClick}
              onDeleteClick={props.onDeleteClick}
              onCardLike={props.onCardLike} />)
          }
        </section>
      </main>
    </>

  )
}
