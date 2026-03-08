
function playChannel(url){

const video = document.getElementById("videoPlayer");

if(!video){
console.error("Video player no encontrado");
return;
}

if(Hls.isSupported()){

const hls = new Hls();
hls.loadSource(url);
hls.attachMedia(video);

hls.on(Hls.Events.MANIFEST_PARSED,function(){
video.play();
});

}

else if(video.canPlayType("application/vnd.apple.mpegurl")){

video.src = url;
video.addEventListener("loadedmetadata",function(){
video.play();
});

}

}
