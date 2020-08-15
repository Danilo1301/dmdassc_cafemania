class SceneTileMap {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
  }

  static createMap()
  {
    var size = [4,6];

    for (var y = 0; y < size[1]; y++) {
      for (var x = 0; x < size[0]; x++) {
        TileMap.createTile(x, y);
      }
    }

    for (var y = 0; y < 10; y++) {
      for (var x = size[0]; x < size[0] + 10; x++) {
        if(Math.random() > 0.3)
        {
          TileMap.createTile(x, y);
        }

      }
    }

    TileMap.tiles["1:1"].walkable = false;
    TileMap.tiles["1:2"].walkable = false;


    TileMap.calculateNeighbours();

  }


  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
