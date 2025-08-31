(() => {
  const apiKey = "c01a65576b8041f9a92194558252508";

  // Grab elements
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const cityEl = document.getElementById("city1");
  const weatherEl = document.getElementById("weather1");
  const headingEl = document.getElementById("mainHeading");

  // Helper: change background based on weather
  function updateBackground(condition, isDay) {
    const body = document.body;
    condition = condition.toLowerCase();

    if (condition.includes("sunny") || condition.includes("clear")) {
      body.style.background = isDay
        ? "linear-gradient(to bottom, #87CEEB, #f8f9fa)"  // blue sky
        : "linear-gradient(to bottom, #2c3e50, #000000)"; // night
    } else if (condition.includes("cloud")) {
      body.style.background = "linear-gradient(to bottom, #d7d2cc, #304352)"; // cloudy grey
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      body.style.background = "linear-gradient(to bottom, #667db6, #0082c8, #0082c8, #667db6)"; // rainy blue
    } else if (condition.includes("snow")) {
      body.style.background = "linear-gradient(to bottom, #e6dada, #274046)"; // snowy
    } else if (condition.includes("storm") || condition.includes("thunder")) {
      body.style.background = "linear-gradient(to bottom, #232526, #414345)"; // stormy dark
    } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
      body.style.background = "linear-gradient(to bottom, #606c88, #3f4c6b)"; // foggy grey
    } else {
      body.style.background = "#f8f9fa"; // default
    }

    body.style.transition = "background 1s ease"; // smooth transition
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    if (!query) return;

    cityEl.textContent = "Loading...";
    weatherEl.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
    headingEl.textContent = `Weather for ${query}`;

    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.error) {
        const msg = data?.error?.message || res.statusText || "Unknown error";
        throw new Error(msg);
      }

      const w = data.current;
      const loc = data.location;

      cityEl.textContent = `${loc.name}, ${loc.country}`;
      headingEl.textContent = `Weather for ${loc.name}`;
      weatherEl.innerHTML = `
        <img src="https:${w.condition.icon}" alt="${w.condition.text}" width="64" height="64"><br>
        <strong>${w.temp_c}°C</strong> (Feels like ${w.feelslike_c}°C)<br>
        ${w.condition.text}<br>
        Humidity: ${w.humidity}%<br>
        Wind: ${w.wind_kph} kph
      `;

      // 🌈 Change background based on condition
      updateBackground(w.condition.text, w.is_day);

    } catch (err) {
      cityEl.textContent = "Error";
      weatherEl.innerHTML = `<div class="alert alert-danger p-2 m-0">${err.message}</div>`;
      headingEl.textContent = "Weather (Error)";
      console.error("Weather fetch failed:", err);
    }
  });
})();
