TILE_ITEM_TYPE = {
  FLOOR: 0,
  COOKER: 1,
  TABLE: 2,
  CHAIR: 3,
  WALL: 4,
  WALL_OBJECT: 5,
  DOOR: 6
}

TILE_ITEM = {
  FLOOR_0: 0,
  FLOOR_1: 1,
  COOKER_0: 2,
  COOKER_1: 3,
  WALL_OBJECT_0: 4,
  WALL_OBJECT_1: 5,
  WALL_0: 6,
  WALL_1: 7
}

class TileItem {
  constructor(id)
  {
    this.width = 158;
    this.height = 79;

    this.id = id;

    this.container = new PIXI.Container();
  }

  oi()
  {
    console.log("oi from super")
  }
}

class TileItemFloor extends TileItem {
  constructor(id)
  {
    super(id);
    this.type = TILE_ITEM_TYPE.FLOOR;

    this.sprite = new PIXI.Sprite(Game.resources["gameobject:"+id+":0"].texture);
    this.container.addChild(this.sprite);
  }
}

class TileItemCooker extends TileItem {
  constructor(id)
  {
    super(id);
    this.type = TILE_ITEM_TYPE.COOKER;

    this.sprite = new PIXI.Sprite(Game.resources["gameobject:"+id+":0"].texture);
    this.container.addChild(this.sprite);

    this.text = new PIXI.Text('?', SceneTileMap.tileFontStyle);
    this.text.position.set(this.width/2, this.height/2);
    this.text.anchor.set(0.5);
    this.container.addChild(this.text);

    this.data = {}
  }

  updateVisual()
  {
    this.text.text = this.data.cooking;
  }
}
