const searchBtn = document.getElementById("search-btn");
const countryInput = document.getElementById("country-input");
const countryInfo = document.getElementById("country-info");
const borderSection = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");
const spinner = document.getElementById("loading-spinner");

searchBtn.addEventListener("click", () => {
    const country = countryInput.value.trim();
    if (country) searchCountry(country);
});

countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const country = countryInput.value.trim();
        if (country) searchCountry(country);
    }
});

async function searchCountry(countryName) {
    try {
        spinner.classList.remove("hidden");
        clearUI();
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error("Country not found");
        const data = await response.json();
        const country = data[0];
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
        `;
        if (country.borders) {
            fetchBorders(country.borders);
        }
    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        spinner.classList.add("hidden");
    }
}

async function fetchBorders(borderCodes) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`);
        if (!response.ok) throw new Error("Error fetching bordering countries");
        const data = await response.json();
        data.forEach(neighbor => {
            const div = document.createElement("div");
            div.classList.add("border-card");
            div.innerHTML = `
                <img src="${neighbor.flags.png}" alt="Flag of ${neighbor.name.common}" width="50">
                <p>${neighbor.name.common}</p>
            `;
            borderSection.appendChild(div);
        });
    } catch (error) {
        console.error("Border fetch error:", error);
    }
}

function clearUI() {
    countryInfo.innerHTML = "";
    borderSection.innerHTML = "";
    errorMessage.textContent = "";
}