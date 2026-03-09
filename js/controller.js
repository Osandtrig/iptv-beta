
const video = document.getElementById("videoPlayer")
const loadBtn = document.getElementById("loadPlaylist")
const urlInput = document.getElementById("playlistUrl")
const channelList = document.getElementById("channelList")

loadBtn.addEventListener("click", loadPlaylist)

async function loadPlaylist(){

const url = urlInput.value.trim()

if(!url){

alert("Pega una URL .m3u primero")
return

}

try{

const response = await fetch(url)
const text = await response.text()

parseM3U(text)

}catch(err){

alert("Error cargando la lista")

}

}



function parseM3U(data){

const lines = data.split("\n")

let channels = []

for(let i=0;i<lines.length;i++){

if(lines[i].startsWith("#EXTINF")){

const info = lines[i]
const url = lines[i+1]?.trim()

if(!url) continue

const name = info.split(",")[1] || "Canal"
const countryMatch = info.match(/tvg-country="(.*?)"/)
const country = countryMatch ? countryMatch[1] : "Otros"

channels.push({

name,
url,
country

})

}

}

renderChannels(channels)

}



function renderChannels(channels){

channelList.innerHTML = ""

const countries = {}

channels.forEach(c=>{

if(!countries[c.country]){

countries[c.country] = []

}

countries[c.country].push(c)

})


Object.keys(countries).sort().forEach(country=>{

const section = document.createElement("div")
section.className = "country-section"

const header = document.createElement("div")
header.className = "country-header"
header.innerHTML = `${country} (${countries[country].length} canales)`

const grid = document.createElement("div")
grid.className = "country-channels"

header.addEventListener("click",()=>{

grid.classList.toggle("open")

})


countries[country].forEach(channel=>{

const card = document.createElement("div")
card.className = "channel-card"

card.innerHTML = `<p>${channel.name}</p>`

card.onclick = ()=>{

video.src = channel.url
video.play()

}

grid.appendChild(card)

})


section.appendChild(header)
section.appendChild(grid)

channelList.appendChild(section)

})

}
