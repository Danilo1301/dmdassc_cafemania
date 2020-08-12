class Tile {
  constructor()
  {
    this.width = 158;
    this.height = 79;

    this.floor;

    this.container = new PIXI.Container();
    this.container.pivot.set(this.width/2, this.height/2);

    this.sprite = new PIXI.Sprite(Game.resources['tile'].texture);
    this.container.addChild(this.sprite);

    this.text = new PIXI.Text('_', SceneTileMap.tileFontStyle);
    this.text.position.set(this.width/2, this.height/2);
    this.text.anchor.set(0.5);
    this.container.addChild(this.text);

    this.background = new PIXI.Graphics();
    this.background.beginFill(0xFFFFFF);
    this.background.drawRect(0, 0, this.width, this.height);
    this.background.endFill();
    this.background.alpha = 0.0;
    this.container.addChild(this.background);
  }

  setAsNotWalkable()
  {
    this.walkable = false;
    this.background.tint = 0;
    this.background.alpha = 0.5;
  }

  update(delta) {}
}
