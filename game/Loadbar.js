class Loadbar {
  constructor(x, y, width, height, options) {
    this.position = {x: x, y: y};
    this.width = width;
    this.height = height;
    this.progress = 0;

    this.container = new PIXI.Container();
    this.container.pivot.set(width/2, height/2);

    this.background = new PIXI.Sprite(Game.resources[options.texture].texture);
    this.background.width = this.width;
    this.background.height = this.height;

    this.mask = new PIXI.Graphics();
    this.mask.beginFill(0xFFFFFF);
    this.mask.drawRect(0, 0, this.width, this.height);
    this.mask.endFill();

    this.background.mask = this.mask;

    this.container.addChild(this.background);
    this.container.addChild(this.mask);
  }

  update()
  {
    this.mask.width = this.progress*this.width;

    this.container.position.x = this.position.x;
    this.container.position.y = this.position.y;
  }

  setProgress(progress)
  {
    this.progress = progress.clamp(0.001, 1);
  }
}
