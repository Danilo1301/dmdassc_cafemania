class Loadbar {
  constructor(x, y, width, height, options) {
    this.position = {x: x, y: y};
    this.width = width;
    this.height = height;

    this.container = new PIXI.Container();
    this.container.pivot.set(width/2, height/2);

    this.background = PIXI.Sprite.from(options.background_src);
    this.background.width = this.width;
    this.background.height = this.height;

    this.mask = PIXI.Sprite.from('assets/images/loadbar_mask.png');
    this.mask.width = this.width;
    this.mask.height = this.height;

    this.progress = 0;

    this.container.addChild(this.background);
    this.container.addChild(this.mask);

    this.background.mask = this.mask;
  }

  update()
  {
    this.mask.width = this.progress*this.width;

    this.container.position.x = this.position.x;
    this.container.position.y = this.position.y;
  }

  setProgress(progress)
  {
    this.progress = progress.clamp(0, 1);
  }
}
