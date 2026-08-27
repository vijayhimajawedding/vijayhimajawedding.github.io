/*====================================
            LOTUS
====================================*/

const Lotus={
    lotus:null,
    timeline:null,
    current:null,
    initialized:false,
    visited:{
        haldi:false,
        mehendi:false,
        wedding:false,
        lunch:false
    }
};

Lotus.init=function(){
    this.lotus=document.getElementById("timelineLotus");
    this.timeline=document.querySelector(".timeline");
}

document.addEventListener("DOMContentLoaded", ()=>{
    Lotus.init();
});

Lotus.reset=function(){
    this.current=null;
    this.initialized=false;
    this.lotus.style.opacity="0";
    this.lotus.style.transform="translate(-50%,-50%) scale(0)";
}

Lotus.moveTo=function(eventName){
    const dot = document.getElementById("dot-" + eventName);
    if(!dot) return;

    // Mark this event as visited

    this.visited[eventName] = true;

    // Make the dot permanently gold

    dot.classList.add("visited");

    // Position relative to the timeline

    const top = dot.offsetTop;

    // First appearance

    if(!this.initialized){
        this.lotus.style.opacity = "1";
        this.lotus.style.transform = "translate(-50%,-50%) scale(1.25)";
        setTimeout(()=>{
            this.lotus.style.transform = "translate(-50%,-50%) scale(1)";
        },250);
        this.initialized = true;
    }

    // Move lotus

    this.lotus.style.top = top + 100 + "px";
    this.current = eventName;
}