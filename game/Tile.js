class TileTopFloor {
  constructor(tile)
  {
    this.tile = tile;

    this.container = new PIXI.Container();
  }

  update(delta)
  {
    this.container.x = this.tile.container.x;
    this.container.y = this.tile.container.y;
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

    this.tileItems = {};

    this.topFloor = new TileTopFloor(this);
    SceneGameObjects.addObject(this.topFloor);
  }

  placeItem(item)
  {
    item.placedAtTile = this;

    for (var part of item.parts) {

      var atTile = [this.mapPos.x + part.t[0], this.mapPos.y + part.t[1]]
      atTile = TileMap.tiles[`${atTile[0]}:${atTile[1]}`]

      atTile.topFloor.container.addChild(part.sprite);
    }

  }

  removeTileItem(tileItem)
  {
    this.tileItems[tileItem.uniqueid].destroy();
    delete this.tileItems[tileItem.uniqueid];
  }

  addTileItem(tileItem)
  {
    var item = new TileItemCooker();

    item.id = tileItem.id;
    item.uniqueid = tileItem.uniqueid;
    item.tile = this;
    item.data = tileItem.data;
    item._object = tileItem;

    item.create();


    this.tileItems[item.uniqueid] = item;
  }

  update(delta) {
    this.topFloor.update(delta);
  }
}
