import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

import Main from "./Main";
import Footer from "./Footer";

import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup"

import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

import CurrentUserContext from "../contexts/CurrentUserContext";

import api from "../utils/api";
import { register, authorize, getContent } from "../utils/auth";

function App() {
  const navigate = useNavigate();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [cardForDelete, setCardForDelete] = useState('');
  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);
  const [authorizationUserEmail, setAuthorizationUserEmail] = useState('');
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);
  
  const [isLoadingEditProfilePopup, setIsLoadingEditProfilePopup] = useState(false);
  const [isLoadingAddPlacePopup, setIsLoadingAddPlacePopup] = useState(false);
  const [isLoadingEditAvatarPopup, setIsLoadingEditAvatarPopup] = useState(false);
  const [isLoadingDeletePopupOpen, setIsLoadingDeletePopupOpen] = useState(false);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  };

  function handleConfirmDeleteClick(card) {
    setCardForDelete(card);
    setDeletePopupOpen(true);
  };

  const closeAllPopups = useCallback(() => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setDeletePopupOpen(false);
    setImagePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard({});
  }, []);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([
        api.getUser(localStorage.jwt),
        api.getCards(localStorage.jwt),
      ])
      .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((err) => {
          console.log(`Ошибка получения данных пользователя и карточек мест ${err}`);
        })
    }
  }, [loggedIn]);

  function handleUpdateUser({ name, about }, reset) {
    setIsLoadingEditProfilePopup(true);
    api.updateProfileInfo(name, about, localStorage.jwt)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
        reset();
      })
      .catch((err) => {
        console.log(`Ошибка при редактировании данных пользователя ${err}`)
      })
      .finally(() => {
        setIsLoadingEditProfilePopup(false);
      })
  };

  function handleCardDelete() {
    setIsLoadingDeletePopupOpen(true);
    api.deleteCard(cardForDelete._id, localStorage.jwt)
      .then(() => {
        setCards(cards.filter((item) => item !== cardForDelete));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка при удалении карточки места ${err}`)
      })
      .finally(() => {
        setIsLoadingDeletePopupOpen(false);
      })
  };

  function handleUpdateAvatar({ avatar }, reset) {
    setIsLoadingEditAvatarPopup(true);
    api.updateAvatar(avatar, localStorage.jwt)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
        reset();
      })
      .catch((err) => {
        console.log(`Ошибка при редактировании аватара ${err}`)
      })
      .finally(() => {
        setIsLoadingEditAvatarPopup(false);
      })
  };

  function handleAddPlaceSubmit({ name, link }, reset) {
    setIsLoadingAddPlacePopup(true);
    api.addNewCard(name, link, localStorage.jwt)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
        reset();
      })
      .catch((err) => {
        console.log(`Ошибка при добавлении карточки места ${err}`)
      })
      .finally(() => {
        setIsLoadingAddPlacePopup(false);
      })
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    
    if (isLiked) {
      api.deleteLike(card._id, localStorage.jwt)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(`Ошибка удаления лайка ${err}`);
        });
    } else {
      api.addLike(card._id, localStorage.jwt)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(`Ошибка добавления лайка ${err}`);
        });
    }
  };

  useEffect(() => {
    checkToken();
  }, [navigate]);

  const checkToken = () => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        getContent(jwt)
          .then((res) => {
            if (res) {
              setLoggedIn(true);
              setAuthorizationUserEmail(res.data.email);
              navigate('/', { replace: true });
            }
          })
          .catch((err) => {
            console.log(`Ошибка проверки токена ${err}`);
          });
        }
      }
  };

  function handleRegister(email, password) {
    register(email, password)
      .then((data) => {
        if (data) {
          setIsInfoTooltipSuccess(true);
          navigate('/sign-in', { replace: true });
        }
      })
      .catch((err) => {
        console.log(`Ошибка при регистрации ${err}`);
        setIsInfoTooltipSuccess(false);
      })
      .finally(() => setIsInfoTooltipPopupOpen(true));
  };

  function handleLogin(email, password) {
    authorize(email, password)
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          setAuthorizationUserEmail(email);
          navigate('/', { replace: true });
        } 
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка при авторизации ${err}`);
      })
  };

  function signOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardDelete={handleConfirmDeleteClick}
                onCardLike={handleCardLike}
                loggedIn={loggedIn}
                element={Main}
                cards={cards}
                signOut={signOut}
                email={authorizationUserEmail}
              />
            }
          />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          />
          <Route
            path="/sign-in"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="*"
            element={loggedIn ? (<Navigate to="/" />) : (<Navigate to="/sign-in" />)}
          />
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isSending={isLoadingEditProfilePopup}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isSending={isLoadingAddPlacePopup}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isSending={isLoadingEditAvatarPopup}
        />
        <ConfirmDeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onDeleteCardConfirm={handleCardDelete}
          cardId={cardForDelete}
          isSending={isLoadingDeletePopupOpen}
        />
        <ImagePopup
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          card={selectedCard}
        />
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isSuccess={isInfoTooltipSuccess}
        />

        {loggedIn && <Footer />}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;