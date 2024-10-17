const defaultCity = "Islamabad";
const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
let userMessage = null;
let isResponseGenerating = false;
const WEATHER_API_KEY = "2d8799b2de2227bba0eb1c76ede71882"; // OpenWeatherMap API key
const API_KEY = "AIzaSyA3WKYFSixfc2EBlva8rCmJiv_hQMFn03g"; // gemini API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`; // Use backticks for template literal

// Create chat message element
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

//this func does not work
const showTypingEffect = (text, textElement) => {
  const words = text.split(" ");
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    textElement.innerText +=
      (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];

    // Once all words are typed out
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
    }

    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
};

async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    if (data.cod === 200) {
      return `Current weather in ${city}:
  Temperature: ${data.main.temp}°C
  Description: ${data.weather[0].description}
  Humidity: ${data.main.humidity}%
  Wind Speed: ${data.wind.speed} m/s`;
    } else {
      return `Sorry, I couldn't fetch weather data for ${city}.`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return "Sorry, there was an error fetching the weather data.";
  }
}

// Generate the API response
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");

  try {
    // Send request to API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Get and display the response
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(
      /\*\*(.*?)\*\*/g,
      "$1"
    );
    showTypingEffect(apiResponse, textElement);
  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message;
    incomingMessageDiv.classList.add("error"); // Add error class for styling
  }
};

const handleOutgoingChat = async () => {
  userMessage =
    typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return;

  isResponseGenerating = true;

  // Display user message
  const outgoingHtml = `<div class="message-content">
                            <img class="avatar" src="user.jpeg" alt="User Avatar">
                            <p class="text"></p>
                          </div>`;
  const outgoingMessageDiv = createMessageElement(outgoingHtml, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);

  typingForm.reset();
  chatContainer.scrollTo(0, chatContainer.scrollHeight);

  // Prepare bot response
  const incomingHtml = `<div class="message-content">
                            <img class="avatar" src="gemini.svg" alt="Gemini avatar">
                            <p class="text"></p>
                          </div>`;
  const incomingMessageDiv = createMessageElement(incomingHtml, "incoming");
  chatContainer.appendChild(incomingMessageDiv);

  let botResponse;
  const lowercaseMessage = userMessage.toLowerCase();

  if (lowercaseMessage.includes("weather")) {
    // Extract city name from the message
    const cityMatch = lowercaseMessage.match(
      /weather(?:\s+in|\s+of|\s+for)?\s+([a-z]+)/
    );
    let city;
    if (cityMatch && cityMatch[1]) {
      city = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1); // Capitalize first letter
    } else {
      city = defaultCity; // Use the default city if no city is specified
    }
    botResponse = await fetchWeatherData(city);
    if (city === defaultCity) {
      botResponse = `${botResponse}`;
    }
  } else {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);
      botResponse = data?.candidates[0].content.parts[0].text.replace(
        /\*\*(.*?)\*\*/g,
        "$1"
      );
    } catch (error) {
      botResponse = `Error: ${error.message}`;
      incomingMessageDiv.classList.add("error");
    }
  }

  const textElement = incomingMessageDiv.querySelector(".text");
  showTypingEffect(botResponse, textElement);
};

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChat();
});

// Initialize VanillaTilt on the weather data section
VanillaTilt.init(document.querySelector(".weather-data"), {
  max: 2,
  speed: 200,
});

// Initialize VanillaTilt on each chart
const charts = document.querySelectorAll(".chart");
charts.forEach((chart) => {
  VanillaTilt.init(chart, {
    max: 5,
    speed: 300,
  });
});

// Initialize VanillaTilt on each weather table
const tables = document.querySelectorAll(".weather-table");
tables.forEach((table) => {
  VanillaTilt.init(table, {
    max: 3,
    speed: 12,
  });
});

// Add mousemove event for weather-data section
const weatherData = document.querySelector(".weather-data");
weatherData.addEventListener("mousemove", (e) => {
  let x = e.pageX - weatherData.offsetLeft;
  let y = e.pageY - weatherData.offsetTop;
  weatherData.style.setProperty("--x", `${x}px`);
  weatherData.style.setProperty("--y", `${y}px`);
});

// Sidebar toggle functionality
const hamburgerMenu = document.querySelector(".hamburger-menu");
const closeSidebar = document.querySelector(".close-sidebar");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

function toggleSidebar() {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

hamburgerMenu.addEventListener("click", toggleSidebar);
closeSidebar.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

// Fetch weather data on page load and on search
document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "2d8799b2de2227bba0eb1c76ede71882";
  const cityInput = document.getElementById("cityInput");
  const searchBtn = document.getElementById("search-btn");
  const weatherDataDiv = document.querySelector(".weather-data");
  const weatherTableDiv = document.querySelector(".weather-table-container");

  const weatherGif = {
    clear: "sunny.gif",
    cloudy: "cloudy.gif",
    rain: "rainy.gif",
    drizzle: "drizzle.gif",
    thunderstorm: "thunderstorm.gif",
    snow: "snow.gif",
    atmosphere: "foggy.gif",
  };

  let barChart, doughnutChart, lineChart;

  // City not found popup
  const cityNotFoundPopup = document.getElementById("cityNotFoundPopup");
  const closePopupBtn = document.getElementById("closePopupBtn");

  closePopupBtn.addEventListener("click", () => {
    cityNotFoundPopup.style.display = "none";
  });

  // Constants for pagination
  let currentPage = 1;
  const itemsPerPage = 10;
  let originalData = []; // Store original weather data
  let filteredData = []; // Store filtered data for pagination

  async function fetchWeather(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === "200") {
        displayWeather(data);
        updateBackgroundGif(data);
        updateCharts(data);
        displayWeatherTable(data);
      } else {
        showCityNotFoundPopup();
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later.");
    }
  }

  function displayWeather(data) {
    const city = data.city.name;
    const tempCelsius = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;
    const description = data.list[0].weather[0].description;
    const iconCode = data.list[0].weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherDataDiv.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
            <div id="weather-grid">
                <p id="city">${city}</p>
                <p id="temp">
                    <button id="temp-toggle"><i class="fas fa-sync-alt"></i></button>
                    <span id="temperature-value">${tempCelsius.toFixed(
                      1
                    )}</span><span id="temp-unit">°C</span> 
                </p>
                <p id="humidity">
                    <i class="fas fa-tint" style="margin-right: 5px; color: #00e6f7;"></i>
                    Humidity: ${humidity}% &nbsp; 
                    <i class="fas fa-wind" style="margin-right: 5px; color: #fac77b;"></i>
                    Wind Speed: ${windSpeed} m/s
                </p>
                <p id="description">
                    <img id="temp_img" src="${iconUrl}" alt="${description}" style="vertical-align: middle; margin-left: 5px;" />${description}
                </p>
            </div>
        `;

    addTemperatureConversion(tempCelsius);
  }

  function addTemperatureConversion(tempCelsius) {
    const tempToggleBtn = document.getElementById("temp-toggle");
    const tempValueElement = document.getElementById("temperature-value");
    let isCelsius = true; // Track the current temperature unit

    // Set the initial button icon and unit
    tempToggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';

    tempToggleBtn.addEventListener("click", () => {
      if (isCelsius) {
        const tempFahrenheit = (tempCelsius * 9) / 5 + 32;
        tempValueElement.innerText = tempFahrenheit.toFixed(1);
        tempToggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i>'; // Keep the icon same (you can change it if needed)
        document.getElementById("temp-unit").innerText = "°F"; // Change the unit to Fahrenheit
      } else {
        tempValueElement.innerText = tempCelsius.toFixed(1);
        tempToggleBtn.innerHTML = '<i class="fas fa-sync-alt"></i>'; // Keep the icon same (you can change it if needed)
        document.getElementById("temp-unit").innerText = "°C"; // Change the unit back to Celsius
      }

      isCelsius = !isCelsius; // Toggle the unit
    });
  }

  // Function to show "City not found" popup
  function showCityNotFoundPopup() {
    cityNotFoundPopup.style.display = "block";
  }

  // Function to update background based on weather condition
  function updateBackgroundGif(data) {
    const weatherCondition = data.list[0].weather[0];
    const conditionId = weatherCondition.id;

    let gifCategory = "clear"; // Default gif

    if (conditionId >= 200 && conditionId < 300) {
      gifCategory = "thunderstorm";
    } else if (conditionId >= 300 && conditionId < 400) {
      gifCategory = "drizzle";
    } else if (conditionId >= 500 && conditionId < 600) {
      gifCategory = "rain";
    } else if (conditionId >= 600 && conditionId < 700) {
      gifCategory = "snow";
    } else if (conditionId >= 700 && conditionId < 800) {
      gifCategory = "atmosphere";
    } else if (conditionId === 800) {
      gifCategory = "clear";
    } else if (conditionId > 800 && conditionId < 900) {
      gifCategory = "cloudy";
    }

    const body = document.querySelector("body");
    const gif = weatherGif[gifCategory] || "sunny.gif";
    body.style.background = `url('${gif}') no-repeat center center/cover`;
  }

  // Function to update charts
  function updateCharts(data) {
    const temperatures = data.list
      .slice(0, 5)
      .map((forecast) => forecast.main.temp);
    const weatherConditions = data.list
      .slice(0, 5)
      .map((forecast) => forecast.weather[0].main);
    const conditionCounts = {};

    weatherConditions.forEach((condition) => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
    clearCharts();

    const ctxBar = document.getElementById("barChart").getContext("2d");
    const ctxDoughnut = document
      .getElementById("doughnutChart")
      .getContext("2d");
    const ctxLine = document.getElementById("lineChart").getContext("2d");

    barChart = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatures,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    });

    doughnutChart = new Chart(ctxDoughnut, {
      type: "doughnut",
      data: {
        labels: Object.keys(conditionCounts),
        datasets: [
          {
            data: Object.values(conditionCounts),
            backgroundColor: [
              "#ffcd56",
              "#ff6384",
              "#36a2eb",
              "#cc65fe",
              "#ff9f40",
            ],
          },
        ],
      },
    });

    lineChart = new Chart(ctxLine, {
      type: "line",
      data: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatures,
            borderColor: "rgba(153, 102, 255, 1)",
            fill: false,
            tension: 0.1,
          },
        ],
      },
    });
  }

  function clearCharts() {
    if (barChart) barChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();
  }

  function displayWeatherTable(data) {
    originalData = data.list;
    filteredData = [...originalData];

    renderTable(currentPage);
  }

  // Function to render the weather table
  function renderTable(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temperature (°C)</th>
                        <th>Humidity (%)</th>
                        <th>Wind Speed (m/s)</th>
                        <th>Weather</th>
                    </tr>
                </thead>
                <tbody>
        `;

    paginatedData.forEach((forecast) => {
      const date = new Date(forecast.dt_txt).toLocaleString();
      const temp = forecast.main.temp;
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;
      const weather = forecast.weather[0].description;

      tableHtml += `
                <tr>
                    <td>${date}</td>
                    <td>${temp}°C</td>
                    <td>${humidity}%</td>
                    <td>${windSpeed} m/s</td>
                    <td>${weather}</td>
                </tr>
            `;
    });

    tableHtml += "</tbody></table>";
    weatherTableDiv.innerHTML = tableHtml;

    // Update pagination info
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    document.getElementById(
      "pageInfo"
    ).textContent = `Page ${page} of ${totalPages}`;

    // Disable/enable pagination buttons based on current page
    document.getElementById("prevPage").disabled = page === 1;
    document.getElementById("nextPage").disabled = page === totalPages;
  }

  function sortData() {
    const sortBy = document.getElementById("sortBy").value;

    switch (sortBy) {
      case "temperatureAsc":
        clearFilters();
        filteredData.sort((a, b) => a.main.temp - b.main.temp);
        break;

      case "temperatureDesc":
        clearFilters();
        filteredData.sort((a, b) => b.main.temp - a.main.temp);
        break;

      case "highesttemp":
        clearFilters();
        const highestTempDay = filteredData.reduce((prev, current) =>
          prev.main.temp > current.main.temp ? prev : current
        );

        filteredData = [highestTempDay];
        break;

      case "lowesttemp":
        clearFilters();
        const lowestTempDay = filteredData.reduce((prev, current) =>
          prev.main.temp > current.main.temp ? prev : current
        );

        filteredData = [lowestTempDay];
        break;
      case "Norain":
        clearFilters();
        filteredData = filteredData.filter((entry) =>
          entry.weather.some((condition) =>
            condition.description.includes("rain")
          )
        );
        break;

      default:
        break;
    }
  }

  function clearFilters() {
    filteredData = [...originalData]; // Reset filtered data to original
    currentPage = 1; // Reset to the first page
    renderTable(currentPage); // Re-render the table
    document.getElementById("sortBy").value = "default"; // Reset sort dropdown
  }

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable(currentPage);
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    renderTable(currentPage);
  });
  document.getElementById("applySort").addEventListener("click", () => {
    sortData();
    currentPage = 1;
    renderTable(currentPage);
  });
  document.getElementById("clearFilters").addEventListener("click", () => {
    clearFilters();
  });

  fetchWeather(defaultCity);

  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
    }
  });
});
