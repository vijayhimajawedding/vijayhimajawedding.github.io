/*====================================
        BASE ACTIVITY
====================================*/

class Activity{
    constructor(name){
        this.name = name;
    }

    start(){}

    complete(){
        Controller.completeActivity(
            this.name
        );
    }

    showCompleted(){
        Controller.hint.classList.add("show");
    }
}