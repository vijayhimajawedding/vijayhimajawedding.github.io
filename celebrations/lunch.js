/*====================================
            LUNCH
====================================*/

const Lunch={
    activity:null,
    hand:null,
    card:null,
    button:null,
    dragging:false,
    startPointerX:0,
    currentProgress:0,
    maxDrag:260,
    revealed:false,
    completed:false,
    stage:1,
    startX:0,
    progress:0
};

Lunch.init=function(){
    this.activity = document.getElementById("lunchActivityImage");
    this.hand = document.getElementById("lunchHand");
    this.card = document.getElementById("lunchCard");
    this.button = document.getElementById("lunchRevealBtn");
    this.path={
        start:{
            left:45,
            top:87,
            angle:-36
        },
        end:{
            left:80,
            top:86,
            angle:0
        }
    };
    this.button.onclick=()=>{
        if(this.revealed) return;
        this.stage = 2;
        this.activity.src = "assets/images/lunch/lunch-activity-3.png";
        this.hand.style.display = "none";
        setTimeout(()=>{
            this.reveal();
        },700);
    };
    this.bindEvents();
}

document.addEventListener("DOMContentLoaded", ()=>{
    Lunch.init();
});

Lunch.resetHand=function(){
    this.hand.style.left = this.path.start.left+"%";
    this.hand.style.top = this.path.start.top+"%";
    this.hand.style.transform = `translate(-50%,-50%) rotate(${this.path.start.angle}deg)`;
}

Lunch.moveHand=function(progress){
    progress=Math.max(
        0,
        Math.min(progress,1)
    );
    this.currentProgress=progress;
    const left = this.path.start.left + (this.path.end.left - this.path.start.left) * progress;
    const top = this.path.start.top + (this.path.end.top - this.path.start.top) * progress;
    const angle = this.path.start.angle + (this.path.end.angle - this.path.start.angle) * progress + Math.sin(progress * Math.PI) * 5;
    this.hand.style.left = left+"%";
    this.hand.style.top = top+"%";
    this.hand.style.transform =
        `translate(-50%,-50%)
        rotate(${angle}deg)
        scale(${1 - progress * 0.05})`;
}

Lunch.dragStart=function(e){
    if(this.completed) return;
    if(this.revealed) return;
    this.dragging=true;
    if(e.touches){
        this.startX = e.touches[0].clientX;
    }
    else{
        this.startX = e.clientX;
    }
}

Lunch.dragMove=function(e){
    if(!this.dragging) return;
    if(e.touches){
        e.preventDefault();
    }
    let currentX;
    if(e.touches){
        currentX = e.touches[0].clientX;
    }
    else{
        currentX = e.clientX;
    }
    const distance = currentX - this.startX;
    const progress = Math.max(this.progress, distance / 220);
    this.moveHand(progress);
    if(progress>=1){
        this.dragging=false;
        this.completeStage();
    }
}

Lunch.dragStop=function(){
    if(!this.dragging) return;
    this.dragging=false;
}

Lunch.completeStage=function(){
    this.activity.style.opacity="0";
    setTimeout(()=>{
        if(this.stage===1){
            this.stage=2;
            this.activity.style.opacity=".35";
            setTimeout(()=>{
                this.activity.src = "assets/images/lunch/lunch-activity-2.png";
                this.activity.style.opacity="1";
            },150);
            this.activity.style.opacity="1";
            this.hand.style.transition="all .45s ease";
            this.resetHand();
            Controller.instruction.innerHTML = "One more wipe.";
            setTimeout(()=>{
                this.hand.style.transition="none";
            },450);
        }
        else{
            this.activity.style.opacity = ".35";
            setTimeout(()=>{
                this.activity.src = "assets/images/lunch/lunch-activity-3.png";
                this.activity.style.opacity="1";
            },150);
            this.activity.style.opacity="1";
            this.hand.style.transition="all .5s ease";
            this.hand.style.transform += " translateY(-25px)";
            this.hand.style.opacity="0";
            setTimeout(()=>{
                this.reveal();
            },800);
        }
    },250);
}

Lunch.reveal=function(){
    if(this.revealed) return;
    this.revealed=true;
    this.button.style.display="none";
    this.activity.style.opacity="0";
    this.hand.style.display="none";
    setTimeout(()=>{
        this.activity.style.display="none";
        this.card.style.display="block";
        this.card.classList.add("show");
        Controller.instruction.style.display="none";
        Controller.hint.textContent="✦Tap outside the invitation to continue✦";
        Controller.hint.classList.add("show");
        this.completed=true;
        setTimeout(()=>{
            Controller.completeActivity("lunch");
            Controller.hide();
        },5000);
    },700);
}

Lunch.showCompleted=function(){
    this.showInvitation();
}

Lunch.showInvitation=function(){
    this.activity.style.display="none";
    this.hand.style.display="none";
    this.button.style.display="none";
    this.card.style.display="block";
    this.card.classList.add("show");
    Controller.instruction.style.display="none";
    Controller.hint.textContent="✦Tap outside the invitation to continue✦";
    Controller.hint.classList.add("show");
}

Lunch.bindEvents=function(){
    const hand=this.hand;
    hand.onmousedown=(e)=>{
        this.dragStart(e);
    };
    document.onmousemove=(e)=>{
        this.dragMove(e);
    };
    document.onmouseup=()=>{
        this.dragStop();
    };
    hand.ontouchstart=(e)=>{
        this.dragStart(e);
    };
    document.ontouchmove=(e)=>{
        this.dragMove(e);
    };
    document.ontouchend=()=>{
        this.dragStop();
    };
}

Lunch.start=function(){
    if(this.completed){
        this.showCompleted();
        return;
    }
    this.stage=1;
    this.revealed=false;
    this.dragging=false;
    this.progress=0;
    this.activity.src="assets/images/lunch/lunch-activity-1.png";
    this.activity.style.display="block";
    this.activity.style.opacity="1";
    this.hand.style.display="block";
    this.hand.style.opacity="1";
    this.button.style.display="block";
    this.card.style.display="none";
    this.card.classList.remove("show");
    Controller.instruction.style.display="block";
    Controller.instruction.style.opacity="1";
    Controller.instruction.innerHTML="Drag the hand to clean the leaf.";
    Controller.hint.classList.remove("show");
    this.resetHand();
}