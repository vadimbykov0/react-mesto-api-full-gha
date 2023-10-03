import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

import Header from "./Header";
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
import auth from "../utils/auth";

function App() {
  const navigate = useNavigate();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopup, setImagePopup] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [cardForDelete, setCardForDelete] = useState('');
  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({});
  const [dataUser, setDataUser] = useState('');

  const [authorizationUserEmail, setAuthorizationUserEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);
  const [isCheckToken, setIsCheckToken] = useState(true);
  
  const [isLoadingEditProfilePopup, setIsLoadingEditProfilePopup] = useState(false);
  const [isLoadingAddPlacePopup, setIsLoadingAddPlacePopup] = useState(false);
  const [isLoadingEditAvatarPopup, setIsLoadingEditAvatarPopup] = useState(false);
  const [isLoadingDeletePopupOpen, setIsLoadingDeletePopupOpen] = useState(false);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setDeletePopupOpen(false);
    setImagePopup(false);
    setIsInfoTooltipPopupOpen(false);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setAuthorizationUserEmail(res.email);
            navigate('/');
          }
        })
        .catch((err) => {
          console.log(`Ошибка проверки токена ${err}`);
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (localStorage.jwt) {
      auth.checkToken(localStorage.jwt)
        .then(res => {
          setDataUser(res.email)
          setLoggedIn(true)
          setIsCheckToken(false)
          navigate('/')
        })
        .catch((err) => {
          console.log(`Ошибка авторизации при повторном входе ${err}`)
        });
    } else {
      setIsCheckToken(false)
      setLoggedIn(false)
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([
        api.getUserInfo(localStorage.jwt),
        api.getCards(localStorage.jwt)
      ])
        .then(([dataUser, dataCards]) => {
          setCurrentUser(dataUser);
          setCards(dataCards);
        })
        .catch((err) => {
          console.log(`Ошибка получения данных пользователя и карточек мест ${err}`);
        })
    }
  }, [loggedIn]);

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
    setImagePopup(true);
  };

  function handleDeleteClick(card) {
    setCardForDelete(card);
    setDeletePopupOpen(true);
  };

  const handleCardLike = useCallback((card) => {
    const isLike = card.likes.some(element => currentUser._id === element)
    if (isLike) {
      api.deleteLike(card._id, localStorage.jwt)
        .then(res => {
          setCards(cards => cards.map((item) => item._id === card._id ? res : item))
        })
        .catch((err) => console.error(`Ошибка при снятии лайка ${err}`))
    } else {
      api.addLike(card._id, localStorage.jwt)
        .then(res => {
          setCards(cards => cards.map((item) => item._id === card._id ? res : item))
        })
        .catch((err) => console.error(`Ошибка при установке лайка ${err}`))
    }
  }, [currentUser._id])

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
  }

  function handleUpdateUser(dataUser, reset) {
    setIsLoadingEditProfilePopup(true);
    api.changeUserInfo(dataUser, localStorage.jwt)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        reset();
        setIsLoadingEditProfilePopup(false);
      })
      .catch((err) => {
        console.log(`Ошибка при редактировании данных пользователя ${err}`)
      })
      .finally(() => setIsLoadingEditProfilePopup(false))
  };

  function handleUpdateAvatar(dataUser, reset) {
    setIsLoadingEditAvatarPopup(true);
    api.setUserAvatar(dataUser, localStorage.jwt)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        reset();
        setIsLoadingEditAvatarPopup(false);
      })
      .catch((err) => {
        console.log(`Ошибка при редактировании аватара ${err}`)
      })
      .finally(() => setIsLoadingEditAvatarPopup(false))
  };

  function handleAddPlaceSubmit(dataCard, reset) {
    setIsLoadingAddPlacePopup(true);
    api.addNewCard(dataCard, localStorage.jwt)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
        reset();
        setIsLoadingAddPlacePopup(false);
      })
      .catch((err) => {
        console.log(`Ошибка при добавлении карточки места ${err}`)
      })
      .finally(() => setIsLoadingAddPlacePopup(false))
  };

  function handleRegister(data) {
    auth.register(data, localStorage.jwt)
      .then((res) => {
        if (res) {
          setIsInfoTooltipSuccess(true);
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        console.log(`Ошибка регистрации пользователя ${err}`);
      })
      .finally(() => setIsInfoTooltipPopupOpen(true));
  };

  function handleLogin(data) {
    auth.login(data)
      .then((res) => {
        if (res && res.token) {
          localStorage.setItem("jwt", res.token);
          navigate("/");
          setAuthorizationUserEmail(res.email);
          setLoggedIn(true);
        }
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка входа ${err}`);
      });
  };

  function logOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setAuthorizationUserEmail('');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          logOut={logOut}
          email={authorizationUserEmail}
        />

        <Routes>
          <Route
            path="/sign-up"
            element={<Register isCheckToken={isCheckToken} onRegister={handleRegister} />}
          />
          <Route
            path="/sign-in"
            element={<Login isCheckToken={isCheckToken} onLogin={handleLogin} />}
          />
          <Route
            path="*"
            element={<Navigate to={loggedIn ? "/" : "/sign-in"} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardDelete={handleDeleteClick}
                onCardLike={handleCardLike}
                loggedIn={loggedIn}
                element={Main}
                cards={cards}
                isCheckToken={isCheckToken}
                dataUser={dataUser}
              />
            }
          />
        </Routes>

        {loggedIn && <Footer />}
        
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
          card={cardForDelete}
          isSending={isLoadingDeletePopupOpen}
        />

        <ImagePopup
          isOpen={isImagePopup}
          onClose={closeAllPopups}
          card={selectedCard}
        />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isSuccess={isInfoTooltipSuccess}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;