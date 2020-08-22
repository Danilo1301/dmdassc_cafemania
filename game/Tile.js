class TileTop {
  constructor(tile)
  {
    this.tile = tile;
    this.container = new PIXI.Container();
    this.offset = 0;

    SceneGameObjects.addObject(this);
  }

  update(delta)
  {
    this.container.x = this.tile.container.x;
    this.container.y = this.tile.container.y;
    this.container.displayY = this.container.y + this.offset;
  }

  destroy()
  {
    SceneGameObjects.removeObject(this);
    this.container.destroy();
  }
}

class TileTopFloor extends TileTop {
  constructor(tile)
  {
    super(tile);
  }
}

class TileTopChair extends TileTop {
  constructor(tile)
  {
    super(tile);
    this.chair = null;
  }

  destroy()
  {
    super.destroy();
    this.tile = null;
  }
}

class TileTopWall extends TileTop {
  constructor(tile)
  {
    super(tile);

    this.offset = -TileMap.tileSize.height/4;
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
  }

  removeItem(uniqueId)
  {
    var item = this.tileItems[uniqueId];
    item.placedAtTile = null;
    item.destroy();

    delete this.tileItems[uniqueId];

    return item;
  }

  placeItem(item)
  {
    if(this.tileItems[item.uniqueid] != undefined) {
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

      if(item.type == TILE_ITEM_TYPE.CHAIR)
      {
        if(!this.topChair)
        {
          this.topChair = new TileTopChair(this);
        }


        atTile.topChair.container.addChild(item.sprite_topchair);
        atTile.topChair.chair = item;

        if(item.data.rotation >= 2)
        {
          atTile.topFloor.offset = -2;
          atTile.topChair.offset = 2;
        } else {
          atTile.topFloor.offset = -1;
          atTile.topChair.offset = -1;
        }


      }

      atTile.topFloor.container.addChild(part.hitbox);
    }


  }

  update(delta) {
    for (var tileItemId in this.tileItems) {
      this.tileItems[tileItemId].update(delta);
    }

    if(this.topChair)
    {
      if(!this.topChair.chair.placedAtTile)
      {
        this.topChair.destroy();
        delete this.topChair;
      }
    }
  }
}
