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

  // Отримання збраження про кота обраної породи
  const breedId = evt.target.value;
  fetchCatByBreed(breedId)
    .then(data => {
      console.log({ data });
      const { url, id, width } = data[0];
      const x = fetch(`https://api.thecatapi.com/v1/images/${id}`).then(res =>
        console.log({ res })
      );

      // Відображення зображення
      catInfo.innerHTML = `
						<div class="img">
							 <img src="${url}" id="${id}" width="500"/>
						</div>
					  `;
      catInfo.classList.remove('is-hidden'); // Відобразити інформацію про кота
    })
    .catch(onErrorFetch) // Обробка помилок при отриманні даних
    .finally(() => {
      loader.classList.add('is-hidden'); // Приховати завантажувач
      select.classList.remove('is-hidden'); // Відобразити селект
    });
}
// Функція для відображення інформації про кота за ID зображення
function displayCatInfoById(imageId, breeds) {
  const selectedBreed = breeds[0]; // Отримуємо першу породу з масиву breeds (може бути потрібно розширити логіку для роботи з іншими породами)
  const catInfo = document.querySelector('.info'); // Знаходимо DOM елемент для відображення інформації про кота
  const { id, url } = selectedBreed; // Отримуємо ID та URL породи

  // Порівнюємо ID зображення з ID породи та виводимо інформацію, якщо вони співпадають
  if (id === imageId) {
    catInfo.innerHTML = `
		 <div class="info">
			<h1>${selectedBreed.name}</h1>
			<p>${selectedBreed.description}</p>
			<p><i><b>Life_span: </b></i>${selectedBreed.life_span} years</p>
			<p><i><b>Temperament:</b></i> ${selectedBreed.temperament}</p>
		 </div>
	  `;

    catInfo.classList.remove('is-hidden'); // Відображення блоку інформації про кота
  } else {
    catInfo.classList.add('is-hidden'); // Приховуємо блок інформації про кота, якщо ID не співпадають
  }
}
// // Функція для відображення інформації про породу кота
// function displayBreedInfo(breedId) {
// 	fetch(`${base_url}${end_point}/${breedId}?api_key=${api_key}`)
// 	  .then(response => response.json())
// 	  .then(breedData => {
// 		 const breed = breedData[0];

{
  //    <div class="info">
  //   <h1>${breeds[0].name}</h1>
  //   <p>${breeds[0].description}</p>
  //   <p><i><b>Life_span: </b></i>${breeds[0].life_span} years</p>
  //   <p><i><b>Temperament:</b></i> ${breeds[0].temperament}</p>
  //   </div>
}

// // Функція для відображення інформації про породу кота
// function displayBreedInfo(breedId) {
// 	fetch(`${base_url}${end_point}/${breedId}?api_key=${api_key}`)
// 	  .then(response => response.json())
// 	  .then(breedData => {
// 		 const breed = breedData[0];

// 		 // Відображення інформації про кота та породу
// 		 catInfo.innerHTML = `
// 			<div class="img">
// 			  <img src="${url}" id="${id}" width="${width}" />
// 			</div>
// 			<div class="info">
// 			  <h1>${breed.name}</h1>
// 			  <p>${breed.description}</p>
// 			  <p><i><b>Life_span:</b></i> ${breed.life_span} years</p>
// 			  <p><i><b>Temperament:</b></i> ${breed.temperament}</p>
// 			</div>
// 		 `;
// 		 catInfo.classList.remove('is-hidden'); // Відобразити інформацію про кота та породу
// 	  })
// 	  .catch(onErrorFetch);
//  }

//  // Оновлений обробник події вибору породи кота
//  function onSelectBreedCats(evt) {
// 	loader.classList.remove('is-hidden'); // Відобразити завантажувач
// 	select.classList.add('is-hidden'); // Приховати селект
// 	catInfo.classList.add('is-hidden'); // Приховати інформацію про кота

// 	// Отримання інформації про кота обраної породи
// 	const breedId = evt.target.value;
// 	fetchCatByBreed(breedId)
// 	  .then(data => {
// 		 const { url, id, width } = data[0];

// 		 // Виклик функції для відображення інформації про породу кота
// 		 displayBreedInfo(breedId);
// 	  })
// 	  .catch(onErrorFetch)
// 	  .finally(() => {
// 		 loader.classList.add('is-hidden'); // Приховати завантажувач
// 		 select.classList.remove('is-hidden'); // Відобразити селект
// 	  });
//  }
