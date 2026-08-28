// Elements

// Countdown

const weddingDate = new Date("September 5, 2026 10:46:00").getTime();
function updateCountdown(){
    const now = new Date().getTime();
    const distance = weddingDate - now;
    document.getElementById("days").textContent = Math.floor(distance/(1000*60*60*24));
    document.getElementById("hours").textContent = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    document.getElementById("minutes").textContent = Math.floor((distance%(1000*60*60))/(1000*60));
    document.getElementById("seconds").textContent = Math.floor((distance%(1000*60))/1000);
}

updateCountdown();

setInterval(updateCountdown,1000);

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".person-card,.time-box,.timeline-content").forEach(el=>{
    el.classList.add("hidden");
    observer.observe(el);
});

const form = document.querySelector(".rsvp-form");
const sideButtons = document.querySelectorAll(".side-icon");
const sideInput = document.getElementById("rsvpSide");

sideButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        sideButtons.forEach(b => {
            b.classList.remove("selected", "pop");
        });
        btn.classList.add("selected");

        // Force reflow so the pop animation
        // replays every time it's clicked

        void btn.offsetWidth;
        btn.classList.add("pop");
        sideInput.value = btn.dataset.side;

        // Ripple effect at the tap point
        const circle = btn.querySelector(".icon-circle");
        const rect = circle.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        circle.appendChild(ripple);
        ripple.addEventListener("animationend", () => {
            ripple.remove();
        });
    });
});

const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeLightbox = document.querySelector(".close-lightbox");
const prevBtn = document.querySelector(".lightbox-prev");
const nextBtn = document.querySelector(".lightbox-next");
const currentImage = document.getElementById("currentImage");
const totalImages = document.getElementById("totalImages");
const images = [...galleryItems].map(item=>item.querySelector("img"));

let currentIndex=0;

totalImages.textContent=images.length;

function openLightbox(index){
    currentIndex=index;
    lightbox.classList.add("active");
    lightboxImage.style.opacity=0;
    setTimeout(()=>{
        lightboxImage.src=images[index].src;
        lightboxImage.style.opacity=1;
    },150);
    lightboxImage.alt=images[index].alt;
    currentImage.textContent=index+1;
}

galleryItems.forEach((item,index)=>{
    item.addEventListener("click",()=>{
        openLightbox(index);
    });
});

nextBtn.addEventListener("click",()=>{
    currentIndex=(currentIndex+1)%images.length;
    openLightbox(currentIndex);
});

prevBtn.addEventListener("click",()=>{
    currentIndex=(currentIndex-1+images.length)%images.length;
    openLightbox(currentIndex);
});

closeLightbox.addEventListener("click",()=>{
    lightbox.classList.remove("active");
});

lightbox.addEventListener("click",(e)=>{
    if(e.target===lightbox){
        lightbox.classList.remove("active");
    }
});

document.addEventListener("keydown",(e)=>{
    if(!lightbox.classList.contains("active")) return;
    if(e.key==="Escape"){
        lightbox.classList.remove("active");
    }
    if(e.key==="ArrowRight"){
        nextBtn.click();
    }
    if(e.key==="ArrowLeft"){
        prevBtn.click();
    }
});

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 50) return;
    if (swipeDistance < 0) {
        nextBtn.click();
    } else {
        prevBtn.click();
    }
}

const sections = document.querySelectorAll("header, section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll",()=>{
    let current="";
    sections.forEach(section=>{
        const sectionTop=section.offsetTop-150;
        if(window.scrollY>=sectionTop){
            current=section.getAttribute("id");
        }
    });
    navLinks.forEach(link=>{
        link.classList.remove("active");
        if(link.getAttribute("href")==="#"+current){
            link.classList.add("active");
        }
    });
});

const backToTop=document.getElementById("backToTop");

window.addEventListener("scroll",()=>{
    if(window.scrollY>500){
        backToTop.classList.add("show");
    }else{
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click",()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});

const progress=document.getElementById("progressBar");

window.addEventListener("scroll",()=>{
    const height=document.documentElement.scrollHeight-window.innerHeight;
    const progressWidth=(window.scrollY/height)*100;
    progress.style.width=progressWidth+"%";
});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");
const menuOverlay = document.getElementById("menuOverlay");

document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        lightbox.classList.remove("active");
    }
});

window.addEventListener("resize",()=>{
    if(window.innerWidth>768){
        navMenu.classList.remove("show");
        menuOverlay.classList.remove("show");
        menuToggle.classList.remove("active");
        document.body.classList.remove("menu-open");
    }
});

const petalsContainer = document.getElementById("petals-container");

function createPetal(){
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.innerHTML = "🌸";
    petal.style.left = Math.random()*100 + "vw";
    petal.style.fontSize = (16 + Math.random()*18) + "px";
    petal.style.animationDuration = (8 + Math.random()*6) + "s";
    petalsContainer.appendChild(petal);
    petal.addEventListener("animationend",()=>{
        petal.remove();
    });
}

const sparkleContainer=document.getElementById("sparkles");

function createSparkle(){
    const star=document.createElement("span");
    star.className="sparkle";
    star.innerHTML="✨";
    star.style.left=Math.random()*100+"vw";
    star.style.top=Math.random()*100+"vh";
    star.style.fontSize=(8+Math.random()*12)+"px";
    sparkleContainer.appendChild(star);
    setTimeout(()=>{
        star.remove();
    },4000);
}

/* ==========================================
        PREMIUM SCRATCH CARD
========================================== */

let revealed = false;
const scratchCanvas = document.getElementById("overlayScratchCanvas");
const wrapper = document.querySelector(".scratch-wrapper");
const overlay = document.getElementById("dateOverlay");
const heroTeaser = document.getElementById("heroTeaser");
const modal = document.querySelector(".date-modal");

modal.addEventListener("transitionend", (e) => {
    if(
        e.propertyName === "transform" &&
        overlay.classList.contains("show")
    ){
        resizeCanvas();
    }
});

if (scratchCanvas) {
    const ctx = scratchCanvas.getContext("2d", {
        willReadFrequently: true
    });
    const foil = new Image();
    foil.src = "assets/images/gold-foil.png";
    let scratching = false;

    function resizeCanvas(){
        const dpr = window.devicePixelRatio || 1;
        const width  = wrapper.offsetWidth;
        const height = wrapper.offsetHeight;

        scratchCanvas.width  = width * dpr;
        scratchCanvas.height = height * dpr;

        scratchCanvas.style.width  = width + "px";
        scratchCanvas.style.height = height + "px";

        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(dpr,dpr);

        drawFoil();

    }

    function drawFoil() {
        if (!foil.complete) return;
        ctx.globalCompositeOperation = "source-over";
        const width  = wrapper.offsetWidth;
        const height = wrapper.offsetHeight;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        ctx.drawImage(
            foil,
            0,
            0,
            width,
            height
        );

        ctx.globalCompositeOperation = "destination-out";
    }

    foil.onload = () => {
        if (scratchCanvas.width) drawFoil();
    };

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas(); // pre-size & pre-paint immediately, before the overlay ever opens
    function scratch(x, y) {
        ctx.beginPath();
        ctx.arc(
            x,
            y,
            28,
            0,
            Math.PI * 2
        );
        ctx.fill();
        checkProgress();
    }
    function getPoint(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    scratchCanvas.addEventListener("mousedown", () => {
        scratching = true;
    });

    scratchCanvas.addEventListener("mouseup", () => {
        scratching = false;
    });

    scratchCanvas.addEventListener("mouseleave", () => {
        scratching = false;
    });

    scratchCanvas.addEventListener("mousemove", (e) => {
        if (!scratching) return;
        const p = getPoint(e);
        scratch(p.x, p.y);
    });

    scratchCanvas.addEventListener("touchstart", () => {
        scratching = true;
    });

    scratchCanvas.addEventListener("touchend", () => {
        scratching = false;
    }); 

    scratchCanvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (!scratching) return;
        const p = getPoint(e);
        scratch(p.x, p.y);
    });

    function closeReveal() {
        overlay.classList.remove("show");
        website.style.overflowY = "auto";
        heroTeaser.innerHTML = `
            <div class="hero-date-wrapper">
                <img
                    src="assets/images/wedding-date.png"
                    class="hero-date-card"
                    alt="Wedding Date">
            </div>
        `;
    }

    function checkProgress() {
        if (revealed) return;
        const pixels = ctx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        ).data;
        let transparent = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparent++;
            }
        }
        const totalPixels = pixels.length / 4;
        const percent = (transparent / totalPixels) * 100;
        if (percent>=25) {
            revealed = true;
            scratchCanvas.style.transition = ".8s ease";
            scratchCanvas.style.opacity = "0";
            setTimeout(() => {       
                scratchCanvas.remove();
                document.getElementById("continueHint")
                .classList.add("show");
                setTimeout(() => {
                    closeReveal();
                }, 3000)
            },800);
        }
    }
}

const continueHint = document.getElementById("continueHint");
overlay.addEventListener("click", () => {
    if(!revealed) return;
    closeReveal();
});

const websiteContainer = document.getElementById("website");
const hero = document.querySelector(".hero");
let modalOpened = false;
websiteContainer.addEventListener("scroll", () => {
    const triggerPoint = 180;    
    if (
        websiteContainer.scrollTop >= triggerPoint &&
        !modalOpened
    ){
        modalOpened = true;
        websiteContainer.style.overflowY = "hidden";
        overlay.classList.add("show");
        resizeCanvas();
    }
});

/*=============================
  TIMELINE POSITIONING
=============================*/

function positionTimeline(){
    const timeline = document.querySelector(".timeline");
    const line = document.querySelector(".timeline-line");
    const lotus = document.querySelector(".timeline-lotus");
    const rows = [
        document.getElementById("haldi-row"),
        document.getElementById("mehendi-row"),
        document.getElementById("wedding-row"),
        document.getElementById("lunch-row")
    ];

    const dots = [
        document.getElementById("dot-haldi"),
        document.getElementById("dot-mehendi"),
        document.getElementById("dot-wedding"),
        document.getElementById("dot-lunch")
    ];

    if (!timeline || !line || !lotus) return;
    if (rows.some(row => !row) || dots.some(dot => !dot)) return;

    const firstCenter = rows[0].offsetTop + rows[0].offsetHeight / 2;
    const lastCenter = rows[3].offsetTop + rows[3].offsetHeight / 2;
    const LOTUS_OFFSET = 55;
    timeline.style.top = `${firstCenter - LOTUS_OFFSET}px`;
    line.style.height = `${lastCenter - firstCenter}px`;

    rows.forEach((row, index) => {
        const center = row.offsetTop + row.offsetHeight / 2;
        dots[index].style.top = `${center - firstCenter}px`;
    });
}

/*====================================
  TIMELINE SCROLL ANIMATION
====================================*/

positionTimeline();
window.addEventListener("load", () => {
    positionTimeline();
});

window.addEventListener("resize", () => {
    positionTimeline();
    if(Lotus.current){
        Lotus.moveTo(Lotus.current);
    }
});

/*=========================
    CUSTOM RSVP DROPDOWN
=========================*/

const customSelect = document.getElementById("attendanceSelect");
const trigger = customSelect.querySelector(".select-trigger");
const selectedText = customSelect.querySelector(".selected-text");
const hiddenInput = document.getElementById("attendanceValue");
const options = customSelect.querySelectorAll(".select-option");
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz4iKuSenZrfxh-wbMcL90b7YiqQBRWO4mQlF4OsElK2vhofWR45Wq1KOWXSGxZ7Frdbw/exec";

document.querySelector(".rsvp-form").addEventListener("submit", async function(e){

    e.preventDefault();

    if(hiddenInput.value === ""){
    customSelect.classList.add("error");
    return;
}

if(document.getElementById("rsvpSide").value === ""){
    alert("Please choose Bride's Side or Groom's Side.");
    return;
}

const data = {

    name: document.getElementById("guestName").value.trim(),

    phone: document.getElementById("guestPhone").value.trim(),

    side: document.getElementById("rsvpSide").value,

    attendance: document.getElementById("attendanceValue").value,

    wishes: document.getElementById("guestWishes").value.trim(),

    device: navigator.userAgent

};

const formData = new FormData();
formData.append("name", data.name);
formData.append("phone", data.phone);
formData.append("side", data.side);
formData.append("attendance", data.attendance);
formData.append("wishes", data.wishes);
formData.append("device", data.device);

// no-cors means we can't read the response body anyway, so we
// don't wait on it — fire the request in the background and let
// the sheet write happen server-side while we show the modal
// right away instead of leaving the guest staring at a spinner.

fetch(SCRIPT_URL,{
    method:"POST",
    mode:"no-cors",
    body: formData
}).catch((error) => {
    console.error(error);
});

const title = document.getElementById("successTitle");
const msg1 = document.getElementById("successMessage1");
const msg2 = document.getElementById("successMessage2");
const date = document.getElementById("successDate");

if(data.attendance === "yes"){
    title.textContent = "Thank You!";
    msg1.textContent = "Your RSVP has been received with love.";
    msg2.textContent = "We are delighted that you'll be celebrating our special day with us.";
    date.textContent = "See you on 5 September 2026 ❤️";
}else{
    title.textContent = "Thank You!";
    msg1.textContent = "We'll surely miss having you with us.";
    msg2.textContent = "Thank you for your warm wishes and blessings.";
    date.textContent = "With Love, Vijay & Himaja ❤️";
}

document.getElementById("rsvpSuccess").classList.add("show");
});

const rsvpForm = document.querySelector(".rsvp-form");

document.getElementById("successClose").addEventListener("click",()=>{
    document.getElementById("rsvpSuccess").classList.remove("show");
    rsvpForm.reset();
    selectedText.textContent = "Will you attend?";
    hiddenInput.value = "";
    customSelect.classList.remove("error");
    options.forEach(option=>{
        option.classList.remove("selected");
    });
    document.querySelectorAll(".side-icon").forEach(icon=>{
            icon.classList.remove(
                "selected",
                "pop"
            );
        });

    document.getElementById("rsvpSide").value = "";
});

document.getElementById("RsvpClose").addEventListener("click",()=>{
    document.getElementById("rsvpSuccess").classList.remove("show");
    rsvpForm.reset();
    selectedText.textContent = "Will you attend?";
    hiddenInput.value = "";
    customSelect.classList.remove("error");
    options.forEach(option=>{
        option.classList.remove("selected");
    });
    document.querySelectorAll(".side-icon").forEach(icon=>{
            icon.classList.remove(
                "selected",
                "pop"
            );
        });

    document.getElementById("rsvpSide").value = "";
});

trigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");
});

options.forEach(option => {
    option.addEventListener("click", () => {
        options.forEach(o=>{
            o.classList.remove("selected");
        });
        option.classList.add("selected");
        selectedText.textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        customSelect.classList.remove("error");
        const isTouch = window.matchMedia("(hover: none)").matches;
        if(isTouch){
            setTimeout(()=>{
                customSelect.classList.remove("open");
            },900);
        }
        else{
            customSelect.classList.remove("open");
        }
    });
});

document.addEventListener("click", (e) => {
    if(!customSelect.contains(e.target)){
        customSelect.classList.remove("open");
    }
});