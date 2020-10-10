'use strict';

const AVATAR_URL = `img/avatars/user`;
const AVATAR_TYPE = `.png`;
const OFFER_TITLE = `Lorem Ipsum`;
const OFFER_PRICE = [200, 3000, 5000, 10000];
const OFFER_TYPE = [`palace`, `flat`, `house`, `bungalow`];
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
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

const renderNumber = (min, max) => {
  return Math.floor(min + Math.random() * Math.floor(max - min));
};

const renderUrl = (number) => {
  let url;

  if (number < 10) {
    url = AVATAR_URL + 0 + number + AVATAR_TYPE;
  } else {
    url = AVATAR_URL + number + AVATAR_TYPE;
  }

  return url;
};

const renderUrlArray = (ammount) => {
  let numbersArray = [];
  let avatarNumbersArray = [];

  for (let i = 0; i < ammount; i++) {
    numbersArray[i] = i + 1;
  }

  for (let i = 0; i < ammount; i++) {
    const number = renderNumber(0, numbersArray.length);
    const avatarNumber = numbersArray[number];
    avatarNumbersArray[i] = renderUrl(avatarNumber);
    numbersArray.splice(number, 1);
  }

  return avatarNumbersArray;
};

const renderOffers = function () {
  let offersArray = [];

  const urlArray = renderUrlArray(PIN_QUANTITY);

  for (let i = 0; i < PIN_QUANTITY; i++) {
    const offerFeatures = OFFER_FEATURES.slice(renderNumber(0, OFFER_FEATURES.length));
    const offerPhotos = OFFER_PHOTOS.slice(renderNumber(0, OFFER_PHOTOS.length));
    const locationX = renderNumber(LOCATION_X_MIN, LOCATION_X_MAX - PIN_WIDTH - PIN_WIDTH / 2);
    const locationY = renderNumber(LOCATION_Y_MIN, LOCATION_Y_MAX - PIN_HEIGHT);

    offersArray[i] = {
      "author":
        {
          "avatar": urlArray[i]
        },
      "offer":
        {
          "title": OFFER_TITLE,
          "address": locationX.toString() + `, ` + locationY.toString(),
          "price": OFFER_PRICE[renderNumber(0, OFFER_PRICE.length)],
          "type": OFFER_TYPE[renderNumber(0, OFFER_TYPE.length)],
          "rooms": OFFER_ROOMS[renderNumber(0, OFFER_ROOMS.length)],
          "guests": OFFER_GUESTS[renderNumber(0, OFFER_GUESTS.length)],
          "checkin": OFFER_CHECKIN[renderNumber(0, OFFER_CHECKIN.length)],
          "checkout": OFFER_CHECKOUT[renderNumber(0, OFFER_CHECKOUT.length)],
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

const offers = Array.from(renderOffers());

const renderPin = (offer) => {
  let pinElement = pinTemplate.cloneNode(true);
  const pinStyle = `left: ` + (offer.location.x + PIN_WIDTH / 2) + `px; top: ` + (offer.location.y + PIN_HEIGHT) + `px;`;

  pinElement.style.cssText = pinStyle;
  pinElement.querySelector(`img`).alt = offer.offer.title;
  pinElement.querySelector(`img`).src = offer.author.avatar;

  return pinElement;
};

const fragment = document.createDocumentFragment();
for (let i = 0; i < offers.length; i++) {
  fragment.appendChild(renderPin(offers[i]));
}

mapPinsArea.appendChild(fragment);

mapArea.classList.remove(`map--faded`);
