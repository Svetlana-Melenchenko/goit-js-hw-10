// Імпорт необхідних модулів та бібліотек
import { fetchBreeds, fetchCatByBreed } from './cat-api'; // Імпорт функцій з cat-api.js
import Notiflix from 'notiflix'; // Імпорт бібліотеки для сповіщень
import SlimSelect from 'slim-select'; // Імпорт бібліотеки для стилізованого селекта
import 'slim-select/dist/slimselect.css'; // Імпорт стилів для стилізованого селекта
import './style.css'; // Імпорт власних стилів з styles.css

// Оголошення елементів сторінки
const elements = {
  select: document.querySelector('.breed-select'), // Вибір породи (селект)
  loader: document.querySelector('.loader'), // Завантажувач
  error: document.querySelector('.error'), // Повідомлення про помилку
  catInfo: document.querySelector('.cat-info'), // Інформація про кота
};

// Розпакування елементів сторінки
const { select, loader, error, catInfo } = elements;

// Приховання селекту та відображення завантажувача
select.classList.add('is-hidden');
error.classList.add('is-hidden');
loader.classList.remove('is-hidden');

// Масив для опцій вибору породи кота
let breedOptions = [];

// Отримання інформації про породи котів і ініціалізація селекта
fetchBreeds()
  .then(data => {
    breedOptions = data.map(breed => ({ value: breed.id, text: breed.name }));
    initializeSelect();
    select.classList.remove('is-hidden'); // Відобразити селект
    loader.classList.add('is-hidden'); // Приховати завантажувач
  })
  .catch(onErrorFetch); // Обробка помилок при отриманні даних

// Ініціалізація стилізованого селекта
function initializeSelect() {
  new SlimSelect({
    select: select,
    data: breedOptions,
  });
  select.addEventListener('change', onSelectBreedCats); // Додати обробник події для вибору породи
}

// Обробка помилок при отриманні даних
function onErrorFetch() {
  loader.classList.add('is-hidden'); // Приховати завантажувач
  select.classList.remove('is-hidden'); // Відобразити селект
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!'
  ); // Повідомлення про помилку
}

// Обробник події вибору породи кота
function onSelectBreedCats(evt) {
  loader.classList.remove('is-hidden'); // Відобразити завантажувач
  select.classList.add('is-hidden'); // Приховати селект
  catInfo.classList.add('is-hidden'); // Приховати інформацію про кота

  // Отримання зoбраження кота обраної породи
  const breedId = evt.target.value;
  let breedDetails = null;

  fetchCatByBreed(breedId)
    .then(data => {
      console.log({ data });
      const { url, id, width } = data[0];
      fetch(`https://api.thecatapi.com/v1/images/${id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          const { name, description, life_span, temperament } = data.breeds[0];
          catInfo.innerHTML = `
        <div class="img">
      		<img src="${url}" id="${id}" width="500"/>
        </div>
        <div class="info">
      	  <h1>${name}</h1>
      	  <p>${description}</p>
      	  <p><i><b>Life_span: </b></i>${life_span} years</p>
      	  <p><i><b>Temperament:</b></i> ${temperament}</p>
        </div>
       `;
          catInfo.classList.remove('is-hidden');
        });
    })
    .catch(onErrorFetch) // Обробка помилок при отриманні даних
    .finally(() => {
      loader.classList.add('is-hidden'); // Приховати завантажувач
      select.classList.remove('is-hidden'); // Відобразити селект
    });
}

// // Функція для відображення інформації про кота за ID зображення
// function displayCatInfoById(imageId, breeds) {
//   const selectedBreed = breeds[0]; // Отримуємо першу породу з масиву breeds (може бути потрібно розширити логіку для роботи з іншими породами)
//   const catInfo = document.querySelector('.info'); // Знаходимо DOM елемент для відображення інформації про кота
//   const { id, url } = selectedBreed; // Отримуємо ID та URL породи
//   // Порівнюємо ID зображення з ID породи та виводимо інформацію, якщо вони співпадають
//   if (id === imageId) {
//     catInfo.innerHTML = `
// 		 <div class="info">
// 			<h1>${selectedBreed.name}</h1>
// 			<p>${selectedBreed.description}</p>
// 			<p><i><b>Life_span: </b></i>${selectedBreed.life_span} years</p>
// 			<p><i><b>Temperament:</b></i> ${selectedBreed.temperament}</p>
// 		 </div>
// 	  `;

//     catInfo.classList.remove('is-hidden'); // Відображення блоку інформації про кота
//   } else {
//     catInfo.classList.add('is-hidden'); // Приховуємо блок інформації про кота, якщо ID не співпадають
//   }
// }
