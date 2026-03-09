
// controller.js
const video = document.getElementById("videoPlayer"); 
const loadBtn = document.getElementById("loadPlaylist");
const urlInput = document.getElementById("playlistUrl");
const channelList = document.getElementById("channelList");
const filterCountry = document.getElementById("filterCountry");
const filterCategory = document.getElementById("filterCategory");

let channels = [];
let filteredChannels = [];

loadBtn.addEventListener("click", loadPlaylist);
filterCountry.addEventListener("change", applyFilters);
filterCategory.addEventListener("change", applyFilters);

async function loadPlaylist() {
    const url = urlInput.value.trim();
    if (!url) return alert("Pega una URL .m3u primero");

    try {
        const response = await fetch(url);
        const text = await response.text();
        parseM3U(text);
    } catch (err) {
        console.error(err);
        alert("Error cargando la lista");
    }
}

// === PARSER M3U CON LOGOS, CATEGORÍAS Y PAÍS ===
function parseM3U(data) {
    const lines = data.split("\n");
    channels = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
            const info = lines[i];
            const streamUrl = lines[i + 1]?.trim();
            if (!streamUrl) continue;

            const name = info.split(",")[1] || "Canal";

            // país
            let country = "Otros";
            const countryMatch = info.match(/tvg-country="(.*?)"/i);
            if (countryMatch && countryMatch[1]) country = nombrePaisPorCodigo(countryMatch[1].toUpperCase());

            // logo y categoría
            const logo = info.match(/tvg-logo="(.*?)"/i)?.[1] || "";
            const category = info.match(/group-title="(.*?)"/i)?.[1] || "Sin categoría";

            channels.push({name, url: streamUrl, country, logo, category});
        }
    }

    populateFilters();
    applyFilters();
}

// === FUNCION AUXILIAR PARA MAPEAR CÓDIGOS A NOMBRES DE PAÍS ===
function nombrePaisPorCodigo(code) {
    const mapa = {
        "AR": "Argentina","BR": "Brasil","ES": "España","US": "Estados Unidos",
        "MX": "México","CL": "Chile","CO": "Colombia","FR": "Francia",
        "IT": "Italia","DE": "Alemania","UK": "Reino Unido"
    };
    return mapa[code] || "Otros";
}

// === FILTROS DINÁMICOS ===
function populateFilters() {
    const countries = ["Todos", ...new Set(channels.map(c => c.country))];
    const categories = ["Todos", ...new Set(channels.map(c => c.category))];

    filterCountry.innerHTML = countries.map(c => `<option>${c}</option>`).join("");
    filterCategory.innerHTML = categories.map(c => `<option>${c}</option>`).join("");
}

function applyFilters() {
    const country = filterCountry.value;
    const category = filterCategory.value;

    filteredChannels = channels.filter(c => 
        (country === "Todos" || c.country === country) &&
        (category === "Todos" || c.category === category)
    );

    renderChannels(filteredChannels);
}

// === RENDERIZADO DE CANALES ===
function renderChannels(channelsToRender) {
    channelList.innerHTML = "";

    const countries = {};
    channelsToRender.forEach(c => {
        if (!countries[c.country]) countries[c.country] = [];
        countries[c.country].push(c);
    });

    Object.keys(countries).sort().forEach(country => {
        const section = document.createElement("div");
        section.className = "country-section";

        const header = document.createElement("div");
        header.className = "country-header";
        header.innerHTML = `${country} (${countries[country].length} canales)`;

        const grid = document.createElement("div");
        grid.className = "country-channels";

        header.addEventListener("click", () => grid.classList.toggle("open"));

        countries[country].forEach(channel => {
            const card = document.createElement("div");
            card.className = "channel-card";
            card.innerHTML = `
                ${channel.logo ? `<img src="${channel.logo}" alt="${channel.name}">` : ""}
                <p>${channel.name}</p>
                <small>${channel.category}</small>
            `;
            card.onclick = () => {
                playChannel(channel.url);
                saveHistory(channel);
            };
            grid.appendChild(card);
        });

        section.appendChild(header);
        section.appendChild(grid);
        channelList.appendChild(section);
    });
}

// === HISTORIAL LOCALSTORAGE ===
function saveHistory(channel) {
    let history = JSON.parse(localStorage.getItem("history")||"[]");
    history = history.filter(c => c.url !== channel.url);
    history.unshift(channel);
    if(history.length>20) history.pop();
    localStorage.setItem("history", JSON.stringify(history));
}


