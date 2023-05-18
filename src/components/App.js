import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import {useState, useEffect} from 'react';
import ImagePopup from "./ImagePopup";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import api from '../utils/api';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup";

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

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
    setSelectedCard(null);
    setCardToDelete(null);
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header/>
        {
          // Таким образом мы оборабатываем неопределенное состояние отсутствия пользователя
          currentUser ? (<Main onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}/>) : null
        }
        <Footer/>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} isLoading={isLoading} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} isLoading={isLoading} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} isLoading={isLoading} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

        <ConfirmationPopup card={cardToDelete} isLoading={isLoading} onClose={closeAllPopups} onConfirmCardDelete={handleConfirmCardDelete} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
