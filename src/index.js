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

loader.classList.replace('loader', 'is-hidden');
error.classList.add('is-hidden');
divCatInfo.classList.add('is-hidden');

let arrBreedsId = [];
fetchBreeds()
  .then(data => {
    data.forEach(element => {
      arrBreedsId.push({ text: element.name, value: element.id });
    });
    new SlimSelect({
      select: selector,
      data: arrBreedsId,
    });
  })
  .catch(onFetchError);

selector.addEventListener('change', onSelectBreed);

function onSelectBreed(event) {
  event.preventDefault();
  loader.classList.replace('is-hidden', 'loader');
  selector.classList.add('is-hidden');
  divCatInfo.classList.add('is-hidden');

  const breedId = event.currentTarget.value;
  fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'is-hidden');
      selector.classList.remove('is-hidden');
      const { url, breeds } = data[0];

      const catInfoHtml = data
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
        .join('');

      divCatInfo.innerHTML = catInfoHtml;
      divCatInfo.classList.remove('is-hidden');
    })
    .catch(onFetchError);
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
