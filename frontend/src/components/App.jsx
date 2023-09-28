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
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [cardForDelete, setCardForDelete] = useState('');
  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({});

  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [authorizationUserEmail, setAuthorizationUserEmail] = useState('');
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);
  
  const [isLoadingEditProfilePopup, setIsLoadingEditProfilePopup] = useState(false);
  const [isLoadingAddPlacePopup, setIsLoadingAddPlacePopup] = useState(false);
  const [isLoadingEditAvatarPopup, setIsLoadingEditAvatarPopup] = useState(false);
  const [isLoadingDeletePopupOpen, setIsLoadingDeletePopupOpen] = useState(false);

  const checkToken = useCallback(
    () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        setToken(token);
        auth.checkToken(token)
          .then(res => {
            setLoggedIn(true);
            setAuthorizationUserEmail(res.email);
            navigate('/', { replace: true });
            })
          .catch((err) => {
            console.log(`Ошибка проверки токена ${err}`);
          })
      }
    },
    [navigate]
  );

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      Promise.all([
        api.getUserInfo(token),
        api.getCards(token)
      ])
        .then((res) => {
          const [dataUser, dataCards] = res;
          setCurrentUser(dataUser);
          setCards(dataCards);
        })
        .catch((err) => {
          console.log(`Ошибка получения данных пользователя и карточек мест ${err}`);
        })
    }
  }, [loggedIn]);

  const handleUpdateUser = (dataUser, reset) => {
    setIsLoadingEditProfilePopup(true);

    api.changeUserInfo(dataUser, token)
      .then((res) => {
        setCurrentUser(res);
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

  const handleUpdateAvatar = (dataUser, reset) => {
    setIsLoadingEditAvatarPopup(true);

    api.setUserAvatar(dataUser, token)
      .then((res) => {
        setCurrentUser(res);
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

  const handleCardLike = (card) => {
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
      api.setLike(card._id, localStorage.jwt)
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

  const handleCardDelete = () => {
    setIsLoadingDeletePopupOpen(true);

    api.deleteCard(cardForDelete._id, token)
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

  const handleAddPlaceSubmit = (dataCard, reset) => {
    setIsLoadingAddPlacePopup(true);

    api.addNewCard(dataCard, token)
      .then((res) => {
        setCards([res, ...cards]);
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

  const handleRegister = (password, email) => {
    auth.register(password, email)
      .then(res => {
          setIsInfoTooltipSuccess(true);
          navigate('/sign-in', { replace: true });
      })
      .catch((err) => {
        console.log(`Ошибка при регистрации ${err}`);
        setIsInfoTooltipSuccess(false);
      })
      .finally(() => {
        setIsInfoTooltipPopupOpen(true)
      })
  };

  const handleLogin = (password, email) => {
    auth.login(password, email)
      .then(res => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка при авторизации ${err}`);
      })
  };

  const signOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setToken('');
    navigate('/sign-in');
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };


  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setDeletePopupOpen(false);
    setImagePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard({});
  };

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  };

  function handleConfirmDeleteClick(card) {
    setCardForDelete(card);
    setDeletePopupOpen(true);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          signOut={signOut}
          email={authorizationUserEmail}
        />

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