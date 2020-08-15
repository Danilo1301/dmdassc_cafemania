class TileTopFloor {
  constructor()
  {
  }

  update(delta)
  {
  }
}

class Tile {
  constructor(x, y)
  {
    this.tileKey = `${x}:${y}`;
    this.walkable = true;
    this.mapPos = {x: x, y: y};

    this.container = new PIXI.Container();

    this.sprite = new PIXI.Sprite(Game.resources["tile"].texture);
    this.sprite.anchor.set(0.5)
    this.container.addChild(this.sprite);

    ObjectOrigin.show(this.container, `tile[${this.tileKey}]`);
  }

  update(delta) {
  }
}
