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

class TileTopWall {
  constructor(tile)
  {
    this.tile = tile;
    this.container = new PIXI.Container();
    this.container.displayPosition = {x: 0, y: 0};
  }

  update(delta)
  {
    this.container.x = this.tile.container.x;
    this.container.y = this.tile.container.y;

    this.container.displayPosition.y = this.container.y - TileMap.tileSize.height/4;
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
    this.topWall = new TileTopWall(this);

    SceneGameObjects.addObject(this.topFloor);
    SceneGameObjects.addObject(this.topWall);
  }

  removeItem(uniqueId)
  {
    var item = this.tileItems[uniqueId];
    item.destroy();

    delete this.tileItems[uniqueId];

    return item;
  }

  placeItem(item)
  {
    if(this.tileItems[item.uniqueid] != undefined) {
      console.log("already added");
      return
    }

    item.createSprites();

    this.tileItems[item.uniqueid] = item;
    item.placedAtTile = this;


    for (var part of item.parts) {

      var atTile = [this.mapPos.x + part.t[0], this.mapPos.y + part.t[1]]
      atTile = TileMap.tiles[`${atTile[0]}:${atTile[1]}`]

      if(item.type == TILE_ITEM_TYPE.FLOOR)
      {
        atTile.container.addChild(part.container);
      } else if(item.type == TILE_ITEM_TYPE.WALL) {
        atTile.topWall.container.addChild(part.container);
      } else {
        atTile.topFloor.container.addChild(part.container);
      }

      atTile.topFloor.container.addChild(part.hitbox);
    }


  }

  update(delta) {
    for (var tileItemId in this.tileItems) {
      this.tileItems[tileItemId].update(delta);
    }
  }
}
