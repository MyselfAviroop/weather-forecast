const apiKey = '6f2609f1463d0ee51b1b597c7ff69070';
let map;

function initializeMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); // Default view for India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    enableDoubleClickWeather();
}

function enableDoubleClickWeather() {
    map.on('dblclick', async (event) => {
        const { lat, lng } = event.latlng;

        const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiURL);
            if (!response.ok) throw new Error('Failed to fetch weather data');

            const data = await response.json();
            const city = data.name || 'Unknown Location';

            // Add Marker
            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<b>${city}</b><br>Lat: ${lat.toFixed(2)}, Lon: ${lng.toFixed(2)}`)
                .openPopup();

            // Display Weather Data
            displayWeather(data);
        } catch (error) {
            alert(error.message);
        }
    });
}

function displayWeather(data) {
    const sidebar = document.getElementById('sidebar');
    const sidebarcity = document.getElementById('sidebarcity');
    const sidebarTemperature = document.getElementById('sidebarTemperature');
    const sidebarHumidity = document.getElementById('sidebarHumidity');
    const sidebarWindSpeed = document.getElementById('sidebarWindSpeed');
    const sidebarForecast = document.getElementById('sidebarForecast');
    const sidebarWeatherIcon = document.getElementById('sidebarWeatherIcon');

    // Log to verify function execution
    console.log('Updating Sidebar with Weather Data:', data);

    // Update sidebar content
    sidebarcity.textContent = `City: ${data.name}`;
    sidebarTemperature.textContent = `Temperature: ${data.main.temp}°C`;
    sidebarHumidity.textContent = `Humidity: ${data.main.humidity}%`;
    sidebarWindSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    sidebarForecast.textContent = `Forecast: ${data.weather[0].description}`;
    sidebarWeatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    sidebarWeatherIcon.alt = data.weather[0].description;

    // Show sidebar
    sidebar.classList.add('open');
    console.log('Sidebar Opened');
}

// Fetch weather by city name
document.getElementById('searchButton').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return alert('Please enter a city name.');

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        const { lat, lon } = data.coord;

        map.setView([lat, lon], 13);
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${city}</b><br>Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`)
            .openPopup();

        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
});

// Close Sidebar
document.getElementById('closeSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    console.log('Sidebar Closed');
});

// Initialize the map
initializeMap();  