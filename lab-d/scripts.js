const API_KEY = 'e06fe05f348c4cb579d5307b8ca57f39';


const inputMiasto = document.getElementById('miasto');
const przycisk = document.getElementById('przycisk');
const sekcjaWyniki = document.getElementById('wyniki');
const sekcjaBlad = document.getElementById('blad');

const elMiastoNazwa = document.getElementById('miasto-nazwa');
const elIkona = document.getElementById('ikona');
const elTemperatura = document.getElementById('temperatura');
const elOpis = document.getElementById('opis');
const elWilgotnosc = document.getElementById('wilgotnosc');
const elWiatr = document.getElementById('wiatr');
const elGodzina = document.getElementById('godzina-label');

const btnLewo  = document.getElementById('lewo');
const btnPrawo = document.getElementById('prawo');


let daneGodzinowe  = [];
let aktualnyIndeks = 0;

function formatujCzas(timestamp) {
  const d = new Date(timestamp * 1000);
  const godz = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${godz}:${min}`;
}

function formatujDate(timestamp) {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
}

const elMain = document.getElementById('main');

const klasyTla = [
  'pogoda-slonecznie',
  'pogoda-noc',
  'pogoda-male-zachmurzenie',
  'pogoda-zachmurzenie',
  'pogoda-deszcz',
  'pogoda-burza',
  'pogoda-snieg',
  'pogoda-mgla',
];

function ustawTlo(ikonaKod) {
  klasyTla.forEach(k => elMain.classList.remove(k));

  const mapa = {
    '01d': 'pogoda-slonecznie',
    '01n': 'pogoda-noc',
    '02d': 'pogoda-male-zachmurzenie',
    '02n': 'pogoda-male-zachmurzenie',
    '03d': 'pogoda-male-zachmurzenie',
    '03n': 'pogoda-male-zachmurzenie',
    '04d': 'pogoda-zachmurzenie',
    '04n': 'pogoda-zachmurzenie',
    '09d': 'pogoda-deszcz',
    '09n': 'pogoda-deszcz',
    '10d': 'pogoda-deszcz',
    '10n': 'pogoda-deszcz',
    '11d': 'pogoda-burza',
    '11n': 'pogoda-burza',
    '13d': 'pogoda-snieg',
    '13n': 'pogoda-snieg',
    '50d': 'pogoda-mgla',
    '50n': 'pogoda-mgla',
  };

  const klasa = mapa[ikonaKod];
  if (klasa) elMain.classList.add(klasa);
}

function wyswietlAktualna(dane) {
  elMiastoNazwa.textContent = `${dane.name}, ${dane.sys.country}`;
  elTemperatura.textContent = `${Math.round(dane.main.temp)}°C`;
  elOpis.textContent = dane.weather[0].description;
  elWilgotnosc.textContent = `Wilgotność: ${dane.main.humidity}%`;
  elWiatr.textContent = `Wiatr: ${Math.round(dane.wind.speed * 3.6)} km/h`;
  elGodzina.textContent = 'Teraz';

  ustawTlo(dane.weather[0].icon);

  elIkona.src = `https://openweathermap.org/img/wn/${dane.weather[0].icon}@2x.png`;
  elIkona.style.display = '';

  sekcjaWyniki.classList.remove('ukryty');
  sekcjaBlad.classList.add('ukryty');
}

function wyswietlPrognoze(index) {
  const d = daneGodzinowe[index];
  if (!d) return;

  elTemperatura.textContent = `${Math.round(d.main.temp)}°C`;
  elOpis.textContent = d.weather[0].description;
  elWilgotnosc.textContent = `Wilgotność: ${d.main.humidity}%`;
  elWiatr.textContent = `Wiatr: ${Math.round(d.wind.speed * 3.6)} km/h`;
  elGodzina.textContent = `${formatujDate(d.dt)} ${formatujCzas(d.dt)}`;

  ustawTlo(d.weather[0].icon);
  elIkona.src = `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`;
}

function pobierzAktualna(miasto) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(miasto)}&appid=${API_KEY}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const dane = JSON.parse(xhr.responseText);
      wyswietlAktualna(dane);

      pobierzPrognozeFetch(miasto);

    } else if (xhr.status === 404) {
      sekcjaBlad.classList.remove('ukryty');
      sekcjaWyniki.classList.add('ukryty');
    }
  };

  xhr.onerror = function () {
    sekcjaBlad.classList.remove('ukryty');
  };

  xhr.send();
}

function pobierzPrognozeFetch(miasto) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(miasto)}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      daneGodzinowe  = data.list;
      aktualnyIndeks = 0;
    })
    .catch(err => {
      console.error('Błąd prognozy:', err);
    });
}

btnLewo.addEventListener('click', () => {
  if (aktualnyIndeks > 0) {
    aktualnyIndeks--;
    wyswietlPrognoze(aktualnyIndeks);
  }
});

btnPrawo.addEventListener('click', () => {
  if (aktualnyIndeks < daneGodzinowe.length - 1) {
    aktualnyIndeks++;
    wyswietlPrognoze(aktualnyIndeks);
  }
});

function onSzukaj() {
  const miasto = inputMiasto.value.trim();
  if (!miasto) return;

  sekcjaWyniki.classList.add('ukryty');
  sekcjaBlad.classList.add('ukryty');

  pobierzAktualna(miasto);
}

przycisk.addEventListener('click', onSzukaj);

inputMiasto.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') onSzukaj();
});
