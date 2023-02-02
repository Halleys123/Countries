'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderCountry = function (data, className = 'country') {
  let languagee = '';
  let currunciee;

  for (const a in data.languages) {
    languagee += data.languages[a] + ', ';
  }
  for (const a in data.currencies) {
    currunciee = data.currencies[a]['name'];
  }

  const HTMLsnip = `<article class="${className} country">
<img class="country__img" src="${data.flags.svg}" />
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
    1
  )} million</p>
  <p class="country__row"><span>🗣️</span>${languagee}</p>
  <p class="country__row"><span>💰</span>${currunciee}</p>
  </div>
</article>`;

  countriesContainer.insertAdjacentHTML('beforeend', HTMLsnip);
  countriesContainer.style.opacity = 1;
};

const getCountryData = function (country) {
  const request = new XMLHttpRequest();

  request.open(
    'GET',
    `https://restcountries.com/v3.1/name/${country}?fullText=true`
  );
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    let neigbour;
    if (data.borders) [neigbour] = data.borders;
    renderCountry(data);
    if (!neigbour) {
      return;
    }
    data.borders.forEach(al => {
      const request2 = new XMLHttpRequest();

      request2.open('GET', `https://restcountries.com/v3.1/alpha/${al}`);
      request2.send();
      request2.addEventListener('load', function () {
        const [data2] = JSON.parse(this.responseText);
        renderCountry(data2, 'neighbour');
      });
    });
  });
};

// getCountryData('india');

//New way of using API
const getJSON = function (url, error = 'Something went wrong') {
  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${error} (${response.status})`);
    }
    return response.json();
  });
};

const getCountryDataModern = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neigbour = data[0].borders;

      neigbour.forEach(countr => {
        fetch(`https://restcountries.com/v3.1/alpha/${countr}`)
          .then(response => response.json())
          .then(response => renderCountry(response[0], 'neighbour'));
      });
    })
    .catch(err => alert(err));
};

btn.addEventListener('click', function () {
  getCountryDataModern('india');
});
getCountryData(prompt('Enter A country: '));
// console.log();

//Coding Challenge
const getMylocation = function () {
  const cor = navigator.geolocation.getCurrentPosition(pos =>
    console.log(pos.coords)
  );
  let coords;
  cor.addEventListener('load', function () {
    const { latitude } = cor.coords.latitude;
    const { longitude } = cor.coords.longitude;
    coords = [latitude, longitude];
    console.log(coords.toString());
    return coords;
  });
};
//getMylocation();
