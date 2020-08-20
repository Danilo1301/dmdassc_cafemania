class SceneRenderTileItem {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static tiles = {};

  static getOrders(tileItemData)
  {
    var order = ["front"];

    var hasBack = tileItemData.rotation.includes("BACK")
    var hasFlip = tileItemData.rotation.includes("FLIP")

    if(hasBack) { order.push("back") }

    if(hasFlip) {
      order.push("front_flipped")
      if(hasBack) { order.push("back_flipped") }
    }

    return order;
  }

  static createDebugSprite(x, y, w, h)
  {
    var background = new PIXI.Graphics();
    background.beginFill(0x0000FF);
    background.drawRect(0, 0, w, h);
    background.endFill();
    background.alpha = 0.2;
    background.position.set(x, y);
    Game.app.stage.addChild(background);
    return background;
  }

  static getFrameTiles(size)
  {
    var frameTiles = {
      tiles: [],
      extrem: []
    };

    for (var y = 0; y < size[1]; y++) {
      for (var x = 0; x < size[0]; x++) {
        var name = `${x}:${y}`

        if(x == size[0]-1 || y == size[1]-1) {
          if(!frameTiles.tiles[name]) {
            frameTiles.tiles[name] = [x, y];
          }
        }
      }
    }

    frameTiles.extrem = [`${size[0]-1}:0`, `0:${size[1]-1}`];

    return frameTiles
  }

  static setup()
  {
  }

  static renderTiles()
  {
    for (var tileItemId in Game.data.tileItems) {
      //if(tileItemId != 3) { continue }



      var tileItemData = Game.data.tileItems[tileItemId];
      var renderTile = this.tiles[tileItemId] = {};
      var baseTexture = Game.resources["tileitem:"+tileItemId].texture;

      renderTile.textures = [];
      renderTile.textures_index = {};

      var orders = this.getOrders(tileItemData);

      var eachFrameSize = {
        x: baseTexture.width / tileItemData.images,
        y: baseTexture.height / orders.length
      }

      //this.createDebugSprite(0, 0, eachFrameSize.x, eachFrameSize.y);

      var frameTiles = this.getFrameTiles(tileItemData.size);

      var gridInfo = TileMap.getGridInfo(tileItemData.size[0], tileItemData.size[1]);

      var offset = {
        x: eachFrameSize.x-gridInfo.rect.w,
        y: eachFrameSize.y-gridInfo.rect.h
      }


      for (var o of orders) {
        var y = orders.indexOf(o)*eachFrameSize.y;

        for (var i = 0; i < tileItemData.images; i++) {
          var x = i*eachFrameSize.x;



          //--
          for (var frameTile_key in frameTiles.tiles) {
            var frameTile = frameTiles.tiles[frameTile_key];

            var pos = TileMap.getTilePosition(frameTile[0], frameTile[1]);


            var cutx = pos.x - (gridInfo.rect.x + TileMap.tileSize.width/2)
            var cuty = pos.y;
            var cutw = TileMap.tileSize.width;
            var cuth = TileMap.tileSize.height;

            cutx += offset.x/2;
            cuty += offset.y;

            var addy = -cuty;

            cuty += addy;
            cuth -= addy;



            var name = `${o}_${i}_${frameTile_key}`;

            var t32Rect = new PIXI.Rectangle(x + cutx, y + cuty, cutw, cuth);
            var texture = new PIXI.Texture(baseTexture, t32Rect);

            var index = renderTile.textures.push(texture);

            renderTile.textures_index[name] = index-1;


          }
        }
      }

    }

  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
