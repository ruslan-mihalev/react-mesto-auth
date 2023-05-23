import {useState, useEffect} from 'react';
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from "./ImagePopup";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import api from '../utils/api';
import * as auth from '../utils/auth';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup";
import Register from "./Register";
import Login from "./Login";
import ProtectedRouter from "./ProtectedRouter";
import InfoTooltip from "./InfoTooltip";

function App() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isInfoTooltipPopupStyleSuccess, setIsInfoTooltipPopupStyleSuccess] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // Возможно нужно завязаться на наличие токена
  const isLoggedIn = !!email;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      auth.validateToken(token)
        .then(body => {
          const email = body.data.email;
          if (email) {
            setEmail(email);
            navigate('/', {replace: true});
          }
        })
    }
  }, [navigate]);

  useEffect(() => {
    api.getUser()
      .then(user => {
        setCurrentUser(user);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    api.getCards()
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch(err => {
        console.log(err);
      });
  }, [currentUser]);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard(null);
    setCardToDelete(null);
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser?._id);
    api.like(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err));
  }

  function handleCardDelete(card) {
    setCardToDelete(card)
  }

  function handleConfirmCardDelete(card) {
    setIsLoading(true);
    api.deleteCard(card._id)
      .then(_ => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        setCardToDelete(null);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    api.setUser(user)
      .then(newUser => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.setAvatar(avatar)
      .then(newUser => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(place) {
    setIsLoading(true);
    api.addCard(place)
      .then(newCard => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onRegister() {
    navigate("/sign-in", {replace: true});
    setIsInfoTooltipPopupStyleSuccess(true);
    setIsInfoTooltipPopupOpen(true);
  }

  function onLogin(token, email) {
    localStorage.setItem('token', token);
    setEmail(email);
    navigate("/", {replace: true});
  }

  function onLoginError() {
    setIsInfoTooltipPopupStyleSuccess(false);
    setIsInfoTooltipPopupOpen(true);
  }

  function onSignOut() {
    localStorage.removeItem('token');
    setEmail('');
    navigate("/sign-in", {replace: true});
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={onSignOut}/>
        <Routes>
          <Route path="/" element={
            <>
              <ProtectedRouter element={Main}
                               isLoggedIn={isLoggedIn}
                               onEditAvatar={handleEditAvatarClick}
                               onEditProfile={handleEditProfileClick}
                               onAddPlace={handleAddPlaceClick}
                               cards={cards}
                               onCardClick={handleCardClick}
                               onCardLike={handleCardLike}
                               onCardDelete={handleCardDelete}/>
              <Footer/>
            </>
          }/>
          <Route path="/sign-up" element={
            <Register onRegister={onRegister}/>
          }/>
          <Route path="/sign-in" element={
            <Login onLogin={onLogin} onLoginError={onLoginError}/>
          }/>
          <Route path="*" element={isLoggedIn ? <Navigate to="/" replace/> : <Navigate to="/sign-in" replace/>}/>
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <ConfirmationPopup
          card={cardToDelete}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onConfirmCardDelete={handleConfirmCardDelete}
        />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          isOk={isInfoTooltipPopupStyleSuccess}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
