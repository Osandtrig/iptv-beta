
function playChannel(url){
    const video = document.getElementById("videoPlayer");
    if(!video) return console.error("Video player no encontrado");

    video.pause();
    video.src = ""; // limpiar

    if(Hls.isSupported() && url.endsWith(".m3u8")){
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, ()=> video.play());
    } else if(url.endsWith(".mpd")){
        const player = new shaka.Player(video);
        player.load(url).then(()=> video.play())
        .catch(e=> console.error("Error DASH:", e));
    } else {
        video.src = url;
        video.play().catch(()=> console.warn("No se pudo reproducir el video"));
    }
}
