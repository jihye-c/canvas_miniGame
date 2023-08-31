import App from "./App.js";

export default class Wall{
    constructor(config){
        this.img = document.querySelector('#wall-img');
        this.type = config.type
        switch(this.type){
            case 'BIG':
                this.sizeX = 18 / 30;
                this.sx = this.img.width * (9/30);
                break
            case 'SMALL':
                this.sizeX = 9 / 30;
                this.sx = this.img.width * (0/30);
                break
        }
        this.width = App.height * this.sizeX
        this.height = App.height;
    }
    update(){

    }
    draw(){
        App.ctx.drawImage(
            this.img,
            this.sx, 0, this.img.width * this.sizeX , this.img.height,
            0, 0, this.width, this.height
            )
    }
}