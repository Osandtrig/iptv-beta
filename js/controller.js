
async function loadPlaylist(){

const url = document.getElementById("m3uUrl").value;

const response = await fetch(url);
const text = await response.text();

parseM3U(text);

}

function parseM3U(data){

channels = [];

const lines = data.split("\n");

for(let i=0;i<lines.length;i++){

if(lines[i].startsWith("#EXTINF")){

let name = lines[i].split(",")[1];
let stream = lines[i+1];

channels.push({
name:name,
logo:"",
stream:stream
});

}

}

renderChannels();

}

function renderChannels(){

const list = document.getElementById("channelList");
list.innerHTML="";

channels.forEach(channel=>{

let card=document.createElement("div");
card.className="channel-card";

let name=document.createElement("p");
name.innerText=channel.name;

card.appendChild(name);

card.onclick=()=>playChannel(channel.stream);

list.appendChild(card);

});

}
