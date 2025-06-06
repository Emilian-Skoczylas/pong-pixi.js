export class Paddle extends PIXI.Graphics {
  constructor(x) {
    super();
    this.rect(0, 0, 20, 150);
    this.fill({
        color: 0xffffff
    });
    this.x = x;
    this.y = window.innerHeight / 2 - 75;
  }

  move(dy, limit) {
    this.y = Math.max(0, Math.min(this.y + dy, limit - this.height));
  }
}