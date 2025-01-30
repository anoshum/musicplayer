const songs = [
    { title: "Song 1", artist: "Artist 1", src: "songs/song1.mp3" },
    { title: "Hamari Adhuri Kahani", artist: "Artist 2", src: "songs/Hamari Adhuri Kahani.mp3" },
    { title: "Song 3", artist: "Artist 3", src: "songs/song3.mp3" },
    { title: "Song 3", artist: "Artist 3", src: "songs/song3.mp3" },
    { title: "Song 3", artist: "Artist 3", src: "songs/song3.mp3" },
    { title: "Song 3", artist: "Artist 3", src: "songs/song3.mp3" },
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
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalDurationDisplay = document.getElementById("total-duration");

function updateSongDetails() {
    songTitle.innerText = songs[currentSongIndex].title;
    artistName.innerText = songs[currentSongIndex].artist;
    audioPlayer.src = songs[currentSongIndex].src;
    audioPlayer.play();
    playPauseBtn.innerText = "⏸";
}

// Convert seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update progress bar and time
audioPlayer.addEventListener("timeupdate", () => {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    currentTimeDisplay.innerText = formatTime(audioPlayer.currentTime);
});

// Set total duration once metadata loads
audioPlayer.addEventListener("loadedmetadata", () => {
    totalDurationDisplay.innerText = formatTime(audioPlayer.duration);
});

// Seek music when progress bar is changed
progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Toggle Play/Pause
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
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSongDetails();
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
