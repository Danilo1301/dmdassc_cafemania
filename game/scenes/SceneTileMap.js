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

      var key = `${ev.x}:${ev.y}`;

      var tile = TileMap.tiles[key];
      var tileInfo = GameLogic.userData.tiles[key];

      if(tileInfo.floor != null) {
        var floor = new TileItemFloor(tileInfo.floor);

        tile.addFloor(floor);
      }

      for (var object of tileInfo.objects) {
        var tileItem;

        if(!tile.objects[object.uniqueid]) {

          tileItem = new TileItemCooker(object.id);
          tileItem.uniqueid = object.uniqueid;
          tile.addObject(tileItem);
        } else {
          tileItem = tile.objects[object.uniqueid];
        }



        tileItem.data = object.data;
        tileItem.updateVisual();

        tile.walkable = false;
      }


      //console.log(tileInfo.objects)
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
