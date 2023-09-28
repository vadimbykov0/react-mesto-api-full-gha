import React from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import ProtectedRouteElement from "./ProtectedRoute.js";
import '../index.css';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import Login from './Login';
import Register from './Register';
import NavBar from './NavBar.js';

import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip.js';

import { api } from '../utils/Api';
import * as authApi from '../utils/AuthApi';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import { CardsContext } from './contexts/CardsContext';

function App() {
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '' }); //State for current user info
  const [cards, setCards] = React.useState([]); //State for cards

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false); //State for EditProfilePopup
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false); //State for AddPlacePopupOpen
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false); //State for EditAvatarPopupOpen
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false); //State for DeleteCardPopupOpen
  const [selectedCard, setSelectedCard] = React.useState({}); //State for selected card for ImagePopup
  const [deletedCard, setDeletedCard] = React.useState({}); //State for deleted card for ImagePopup

  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false); //State for InfoTooltipOpen
  const [isSuccess, setSucces] = React.useState(false); //State for seccessfull registration or login
  const [token, setToken] = React.useState(); //State for token

  const [isLoading, setIsLoading] = React.useState(false); //State for standart button text

  const [userData, setUserData] = React.useState({ email: '', _id: '' });//State for user regiztration data
  const [isLoggedIn, setLoggedIn] = React.useState(false); //State logged in user
  const navigate = useNavigate();

  // const api = new Api('http://localhost:3000', token);

  /**
   * Handler to user registration
   * @param {object} - email and password.
   */
  function handlerRegUser({ email, password }) {
    setIsLoading(true);
    authApi.register(email, password)
      .then((data) => {
        setUserData({ email: data.email, _id: data._id });
        setSucces(true);
        navigate('/sign-in', { replace: true });
      })
      .catch(err => {
        console.log(err);
        setSucces(false);
      })
      .finally(() => {
        setIsLoading(false);
        setInfoTooltipOpen(true);
      });
  }

  /**
  * Handler to user authorizetion
  * @param {object} - email and password.
  */
  function handlerLogIn({ email, password }) {
    setIsLoading(true);
    authApi.authorize(email, password)
      .then(({ token }) => {
        localStorage.setItem('jwt', token);
        setToken(token);
      })
      .catch(err => {
        console.log(err)
        setSucces(false);
        setInfoTooltipOpen(true);
      })
      .finally(() => setIsLoading(false))
  }

  /**
   * logOut function
   */
  function logOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setUserData({ email: '', _id: '' });
    api.setToken('');
    navigate('/sign-in', { replace: true });
  }

  // Check token
  React.useEffect(() => {
    if (token) {
      authApi.getUserData(token)
        .then((res) => {
          const data = res;
          setUserData({ email: data.email, _id: data._id });
          setCurrentUser(res)
          setLoggedIn(true);
          navigate('/', { replace: true });
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [token]);

  React.useEffect(() => {
    // Check token
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setToken(jwt);
      api.setToken(jwt);
      //Get user info
      api.getCurrentUser()
        .then((res) => {
          setCurrentUser(res); //Set currentUser
        })
        .catch(err => {
          console.log(err);
        });

      //Get cards
      api.getCards()
        .then((res) => setCards(res))
        .catch(err => {
          console.log(err);
        });
    };
  }, []);


  /**
   * Handler for avatar edit popup.
   * Changing state isEditAvatarPopupOpen.
   */
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  /**
  * Handler for edit profile popup.
  * Changing state isEditProfilePopupOpen.
  */
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  /**
  * Handler for add new place popup.
  * Changing state isAddPlacePopupOpen.
  */
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  /**
  * Handler for image popup.
  * Changing state selectedCard.
  * * @param {object} card - odject with card info.
  */
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  /**
  * Handler for delete popup.
  * Changing state isDeleteCardPopupOpen.
  */
  function handleDeleteClick(card) {
    setDeletedCard(card);
    setDeleteCardPopupOpen(true);
  }

  /**
  * Close all popups
  */
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setDeleteCardPopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard({});
  }

  /**
   * Handle Card Like
   * @param {object} card - object with card descripion.
   * @returns json of card with new likes
   */
  function handleCardLike(card) {
    //is it my like?
    const isLiked = card.likes.some(id => id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then(newCard => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(err);
      });;
  }

  /**
   * Handler delete card
   * @param {object} card - object with card descripion.
   * @returns json with list of cards without deleted card
   */
  function handleCardDelete() {
    setIsLoading(true);
    api.deleteCard(deletedCard._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== deletedCard._id));
        closeAllPopups()
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setIsLoading(false));
  }

  /**
   * Handler to update user
   * @param {string} name - new name.
   * @param {string} description - new description.
   */
  function handleUpdateUser(name, description) {
    setIsLoading(true);
    api.setUserInfo(name, description)
      .then((updateUser) => {
        setCurrentUser(updateUser);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setIsLoading(false));
  }

  /**
   * Handler to update avatar
   * @param {string} avatar - new avatar.
   */
  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.setNewAvatar(avatar)
      .then(updateAvatar => {
        setCurrentUser(updateAvatar);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));

  }

  /**
   * Handler to add new place
   * * @param {json} card - new card data.
   */
  function handleAddNewPlace(card) {
    setIsLoading(true);
    api.addNewCard(card)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));

  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        <div className="page">
          <Header>
            <NavBar
              email={userData.email}
              logOut={logOut}
              loggedIn={isLoggedIn} />
          </Header>
          <Routes>
            <Route path="*" element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={
              <Login
                onLogin={handlerLogIn}
                buttonText={isLoading ? 'Войти...' : 'Войти'} />}
            />
            <Route path="/sign-up" element={
              <Register
                onRegister={handlerRegUser}
                buttonText={isLoading ? 'Зарегистрироваться...' : 'Зарегистрироваться'} />} />
            <Route path="/" element={<ProtectedRouteElement
              element={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onClose={closeAllPopups}
              onCardClick={handleCardClick}
              onDeleteClick={handleDeleteClick}
              onCardLike={handleCardLike}
              loggedIn={isLoggedIn} />
            } />
          </Routes>
          {isLoggedIn && <Footer loggedIn={isLoggedIn} />}

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            buttonText={isLoading ? 'Сохранение...' : 'Сохранить'} />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddNewPlace={handleAddNewPlace}
            buttonText={isLoading ? 'Сохранение...' : 'Создать'} />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            buttonText={isLoading ? 'Сохранение...' : 'Сохранить'} />

          <DeleteCardPopup
            isOpen={isDeleteCardPopupOpen}
            onClose={closeAllPopups}
            hedlerDeleteCartd={handleCardDelete}
            buttonText={isLoading ? 'Удаление...' : 'Да'} />

          <ImagePopup
            name={'picture'}
            card={selectedCard}
            onClose={closeAllPopups} />

          <InfoTooltip
            name={'info-tool'}
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess} />
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
