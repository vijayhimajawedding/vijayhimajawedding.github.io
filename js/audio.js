const openingMusic = document.getElementById("openingMusic");
const weddingMusic = document.getElementById("weddingMusic");

openingMusic.volume = 0;
weddingMusic.volume = 0;

// Fade In

function fadeIn(audio, duration = 1000, targetVolume = 1) {
    audio.play();
    const step = targetVolume / (duration / 50);
    const fade = setInterval(() => {
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(audio.volume + step, targetVolume);
        } else {
            clearInterval(fade);
        }
    }, 50);
}

// Fade Out

function fadeOut(audio, duration = 1000) {
    const step = audio.volume / (duration / 50);
    const fade = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - step, 0);
        } else {
            audio.pause();
            clearInterval(fade);
        }
    }, 50);
}

// Cross Fade

function crossFade(fromAudio, toAudio, duration = 1000, targetVolume = 1) {
    fadeOut(fromAudio, duration);
    toAudio.volume = 0;
    fadeIn(toAudio, duration, targetVolume);
}

function pauseAllMusic() {
    openingMusic.pause();
    weddingMusic.pause();
}

function resumeAppropriateMusic() {
    if (document.hidden) return;
    if (document.getElementById("landingContainer")) {
        // Only resume opening music after the seal has been opened
        if (introUnlocked) {
            openingMusic.play().catch(() => {});
        }
    } else {
        weddingMusic.play().catch(() => {});
    }
}

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
        pauseAllMusic();
    } else {
        resumeAppropriateMusic();
    }

});

// visibilitychange alone is NOT reliable on many mobile browsers,
// especially in-app webviews (WhatsApp, Instagram, Facebook, etc.)
// which is exactly how a wedding invite link is usually opened.
// These are used as fallbacks to make sure music actually stops
// when the user leaves the page/app.

window.addEventListener("pagehide", pauseAllMusic);

window.addEventListener("blur", pauseAllMusic);

window.addEventListener("focus", resumeAppropriateMusic);

// Page Lifecycle API - fired when the browser freezes a
// backgrounded tab (mainly Chrome/Android)
document.addEventListener("freeze", pauseAllMusic);