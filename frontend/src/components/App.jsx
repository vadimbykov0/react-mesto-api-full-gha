import { useEffect, useState } from "react";
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

  const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [isImagePopup, setImagePopup] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isInfoTooltipPopup, setIsInfoTooltipPopup] = useState(false);

  const [cards, setCards] = useState([]);
  const [cardForDelete, setCardForDelete] = useState('');
  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({});

  const [headerEmail, setHeaderEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);
  
  const [isLoadingEditProfilePopup, setIsLoadingEditProfilePopup] = useState(false);
  const [isLoadingAddPlacePopup, setIsLoadingAddPlacePopup] = useState(false);
  const [isLoadingEditAvatarPopup, setIsLoadingEditAvatarPopup] = useState(false);
  const [isLoadingDeletePopupOpen, setIsLoadingDeletePopupOpen] = useState(false);

  function closeAllPopups() {
    setProfilePopupOpen(false);
    setPlacePopupOpen(false);
    setAvatarPopupOpen(false);
    setDeletePopupOpen(false);
    setImagePopup(false);
    setIsInfoTooltipPopup(false);
    setSelectedCard({});
  }

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(localStorage.jwt), api.getCards(localStorage.jwt)])
        .then(([dataUser, dataCards]) => {
          setCurrentUser(dataUser);
          setCards(dataCards);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedIn]);

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
        console.log(err);
      })
      .finally(() => setIsInfoTooltipPopup(true));
  };

  function checkToken() {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          if (res && res.data) {
            setLoggedIn(true);
            navigate("/");
            setHeaderEmail(res.data.email);
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  function handleLogin(data) {
    auth.login(data)
      .then((res) => {
        if (res && res.token) {
          localStorage.setItem("jwt", res.token);
          navigate("/");
          setHeaderEmail(data.email);
          setLoggedIn(true);
        }
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipPopup(true);
        console.log(err);
      });
  };

  function logOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setHeaderEmail('');
  };

  function handleEditProfileClick() {
    setProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setPlacePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setAvatarPopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopup(true);
  };

  function handleDeleteClick(card) {
    setCardForDelete(card);
    setDeletePopupOpen(true);
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
    api.addNewCard(dataCard, localStorage)
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          logOut={logOut}
          email={headerEmail}
        />

        <Routes>
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
          cardId={cardForDelete}
          isSending={isLoadingDeletePopupOpen}
        />

        <ImagePopup
          isOpen={isImagePopup}
          onClose={closeAllPopups}
          card={selectedCard}
        />

        <InfoTooltip
          isOpen={isInfoTooltipPopup}
          onClose={closeAllPopups}
          isSuccess={isInfoTooltipSuccess}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;