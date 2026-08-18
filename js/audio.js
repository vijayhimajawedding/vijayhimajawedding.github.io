const landingMusic = document.getElementById("landingMusic");
const openingMusic = document.getElementById("openingMusic");
const weddingMusic = document.getElementById("weddingMusic");

landingMusic.volume = 0;
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

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        landingMusic.pause();

        openingMusic.pause();

        weddingMusic.pause();

    } else {

        if (
            document.getElementById("landingContainer")
        ) {

            if (!introUnlocked) {

                landingMusic.play().catch(() => {});

            } else {

                openingMusic.play().catch(() => {});

            }

        } else {

            weddingMusic.play().catch(() => {});

        }

    }

});