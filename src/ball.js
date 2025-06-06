import { Graphics } from "pixi.js";
import { Howl } from "howler";

export class Ball extends Graphics {
  constructor(sfx) {
    super();
    this.sfx = sfx;
    this.size = 30;
    this.vx = 4;
    this.vy = 4;
    this.circle(0, 0, this.size / 2)
    .fill({
        color: 0xffffff
    });
    this.reset();
  }

  reset() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.vx = (Math.random() > 0.5 ? 1 : -1) * 2;
    this.vy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 2);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  bounceVertical(limit) {
    if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > limit) {
      this.vy *= -1;

      this.sfx.play('wall');
    }
  }

  checkCollision(paddle) {
    return (
      this.x + this.size / 2 > paddle.x &&
      this.x - this.size / 2 < paddle.x + paddle.width &&
      this.y + this.size / 2 > paddle.y &&
      this.y - this.size / 2 < paddle.y + paddle.height
    );
  }
}