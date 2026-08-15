/*====================================
            HALDI V2
====================================*/

const Haldi = {
    card: null,
    canvas: null,
    button: null,
    ctx: null,
    texture: null,
    scratching: false,
    revealed: false,
    brushSize: 34,
    threshold: 35,
    scratchCount:0
};

Haldi.init = function(){
    this.card = document.getElementById("haldiCard");
    this.canvas = document.getElementById("haldiScratchCanvas");
    this.button = document.getElementById("haldiRevealBtn");
    this.ctx = this.canvas.getContext("2d",{ willReadFrequently:true });

    // Preload the overlay texture once, up front,
    // so it's already cached by the time start() runs.

    this.texture = new Image();
    this.texture.src = "assets/images/haldi-overlay.png";
    this.button.onclick = ()=>{
        this.reveal();
    };
}

Haldi.start = function(){
    this.revealed = false;
    this.scratching = false;
    this.scratchCount = 0;

    // Keep the canvas invisible/non-interactive until the
    // overlay texture has actually been painted onto it —
    // otherwise the card underneath flashes through first.

    this.canvas.style.display = "block";
    this.canvas.style.opacity = "0";
    this.canvas.style.pointerEvents = "none";
    this.button.style.display = "none";
    this.resizeCanvas();
    this.loadOverlay();
    this.bindEvents();
}

Haldi.resizeCanvas = function(){
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
}

Haldi.loadOverlay = function(){
    const paintOverlay = ()=>{
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.drawImage(
            this.texture,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Only now reveal the canvas — the overlay is
        // already painted, so there's nothing to flash.

        this.canvas.style.opacity = "1";
        this.canvas.style.pointerEvents = "auto";
        this.button.style.display = "block";
    };

    // If the (preloaded) texture is already cached, this
    // paints synchronously with no visible delay at all.

    if(this.texture.complete && this.texture.naturalWidth !== 0){
        paintOverlay();
    }
    else{
        this.texture.onload = paintOverlay;
    }
}

Haldi.getPoint = function(e){
    const rect = this.canvas.getBoundingClientRect();
    if(e.touches){
        return{
            x:e.touches[0].clientX - rect.left,
            y:e.touches[0].clientY - rect.top
        };
    }
    return{
        x:e.clientX - rect.left,
        y:e.clientY - rect.top
    };
}

Haldi.reveal = function(){
    if(this.revealed) return;
    this.revealed = true;
    this.scratching = false;
    this.button.style.display = "none";
    this.canvas.style.transition = "opacity .8s ease";
    this.canvas.style.opacity = "0";
    setTimeout(()=>{
        this.canvas.style.display = "none";
        this.complete();
    },800);
}

Haldi.complete = function(){
    Controller.hint.classList.add("show");
    CelebrationState.haldi = true;
    Controller.instruction.style.opacity = "0";
    setTimeout(()=>{
        Controller.instruction.style.display = "none";
    },300);
    Controller.completeActivity("haldi");
    Controller.autoCloseTimer = setTimeout(()=>{
        if(Controller.modal.classList.contains("show")){
            Controller.hide();
        }
    },5000);
}

Haldi.checkProgress = function(){
    if(this.revealed) return;
    const pixels = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
    ).data;
    let transparent = 0;
    for(
        let i=3;
        i<pixels.length;
        i+=4
    ){
        if(pixels[i]===0){
            transparent++;
        }
    }
    const percent = transparent/(this.canvas.width*this.canvas.height)*100;
    if(percent>=this.threshold){
        this.reveal();
    }
}

Haldi.scratch = function(x,y){
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.beginPath();
    this.ctx.arc(
        x,
        y,
        this.brushSize,
        0,
        Math.PI * 2
    );
    this.ctx.fill();
    this.scratchCount++;
    if(this.scratchCount>=18){
        this.scratchCount=0;
        this.checkProgress();
    }
}

Haldi.bindEvents = function(){
    const self = this;
    const canvas = self.canvas;
    canvas.onmousedown = function(){
        self.scratching = true;
    };
    canvas.onmouseup = function(){
        self.scratching = false;
    };
    canvas.onmouseleave = function(){
        self.scratching = false;
    };
    canvas.onmousemove = function(e){
        if(!self.scratching) return;
        const p = self.getPoint(e);
        self.scratch(
            p.x,
            p.y
        );
    };
    canvas.ontouchstart = function(){
        self.scratching = true;
    };
    canvas.ontouchend = function(){
        self.scratching = false;
    };
    canvas.ontouchmove = function(e){
        e.preventDefault();
        if(!self.scratching) return;
        const p = self.getPoint(e);
        self.scratch(
            p.x,
            p.y
        );
    };
};

document.addEventListener("DOMContentLoaded", ()=>{
    Haldi.init();
});


Haldi.showCompleted = function(){
    this.button.style.display = "none";
    this.canvas.style.display = "none";
    Controller.hint.classList.add("show");
}