import { Application, Text, TextStyle, Graphics } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Paddle } from "./paddle.js";
import { Ball } from "./ball.js";
import { Sfx } from './Sfx.js';

export class PongGame {
  constructor() {
    this.app = new Application();
    this.sfx = new Sfx();
    this.keys = {};
    this.leftScore = 0;
    this.rightScore = 0;
    this.winningScore = 11;

    this.init();
  }

  async init() {
    await this.app.init({
      resizeTo: window,
      backgroundColor: 0x000000,
    });

    this.app.canvas.style.position = "absolute";
    document.body.appendChild(this.app.canvas);
    
    initDevtools(this.app);
    this.createEntities();
    this.setupInput();
    this.app.ticker.add(() => this.update());
  }

  createEntities() {
    const centerLine = new Graphics();
    const segmentHeight = 15;
    const gap = 10;
    const x = window.innerWidth / 2 - 2;

    for (let y = 0; y <= window.innerHeight; y += segmentHeight + gap) {
      centerLine.fill({
        color: 0xa6a6a6})
        .rect(x, y, + 7.5, 4, segmentHeight);
    }

    this.app.stage.addChild(centerLine);

    this.leftPaddle = new Paddle(50);
    this.rightPaddle = new Paddle(window.innerWidth - 70);
    this.ball = new Ball(this.sfx);

    this.app.stage.addChild(this.leftPaddle, this.rightPaddle, this.ball);

    const textStyle = new TextStyle({
      fontFamily: "Orbitron",
      fontSize: 124,
      fill: 0xffffff,
    });

    this.leftScoreText = new Text({
        text: '0',
        style: textStyle
    });
    this.rightScoreText = new Text({
        text: '0',
        style: textStyle
    });

    this.leftScoreText.x = window.innerWidth / 4;
    this.rightScoreText.x = (window.innerWidth * 3) / 4;
    this.leftScoreText.y = this.rightScoreText.y = 20;

    this.app.stage.addChild(this.leftScoreText, this.rightScoreText);


    this.winnerText = new Text({
        text: '',
        style: textStyle,
        fill: 0xff0000,
        align: 'center'
    });

    this.winnerText.anchor.set(0.5);
    this.winnerText.x = this.app.canvas.width / 2;
    this.winnerText.y = this.app.canvas.height / 2;

    this.app.stage.addChild(this.winnerText);
  }

  setupInput() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      if (e.key.toLowerCase() === "r") {
        this.leftScore = 0;
        this.rightScore = 0;
        this.updateScore();

        this.winnerText.text = '';
        this.ball.reset();
        this.app.ticker.start();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  update() {
    const height = this.app.canvas.height;

    if (this.keys["w"])
        this.leftPaddle.move(-5, height);
    if (this.keys["s"])
        this.leftPaddle.move(5, height);
    if (this.keys["ArrowUp"])
        this.rightPaddle.move(-5, height);
    if (this.keys["ArrowDown"])
        this.rightPaddle.move(5, height);

    this.ball.update();
    this.ball.bounceVertical(height);

    if (this.ball.checkCollision(this.leftPaddle)) {
        this.ball.vx = Math.min(Math.abs(this.ball.vx) * 1.03, 8);
        this.ball.vx = Math.abs(this.ball.vx);

        const paddleCenter = this.leftPaddle.y + this.leftPaddle.height / 2;
        const offset = (this.ball.y - paddleCenter) / (this.leftPaddle.height / 2);

        const minVy = 1.5;
        const maxVy = 6;

        this.ball.vy = offset * maxVy;

        if (Math.abs(this.ball.vy) < minVy) {
            this.ball.vy = minVy * Math.sign(this.ball.vy || 1); // jakby było 0, to daj 1
        }

        this.sfx.play('paddle');
    }

    if (this.ball.checkCollision(this.rightPaddle)) {
        this.ball.vx = Math.min(Math.abs(this.ball.vx) * 1.03, 8);
        this.ball.vx = -Math.abs(this.ball.vx);

        const paddleCenter = this.rightPaddle.y + this.rightPaddle.height / 2;
        const offset = (this.ball.y - paddleCenter) / (this.rightPaddle.height / 2);

        const minVy = 1.5;
        const maxVy = 6;

        this.ball.vy = offset * maxVy;

        if (Math.abs(this.ball.vy) < minVy) {
            this.ball.vy = minVy * Math.sign(this.ball.vy || 1); // jakby było 0, to daj 1
        }
        this.sfx.play('paddle');
    }

    if (this.ball.x < 0) {
      this.rightScore++;
      this.updateScore();
      this.sfx.play('score');
      this.ball.reset();
    } 
    else if (this.ball.x > this.app.canvas.width) {
      this.leftScore++;
      this.updateScore();
      this.sfx.play('score');
      this.ball.reset();
    }
  }

    updateScore() {
        this.leftScoreText.text = this.leftScore.toString();
        this.rightScoreText.text = this.rightScore.toString();

        if (this.leftScore >= this.winningScore || this.rightScore >= this.winningScore)
            this.endGame();
  }

  endGame() {
    console.log('Game Over!');
    this.app.ticker.stop();

    if (this.leftScore >= this.winningScore){
        this.winnerText.text = 'Player 1 WINS!';
    }
    else if (this.rightScore >= this.winningScore){
        this.winnerText.text = 'Player 2 WINS!';
    }
  }
}
