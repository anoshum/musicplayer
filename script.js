const songs = [
    { title: "Song 1", artist: "Artist 1", src: "songs/song1.mp3" },
    { title: "Song 2", artist: "Artist 2", src: "songs/song2.mp3" },
    { title: "Song 3", artist: "Artist 3", src: "songs/song3.mp3" }
];

let currentSongIndex = 0;
const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");

function updateSongDetails() {
    songTitle.innerText = songs[currentSongIndex].title;
    artistName.innerText = songs[currentSongIndex].artist;
    audioPlayer.src = songs[currentSongIndex].src;
}

// Function to toggle play/pause
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerText = "⏸";
    } else {
        audioPlayer.pause();
        playPauseBtn.innerText = "▶";
    }
}

// Next and Previous song functions
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongDetails();
    audioPlayer.play();
    playPauseBtn.innerText = "⏸";
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSongDetails();
    audioPlayer.play();
    playPauseBtn.innerText = "⏸";
}

// Maintain playback when the screen is off or the tab is hidden
document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audioPlayer.paused) {
        audioPlayer.play();
    }
});

// Prevent browser restrictions (use the wake lock API if supported)
if ("wakeLock" in navigator) {
    let wakeLock = null;
    async function requestWakeLock() {
        try {
            wakeLock = await navigator.wakeLock.request("screen");
            wakeLock.addEventListener("release", () => {
                console.log("Screen Wake Lock Released");
            });
        } catch (err) {
            console.error(`Wake Lock Error: ${err.name}, ${err.message}`);
        }
    }
    requestWakeLock();
}

// Volume control event
volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;
});

// Event Listeners
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Auto play next song when current song ends
audioPlayer.addEventListener("ended", nextSong);

// Initialize the first song
updateSongDetails();
