"use strict";

// const getCountryData = function (country) {
//   //old school AJAX, call country 1
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v2/name/${country}`);
//   request.send();
//   request.addEventListener("load", function () {
//     //need tp store it in an object, it's json at first
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     renderCountry(data);

//     //get neighbor country (2)
//     // const neighbor = data.borders?.[0]; // for countries with no borders
//     // if (!neighbor) return;
//     // const request2 = new XMLHttpRequest();
//     // request2.open("GET", `https://restcountries.com/v2/alpha/${neighbor}`);
//     // request2.send();
//     // request2.addEventListener("load", function () {
//     //   const data2 = JSON.parse(this.responseText);
//     //   renderCountry(data2, "neighbor");
//     // });
//     //now the second call depends on the first call so we know the order
//     //in which the AJAX calls happen we have one callnack inside the other one
//   });
// };
// getCountryData("germany");

//new way

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(
//       // as soon as the promise is fulfilled
//       (response) => {
//         //what if the country name is not real?
//         if (!response.ok) {
//           throw new Error(`Country not found`);
//         }
//         return response.json();
//       },
//     )
//     .then(function (data) {
//       renderCountry(data[0]);
//       //now the nieghbor country
//       const neighbor = data[0].borders[0];
//       if (!neighbor) return;

//       //when we return the method, the fulfilled value of the next then method
//       //will be the fullfiled value of the promise we returned
//       return fetch(`https://restcountries.com/v2/alpha/${neighbor}`);
//     })
//     .then((response) => response.json())
//     .then((data) => renderCountry(data, "neighbor"))
//     .catch((err) =>
//       //handle rejection, it will handle all the errors
//       renderError(`Something went wrong! ${err.message}, try again`),
//     )
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
//   //the callback function we define in finally will always be called,
//   //no matter if the promise is fulfilled or rejected

//   //in order to read the data we need json, this creates a new promise
//   //on that promise we can again call the then method
// };

// const getCountryData = function (country) {
//   getJson(`https://restcountries.com/v2/name/${country}`, `Country not found`)
//     .then(function (data) {
//       renderCountry(data[0]);

//       const neighbor = data[0].borders?.[0];
//       if (!neighbor) {
//         throw new Error("No neighbor found");
//       }

//       return getJson(
//         `https://restcountries.com/v2/alpha/${neighbor}`,
//         "Country not found",
//       );
//     })
//     .then((data) => renderCountry(data, "neighbor"))
//     .catch((err) =>
//       renderError(`Something went wrong! ${err.message}, try again`),
//     )
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

// const whereAmI = function (lat, lng) {
//   const request = fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     .then((res) => {
//       //because it returns undefined after 3 requests
//       if (!res.ok) throw new Error(`Problem with geocoding${res.status}`);
//       return res.json();
//     })
//     .then((data) => {
//       console.log(`you are in ${data.region}, ${data.country}`);
//       return fetch(`https://restcountries.com/v2/name/${data.country}`);
//     })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`Country not found`);
//       }
//       return response.json();
//     })
//     .then((data) => renderCountry(data[0]))
//     .catch((err) =>
//       renderError(`Something went wrong, ${err.message}. Try again`),
//     )
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });

//   console.log(request);
// };
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);

//promisifying
// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     //the first one gets the position so it means the promis
//     //is fulfilled, the second one gives an error
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };
// const whereAmI = function () {
//   getPosition()
//     .then((pos) => {
//       const { latitude: lat, longitude: lng } = pos.coords;
//       return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//     })
//     .then((res) => {
//       if (!res.ok) throw new Error(`Problem with geocoding${res.status}`);
//       return res.json();
//     })
//     .then((data) => {
//       console.log(`you are in ${data.region}, ${data.country}`);
//       return fetch(`https://restcountries.com/v2/name/${data.country}`);
//     })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`Country not found`);
//       }
//       return response.json();
//     })
//     .then((data) => renderCountry(data[0]))
//     .catch((err) =>
//       renderError(`Something went wrong, ${err.message}. Try again`),
//     )
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });

// };
// whereAmI()

//async await

const countriesContainer = document.querySelector(".boxes-wrapper");

const renderCountry = function (data, className = "") {
  const html = `
  <div class= " ${className}">
    <div class="box">
        <div class="flag-box">
          <img src="${data.flag}" alt="flag" />
        </div>
        <div class="info-box">
          <p>${data.name}</p>
          <p>${data.region}</p>
          <p>👫 <span>${(+data.population / 1000000).toFixed(1)}M</span> people</p>
          <p>🗣️ <span>${data.languages[0].name}</span></p>
          <p>💰 <span>${data.currencies[0].name}</span></p>
        </div>
      </div>
      </div>
     `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};
const renderError = function (message) {
  const html = `
    <div class="error">
      <p>⚠️ ${message}</p>
    </div>
  `;
  countriesContainer.insertAdjacentHTML("afterbegin", html);
};

const getJson = function (url, errorMessage = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errorMessage}`);
    }
    return response.json();
  });
};
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const geo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);

    if (!geo.ok) throw new Error("Problem getting location data");

    const dataGeo = await geo.json();

    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.country}`,
    );

    if (!res.ok) throw new Error("Problem getting country");

    const data = await res.json();
    renderCountry(data[0]);

    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    throw err;
  }
};

//returning values from async functions
//city is the resolved value of the function so it's actually the return string we have
//in the fucntion. it returns it
// whereAmI().then((city) => console.log(city));
// turn the above into async await
// the scope of await is async, so if await is not running, nothing runs

(async function () {
  try {
    const city = await whereAmI();
    console.log(city);
  } catch (err) {
    renderError(err.message);
  }
})();

//running promises in parallel
// const get3Countries = async function (c1, c2, c3) {
//   try {
// const { data1 } = await getJson(`https://restcountries.com/v2/name/${c1}`);
// const { data2 } = await getJson(`https://restcountries.com/v2/name/${c2}`);
// const { data3 } = await getJson(`https://restcountries.com/v2/name/${c3}`);
//this function takes an array of promises and returns a new promise
//which will run all the promises at the same time
//it short circuits when one promise rejects
//     const data = await Promise.all([
//       await getJson(`https://restcountries.com/v2/name/${c1}`),
//       await getJson(`https://restcountries.com/v2/name/${c2}`),
//       await getJson(`https://restcountries.com/v2/name/${c3}`),
//     ]);
//     //return a new array of capitals
//     console.log(data.map((d) => d[0].capital));
//   } catch (err) {
//     console.log(err);
//   }
// };
// get3Countries("portugal", "canada", "usa");
