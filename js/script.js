// Elements

const navbar = document.querySelector(".navbar");
const musicBtn = document.getElementById("musicBtn");

window.addEventListener("load", () => {
    landingMusic.volume = 0.35;
    landingMusic.play()
        .then(() => {
            console.log("Landing music started");
        })
        .catch((err) => {
            console.log("Autoplay blocked:", err);
        });
});

// Sticky Navbar

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Countdown

const weddingDate = new Date("September 5, 2026 10:46:00").getTime();
function updateCountdown(){
    const now = new Date().getTime();
    const distance = weddingDate - now;
    document.getElementById("days").textContent =
        Math.floor(distance/(1000*60*60*24));
    document.getElementById("hours").textContent =
        Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    document.getElementById("minutes").textContent =
        Math.floor((distance%(1000*60*60))/(1000*60));
    document.getElementById("seconds").textContent =
        Math.floor((distance%(1000*60))/1000);
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

//setInterval(createPetal,600);

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

//setInterval(createSparkle,500);

/* ==========================================
        PREMIUM SCRATCH CARD
========================================== */

let revealed = false;
const scratchCanvas = document.getElementById("overlayScratchCanvas");
const wrapper = document.querySelector(".scratch-wrapper");
const overlay = document.getElementById("dateOverlay");

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

/*====================================
        ASSET PRELOADER
====================================*/

/*const PRELOAD_IMAGES = [

    // Haldi
    "assets/images/haldi-card.png",
    "assets/images/haldi-overlay.png",

    // Mehendi
    "assets/images/mehendi-card.png",
    "assets/images/mehendi/mehendi-0.png",
    "assets/images/mehendi/mehendi-top.png",
    "assets/images/mehendi/mehendi-left.png",
    "assets/images/mehendi/mehendi-right.png",
    "assets/images/mehendi/mehendi-top-left.png",
    "assets/images/mehendi/mehendi-top-right.png",
    "assets/images/mehendi/mehendi-left-right.png",
    "assets/images/mehendi/mehendi-complete.png",

    // Wedding
    "assets/images/wedding-card.png",
    "assets/images/wedding-activity.png",
    "assets/images/drum.png",

    // Lunch
    "assets/images/lunch-card.png",
    "assets/images/lunch/water-stage-1.png",
    "assets/images/lunch/water-stage-2.png",
    "assets/images/lunch/water-stage-3.png",
    "assets/images/lunch/banana-leaf-clean.png",
    "assets/images/lunch/meal.png"

];

function preloadAssets(){

    PRELOAD_IMAGES.forEach(src=>{

        const img = new Image();

        img.src = src;

    });

}

window.addEventListener("load", preloadAssets);

/*==================================== 
CELEBRATION CONTROLLER V2 
====================================*/ 

/*const Celebration = { 
    modal: document.getElementById("celebrationModal"),
    dialog: document.querySelector(".celebration-dialog"), 
    title: document.getElementById("celebrationTitle"), 
    image: document.getElementById("celebrationModalImage"), 
    instruction: document.getElementById("celebrationInstruction"), 
    hint: document.getElementById("celebrationHint"), 
    interaction: document.getElementById("celebrationInteraction"), 
    wrapper: document.querySelector(".celebration-card-wrapper"), 
    canvas: document.getElementById("haldiCanvas"), 
    skip: document.getElementById("haldiSkipBtn"), 
    timer:null, 
    current:null, 
    state:{ 
        haldi:false, 
        mehendi:false, 
        wedding:false, 
        lunch:false 
    } 
};

Celebration.haldiCard = document.getElementById("haldiFinalCard");

Celebration.data = { 
    haldi:{ 
        title:"Haldi", 
        image:"assets/images/haldi-card.png", 
        instruction:"Rub the turmeric to bless the couple."
    }, 
     mehendi:{ 
        title:"Mehendi", 
        image:"assets/images/mehendi-card.png", 
        instruction:"Draw design on each leaf to reveal the invitation." 
    }, 
    wedding:{ 
        title:"Wedding", 
        image:"assets/images/wedding-card.png", 
        instruction:"Press and hold the Shehnai for 3 seconds." 
    }, 
    lunch:{ 
        title:"Lunch", 
        image:"assets/images/lunch-card.png", 
        instruction:"Lift the banana leaf to reveal the feast." 
    } 
}; 

Celebration.reset=function(){ 
    clearTimeout(this.timer); 
    Celebration.haldiCard.classList.remove("show");
    Celebration.haldiCard.style.pointerEvents="none";
    this.instruction.style.display="block"; 
    this.instruction.style.opacity="1"; 
    this.instruction.style.visibility="visible"; 
    this.hint.classList.remove("show"); 
    this.wrapper.style.transform= "translateY(0) scale(1)"; 
    this.canvas.style.display="none"; 
    this.canvas.style.opacity="1"; 
    this.canvas.style.pointerEvents="auto"; 
    this.skip.style.display="none"; 
    document.getElementById("weddingOverlay").style.display="none"; 
    Celebration.interaction.innerHTML=""; 
    Celebration.image.src = ""; 
    Celebration.image.style.opacity = "0"; 
    Celebration.image.style.pointerEvents = "none"; 
} 
Celebration.show=function(){ 
    this.modal.classList.add("show"); 
} 
Celebration.hide=function(){ 
    this.modal.classList.remove("show"); 
    this.reset(); 
} 
Celebration.open=function(eventName){
    this.current=eventName; 
    this.reset(); 
    const data = this.data[eventName]; 
    this.title.textContent= data.title; 
    this.image.src = ""; 
    this.image.style.opacity = "0"; 
    this.image.style.pointerEvents = "none"; 
    this.instruction.textContent= data.instruction; 
    const map={ 
        haldi:0, 
        mehendi:1, 
        wedding:2, 
        lunch:3 
    };
    this.show(); 
    switch(eventName){
        case "haldi": 
        if(this.state.haldi){ 
            moveTimeline(0); 
            showCompletedHaldi(); 
        } 
        else{ 
            Haldi.init(); 
        } 
        break; 
        case "mehendi": 
        if(this.state.mehendi){
            moveTimeline(1); 
            showCompletedMehendi(); 
        } 
        else{ 
            Mehendi.init(); 
        } 
        break; 
        case "wedding": 
        if(this.state.wedding){ 
            moveTimeline(2); 
            showCompletedWedding(); 
        } 
        else{ 
            Wedding.init(); 
        } 
        break; 
        case "lunch": 
        if(this.state.lunch){ 
            moveTimeline(3); 
            showCompletedLunch(); 
        } else{ 
            Lunch.init(); 
        } 
        break; 
    } 
} 
Celebration.dialog.addEventListener("click",(e)=>{ 
    e.stopPropagation(); 
});

function closeCelebrationModal(e){ 
    if(!Celebration.hint.classList.contains("show")) return; 
    if(Celebration.dialog.contains(e.target)) return; 
    clearTimeout(Celebration.timer); 
    Celebration.hide(); 
}

Celebration.modal.addEventListener( 
    "click", 
    closeCelebrationModal 
);

Celebration.modal.addEventListener( 
    "touchstart", 
    closeCelebrationModal, 
    {passive:true} 
);

Celebration.hint.addEventListener("click",()=>{ 
    clearTimeout(Celebration.timer); 
    Celebration.hide(); 
});

Celebration.hint.addEventListener("touchstart",()=>{ 
    clearTimeout(Celebration.timer); 
    Celebration.hide(); 
});

Celebration.title.addEventListener("click",()=>{ 
    if(!Celebration.hint.classList.contains("show")) return; 
    clearTimeout(Celebration.timer); 
    Celebration.hide(); 
}); 

Celebration.title.addEventListener("touchstart",()=>{
    if(!Celebration.hint.classList.contains("show")) return;
    clearTimeout(Celebration.timer); 
    Celebration.hide(); 
}); 

document.addEventListener("keydown",(e)=>{ 
    if( 
        e.key==="Escape" && 
        Celebration.modal.classList.contains("show") 
    ){ 
        Celebration.hide(); 
    } 
});

document.querySelectorAll(".event-card").forEach(card=>{
    card.addEventListener("click",()=>{
        Celebration.open( 
            card.dataset.event 
        ); 
    }); 
});*/ 
    
/*==================================== 
        HALDI ENGINE 
====================================*/ 

/*const Haldi={ 
    scratching:false, 
    revealed:false, 
    ctx:null, 
    brushSize:34, 
    threshold:35, 
    texture:null 
};

Haldi.init=function(){ 
    this.revealed=false; 
    Celebration.canvas.style.display="block"; 
    Celebration.canvas.width= Celebration.canvas.offsetWidth; 
    Celebration.canvas.height= Celebration.canvas.offsetHeight; 
    Celebration.canvas.style.opacity="1"; 
    Celebration.canvas.style.pointerEvents="auto"; 
    Celebration.skip.style.display="flex"; 
    this.ctx= Celebration.canvas.getContext( 
        "2d", 
        { 
            willReadFrequently:true 
        } 
    );
    this.loadTexture(); 
    this.bindEvents(); 
}

Haldi.loadTexture=function(){ 
    this.texture=new Image(); 
    this.texture.src= "assets/images/haldi-overlay.png"; 
    this.texture.onload=()=>{ 
        this.ctx.globalCompositeOperation= "source-over"; 
        this.ctx.clearRect( 
            0, 
            0, 
            Celebration.canvas.width, 
            Celebration.canvas.height 
        ); 
        this.ctx.drawImage( 
            this.texture, 
            0, 
            0, 
            Celebration.canvas.width, 
            Celebration.canvas.height 
        ); 
    }; 
} 

Haldi.getPoint=function(e){ 
    const rect= Celebration.canvas.getBoundingClientRect(); 
    if(e.touches){ 
        return{ 
            x:e.touches[0].clientX-rect.left, 
            y:e.touches[0].clientY-rect.top 
        }; 
    } 
    return{ 
        x:e.clientX-rect.left, 
        y:e.clientY-rect.top 
    }; 
} 

Haldi.scratch=function(x,y){ 
    if(this.revealed) return; 
    this.ctx.globalCompositeOperation = "destination-out"; 
    for(let i=0;i<7;i++){ 
        const angle = Math.random()*Math.PI*2; 
        const radius = Math.random()*18; 
        const size = 10 + Math.random()*12; 
        this.ctx.beginPath(); 
        this.ctx.arc( 
            x + Math.cos(angle)*radius, 
            y + Math.sin(angle)*radius, 
            size, 
            0, 
            Math.PI*2 
        ); 
        this.ctx.fill(); 
    } 
    this.checkProgress(); 
} 

Haldi.bindEvents=function(){ 
    const canvas=Celebration.canvas; 
    canvas.onmousedown=()=>{ 
        this.scratching=true; 
        Celebration.skip.style.display="none"; 
    }; 
    canvas.onmouseup=()=>{ 
        this.scratching=false; 
    }; 
    canvas.onmouseleave=()=>{ 
        this.scratching=false; 
    }; 
    canvas.onmousemove=(e)=>{ 
        if(!this.scratching) return; 
        const p=this.getPoint(e); 
        this.scratch( 
            p.x, 
            p.y 
        ); 
    }; 
    canvas.ontouchstart=()=>{ 
        this.scratching=true; 
        Celebration.skip.style.display="none"; 
    }; 
    canvas.ontouchend=()=>{ 
        this.scratching=false; 
    }; 
    canvas.ontouchmove=(e)=>{ 
        e.preventDefault(); 
        if(!this.scratching) return; 
        const p=this.getPoint(e); 
        this.scratch( 
            p.x, 
            p.y 
        ); 
    }; 
}

Celebration.skip.onclick=()=>{ 
    if(Haldi.revealed) return; 
    Celebration.skip.style.display="none"; 
    Celebration.canvas.style.transition= ".8s ease"; 
    Celebration.canvas.style.opacity="0"; 
    setTimeout(()=>{ 
        Haldi.complete(); 
    },800); 
}

Haldi.checkProgress=function(){ 
    if(this.revealed) return; 
    const pixels=this.ctx.getImageData( 
        0, 
        0, 
        Celebration.canvas.width, 
        Celebration.canvas.height 
    ).data; 
    let transparent=0; 
    for( 
        let i=3; 
        i<pixels.length; 
        i+=4 
    ){ 
        if(pixels[i]===0){ 
            transparent++; 
        } 
    } 
    const percent= transparent/ 
    ( Celebration.canvas.width* 
        Celebration.canvas.height )*100; 
    if(percent>=this.threshold){ 
        this.complete(); 
    } 
} 

Haldi.complete=function(){ 
    if(this.revealed) return; 
    this.revealed=true; 
    Celebration.state.haldi=true; 
    Celebration.canvas.style.transition= "opacity .8s ease"; 
    Celebration.canvas.style.opacity="0"; 
    setTimeout(()=>{ 
        Celebration.canvas.style.display="none"; 
        Celebration.wrapper.style.transform= "translateY(-10px) scale(1.03)"; 
        Celebration.instruction.style.opacity="0"; 
        setTimeout(()=>{ 
            Celebration.instruction.style.display="none"; 
        },300); 
        Celebration.hint.classList.add("show"); 
        createHaldiBurst(); 
        unlockHaldiCard(); 
        moveTimeline(0); 
        Celebration.haldiCard.classList.add("show");
        Celebration.haldiCard.style.pointerEvents="auto";
        Celebration.timer = setTimeout(()=>{ 
            if( Celebration.modal.classList .contains("show") ){
                Celebration.hide(); 
            } 
        },5000); 
    },800); 
}

function unlockHaldiCard(){ 
    Celebration.state.haldi = true; 
    const card= document.querySelector( '.event-card[data-event="haldi"]' ); 
    card.classList.remove("locked"); 
    card.querySelector("img").style.filter="blur(0px)"; 
    card.querySelector(".card-overlay").style.display="none"; 
}

function unlockMehendiCard(){ 
    Celebration.state.mehendi = true; 
    const card = document.querySelector( '.event-card[data-event="mehendi"]' ); 
    card.classList.remove("locked"); 
    card.querySelector("img").style.filter = "blur(0px)"; 
    card.querySelector(".card-overlay") .style.display = "none"; 
}*/

/*==================================== 
        HALDI PARTICLE BURST 
====================================*/ 

/*function createHaldiBurst(){ 
    for(let i=0;i<18;i++){ 
        const particle = document.createElement("span"); 
        particle.className = "haldi-particle"; 
        particle.innerHTML = Math.random()>.5 ? "✨" : "🌼"; 
        particle.style.left = "50%"; 
        particle.style.top = "50%"; 
        particle.style.setProperty( 
            "--x", 
            `${(Math.random()-.5)*220}px` ); 
        particle.style.setProperty( 
            "--y", 
            `${(Math.random()-.5)*220}px` ); 
        Celebration.wrapper.appendChild( particle ); 
        particle.addEventListener( "animationend", 
            ()=>particle.remove() 
        ); 
    } 
}

function showCompletedHaldi(){ 
    Celebration.haldiCard.classList.add("show");
    Celebration.haldiCard.style.pointerEvents="auto"; 
    Celebration.canvas.style.display="none"; 
    Celebration.skip.style.display="none"; 
    Celebration.wrapper.style.transform= "translateY(-10px) scale(1.03)"; 
    Celebration.instruction.style.display="none"; 
    Celebration.hint.classList.add("show"); 
}*/

/*====================================
        MEHENDI ENGINE
====================================*/

/*const Mehendi={
    completed:false,
    tracing:false,
    currentImage:0,
    petals:{
        top:false,
        left:false,
        right:false
    },
    images:{
        "000":"assets/images/mehendi/mehendi-0.png",
        "100":"assets/images/mehendi/mehendi-top.png",
        "010":"assets/images/mehendi/mehendi-left.png",
        "001":"assets/images/mehendi/mehendi-right.png",
        "110":"assets/images/mehendi/mehendi-top-left.png",
        "101":"assets/images/mehendi/mehendi-top-right.png",
        "011":"assets/images/mehendi/mehendi-left-right.png",
        "111":"assets/images/mehendi/mehendi-complete.png"
    }
};

Mehendi.init=function(){
    this.completed=false;
    this.tracing=false;
    this.petals.top=false;
    this.petals.left=false;
    this.petals.right=false;
    Celebration.skip.style.display="none";
    Celebration.canvas.style.display="none";
    Celebration.image.style.opacity = "1";
    Celebration.image.src = this.images["000"];
    Celebration.image.style.pointerEvents = "auto";
    Celebration.skip.style.display = "block";
    Celebration.skip.onclick=()=>{
        Mehendi.petals.top=true;
        Mehendi.petals.left=true;
        Mehendi.petals.right=true;
        Celebration.image.src= Mehendi.images["111"];
        setTimeout(()=>{
            Mehendi.complete();
        },500);
    };
    this.bindEvents();
}

Mehendi.getPoint=function(e){
    const rect = Celebration.image.getBoundingClientRect();
    if(e.touches){
        return{
            x:e.touches[0].clientX-rect.left,
            y:e.touches[0].clientY-rect.top
        };
    }
    return{
        x:e.clientX-rect.left,
        y:e.clientY-rect.top
    };
}

Mehendi.detectPetal=function(x,y){
    const w = Celebration.image.clientWidth;
    const h = Celebration.image.clientHeight;*/

    /* TOP */

    /*if( x>w*0.38 && x<w*0.62 && y>h*0.10 && y<h*0.55 ){
        return "top";
    }*/

    /* LEFT */

    /*if( x>w*0.05 && x<w*0.42 && y>h*0.40 && y<h*0.90 ){
        return "left";
    }*/

    /* RIGHT */

    /*if( x>w*0.58 && x<w*0.95 && y>h*0.40 && y<h*0.90 ){
        return "right";
    }
    return null;
}

Mehendi.bindEvents=function(){
    const canvas = Celebration.image;
    canvas.onmousedown=()=>{
        this.tracing=true;
    };
    canvas.onmouseup=()=>{
        this.tracing=false;
    };
    canvas.onmouseleave=()=>{
        this.tracing=false;
    };
    canvas.onmousemove=(e)=>{
        if(!this.tracing) return;
        const p =
        this.getPoint(e);
        const petal =
        this.detectPetal(
            p.x,
            p.y
        );
        if(petal){
            this.completePetal(
                petal
            );
        }
    };
    canvas.ontouchstart=()=>{
        this.tracing=true;
    };
    canvas.ontouchend=()=>{
        this.tracing=false;
    };
    canvas.ontouchmove=(e)=>{
        e.preventDefault();
        if(!this.tracing) return;
        const p = this.getPoint(e);
        const petal = this.detectPetal(
            p.x,
            p.y
        );
        if(petal){
            this.completePetal(
                petal
            );
        }
    };
}

Mehendi.completePetal=function(petal){
    if(this.petals[petal]) return;
    this.petals[petal]=true;
    this.updateImage();
}

Mehendi.updateImage=function(){
    const key= (this.petals.top?"1":"0")+(this.petals.left?"1":"0")+(this.petals.right?"1":"0");
    Celebration.image.style.opacity="0";
    setTimeout(()=>{
        Celebration.image.src= this.images[key];
        Celebration.image.style.opacity="1";
    },180);
    if(key==="111"){
        setTimeout(()=>{
            this.complete();
        },350);
    }
}

function showCompletedMehendi(){
    Celebration.image.src = Celebration.data.mehendi.image;
    Celebration.image.style.opacity="1";
    Celebration.canvas.style.display="none";
    Celebration.canvas.style.opacity="0";
    Celebration.canvas.style.pointerEvents="none";
    Celebration.skip.style.display="none";
    Celebration.instruction.textContent="";
    Celebration.instruction.style.display="none";
    Celebration.hint.textContent = "✦ Tap outside the invitation to continue ✦";
    Celebration.hint.classList.add("show");
}

Mehendi.complete=function(){
    if(this.completed) return;
    this.completed=true;
    Celebration.state.mehendi=true;
    Celebration.skip.style.display="none";
    this.sparkle();
}

Mehendi.sparkle=function(){
    for(let i=0;i<18;i++){
        const s=document.createElement("span");
        s.className="mehendi-sparkle";
        s.style.left=(40+Math.random()*20)+"%";
        s.style.top=(42+Math.random()*20)+"%";
        s.style.setProperty(
            "--x",
            (Math.random()*180-90)+"px"
        );
        s.style.setProperty(
            "--y",
            (Math.random()*180-90)+"px"
        );
        Celebration.wrapper.appendChild(s);
        setTimeout(()=>{
            s.remove();
        },900);
    }
    setTimeout(()=>{
        this.bloom();
    },650);
}

Mehendi.bloom=function(){
    Celebration.image.style.transition="transform .45s ease";
    Celebration.image.style.transform="scale(1.08)";
    setTimeout(()=>{
        Celebration.image.style.transform="scale(1)";
        this.reveal();
    },450);
}

Mehendi.reveal=function(){

    // Show invitation 

    Celebration.image.src = Celebration.data.mehendi.image;
    Celebration.image.style.opacity="1";
    Celebration.image.style.pointerEvents = "auto";

    // Hide tracing canvas 

    Celebration.canvas.style.opacity="0";
    Celebration.canvas.style.pointerEvents="none";
    Celebration.canvas.style.display="none";

    // Hide instruction 

    Celebration.instruction.textContent="";
    Celebration.instruction.style.display="none";

    // Update hint 

    Celebration.hint.textContent = "✦ Tap outside the invitation to continue ✦";
    Celebration.hint.classList.add("show");
    unlockMehendiCard();
    moveTimeline(1);
    Celebration.timer=setTimeout(()=>{
        if(Celebration.modal.classList.contains("show")){
            Celebration.hide();
        }
    },5000);
}*/

/*====================================
        WEDDING ENGINE
====================================*/

/*const Wedding={
    taps:0,
    completed:false,
    drum:null,
    dots:[]
};

Wedding.init=function(){
    this.completed=false;
    this.taps=0;
    Celebration.canvas.style.display="none";
    Celebration.skip.style.display="none";
    Celebration.hint.classList.remove("show");
    Celebration.image.src="assets/images/wedding-activity.png";
    Celebration.image.style.opacity = "1";
    Celebration.image.style.pointerEvents = "auto";
    Celebration.instruction.textContent="Beat the Drum 5 Times";
    Celebration.instruction.style.display="block";
    Celebration.interaction.innerHTML=`
        <div class="drum-progress">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    document.getElementById("weddingOverlay").style.display="flex";   
    Celebration.skip.style.display = "block";
    Celebration.skip.onclick = () => {
        Wedding.complete();
    };
    this.bindEvents();
}

function showCompletedWedding(){
    Celebration.image.src = Celebration.data.wedding.image;
    Celebration.image.style.opacity = "1";
    Celebration.image.style.pointerEvents = "auto";
    Celebration.canvas.style.display="none";
    Celebration.skip.style.display="none";
    Celebration.interaction.innerHTML="";
    Celebration.instruction.style.display="none";
    Celebration.hint.textContent = "✦ Tap outside the invitation to continue ✦";
    Celebration.hint.classList.add("show");
    document.getElementById("weddingOverlay").style.display="none";
}

Wedding.bindEvents=function(){
    this.drum = document.getElementById("weddingDrum");
    this.dots = document.querySelectorAll(
        ".drum-progress span"
    );
    this.drum.addEventListener("click",(e)=>{
        this.tap(e);
    });
}

Wedding.tap=function(e){
    if(this.completed) return;
    if(this.taps>=5) return;
    this.taps++;
    this.animateDrum();
    this.sparkle(e);
    this.updateProgress();
    if(this.taps===5){
        setTimeout(()=>{
            this.finalCelebration();
        },350);
    }
}

Wedding.animateDrum=function(){
    this.drum.animate(
        [{transform:"scale(1)"}, {transform:"scale(.95)"}, {transform:"scale(1.08)"}, {transform:"scale(1)"}],
        { duration:180, easing:"ease-out" }
    );
}

Wedding.updateProgress=function(){
    const dot=this.dots[this.taps-1];
    dot.classList.add("active");
    dot.animate(
        [{transform:"scale(1)"}, {transform:"scale(1.5)"}, {transform:"scale(1)"}],
        { duration:250 }
    );
}

Wedding.sparkle=function(){
    const symbols=["✦", "✧", "✨"];
    const rect=this.drum.getBoundingClientRect();
    for(let i=0;i<5;i++){
        const s = document.createElement("span");
        s.className="wedding-sparkle";
        s.textContent=symbols[
            Math.floor(Math.random()*symbols.length)
        ];
        s.style.left=(rect.left+rect.width/2-Celebration.wrapper.getBoundingClientRect().left+(Math.random()*50-25))+"px";
        s.style.top=(rect.top+rect.height/2-Celebration.wrapper.getBoundingClientRect().top+(Math.random()*50-25))+"px";
        s.style.setProperty("--x", (Math.random()*80-40)+"px");
        s.style.setProperty("--y", (Math.random()*80-40)+"px");
        Celebration.wrapper.appendChild(s);
        setTimeout(()=>{
            s.remove();
        },500);
    }
}

Wedding.complete=function(){
    if(this.completed) return;
    this.completed=true;
    Celebration.state.wedding=true;
    Celebration.skip.style.display="none";
    this.reveal();
}

Wedding.reveal=function(){
    document.getElementById("weddingOverlay").animate(
        [{opacity:1}, {opacity:0}],{duration:350, fill:"forwards"}
    );
    setTimeout(()=>{
        document.getElementById("weddingOverlay").style.display="none";
        Celebration.image.src = Celebration.data.wedding.image;
        Celebration.image.style.opacity = "1";
        Celebration.image.style.pointerEvents = "auto";
    },350);
    Celebration.interaction.innerHTML="";
    Celebration.instruction.style.display="none";
    Celebration.hint.textContent="✦ Tap outside the invitation to continue ✦";
    Celebration.hint.classList.add("show");
    unlockWeddingCard();
    moveTimeline(2);
    Celebration.timer=setTimeout(()=>{
        if(Celebration.modal.classList.contains("show")){
            Celebration.hide();
        }
    },5000);
}

function unlockWeddingCard(){
    const card=document.querySelector(
        '.event-card[data-event="wedding"]'
    );
    card.classList.remove("locked");
    card.querySelector("img").style.filter="blur(0px)";
    card.querySelector(".card-overlay").style.display="none";
}

Wedding.finalCelebration=function(){
    this.animateFinalDrum();
    this.bigSparkleBurst();
    setTimeout(()=>{
        this.complete();
    },700);
}

Wedding.animateFinalDrum=function(){
    this.drum.animate(
        [{transform:"scale(1)"}, {transform:"scale(.90)"}, {transform:"scale(1.18)"}, {transform:"scale(1.05)"}, {transform:"scale(1)"}],
        {duration:550, easing:"cubic-bezier(.22,1,.36,1)"}
    );
}

Wedding.bigSparkleBurst=function(){
    const symbols=["✦", "✧", "✨"];
    const rect=this.drum.getBoundingClientRect();
    const wrapper=Celebration.wrapper.getBoundingClientRect();
    for(let i=0;i<25;i++){
        const s = document.createElement("span");
        s.className="wedding-sparkle";
        s.textContent=symbols[Math.floor(Math.random()*symbols.length)];
        s.style.left=(rect.left+rect.width/2-wrapper.left)+"px";
        s.style.top=(rect.top+rect.height/2-wrapper.top)+"px";
        s.style.setProperty("--x", (Math.random()*260-130)+"px");
        s.style.setProperty("--y", (Math.random()*220-110)+"px");
        Celebration.wrapper.appendChild(s);
        setTimeout(()=>{
            s.remove();
        },800);
    }
}*/

/*====================================
            LUNCH ENGINE
====================================*/

/*const Lunch={
    stage:0,
    completed:false,
    overlay:null,
    image:null,
    hand:null,
    dragging:false,
    startX:0,
    startLeft:-80,
    maxLeft:120,
    stages:[
    "assets/images/lunch/water-stage-1.png",
    "assets/images/lunch/water-stage-2.png",
    "assets/images/lunch/water-stage-3.png",
    "assets/images/lunch/banana-leaf-clean.png",
    "assets/images/lunch/meal.png"]
};

Lunch.init=function(){
    this.stage=0;
    this.completed=false;
    this.overlay = document.getElementById("lunchOverlay");
    Celebration.canvas.style.display="none";
    Celebration.skip.style.display="none";
    Celebration.hint.classList.remove("show");
    Celebration.image.style.pointerEvents = "none";
    this.overlay.style.display = "block";
    Celebration.instruction.textContent="Drag the hand to the right end 3 times";
    Celebration.instruction.style.display="block";
    this.image=document.getElementById("lunchStage");
    Celebration.image.src = this.stages[0];
    Celebration.image.style.opacity="1";
    this.hand=document.getElementById("wipeHand");
    this.image.src=this.stages[0];
    this.hand.style.left=this.startLeft+"px";
    Celebration.skip.style.display = "block";
    Celebration.skip.onclick = () => {
        Lunch.complete();
    };
    this.bindEvents();
}

Lunch.hideImage=function(){
    Celebration.image.style.opacity="0";
    Celebration.image.style.pointerEvents="none";
}

Lunch.showImage=function(){
    Celebration.image.style.opacity="1";
    Celebration.image.style.pointerEvents="auto";
}

Lunch.bindEvents=function(){
    this.hand.onpointerdown=(e)=>{
        this.startDrag(e);
    };
    window.onpointermove=(e)=>{
        this.drag(e);
    };
    window.onpointerup=()=>{
        this.endDrag();
    };
}

Lunch.startDrag=function(e){
    this.dragging=true;
    this.startX=e.clientX;
    this.hand.style.cursor="grabbing";
}

Lunch.drag=function(e){
    if(!this.dragging) return;
    let distance=e.clientX-this.startX;
    if(distance<0){
        distance=0;
    }
    let left=this.startLeft+distance;
    if(left>this.maxLeft){
        left=this.maxLeft;
    }
    this.hand.style.left=left+"px";
}

Lunch.endDrag=function(){
    if(!this.dragging) return;
    this.dragging=false;
    this.hand.style.cursor="grab";
    const currentLeft=parseInt(this.hand.style.left);
    if(currentLeft>=this.maxLeft){
        this.nextStage();
    }
}

Lunch.nextStage=function(){
    this.stage++;
    this.hand.style.transition="left .35s ease";
    this.hand.style.left=this.startLeft+"px";
    setTimeout(()=>{
        this.image.style.opacity="0";
        setTimeout(()=>{
            this.image.src=this.stages[this.stage];
            this.image.style.opacity="1";

            // Clean leaf reached

            if(this.stage===3){
                this.hand.style.display="none";
                setTimeout(()=>{
                    this.showMeal();
                },600);
            }
        },180);
    },220);
}

Lunch.showMeal=function(){
    this.image.style.opacity="0";
    setTimeout(()=>{
        this.image.src=this.stages[4];
        this.image.style.opacity="1";
        this.startSteam();
    },300);
}

Lunch.startSteam=function(){
    const container=document.getElementById("steamContainer");
    const positions=[{x:170,y:320}, {x:215,y:305}, {x:260,y:325}];
    positions.forEach(pos=>{
        const steam=document.createElement("div");
        steam.className="steam";
        steam.style.left=pos.x+"px";
        steam.style.top=pos.y+"px";
        container.appendChild(steam);
        steam.addEventListener(
            "animationend",
            ()=>{
                steam.remove();
            }
        );
    });
    setTimeout(()=>{
        Lunch.complete();
    },2200);
}

Lunch.complete=function(){
    this.completed=true;
    Celebration.skip.style.display = "none";
    Celebration.state.lunch=true;
    document.getElementById("lunchOverlay").style.display="none";
    Celebration.image.style.opacity="1";
    Celebration.image.style.pointerEvents="auto";
    Celebration.image.src=Celebration.data.lunch.image;
    Celebration.instruction.style.display="none";
    Celebration.hint.textContent="✦ Tap outside the invitation to continue ✦";
    Celebration.hint.classList.add("show");
    unlockLunchCard();
    moveTimeline(3);
    showCompletedLunch();
    Celebration.timer = setTimeout(()=>{
        if(Celebration.modal.classList.contains("show")){
            Celebration.hide();
        }
    },5000);
}

function unlockLunchCard(){
    const card = document.querySelector('.event-card[data-event="lunch"]');
    if(!card) return;
    card.classList.remove("locked");
    card.querySelector("img").style.filter = "blur(0px)";
    card.querySelector(".card-overlay").style.display = "none";
}

function showCompletedLunch(){
    Lunch.showImage();
    Celebration.skip.style.display = "none";
    Lunch.overlay.style.display="none";
    Celebration.image.src=
    Celebration.data.lunch.image;
    Celebration.instruction.style.display="none";
    Celebration.hint.textContent="✦ Tap outside the invitation to continue ✦";
    Celebration.hint.classList.add("show");
}*/

document.querySelector(".rsvp-form")

.addEventListener(

"submit",

function(e){

    e.preventDefault();

    document
        .getElementById("rsvpSuccess")
        .classList.add("show");

});

const rsvpForm = document.querySelector(".rsvp-form");

document
.getElementById("successClose")
.addEventListener("click",()=>{

    document
        .getElementById("rsvpSuccess")
        .classList.remove("show");

    rsvpForm.reset();

    document
        .querySelectorAll(".side-icon")
        .forEach(icon=>{

            icon.classList.remove(
                "selected",
                "pop"
            );

        });

    document
        .getElementById("rsvpSide")
        .value = "";

});

/*=========================
    CUSTOM RSVP DROPDOWN
=========================*/

const customSelect =
document.getElementById("attendanceSelect");

const trigger =
customSelect.querySelector(".select-trigger");

const selectedText =
customSelect.querySelector(".selected-text");

const hiddenInput =
document.getElementById("attendanceValue");

const options =
customSelect.querySelectorAll(".select-option");

trigger.addEventListener("click", () => {

    customSelect.classList.toggle("open");

});

options.forEach(option => {

    option.addEventListener("click", () => {

        options.forEach(o=>{

            o.classList.remove("selected");

        });

        option.classList.add("selected");

        selectedText.textContent =
            option.textContent;

        hiddenInput.value =
            option.dataset.value;

        customSelect.classList.remove("open");

    });

});

document.addEventListener("click", (e) => {

    if(!customSelect.contains(e.target)){

        customSelect.classList.remove("open");

    }

});