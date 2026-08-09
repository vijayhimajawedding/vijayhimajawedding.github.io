/*====================================
            WEDDING
====================================*/

const Wedding = {

    activity:null,

    drum:null,

    card:null,

    button:null,

    taps:0,

    completed:false,

    revealed:false

};

Wedding.init=function(){

    this.activity =
        document.getElementById(
            "weddingActivityImage"
        );

    this.drum =
        document.getElementById(
            "weddingDrum"
        );

    this.card =
        document.getElementById(
            "weddingCard"
        );

    this.button =
        document.getElementById(
            "weddingRevealBtn"
        );

    this.ripple =
    document.getElementById(
        "drumRipple"
    );

    this.button.onclick = ()=>{

    if(this.revealed) return;

    this.taps = 5;

    this.reveal();

};

this.drum.onclick = ()=>{

    this.tapDrum();

};

this.drum.ontouchstart=(e)=>{

    e.preventDefault();

    this.tapDrum();

};

this.sound = new Audio(
    "assets/music/dappu.mp3"
);

};

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Wedding.init();

    }

);

Wedding.start = function(){

    if(this.completed){

        this.showInvitation();

        return;

    }

    this.taps = 0;

    document.getElementById(
    "weddingProgress"
).style.display = "flex";

    const dots = document.querySelectorAll(
    "#weddingProgress .dot"
);

dots.forEach(dot =>{

    dot.classList.remove("active");

});

    this.revealed = false;

    this.activity.style.display = "block";

    this.activity.style.opacity = "1";

    this.drum.style.display = "block";

    this.drum.style.opacity = "1";

    this.drum.style.filter = "none";

    this.drum.style.transform =
"translate(-50%,-50%) scale(1) rotate(0deg)";

    this.button.style.display = "block";

    this.card.classList.remove("show");

    this.card.style.display = "none";

    Controller.instruction.style.display = "block";

    Controller.instruction.style.opacity = "1";

    Controller.instruction.innerHTML =
        "Beat the ceremonial drum 5 times.";

    Controller.hint.classList.remove("show");

}

Wedding.reveal = function(){

    if(this.completed) return;

    const progress = document.getElementById(
    "weddingProgress"
);

if(progress){

    progress.style.display="none";

}

    this.button.style.display = "none";

    this.drum.style.transition =
    "opacity .4s ease";

    this.drum.style.opacity = "0";

    this.activity.style.transition =
    "opacity .6s ease";

    this.activity.style.opacity = "0";

    setTimeout(()=>{

    this.activity.style.display="none";

    this.drum.style.display = "none";

},600);

    setTimeout(()=>{

    this.card.style.display = "block";

    this.card.classList.add("show");

    Controller.instruction.style.display = "none";

    Controller.hint.textContent =
        "✦Tap outside the invitation to continue✦";

    Controller.hint.classList.add("show");

    this.completed = true;

    setTimeout(()=>{

    Controller.completeActivity(
        "wedding"
    );

    CelebrationState.wedding = true;

    Controller.hide();

},5000);

},900);



}



Wedding.showCompleted = function(){

    this.showInvitation();
}

Wedding.showInvitation=function(){

    this.revealed = true;

    this.completed = true;

    this.activity.style.display = "none";

    this.drum.style.display = "none";

    document.getElementById(
        "weddingProgress"
    ).style.display = "none";

    this.button.style.display = "none";

    this.card.style.display = "block";

requestAnimationFrame(()=>{

    this.card.classList.add("show");

});;

    Controller.instruction.style.display = "none";

    Controller.hint.textContent =
        "✦Tap outside the invitation to continue✦";

    Controller.hint.classList.add("show");

}

Wedding.tapDrum = function(){

    if(this.completed) return;

    if(this.revealed) return;

    this.taps++;

    const dots = document.querySelectorAll(
    "#weddingProgress .dot"
);

dots.forEach((dot,index)=>{

    dot.classList.toggle(
        "active",
        index < this.taps
    );

});

    this.sound.currentTime = 0;
this.sound.play();

this.ripple.classList.remove("show");

void this.ripple.offsetWidth;

this.ripple.classList.add("show");

    // Drum animation
    this.drum.style.transform =
"translate(-50%,-50%) scale(1.12) rotate(-4deg)";

this.drum.style.filter =
"drop-shadow(0 0 18px rgba(255,215,0,.9))";

setTimeout(()=>{

    this.drum.style.transform =
    "translate(-50%,-50%) scale(.96) rotate(2deg)";

},80);

setTimeout(()=>{

    this.drum.style.transform =
    "translate(-50%,-50%) scale(1) rotate(0deg)";

    this.drum.style.filter = "none";

},170);

    

    console.log("Wedding taps:",this.taps);

    if(this.taps == 5){

    this.drum.style.filter =
    "drop-shadow(0 0 30px gold)";

}
    
    if(this.taps>=5){

        this.revealed = true;

        this.drum.animate([

    {

        transform:
        "translate(-50%,-50%) scale(1)"

    },

    {

        transform:
        "translate(-50%,-50%) scale(1.18)"

    },

    {

        transform:
        "translate(-50%,-50%) scale(1)"

    }

],{

    duration:500,

    easing:"ease-out"

});   

        setTimeout(()=>{

            this.reveal();

        },1000);

    }

}

