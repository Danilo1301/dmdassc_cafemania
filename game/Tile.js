class TileTopFloor {
  constructor(tile)
  {
    this.container = new PIXI.Container();

    this.background = new PIXI.Graphics();
    this.background.beginFill(0xFFFFFF);
    this.background.drawRect(0, 0, tile.width, tile.height);
    this.background.endFill();
    this.background.alpha = 0.0;
    this.container.addChild(this.background);
    this.container.pivot.set(tile.width/2, tile.height);

    this.position = {x: 0, y: 0};
    this.tile = tile;
  }

  update(delta)
  {
    this.position.x = this.tile.container.x;
    this.position.y = this.tile.container.y;


    this.container.x = this.position.x;
    this.container.y = this.position.y;
  }
}

class Tile {
  constructor()
  {
    this.width = 158;
    this.height = 79;

    this.floor;
    this.objects = {};

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

    this.topFloor = new TileTopFloor(this);
    SceneGameObjects.addObject(this.topFloor);
  }

  setAsNotWalkable()
  {
    this.walkable = false;
    this.background.tint = 0;
    this.background.alpha = 0.5;
  }

  addFloor(floor)
  {
    this.floor = floor;
    this.container.addChild(floor.container)
  }

  addObject(object)
  {
    this.objects[object.uniqueid] = object;
    this.topFloor.container.addChild(object.container)
  }

  update(delta) {}
}
