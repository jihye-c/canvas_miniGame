import Background from "./Background.js";
import Coin from "./Coin.js";
import GameHandler from "./GameHandler.js";
import Player from "./Player.js";
import Score from "./Score.js";
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
        this.walls = [new Wall({type:'SMALL'})]
        this.player = new Player();
        this.coins = [
            new Coin(700 + this.walls[0].width/2, this.walls[0].y2-this.walls[0].gapY / 2)
        ];
        this.score = new Score();
        this.gameHandler = new GameHandler(this);
        this.reset();
    }
    reset(){
        this.walls = [new Wall({type:'SMALL'})]
        this.player = new Player();
        this.coins = [
            new Coin(700 + this.walls[0].width/2, this.walls[0].y2-this.walls[0].gapY / 2)
        ];
        this.score = new Score();
    }
    init(){
        App.canvas.width = App.width * App.dpr;
        App.canvas.height = App.height * App.dpr;
        App.ctx.scale(App.dpr, App.dpr)
        this.backgrounds.forEach(background => {
            background.draw();
        });
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

            if(this.gameHandler.status !== 'PLAYING') return;

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
                    const newWall = new Wall({type : Math.random() > 0.3 ? 'SMALL' : 'BIG'})
                    this.walls.push(newWall)
                    if(Math.random() < 1){
                        const x = newWall.x + newWall.width / 2
                        const y = newWall.y2 - newWall.gapY / 2
                        this.coins.push(new Coin(x,y,newWall.vx))
                    }
                }

                //colliding
                if(this.walls[i].isColliding(this.player.boundingBox)){
                    this.gameHandler.status = 'FINISHED'
                    break
                }
            }
            
            //Player
            this.player.update()
            this.player.draw()
            if(this.player.y >= App.height || this.player.y + this.player.height <= 0){
                this.gameHandler.status = 'FINISHED'
            }

            //Coin
            for (let i = this.coins.length - 1; i >=0; i--){
                this.coins[i].update();
                this.coins[i].draw();
                if(this.coins[i].x + this.coins[i].width < 0){
                    this.coins.splice(i, 1);
                    continue
                }
                if(this.coins[i].boundingBox.isColliding(this.player.boundingBox)){
                    this.coins.splice(i, 1);
                    this.score.coinCount += 1;
                }
            }

            //score
            this.score.update();
            this.score.draw();

            then = now - (delta % App.interval);
        }
        requestAnimationFrame(frame);
    }
}