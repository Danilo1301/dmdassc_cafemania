class SceneTileMap {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    Events.on("UPDATE_TILE", data => {

      console.log(`--- UPDATE_TILE ${data.x} ${data.y}`)

      var tileData = GameLogic.userData.tiles[`${data.x}:${data.y}`];

      var tile;

      if(!TileMap.tileExists(data.x, data.y))
      {
        tile = TileMap.createTile(data.x, data.y);

        var pos = [tile.container.x, tile.container.y];

      

        if(tile.mapPos.x < 0)
        {
          TileHitbox.addx(pos, -50);
        }

        if(tile.mapPos.y < 0)
        {
          TileHitbox.addy(pos, -50);
        }

        tile.container.x = pos[0]
        tile.container.y = pos[1]
      }

      tile = TileMap.tiles[`${data.x}:${data.y}`];



      var itemsuids = [];

      for (var tileItem of tileData.objects)
      {
        itemsuids.push(parseInt(tileItem.uniqueid));
        var item;

        if(tile.tileItems[tileItem.uniqueid] == undefined) {
          item = TileMap.createItem(tileItem.id);
        } else {
          item = tile.tileItems[tileItem.uniqueid];
        }

        item.setData(tileItem);

        tile.placeItem(item);
      }

      for (var item_unique_id in tile.tileItems) {
        if(!itemsuids.includes(parseInt(item_unique_id)))
        {
          tile.removeItem(item_unique_id);
        }
      }

    })
  }

  static tick(delta)
  {
    for (var tile_key in TileMap.tiles) {
      TileMap.tiles[tile_key].update(delta);
    }
  }

  static destroy()
  {
  }
}
