class TileTopFloor {
  constructor(tile)
  {
    this.container = new PIXI.Container();

    this.background = new PIXI.Graphics();
    this.background.beginFill(0xFFFFFF);
    this.background.drawRect(-5, -5, 10, 10);
    this.background.endFill();
    this.background.alpha = 0;
    this.container.addChild(this.background);
    //this.container.pivot.set(tile.width/2, tile.height/2);

    this.tile = tile;
  }

  update(delta)
  {
    this.container.x = this.tile.container.x;
    this.container.y = this.tile.container.y;
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
    //this.container.pivot.set(this.width/2, this.height/2);

    this.size = [1,1];

    this.text = new PIXI.Text('_', SceneTileMap.tileFontStyle);
    //this.text.position.set(this.width/2, this.height/2);
    this.text.anchor.set(0.5);
    this.container.addChild(this.text);

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x00FF00);
    this.background.drawRect(-5, -5, 10, 10);
    this.background.endFill();
    this.background.alpha = 0;
    this.container.addChild(this.background);

    this.topFloor = new TileTopFloor(this);
    SceneGameObjects.addObject(this.topFloor);
  }

  setAsNotWalkable()
  {
    this.walkable = false;
  }

  addFloor(floor)
  {
    if(this.floor) { this.floor.container.destroy(); }
    this.floor = floor;
    this.container.addChild(floor.container)

    floor.setup(this);
  }

  addObject(object)
  {
    this.objects[object.uniqueid] = object;
    this.topFloor.container.addChild(object.container)


    object.setup(this);

    this.updateObjectsSize()
  }

  updateObjectsSize()
  {
    this.size = [1,1];
    for (var object_unique_id in this.objects) {
      var object = this.objects[object_unique_id];

      if(object.size[0] > this.size[0]) { this.size[0] = object.size[0] }
      if(object.size[1] > this.size[1]) { this.size[1] = object.size[1] }
    }
  }

  update(delta) {}
}
