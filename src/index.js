import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36083710-9df5b372674412c7298f0bb13';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('[type="text"]'),
  div: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

let pages = 1;
let name = null;

let arrLengthTotal = 40;
let arrClick = 0;

refs.button.setAttribute('hidden', false);

refs.form.addEventListener('submit', onForm);
refs.button.addEventListener('click', onClick);

function formScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function getUser(name, pages = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${pages}&per_page=40`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

function creatMarkup(arr) {
  const markup = arr

    .map(function (item) {
      return `<div class="photo-card">
        <div class="gallery__item">
        <a href="${item.largeImageURL}">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width='300' height="200"/>
        </a>
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${item.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${item.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${item.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${item.downloads}</b>
          </p>
        </div>
      </div>`;
    })
    .join(' ');

  console.log();

  refs.div.insertAdjacentHTML('beforeend', markup);

  if (!arr.length) {
    refs.button.setAttribute('hidden', false);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  new SimpleLightbox('.gallery__item a').refresh();
}

function onForm(evt) {
  evt.preventDefault();
  name = refs.input.value;
  const trim = name.trim();
  // refs.button.setAttribute('hidden', false);

  if (!name) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }

  if (!trim) {
    return;
  } else {
    refs.div.innerHTML = '';
  }

  getUser(name, (pages = 1)).then(function (response) {
    creatMarkup(response.data.hits);
    if (!response.data.hits.length) {
      refs.button.setAttribute('hidden', false);
    } else {
      refs.button.removeAttribute('hidden');

      const totalHits = response.data.totalHits;
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  });
}

function onClick() {
  pages += 1;

  getUser(name, pages).then(function (response) {
    creatMarkup(response.data.hits);
    formScroll();

    arrClick = response.data.hits.length;

    arrLengthTotal += arrClick;
    console.log(arrLengthTotal);

    if (arrLengthTotal >= response.data.totalHits) {
      arrLengthTotal = 40;

      refs.button.setAttribute('hidden', false);

      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
