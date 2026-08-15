const landingContainer = document.getElementById("landingContainer");
const introVideo = document.getElementById("introVideo");
const LOOP_END = 4.5;
let introUnlocked = false;
const website = document.getElementById("website");
const seal = document.getElementById("seal");
let heroStarted = false;

// Click Seal

seal.addEventListener("click", () => {
    seal.disabled = true;
    seal.blur();
    seal.classList.add("opened");
    seal.style.pointerEvents = "none";
    seal.style.animation = "none";
    introUnlocked = true;
    landingMusic.pause();
    landingMusic.currentTime = 0;
    openingMusic.volume = 1;
    openingMusic.currentTime = 0;
    const t = introVideo.currentTime;
    if (t <= 1) {
        introVideo.playbackRate = 2;
    } else if (t <= 2) {
        introVideo.playbackRate = 1.6;
    } else if (t <= 3.5) {
        introVideo.playbackRate = 1.3;
    } else {
        introVideo.playbackRate = 1;
    }
    introVideo.play();
    openingMusic.play().catch(console.error);
});

// Hero Reveal

introVideo.addEventListener("timeupdate", () => {    
    if (!heroStarted && introVideo.currentTime >= 8.8) {
        openingMusic.pause();
        openingMusic.currentTime = 0;
        weddingMusic.volume = 0.4;
        weddingMusic.play();
        heroStarted = true;
        website.classList.add("show");
        document.querySelector(".site-bg").classList.add("show");
        const hero = document.querySelector(".hero");
        hero.classList.add("reveal");
        landingContainer.style.transition = "opacity .8s ease";
        landingContainer.style.opacity = "0";
    }
});

// Finish

introVideo.addEventListener("ended", () => {
    landingContainer.remove();
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
});

introVideo.addEventListener("timeupdate", () => {

    // Keep looping before seal click

    if (!introUnlocked && introVideo.currentTime >= LOOP_END) {
        introVideo.currentTime = 0;
        introVideo.play();
        return;
    }

    // Smoothly slow down as it approaches the opening

    if (introUnlocked) {
        if (
            introVideo.playbackRate === 2 &&
            introVideo.currentTime >= 2.8
        ) {
            introVideo.playbackRate = 1.6;
        }
        if (
            introVideo.playbackRate === 1.6 &&
            introVideo.currentTime >= 3.8
        ) {
            introVideo.playbackRate = 1.3;
        }
        if (
            introVideo.playbackRate > 1 &&
            introVideo.currentTime >= LOOP_END
        ) {
            introVideo.playbackRate = 1;
        }
    }
});