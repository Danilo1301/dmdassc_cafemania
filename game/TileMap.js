class TileMap {
  static tiles = {};
  static mapSize = {min_x: 0, min_y: 0, max_x: 0, max_y: 0}

  static tileSize = {width: 158, height: 79}

  static createTile(x, y)
  {
    var tile = new Tile();

    var w = this.tileSize.width/2;
    var h = this.tileSize.height/2;

    tile.tileKey = `${x}:${y}`;
    tile.walkable = true;
    tile.mapPos = {x: x, y: y};

    tile.container.x = x*w - y*w;
    tile.container.y = y*h + x*h;
    tile.text.text = `(${x},${y})`;

    this.tiles[tile.tileKey] = tile;

    SceneTileMap.viewport.container.addChild(tile.container);

    if(x < this.mapSize.min_x) { this.mapSize.min_x = x; }
    if(x > this.mapSize.max_x) { this.mapSize.max_x = x; }
    if(y < this.mapSize.min_y) { this.mapSize.min_y = y; }
    if(y > this.mapSize.max_y) { this.mapSize.max_y = y; }
  }

  static tileExists(x, y)
  {
    return this.tiles[`${x}:${y}`] != undefined;
  }

  static calculateNeighbours()
  {
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

    console.log(this.path_find_tiles, '-------------------')
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
