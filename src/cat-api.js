// Оголошення базового URL, кінцевих точок та ключа API
const base_url = 'https://api.thecatapi.com/v1'; // Базовий URL API
const end_point = '/breeds'; // Кінцева точка для отримання інформації про породи
const end_point_two = '/images/search'; // Кінцева точка для отримання зображень котів
const api_key = '3a9bcc0c5da34369acb142820232808'; // Ключ API   //6f3bf7a06a84400a8c1181835232108

// Функція для отримання інформації про породи котів
export function fetchBreeds() {
  return fetch(`${base_url}${end_point}?api_key=${api_key}`).then(response => {
    console.log(response); // Виведення об'єкту відповіді в консоль для дебагу
    if (!response.ok) {
      throw new Error(response.statusText); // Обробка помилок відповіді
    }
    return response.json(); // Парсинг відповіді у форматі JSON
  });
}

// Функція для отримання зображення кота за певною породою
export function fetchCatByBreed(breedId) {
  return fetch(
    `${base_url}${end_point_two}?api_key=${api_key}&breed_ids=${breedId}`
  ).then(response => {
    console.log(33333);
    console.log({ response }); // Виведення об'єкту відповіді в консоль для дебагу
    if (!response.ok) {
      throw new Error(response.statusText); // Обробка помилок відповіді
    }
    return response.json(); // Парсинг відповіді у форматі JSON
  });
}
