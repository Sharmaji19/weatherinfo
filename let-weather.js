// Assume the country_code is a ISO 3166-1 alpha-2 string (eg: "US")
// copied from https://gist.github.com/theory-of-soul/220dfe7a7f383325510be31ffb0d362e
function country2emoji(country_code) {
	var OFFSET = 127397;
	var cc = country_code.toUpperCase();
	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}
			return arr2;
		} else {
			return Array.from(arr);
		}
	}
	return /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint.apply(String, _toConsumableArray([].concat(_toConsumableArray(cc)).map(function (c) {
		return c.charCodeAt() + OFFSET;
	}))) : null;
}



function getTimeOfDay() {
	var timesOfDay = [
		[0, 4, "night"],
		[5, 11, "morning"],          //Store messages in an array
		[12, 17, "afternoon"],
		[18, 24, "night"]
	],
	hr = new Date().getHours();

	for (var i = 0; i < timesOfDay.length; i++) {
		if (hr >= timesOfDay[i][0] && hr <= timesOfDay[i][1]) {
			console.log(timesOfDay[i][2]);
			return timesOfDay[i][2];
		}
	}
}

let weather = {
	apiKey: "2d7e36e83283736d5ee4139300b8118c",
	fetchWeather: function (city) {
		fetch(
			"https://api.openweathermap.org/data/2.5/weather?q=" +
			city +
			"&units=metric&appid=" +
			this.apiKey
		)
			.then((response) => {
				if (!response.ok) {
					alert("No weather found.");
					throw new Error("No weather found.");
				}
				return response.json();
			})
			.then((data) => this.displayWeather(data));
	},
	displayWeather: function (data) {
		const { name } = data;
		const { icon, description } = data.weather[0];
		const { temp, humidity } = data.main;
		const { speed } = data.wind;
		const country = data.sys.country;
		console.log(data)
		document.querySelector(".city").innerText = "Weather in " + name + ", " + country + " " + country2emoji(country);
		document.querySelector(".icon").src =
			"https://openweathermap.org/img/wn/" + icon + ".png";
		document.querySelector(".description").innerText = description;
		document.querySelector(".temp").innerText = temp + "°C";
		document.querySelector(".humidity").innerText =
			"Humidity: " + humidity + "%";
		document.querySelector(".wind").innerText =
			"Wind speed: " + speed + " km/h";
		document.querySelector(".weather").classList.remove("loading");
		// get screen size for better image fit.
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

		// added better bg image support, uncomment to see each possible versions.

		// const image = `https://source.unsplash.com/${vw}x${vh}/?${name}`;

		// suggestion: fetch image using description instead of name as name sometimes return 404
		// const image = `https://source.unsplash.com/${vw}x${vh}/?${description}`;
		
		// or pair description with time of day to get better image
		const image = `https://source.unsplash.com/${vw}x${vh}/?${description}, ${getTimeOfDay()}`; // this one is the best in my opinion

		document.body.style.backgroundImage = `url('${image}')`;

	},
	search: function () {
		this.fetchWeather(document.querySelector(".search-bar").value);
	},
};

document.querySelector(".search button").addEventListener("click", function () {
	weather.search();
});

document
	.querySelector(".search-bar")
	.addEventListener("keyup", function (event) {
		if (event.key == "Enter") {
			weather.search();
		}
	});

weather.fetchWeather("Rishra");