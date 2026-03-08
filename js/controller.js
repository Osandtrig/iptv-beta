
window.onload = function(){

const list = document.getElementById("channelList");

channels.forEach(channel => {

let card = document.createElement("div");
card.className = "channel-card";

let img = document.createElement("img");
img.src = channel.logo;

let name = document.createElement("p");
name.innerText = channel.name;

card.appendChild(img);
card.appendChild(name);

card.onclick = () => playChannel(channel.stream);

list.appendChild(card);

});

}
