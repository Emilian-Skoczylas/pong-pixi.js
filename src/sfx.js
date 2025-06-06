export class Sfx {
  constructor() {
    this.sounds = {
      wall: new Howl({ src: ['./audio/hit_wall.mp3'] }),
      paddle: new Howl({ src: ['./audio/hit_paddle.mp3'] }),
      score: new Howl({ src: ['./audio/score.mp3'] }),
    };
  }

  play(type) {
    const sound = this.sounds[type];
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound "${type}" not found.`);
    }
  }
}
