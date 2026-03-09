

let channels = [];


/* cargar lista IPTV */

async function loadPlaylist(){

const url = document.getElementById("m3uUrl").value;

if(!url){

alert("Ingresa una URL de lista IPTV");

return;

}

try{

const response = await fetch(url);

const text = await response.text();

parseM3U(text);

}

catch(error){

console.error("Error cargando lista:",error);

alert("No se pudo cargar la lista");

}

}



/* parsear archivo M3U */

function parseM3U(data){

channels = [];

const lines = data.split("\n");

for(let i=0;i<lines.length;i++){

if(lines[i].startsWith("#EXTINF")){

let info = lines[i];

let name = info.split(",")[1] || "Canal";

let stream = lines[i+1];

let countryMatch = info.match(/tvg-country="(.*?)"/);

let country = countryMatch ? countryMatch[1] : "Otros";

channels.push({

name:name.trim(),
country:country.trim(),
stream:stream.trim()

});

}

}

renderCountries();

}



/* agrupar por pais */

function renderCountries(){

const container = document.getElementById("channelList");

container.innerHTML = "";


const countries = {};


channels.forEach(channel=>{

if(!countries[channel.country]){

countries[channel.country] = [];

}

countries[channel.country].push(channel);

});


Object.keys(countries).sort().forEach(country=>{


let section = document.createElement("div");

section.className = "country-section";


let header = document.createElement("div");

header.className = "country-header";

header.innerText = country + " (" + countries[country].length + " canales)";


let list = document.createElement("div");

list.className = "country-channels";


countries[country].forEach(channel=>{


let card = document.createElement("div");

card.className = "channel-card";


let name = document.createElement("p");

name.innerText = channel.name;


card.appendChild(name);


card.onclick = () => playChannel(channel.stream);


list.appendChild(card);

});


header.onclick = () => {

list.classList.toggle("open");

};


section.appendChild(header);

section.appendChild(list);

container.appendChild(section);

});

}

