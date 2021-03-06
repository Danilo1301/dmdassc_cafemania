class TileMap {
  static tiles = {};
  static mapSize = {min_x: 0, min_y: 0, max_x: 0, max_y: 0}

  static tileSize = {width: 256, height: 128}

  static createItem(id)
  {
    var type = GameLogic.gameData.tileItems[id].type;
    var item;

    if(type == TILE_ITEM_TYPE.COOKER)
    {
      item = new TileItemCooker(GameLogic.createCooker(id));
    }

    if(type == TILE_ITEM_TYPE.FLOOR)
    {
      item = new TileItemFloor(GameLogic.createFloor(id));
    }

    if(type == TILE_ITEM_TYPE.WALL)
    {
      item = new TileItemWall(GameLogic.createWall(id));
    }

    if(type == TILE_ITEM_TYPE.CHAIR)
    {
      item = new TileItemChair(GameLogic.createChair(id));
    }




    if(!item)
    {
      return console.error("Invalid ID");
    }



    //item.id = tileItem.id;
    //item.uniqueid = tileItem.uniqueid;
    //item.tile = this;
    ///item.data = tileItem.data;
    //item._object = tileItem;

    //item.create();

    return item;
  }

  static getTile(x, y)
  {
    return this.tiles[`${x}:${y}`]
  }

  static getTilePosition(x, y)
  {
    var w = (this.tileSize.width)/2;
    var h = (this.tileSize.height)/2;

    return {
      x: x*w - y*w,
      y: y*h + x*h
    }
  }

  static getGridInfo(sizex, sizey)
  {
    var w = this.tileSize.width/2;
    var h = this.tileSize.height/2;

    var info = {
      rect: {},
      points: {}
    }

    info.points["top"] = this.getTilePosition(0, 0);
    info.points["left"] = this.getTilePosition(0, sizey-1);
    info.points["right"] = this.getTilePosition(sizex-1, 0);
    info.points["bottom"] = this.getTilePosition(sizex-1, sizey-1);

    info.rect.w = (info.points["right"].x+w) - (info.points["left"].x-w);
    info.rect.h = (info.points["bottom"].y+h) - (info.points["top"].y-h);

    info.rect.x = info.points["left"].x-w;
    info.rect.y = -h;

    return info;
  }

  static getGridSize(sizex, sizey)
  {
    var w = this.tileSize.width/2;
    var h = this.tileSize.height/2;

    var top = TileMap.getTilePosition(0, 0);
    var right = TileMap.getTilePosition(sizex-1, 0);
    var left = TileMap.getTilePosition(0, sizey-1);
    var bottom = TileMap.getTilePosition(sizex-1, sizey-1);




    return {
      x: (right.x+w) - (left.x-w),
      y: (bottom.y+h) - (top.y-h)
    }
  }

  static createTile(x, y, ignoreMax)
  {
    var pos = TileMap.getTilePosition(x, y);

    var tile = new Tile(x, y);

    tile.walkable = true;
    tile.container.x = pos.x;
    tile.container.y = pos.y;

    this.tiles[tile.tileKey] = tile;

    SceneTileMap.viewport.container.addChild(tile.container);

    if(ignoreMax == undefined)
    {
      if(x < this.mapSize.min_x) { this.mapSize.min_x = x; }
      if(x > this.mapSize.max_x) { this.mapSize.max_x = x; }
      if(y < this.mapSize.min_y) { this.mapSize.min_y = y; }
      if(y > this.mapSize.max_y) { this.mapSize.max_y = y; }
    }


    return tile;
  }

  static createOutsideTile(x, y)
  {
    var tile = this.createTile(x, y, true);

    var pos = [0,0];

    if(x < 0) { TileHitbox.addx(pos, 30); }
    if(y < 0) { TileHitbox.addy(pos, 30); }

    tile.container.x -= pos[0];
    tile.container.y -= pos[1];
  }

  static tileExists(x, y)
  {
    return this.tiles[`${x}:${y}`] != undefined;
  }

  static calculateNeighbours()
  {
    this.calculateWalkables();

    var all_tiles = {};

    for (var tile_key in this.tiles) {
      var tileData = this.tiles[tile_key];
      all_tiles[tile_key] = {
        key: tile_key,
        walkable: tileData.walkable,
        x: tileData.mapPos.x,
        y: tileData.mapPos.y
      };
    }

    for (var tile_key in this.tiles) {
      var neighbours = this.getNeighboursOfTile(this.tiles[tile_key]);

      all_tiles[tile_key].neighbours = [];

      for (var neighbour of neighbours) {
        all_tiles[tile_key].neighbours.push(all_tiles[neighbour.tileKey]);
      }
    }

    this.path_find_tiles = all_tiles;


  }

  static calculateWalkables()
  {

    for (var tile_key in this.tiles) {
      var tile = this.tiles[tile_key];

      for(var object_uniqueId in tile.tileItems)
      {
        var tileItem = tile.tileItems[object_uniqueId];
        var type = tileItem.type;
        var walkable = true;

        if(type == TILE_ITEM_TYPE.CHAIR || type == TILE_ITEM_TYPE.COOKER)
        {
          for (var part of tileItem.parts) {
            var pos = [part.t[0], part.t[1]]

            var nwTile = this.getTile(tile.mapPos.x + pos[0], tile.mapPos.y + pos[1]);
            nwTile.walkable = false;
          }

        }

      }
    }

  }


  static getNeighboursOfTile(tile)
  {
    var matrices = [[-1, 0], [0, -1], [0, 1], [1, 0]];

    var allowDiagonal = true;

    if(allowDiagonal) { matrices = matrices.concat([[-1, -1], [1, -1], [-1, 1], [1, 1]]); }

    var neighbours = [];

    for (var m of matrices) {
      var neighbour = this.tiles[`${tile.mapPos.x + m[0]}:${tile.mapPos.y + m[1]}`];


      if(neighbour) {
        neighbours.push(neighbour);
      }
    }


    return neighbours;
  }
}
