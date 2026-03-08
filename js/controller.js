
window.onload = function(){

const channelList = document.getElementById("channelList");

channels.forEach(function(channel){

let button = document.createElement("button");

button.innerText = channel.name;

button.onclick = function(){
playChannel(channel.stream);
};

channelList.appendChild(button);

});

};
