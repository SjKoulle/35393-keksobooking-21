'use strict';

const AVATAR_URL = `img/avatars/user`;
const AVATAR_TYPE = `.png`;
const OFFER_TITLE = `Lorem Ipsum`;
const OFFER_PRICE = [200, 3000, 5000, 10000];
const OFFER_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const TYPE_NAMES = {
  flat: `Квартира`,
  bungalow: `Бунгало`,
  house: `Дом`,
  palace: `Дворец`
};
const OFFER_ROOMS = [1, 2, 3];
const OFFER_GUESTS = [1, 2, 3, 5];
const OFFER_CHECKIN = [`12:00`, `13:00`, `14:00`];
const OFFER_CHECKOUT = [`12:00`, `13:00`, `14:00`];
const OFFER_FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const OFFER_DESCRIPTION = `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.`;
const OFFER_PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const LOCATION_X_MIN = 0;
const LOCATION_X_MAX = 1200;
const LOCATION_Y_MIN = 130;
const LOCATION_Y_MAX = 630;
const PIN_QUANTITY = 8;
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const mapArea = document.querySelector(`.map`);
const mapPinsArea = document.querySelector(`.map__pins`);
const mapFiltersArea = document.querySelector(`.map__filters-container`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

const generateNumber = (min, max) => {
  return Math.floor(min + Math.random() * Math.floor(max - min));
};

const generateUrl = (number) => {
  if (number < 10) {
    return AVATAR_URL + 0 + number + AVATAR_TYPE;
  }

  return AVATAR_URL + number + AVATAR_TYPE;
};

const generateUrlArray = (ammount) => {
  let numbersArray = [];
  let avatarNumbersArray = [];

  for (let i = 0; i < ammount; i++) {
    numbersArray[i] = i + 1;
  }

  for (let i = 0; i < ammount; i++) {
    const number = generateNumber(0, numbersArray.length);
    const avatarNumber = numbersArray[number];
    avatarNumbersArray[i] = generateUrl(avatarNumber);
    numbersArray.splice(number, 1);
  }

  return avatarNumbersArray;
};

const generateOffers = function () {
  let offersArray = [];

  const urlArray = generateUrlArray(PIN_QUANTITY);

  for (let i = 0; i < PIN_QUANTITY; i++) {
    const offerFeatures = OFFER_FEATURES.slice(generateNumber(0, OFFER_FEATURES.length));
    let offerPhotos = [];
    const locationX = generateNumber(LOCATION_X_MIN, LOCATION_X_MAX - PIN_WIDTH - PIN_WIDTH / 2);
    const locationY = generateNumber(LOCATION_Y_MIN, LOCATION_Y_MAX - PIN_HEIGHT);

    if (OFFER_PHOTOS.length > 0) {
      offerPhotos = OFFER_PHOTOS.slice(generateNumber(0, OFFER_PHOTOS.length));
    }

    offersArray[i] = {
      "author":
        {
          "avatar": urlArray[i]
        },
      "offer":
        {
          "title": OFFER_TITLE,
          "address": locationX.toString() + `, ` + locationY.toString(),
          "price": OFFER_PRICE[generateNumber(0, OFFER_PRICE.length)],
          "type": OFFER_TYPE[generateNumber(0, OFFER_TYPE.length)],
          "rooms": OFFER_ROOMS[generateNumber(0, OFFER_ROOMS.length)],
          "guests": OFFER_GUESTS[generateNumber(0, OFFER_GUESTS.length)],
          "checkin": OFFER_CHECKIN[generateNumber(0, OFFER_CHECKIN.length)],
          "checkout": OFFER_CHECKOUT[generateNumber(0, OFFER_CHECKOUT.length)],
          "featured": offerFeatures,
          "description": OFFER_DESCRIPTION,
          "photos": offerPhotos
        },
      "location":
        {
          "x": locationX,
          "y": locationY
        }
    };
  }

  return offersArray;
};

const offers = Array.from(generateOffers());

const generatePin = (offer) => {
  let pinElement = pinTemplate.cloneNode(true);
  const pinStyle = `left: ` + (offer.location.x + PIN_WIDTH / 2) + `px; top: ` + (offer.location.y + PIN_HEIGHT) + `px;`;

  pinElement.style.cssText = pinStyle;
  pinElement.querySelector(`img`).alt = offer.offer.title;
  pinElement.querySelector(`img`).src = offer.author.avatar;

  return pinElement;
};

const generateCard = (offer) => {
  let cardElement = cardTemplate.cloneNode(true);
  let cardRooms = ` комнаты для `;
  let cardGuests = ` гостей`;
  const featuresList = cardElement.querySelector(`.popup__features`);
  let featuresItems = cardElement.querySelectorAll(`.popup__feature`);
  const photosList = cardElement.querySelector(`.popup__photos`);
  const photoItem = cardElement.querySelector(`.popup__photo`);

  for (let i = featuresItems.length - 1; i >= 0; i--) {

    let featureUse = 0;

    for (let j = 0; j < offer.offer.featured.length; j++) {
      if (featuresItems[i].classList[1] === (`popup__feature--` + offer.offer.featured[j])) {
        featureUse = 1;
      }
    }

    if (!featureUse) {
      featuresList.removeChild(featuresItems[i]);
    }
  }

  if (offer.offer.rooms === 1) {
    cardRooms = ` комната для `;
  }

  if (offer.offer.guests === 1) {
    cardGuests = ` гостя`;
  }

  if (offer.offer.photos.length > 1) {
    for (let i = 1; i < offer.offer.photos.length; i++) {
      photosList.appendChild(photoItem.cloneNode(true));
    }
  }

  const photoItems = cardElement.querySelectorAll(`.popup__photo`);

  cardElement.querySelector(`.popup__avatar`).src = offer.author.avatar;
  cardElement.querySelector(`.popup__title`).innerText = offer.offer.title;
  cardElement.querySelector(`.popup__text--address`).innerText = offer.offer.address;
  cardElement.querySelector(`.popup__text--price`).innerText = offer.offer.price + `₽/ночь`;
  cardElement.querySelector(`.popup__type`).innerText = TYPE_NAMES[offer.offer.type];
  cardElement.querySelector(`.popup__text--capacity`).innerText = offer.offer.rooms + cardRooms + offer.offer.guests + cardGuests;
  cardElement.querySelector(`.popup__text--time`).innerText = `Заезд после ` + offer.offer.checkin + `, выезд до ` + offer.offer.checkout;
  cardElement.querySelector(`.popup__description`).innerText = OFFER_DESCRIPTION;

  for (let i = 0; i < photoItems.length; i++) {
    photoItems[i].src = offer.offer.photos[i];
  }

  for (let i = 0; i < cardElement.children.length; i++) {
    if (cardElement.children[i].length === 0) {
      cardElement.children[i].style.cssText = `display: none;`;
    }
  }

  if (!offer.offer.price) {
    cardElement.querySelector(`.popup__text--price`).style.cssText = `display: none;`;
  }

  if (!offer.offer.rooms || !offer.offer.guests) {
    cardElement.querySelector(`.popup__text--capacity`).style.cssText = `display: none;`;
  }

  if (!offer.offer.checkin || !offer.offer.checkout) {
    cardElement.querySelector(`.popup__text--time`).style.cssText = `display: none;`;
  }

  if (!offer.offer.type) {
    cardElement.querySelector(`.popup__type`).style.cssText = `display: none;`;
  }

  if (!offer.offer.photos.length) {
    cardElement.querySelector(`.popup__photos`).style.cssText = `display: none;`;
  }

  return cardElement;
};

const fragmentPins = document.createDocumentFragment();

for (let i = 0; i < offers.length; i++) {
  fragmentPins.appendChild(generatePin(offers[i]));
}

const fragmentCard = document.createDocumentFragment();

fragmentCard.appendChild(generateCard(offers[1]));

mapArea.insertBefore(fragmentCard, mapFiltersArea);
mapPinsArea.appendChild(fragmentPins);

mapArea.classList.remove(`map--faded`);
