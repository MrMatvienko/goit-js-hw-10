// live_MpMxPIimRwQg7DVCWCLMSiBy4VQNm1gW5Y13Oukz7Mw5YDCDZd7TQEIAnWeaRSBW

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import './style.css';

const refs = {
  selector: document.querySelector('.breed-select'),
  divCatInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

const { selector, divCatInfo, loader, error } = refs;
//приховуємо початкові рядки
loader.classList.replace('loader', 'is-hidden');
error.classList.add('is-hidden');
divCatInfo.classList.add('is-hidden');

let arrBreedsId = []; // створюємо масив для списку котів
fetchBreeds()
  .then(data => {
    data.forEach(element => {
      arrBreedsId.push({ text: element.name, value: element.id });
    }); // отримали дані про котів з допомогою fetchBreeds та  запушили їх в масив arrBreedsId
    new SlimSelect({
      select: selector,
      data: arrBreedsId,
    }); //  підключили випадаючий список
  })
  .catch(onFetchError); // якщо буде помилка викликаємо функцію onFetchError

selector.addEventListener('change', onSelectBreed); // вішаємо прослуховувач, який буде викликати onSelectBreed у випадку зміни вибору в списку

function onSelectBreed(event) {
  event.preventDefault();
  loader.classList.replace('is-hidden', 'loader'); // заміна класів is-hidden на loader
  selector.classList.add('is-hidden'); // приховуємо випадаючий список порід
  divCatInfo.classList.add('is-hidden'); // приховуємо контейнер з інфою про котів

  const breedId = event.currentTarget.value; // дістаємо значення вибране користувачем з події change
  fetchCatByBreed(breedId) // отримуємо дані обраної кішки
    .then(data => {
      loader.classList.replace('loader', 'is-hidden');
      selector.classList.remove('is-hidden'); //  показуємо випадаючий список
      const { url, breeds } = data[0];

      const createMarkup = data
        .map(
          cat => `
    <div class="box-img"><img src="${cat.url}" alt="${cat.breeds[0].name}" width="600"/></div>
    <div class="box">
        <h1>${cat.breeds[0].name}</h1>
        <p>${cat.breeds[0].description}</p>
        <p><b>Temperament:</b> ${cat.breeds[0].temperament}</p>
    </div>
`
        )
        .join(''); // створюємо розмітку для карточки обраної породи кота

      divCatInfo.innerHTML = createMarkup;
      divCatInfo.classList.remove('is-hidden'); //показуємо контейнер з інфою
    })
    .catch(onFetchError); // обробляємо помилку
}

function onFetchError(error) {
  selector.classList.remove('is-hidden');
  loader.classList.replace('loader', 'is-hidden');

  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!',
    {
      position: 'center-center',
      timeout: 2000,
      width: '600px',
      fontSize: '24px',
    }
  );
}
