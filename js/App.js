import Background from "./Background.js";
import Player from "./Player.js";
import Wall from "./Wall.js";

export default class App{
    static canvas = document.querySelector('canvas')
    static ctx = App.canvas.getContext('2d')
    static dpr = devicePixelRatio > 1 ? 2 : 1;
    static interval = 1000 / 60
    static width = 1024
    static height = 768

    constructor(){
        this.backgrounds = [
            new Background({img:document.querySelector('#bg3-img'),speed : -1}),
            new Background({img:document.querySelector('#bg2-img'),speed : -2}),
            new Background({img:document.querySelector('#bg1-img'),speed : -4}),
        ]
        this.walls = [
            new Wall({type:'SMALL'})
        ]
        this.player = new Player();
        window.addEventListener('resize', this.resize.bind(this))
    }
    resize(){
        App.canvas.width = App.width * App.dpr;
        App.canvas.height = App.height * App.dpr;
        App.ctx.scale(App.dpr, App.dpr)

        const width = innerWidth > innerHeight ? innerHeight * 0.9 : innerWidth * 0.9
        App.canvas.style.width = width + 'px'
        App.canvas.style.height = width * (3/4) + 'px'
    }
    render(){
        let now, delta;
        let then = Date.now();
        const frame = () => {
            requestAnimationFrame(frame);
            now = Date.now();
            delta = now - then;
            if(delta < App.interval) return;
            //write code here

            //Background
            this.backgrounds.forEach(background => {
                background.update();
                background.draw();
            })

            //Walls
            for(let i = this.walls.length -1;  i>=0; i--){
                this.walls[i].update();
                this.walls[i].draw();
                //remove wall
                if(this.walls[i].isOutSide){
                    this.walls.splice(i,1)
                    continue
                }
                if(this.walls[i].canGenerateNext){
                    this.walls[i].generatedNext = true;
                    this.walls.push(new Wall({type : Math.random() > 0.3 ? 'SMALL' : 'BIG'}))
                }
                if(this.walls[i].isColliding(this.player.boundingBox)){
                    this.player.boundingBox.color = `rgba(255,0,0,.5)`
                }
                else{
                    this.player.boundingBox.color = `rgba(0,0,255,.2)`
                }
            }
            
            //Player
            this.player.update()
            this.player.draw()

            then = now - (delta % App.interval);
        }
        requestAnimationFrame(frame);
    }
}