import App from "./App.js";
import BoundingBox from "./BoundingBox.js";
import { randomNumberBetween } from "./utils.js";

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
        this.gapY = randomNumberBetween(App.height * 0.16, App.height * 0.5)
        this.x = App.width;
        this.vx = -6;
        this.y1 = -this.height + randomNumberBetween(30, App.height - this.gapY - 30)
        this.y2 = this.y1 + this.height + this.gapY;
        this.generatedNext = false
        this.gapNextX = App.width * randomNumberBetween(0.2,0.8)

        this.subtractArea = 45;
        this.boundingBox1 = new BoundingBox(this.x + this.subtractArea, this.y1 + this.subtractArea, this.width - this.subtractArea*2, this.height - this.subtractArea * 2);
        this.boundingBox2 = new BoundingBox(this.x + this.subtractArea, this.y2 + this.subtractArea, this.width - this.subtractArea*2, this.height - this.subtractArea * 2);
    }
    get isOutSide(){
        return this.x + this.width < 0
    }
    get canGenerateNext(){
        return (
            !this.generatedNext && 
            this.x + this.width < this.gapNextX
        )
    }
    update(){
        this.x += this.vx;
        this.boundingBox1.x = this.boundingBox2.x = this.x + this.subtractArea
    }
    isColliding(target){
        return(
            this.boundingBox1.isColliding(target) ||
            this.boundingBox2.isColliding(target)
        )
    }
    draw(){

        App.ctx.drawImage(
            this.img,
            this.sx, 0, this.img.width * this.sizeX , this.img.height,
            this.x, this.y1, this.width, this.height
        )
        App.ctx.drawImage(
            this.img,
            this.sx, 0, this.img.width * this.sizeX , this.img.height,
            this.x, this.y2, this.width, this.height
        )
        this.boundingBox1.draw()
        this.boundingBox2.draw();
    }
}