class Button {
  constructor(x, y, width, height, options)
  {
    this.position = {x: x, y: y};
    this.width = width;
    this.height = height;
    this.targetScale = 1;
    this.onclick = null;

    this.container = new PIXI.Container();

    this.sprite = new PIXI.Sprite.from(options.background_src);
    this.sprite.anchor.set(0.5);
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    this.sprite.on('mousedown', this.onMouseDown.bind(this));
    this.sprite.on('mouseup', this.onMouseUp.bind(this));
    this.sprite.on('mouseover', this.onMouseOver.bind(this));
    this.sprite.on('mouseout', this.onMouseOut.bind(this));

    this.container.addChild(this.sprite);
  }

  onMouseOver(event)
  {
    this.targetScale = 1.05;
  }

  onMouseOut(event)
  {
    this.targetScale = 1;
  }

  onMouseDown(event)
  {
    this.targetScale = 1.0;
  }

  onMouseUp(event)
  {
    this.targetScale = 1.05;
    if(this.onclick) { this.onclick(); }
    console.log("action")
  }

  update()
  {
    this.sprite.scale.set( Math.lerp(this.sprite.scale.x, this.targetScale, 0.5));

    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }
}
