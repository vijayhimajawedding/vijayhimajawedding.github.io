/*====================================
            MEHENDI
====================================*/

const Mehendi={
    card:null,
    canvas:null,
    ctx:null,
    button:null,
    lastX:0,
    lastY:0,
    drawing:false,
    revealed:false,
    completed:false,
    brushSize:8,
    leftDone:false,
    topDone:false,
    rightDone:false,
    maskImage:null,
    maskCanvas:null,
    maskCtx:null,
    progress:{
    left:0,
    top:0,
    right:0,
    },
    completionTarget:40,
    lastPaintPoint:{
        left:null,
        top:null,
        right:null
    },
};

Mehendi.init=function(){
    this.card=document.getElementById("mehendiCard");
    this.canvas=document.getElementById("mehendiCanvas");
    this.button=document.getElementById("mehendiRevealBtn");
    this.button.onclick = ()=>{
        if(this.revealed) return;
        this.leftDone = true;
        this.topDone = true;
        this.rightDone = true;
        this.updateFlower();
        setTimeout(()=>{
            this.reveal();
        },800);
    };
    this.ctx=this.canvas.getContext("2d");
    this.maskImage = new Image();
    this.maskImage.src = "assets/images/mehendi/rgb-mask.png";
    this.maskCanvas = document.createElement("canvas");
    this.maskCtx = this.maskCanvas.getContext("2d");
    this.maskImage.onload = ()=>{
        this.maskCanvas.width = this.maskImage.width;
        this.maskCanvas.height = this.maskImage.height;
        this.maskCtx.drawImage(this.maskImage, 0, 0);
    };
    this.bindEvents();
}

Mehendi.start = function(){
    if(this.completed){
        this.button.style.display = "none";
        this.canvas.style.display = "none";
        this.showInvitation();
        return;
    }
    Controller.hint.classList.remove("show");
    this.revealed = false;
    this.leftDone = false;
    this.topDone = false;
    this.rightDone = false;
    this.progress.left=0;
    this.progress.top=0;
    this.progress.right=0;
    this.lastPaintPoint.left=null;
    this.lastPaintPoint.top=null;
    this.lastPaintPoint.right=null;
    this.drawing = false;
    this.canvas.style.display = "block";
    this.canvas.style.opacity = "1";
    this.canvas.style.pointerEvents = "auto";
    this.button.style.display = "block";
    Controller.instruction.style.display = "block";
    Controller.instruction.style.opacity = "1";
    Controller.instruction.innerHTML = "Draw mehendi on each petal.";
    Controller.hint.classList.remove("show");
    this.resizeCanvas();
    this.prepareCanvas();
    this.card.style.opacity = "1";
    this.card.src = "assets/images/mehendi/mehendi-0.png";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Mehendi.resizeCanvas = function(){
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
}

Mehendi.prepareCanvas = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Mehendi.reveal=function(){
    if(this.revealed) return;
    this.revealed=true;
    this.drawing=false;
    this.button.style.display="none";
    this.canvas.style.transition="opacity .8s ease";
    this.canvas.style.opacity="0";
    setTimeout(()=>{
        this.canvas.style.display="none";
        this.card.style.opacity = "0";
        setTimeout(()=>{
            this.card.src = "assets/images/mehendi-card.png";
            this.completed = true;
            this.card.style.opacity = "1";
        },400);
        Controller.instruction.style.display = "none";
        Controller.hint.textContent = "✦Tap outside the invitation to continue✦";
        Controller.hint.classList.add("show");
        setTimeout(()=>{
            Controller.completeActivity("mehendi");
            Controller.hide();
        },5000);
    },1200);
}

Mehendi.showCompleted = function(){
    this.showInvitation();
}

Mehendi.showInvitation=function(){
    this.card.src = "assets/images/mehendi-card.png";
    this.canvas.style.display = "none";
    this.button.style.display = "none";
    Controller.instruction.style.display = "none";
    Controller.hint.textContent = "✦Tap outside the invitation to continue✦";
    Controller.hint.classList.add("show");
}

Mehendi.updateFlower=function(){
    let file="mehendi-0.png";
    if(this.leftDone && !this.topDone && !this.rightDone){
        file="mehendi-left.png";
    }
    else if(!this.leftDone && this.topDone && !this.rightDone){
        file="mehendi-top.png";
    }
    else if(!this.leftDone && !this.topDone && this.rightDone){
        file="mehendi-right.png";
    }
    else if(this.leftDone && this.topDone && !this.rightDone){
        file="mehendi-top-left.png";
    }
    else if(this.leftDone && !this.topDone && this.rightDone){
        file="mehendi-left-right.png";
    }
    else if(!this.leftDone && this.topDone && this.rightDone){
        file="mehendi-top-right.png";
    }
    else if(this.leftDone && this.topDone && this.rightDone){
        file="mehendi-all.png";
    }
    this.card.src = "assets/images/mehendi/"+file;
    console.log(this.card.src);
}

Mehendi.getPoint=function(e){
    const rect = this.canvas.getBoundingClientRect();
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

Mehendi.getMaskColor=function(x,y){
    const maskX = Math.round(x * this.maskCanvas.width / this.canvas.width);
    const maskY = Math.round(y * this.maskCanvas.height / this.canvas.height);
    const pixel = this.maskCtx.getImageData(maskX, maskY, 1, 1).data;
    return{
        r:pixel[0],
        g:pixel[1],
        b:pixel[2]
    };
}

Mehendi.draw=function(x,y){
    if(this.revealed) return;
    const c=this.getMaskColor(x,y);
    let petal=null;
    if(c.r>200){
        petal="left";
    }
    else if(c.g>200){
        petal="top";
    }
    else if(c.b>200){
        petal="right";
    }
    else{
        return;
    }
    if(this[petal+"Done"]) return;
    this.ctx.beginPath();
    this.ctx.moveTo(
        this.lastX,
        this.lastY
    );
    this.ctx.lineTo(
        x,
        y
    );
    this.ctx.strokeStyle = "#5B2C16";
    this.ctx.lineWidth = this.brushSize + 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.globalAlpha = 0.92;
    this.ctx.shadowColor = "#3b1d10";  
    this.ctx.shadowBlur = 2;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
    this.lastX=x;
    this.lastY=y;
    const last = this.lastPaintPoint[petal];
    if(
    !last || Math.hypot(
        x-last.x,
        y-last.y
    ) > 16
    ){
        this.progress[petal]++;
        this.lastPaintPoint[petal]={
            x,
            y
        };
    }
    console.log(this.progress);
    if(this.progress[petal] >= this.completionTarget){
        this.completePetal(petal);
    }
}

Mehendi.completePetal=function(petal){
    console.log("Complete function entered");
    if(this[petal+"Done"]) return;
    this[petal+"Done"]=true;
    this.ctx.globalAlpha=1;
    this.card.style.opacity = "0";
    setTimeout(()=>{
        this.prepareCanvas();
        this.updateFlower();
        this.card.style.opacity="1";
    },180);
    console.log(petal, "completed");
    if(this.leftDone && this.topDone && this.rightDone){
        setTimeout(()=>{
            console.log("Calling reveal...");
            this.reveal();
        },800);
    }
}

Mehendi.bindEvents=function(){
    const self=this;
    const canvas=self.canvas;
    canvas.onmousedown=function(e){
        self.drawing=true;
        const p=self.getPoint(e);
        self.lastX=p.x;
        self.lastY=p.y;
    };
    canvas.onmouseup=function(){
        self.drawing=false;
    };
    canvas.onmouseleave=function(){
        self.drawing=false;
    };
    canvas.onmousemove=function(e){
        if(!self.drawing) return;
        const p=self.getPoint(e);
        self.draw(
            p.x,
            p.y
        );
    };
    canvas.ontouchstart=function(e){
        self.drawing=true;
        const p=self.getPoint(e);
        self.lastX=p.x;
        self.lastY=p.y;
    };
    canvas.ontouchend=function(){
        self.drawing=false;
    };
    canvas.ontouchmove=function(e){
        e.preventDefault();
        if(!self.drawing) return;
        const p=self.getPoint(e);
        self.draw(
            p.x,
            p.y
        );
    };
}

document.addEventListener("DOMContentLoaded", ()=>{
    Mehendi.init();
});