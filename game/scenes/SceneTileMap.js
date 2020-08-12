class SceneTileMap {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static tiles = [];

  static tileFontStyle = new PIXI.TextStyle({
    fontFamily: 'segoe-ui-black',
    fontSize: 18,
    stroke: "#3c1905",
    lineJoin: "round",
    strokeThickness: 8,
    align: "left",
    fill: ['#ffffff']
  });

  static setup()
  {
    Events.on("UPDATE_TILE", function(ev) {
      if(!TileMap.tileExists(ev.x, ev.y)) {
        TileMap.createTile(ev.x, ev.y);
      }

      var tile = TileMap.tiles[`${ev.x}:${ev.y}`];

      if(tile.floor) {
        if(tile.floor.id != ev.data.id) {
          tile.floor.container.destroy();
          tile.floor = null;
        }
      }



      if(!tile.floor)
      {
        tile.floor = new TileObjectFloor(ev.data.id);

        tile.container.addChild(tile.floor.container);
        //console.log(tile.floor)
      }


    });

    //TileMap.calculateNeighbours();
  }


  static tick(delta)
  {
    for (var tile in this.tiles) {
      this.tiles[tile].update(tick);
    }
  }

  static destroy()
  {
  }
}
