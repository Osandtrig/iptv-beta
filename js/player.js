
var player = videojs('player');

function playChannel(url){

player.src({
src: url,
type: "application/x-mpegURL"
});

player.play();

}
