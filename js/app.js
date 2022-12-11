const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');

// update UI
const updateUI = (data) => {
	// destructure properties
	const { cityDetails, weather } = data;

	// update details template
	details.innerHTML = `
        <h2 class="city-name">${cityDetails.EnglishName}</h2>
        <p class="weather-condition">${weather.WeatherText}</p>
        <h2 class="temp">${weather.Temperature.Metric.Value} &deg;C</h2>
    `;

	// update day/night image
	let timeSrc = null;
	weather.IsDayTime ? (timeSrc = 'imgs/day.svg') : (timeSrc = 'imgs/night.svg');
	time.setAttribute('src', timeSrc);

	if (card.classList.contains('hidden')) {
		card.classList.remove('hidden');
	}

	// add icon for weather type
	const iconSrc = `imgs/icons/${weather.WeatherIcon}.svg`;
	icon.setAttribute('src', iconSrc);
};

const updateCity = async (city) => {
	// make request for city
	const cityDetails = await getCity(city);

	// get weather for city
	const weather = await getWeather(cityDetails.Key);

	return { cityDetails, weather };
};

cityForm.addEventListener('submit', (e) => {
	// prevent default action
	e.preventDefault();

	// get user input
	const city = cityForm.city.value.trim().toLowerCase();

	// reset form field
	cityForm.reset();

	// update city ui
	updateCity(city)
		.then((data) => updateUI(data))
		.catch((err) => console.log(err));

	// Save to local storage
	localStorage.setItem('city', city);
});

// reload from local storage
if (localStorage.getItem('city')) {
	updateCity(localStorage.getItem('city'))
		.then((data) => updateUI(data))
		.catch((err) => console.log(err));
}
