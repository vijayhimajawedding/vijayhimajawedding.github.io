/*====================================
        CELEBRATION V2 CONTROLLER
====================================*/

const Controller = {
    current: null,
    modal: null,
    title: null,
    body: null,
    instruction: null,
    hint: null,
    init(){
        this.modal = document.getElementById("celeV2Modal");
        this.title = document.getElementById("celeV2Title");
        this.body = document.getElementById("celeV2Body");
        this.instruction = document.getElementById("celeV2Instruction");
        this.hint = document.getElementById("celeV2Hint");
        this.bindCards();
        this.modal.addEventListener("click", (e)=>{
            if(e.target===this.modal){
                this.hide();
                this.hint.classList.remove("show");
            }
        });
        this.closeBtn = document.getElementById("celeV2Close");
        this.closeBtn.onclick = ()=>{
            this.hide();
        };
    }
};

Controller.show = function(){
    this.modal.classList.add("show");
}

Controller.hide = function(){
    clearTimeout(this.autoCloseTimer);
    this.modal.classList.remove("show");
}

Controller.completeActivity = function(activity){
    CelebrationState[activity] = true;
    unlockCard(activity);
    this.hint.classList.add("show");
}

function unlockCard(activity){
    const card = document.querySelector(
        `.event-card[data-event="${activity}"]`
    );
    if(!card) return;
    card.classList.remove("locked");
    const image = card.querySelector("img");
    if(image){
        image.style.filter = "blur(0px)";
    }
    const overlay = card.querySelector(".card-overlay");
    if(overlay){
        overlay.style.display = "none";
    }
}

Controller.reset = function(){
    document.querySelectorAll(".cele-activity").forEach(activity=>{
        activity.classList.remove("active");
    });
    this.hint.classList.remove("show");
    this.instruction.textContent="";
    this.title.textContent="";
    this.instruction.style.display = "block";
    this.instruction.style.opacity = "1";
}

document.addEventListener("DOMContentLoaded", ()=>{
    Controller.init();
});

Controller.open = function(eventName){
    this.current = eventName;
    Lotus.moveTo(eventName);
    this.reset();
    this.show();
    this.title.textContent = this.data[eventName].title;
    const completed = CelebrationState[eventName];
    if(completed){
        this.instruction.style.display = "none";
    }
    else{
        this.instruction.style.display = "block";
        this.instruction.style.opacity = "1";
        this.instruction.textContent = this.data[eventName].instruction;
    }
    this.showActivity(eventName + "Activity");
    switch(eventName){
        case "haldi":
            CelebrationState.haldi
                ? Haldi.showCompleted()
                : Haldi.start();
        break;

        case "mehendi":
        Mehendi.start();
        break;

        case "wedding":
            CelebrationState.wedding
                ? Wedding.showCompleted()
                : Wedding.start();
        break;

        case "lunch":
            CelebrationState.lunch
                ? Lunch.showCompleted()
                : Lunch.start();
        break;
    }
}

Controller.data = {
    haldi:{
        title:"Haldi",
        instruction:"Rub the turmeric layer."
    },

    mehendi:{
        title:"Mehendi",
        instruction:"Draw mehendi on each petal."
    },

    wedding:{
        title:"Wedding",
        instruction:"Beat the ceremonial drum."
    },

    lunch:{
        title:"Lunch",
        instruction:"Drag the hand to clean the leaf."
    }
};

Controller.bindCards = function(){
    document.querySelectorAll(".event-card").forEach(card=>{
        card.addEventListener("click", ()=>{
            this.open(
                card.dataset.event
            );
        });
    });
}

Controller.showActivity = function(id){
    document.querySelectorAll(".cele-activity").forEach(activity=>{
        activity.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
}