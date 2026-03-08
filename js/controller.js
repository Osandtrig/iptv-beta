window.onload = function(){

const channelList = document.getElementById("channelList");

channels.forEach(function(channel){

let card = document.createElement("div");
card.className = "channel-card";

let logo = document.createElement("img");
logo.src = channel.logo;

let name = document.createElement("p");
name.innerText = channel.name;

card.appendChild(logo);
card.appendChild(name);

card.onclick = function(){
playChannel(channel.stream);
};

channelList.appendChild(card);

});

};
