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

refs.form.addEventListener('submit', onForm);
refs.button.addEventListener('click', onClick);

async function getUser(name, pages) {
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
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width='300'/>
        </a>
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes ${item.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${item.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${item.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${item.downloads}</b>
          </p>
        </div>
      </div>`;
    })
    .join(' ');

  if (!arr.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  refs.div.innerHTML = markup;

  new SimpleLightbox('.gallery__item a');
}

function onForm(evt) {
  evt.preventDefault();
  name = refs.input.value;
  const trim = name.trim();

  if (!name) {
    refs.div.innerHTML = '';
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (!trim) {
    return;
  } else {
    getUser(name, pages).then(response => creatMarkup(response.data.hits));
  }
}

function onClick() {
  pages += 1;
  getUser(name, pages).then(response => creatMarkup(response.data.hits));

  // console.log(response.data.totalHits);
}
