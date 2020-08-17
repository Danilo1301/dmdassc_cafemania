class SceneTileMap {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    Events.on("UPDATE_TILE", data => {


      var tileData = GameLogic.userData.tiles[`${data.x}:${data.y}`];

      if(!TileMap.tileExists(data.x, data.y))
      {
        TileMap.createTile(data.x, data.y);
      }

      var tile = TileMap.tiles[`${data.x}:${data.y}`];

      for (var tileItem of tileData.objects)
      {
        if(!tile.tileItems[tileData.id])
        {
          var item = TileMap.createItem(tileItem.id);

          item.uniqueid = tileItem.uniqueid;

          console.log("create item", item)

          tile.placeItem(item);
        } else {
          console.log("already created", item)
        }

        item.data = tileItem.data;
      }

      console.log(tileData.objects);

      return

      var tile = TileMap.tiles[`${data.x}:${data.y}`];

      for (var tileItem of tileData.objects) {
        if(!tile.tileItems[tileData.id])
        {
          tile.addTileItem(tileItem);
        }
      }

    })
  }

  static tick(delta)
  {

  }

  static destroy()
  {
  }
}
