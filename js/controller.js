
// controller.js completo con nombres de países

const video = document.getElementById("videoPlayer"); 
const loadBtn = document.getElementById("loadPlaylist");
const urlInput = document.getElementById("playlistUrl");
const channelList = document.getElementById("channelList");

loadBtn.addEventListener("click", loadPlaylist);

async function loadPlaylist() {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Pega una URL .m3u primero");
        return;
    }

    try {
        const response = await fetch(url);
        const text = await response.text();
        parseM3U(text);
    } catch (err) {
        console.error(err);
        alert("Error cargando la lista");
    }
}

// === PARSER M3U MEJORADO CON NOMBRES DE PAÍS ===
function parseM3U(data) {
    const lines = data.split("\n");
    let channels = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
            const info = lines[i];
            const streamUrl = lines[i + 1]?.trim();
            if (!streamUrl) continue;

            const name = info.split(",")[1] || "Canal";

            // === Detección de país usando la función nombrePaisPorCodigo ===
            let country = "Otros";

            const countryMatch = info.match(/tvg-country="(.*?)"/i);
            if (countryMatch && countryMatch[1]) {
                country = nombrePaisPorCodigo(countryMatch[1].toUpperCase());
            } else {
                const idMatch = info.match(/tvg-id="(.*?)"/i);
                if (idMatch && idMatch[1]) {
                    const id = idMatch[1].toLowerCase();
                    // Mapear sufijos a nombre de país
                    if (id.includes(".us")) country = "Estados Unidos";
                    else if (id.includes(".es")) country = "España";
                    else if (id.includes(".br")) country = "Brasil";
                    else if (id.includes(".ar")) country = "Argentina";
                    else country = "Otros"; // fallback
                }
            }

            channels.push({
                name: name,
                url: streamUrl,
                country: country
            });
        }
    }

    renderChannels(channels);
}

// === FUNCION AUXILIAR PARA MAPEAR CÓDIGOS A NOMBRES DE PAÍS ===
function nombrePaisPorCodigo(code) {
    const mapa = {
        "AL": "Albania",
        "DZ": "Argelia",
        "AR": "Argentina",
        "AU": "Australia",
        "AT": "Austria",
        "BA": "Bosnia y Herzegovina",
        "BE": "Bélgica",
        "BR": "Brasil",
        "BG": "Bulgaria",
        "CA": "Canadá",
        "CL": "Chile",
        "CO": "Colombia",
        "CR": "Costa Rica",
        "CY": "Chipre",
        "CZ": "República Checa",
        "DE": "Alemania",
        "DK": "Dinamarca",
        "DO": "República Dominicana",
        "EC": "Ecuador",
        "EG": "Egipto",
        "ES": "España",
        "FI": "Finlandia",
        "FR": "Francia",
        "GR": "Grecia",
        "HR": "Croacia",
        "HU": "Hungría",
        "ID": "Indonesia",
        "IE": "Irlanda",
        "IL": "Israel",
        "IN": "India",
        "IT": "Italia",
        "JM": "Jamaica",
        "JP": "Japón",
        "KE": "Kenia",
        "KR": "Corea del Sur",
        "LT": "Lituania",
        "LV": "Letonia",
        "MT": "Malta",
        "MX": "México",
        "MY": "Malasia",
        "NG": "Nigeria",
        "NL": "Países Bajos",
        "NO": "Noruega",
        "NZ": "Nueva Zelanda",
        "PA": "Panamá",
        "PE": "Perú",
        "PH": "Filipinas",
        "PK": "Pakistán",
        "PL": "Polonia",
        "PT": "Portugal",
        "RO": "Rumanía",
        "RS": "Serbia",
        "SA": "Arabia Saudita",
        "SE": "Suecia",
        "SG": "Singapur",
        "SK": "Eslovaquia",
        "SV": "El Salvador",
        "US": "Estados Unidos",
        "UK": "Reino Unido"
    };
    return mapa[code] || "Otros";
}

// === RENDERIZADO DE CANALES ===
function renderChannels(channels) {
    channelList.innerHTML = "";

    const countries = {};

    channels.forEach(c => {
        if (!countries[c.country]) {
            countries[c.country] = [];
        }
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

        header.addEventListener("click", () => {
            grid.classList.toggle("open");
        });

        countries[country].forEach(channel => {
            const card = document.createElement("div");
            card.className = "channel-card";
            card.innerHTML = `<p>${channel.name}</p>`;
            card.onclick = () => {
                video.src = channel.url;
                video.play();
            };
            grid.appendChild(card);
        });

        section.appendChild(header);
        section.appendChild(grid);
        channelList.appendChild(section);
    });
}
